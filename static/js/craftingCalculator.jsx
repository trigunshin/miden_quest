import React from 'react';
import _ from 'lodash';
import {tierPrice} from './defaultStates';

function getCraftingInputs(prefix, stateKeys) {
    return _.map(stateKeys, (stateKey) => {
        return {title: _.upperFirst(stateKey), type: 'number', cls: 'input', stateKey: prefix.concat(stateKey), fn: (state)=>{return _.get(state, prefix.concat(stateKey), 0);}};
    });
}
function _getCraftingCostArgs(state) {
    return {
        baseCost: _.get(tierPrice, _.get(state, 'crafting.tier', 1), 0),
        level: _.get(state, 'crafting.level', 0),
        workshops: _.get(state, 'crafting.workshops', 0),
        start: _.get(state, 'crafting.start', 0),
        end: _.get(state, 'crafting.end', 0)
    };
}
function _getCraftingCost(baseCost, level, workshops, slot) {
    let base = (baseCost/5);
    let slotCost = Math.pow((slot-1)*2+1, 1.6) / (1+level/400);
    let workshopModifier = _.max([100-workshops, 80])/100;
    return _.ceil(base * slotCost * workshopModifier)||0;
}
function getCraftingCost(state) {
    const args = _getCraftingCostArgs(state);
    return _getCraftingCost.apply(this, _.values(args));
}
function getTotalCraftingCost(state) {
    let args = _getCraftingCostArgs(state);
    return _.sum(_.map(_.range(args.start, args.end+1), (slot) => {
        return _getCraftingCost(args.baseCost, args.level, args.workshops, slot);
    }));
}
function getCraftingCols(ts) {
    const inputCols = getCraftingInputs('crafting.', ['level', 'workshops', 'tier', 'start', 'end']);
    const labelCols = [
        {title: 'Next Craft Cost', cls: 'label', fn: getCraftingCost},
        {title: 'Total Craft Cost', cls: 'label', fn: getTotalCraftingCost},
    ];
    return inputCols.concat(labelCols);
}

let craftingCalculatorsConfig = {
    crafting: {label: 'Crafting', stateKeyPrefix: 'crafting', cols: getCraftingCols},
};
let craftingActionPrefix = 'crafting';
let craftingReducerHelper = (defaultState, state, action) => {
    if(!action.type.startsWith(craftingActionPrefix)) return state||defaultState;
    let newState = Object.assign({}, state);

    let stateKey = _.replace(action.type, 'crafting.', '');
    return _.set(newState, stateKey, action.value||0);
};

export function getCraftingCalculators(initState) {
    let craftingCalculators = {};
    let defaultState = _.get(initState, 'crafting', initState);

    _.forIn(craftingCalculatorsConfig, (res, key) => {
        craftingCalculators[key] = {
            title: <h4>{res.label}</h4>,
            stateKey: res.stateKeyPrefix,
            /*
            currently this creates N reducers that overwrite each other in reducers.jsx
            ideally there would either be a single reducer or the reducers dict would not use stateKey
            //*/
            reducer: _.partial(craftingReducerHelper, defaultState),
            cols: res.cols(res)
        }
    });
    return craftingCalculators;
};
