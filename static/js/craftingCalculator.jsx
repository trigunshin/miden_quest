import React from 'react';
import _ from 'lodash';

function getCraftingColumns(ts) {
    return [{title: 'EV Total', placeholder: 0, cls: 'label', fn: (state)=>{return 0;}}];
}
function getCraftingCols(ts) {
    return getCraftingColumns(ts);
}

let craftingCalculatorsConfig = {
    crafting: {label: 'Crafting (TODO)', stateKeyPrefix: 'crafting', cols: _.partial(getCraftingCols)},
};
let craftingActionPrefixes = [];
let craftingReducerHelper = (state, action) => {
    if(!_.find(craftingActionPrefixes, (pre)=>{return action.type.startsWith(pre);})) return state||defaultState;
    let newState = Object.assign({}, state);
    return _.set(newState, action.type, action.value||0);
};


export function getCraftingCalculators(defaultState) {
    let craftingCalculators = {};
    
    _.forIn(craftingCalculatorsConfig, (res, key) => {
        craftingCalculators[key] = {
            title: <h4>{res.label}</h4>,
            stateKey: res.stateKeyPrefix,
            /*
            currently this creates N reducers that overwrite each other in reducers.jsx
            ideally there would either be a single reducer or the reducers dict would not use stateKey
            //*/
            reducer: craftingReducerHelper,
            cols: res.cols(res)
        }
    });
    return;
};
