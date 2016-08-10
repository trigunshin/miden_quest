import React from 'react';
import _ from 'lodash';
import {tiers, building_costs} from './defaultStates';

function getResourceColumns(resType, tiers, ts) {
    return _.map(tiers, (tier) => {
        const type = _.join(_.dropRight(resType),'');
        const valueKey = _.trim(_.join([ts.stateKeyPrefix, '.costs.', tier, ' ', _.upperFirst(type)], ''));
        const stateKey = resType.concat(tier);
        const title = _.upperFirst(tier);
        const fn = (state)=>{return _.get(state, valueKey);};
        return {title, cls: 'label', stateKey, fn};
    });
}

//const tradeBuildingKeys = [{key: 'mine', label: 'Mine'}, {key: 'watchtower', label: 'Watchtower'}, {key: 'lumber_camp', label: 'Lumber Camp'}, {key: 'fishing_hut', label: 'Fishing Hut'}, {key: 'trade_center', label: 'Trade Center'}, {key: 'botanist_house', label: 'Botanist House'}];
const tradeBuildingKeys = ['mine', 'watchtower', 'lumber_camp', 'fishing_hut', 'trade_center', 'botanist_house'];
const utilityFirstRow = ['locator', 'gem_mine', 'billboard', 'barracks', 'keep', 'farm'];
const utilitySecondRow = ['silo', 'adventurer_guild', 'inn', 'academy', 'workshop', 'toolshed'];

function getBuildingPair(label, key, ts) {
    let pre = ts.stateKeyPrefix;
    let ret = [
        {title: label+' Start', type: 'number', placeholder: 0, cls: 'input', stateKey: key+'.start', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.', key, '.start'));}},
        {title: label+' End', type: 'number', placeholder: 0, cls: 'input', stateKey: key+'.finish', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.', key, '.finish'));}}
    ];
    return ret;
}
function getBuildings(keys, ts) {
    return _.flatten(_.map(keys, (key) => {
        let label = building_costs[key].label;
        return getBuildingPair(label, key, ts);
    }));
}
let config = {
    misc: {label: 'Misc', stateKeyPrefix: 'kingdom', cols: _.partial(getResourceColumns, '', ['Gold', 'Relics', 'Gem'])},
    wood: {label: 'Wood', stateKeyPrefix: 'kingdom', cols: _.partial(getResourceColumns, 'wood.', tiers)},
    ore: {label: 'Ore', stateKeyPrefix: 'kingdom', cols: _.partial(getResourceColumns, 'ore.', tiers)},
    plant: {label: 'Plant', stateKeyPrefix: 'kingdom', cols: _.partial(getResourceColumns, 'plant.', tiers)},
    fish: {label: 'Fish', stateKeyPrefix: 'kingdom', cols: _.partial(getResourceColumns, 'fish.', tiers)},
    trades: {label: 'Tradeskills', stateKeyPrefix: 'kingdom', cols: _.partial(getBuildings, tradeBuildingKeys)},
    utilFirst: {label: 'Buildings', stateKeyPrefix: 'kingdom', cols: _.partial(getBuildings, utilityFirstRow)},
    utilSecond: {label: 'Buildings', stateKeyPrefix: 'kingdom', cols: _.partial(getBuildings, utilitySecondRow)},
    test: {label: 'test', stateKeyPrefix: 'kingdom', cols: (ts) =>{
        return [{
            title: 'Test', type: 'text', placeholder: 0, cls: 'input', stateKey: '.test', 
            fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.test'));}
        }]
    }}
};

function validateStartFinish(state, key, type, value) {
    if(type.endsWith('finish')) {
        state[key].finish = value||0;
        if(state[key].start > state[key].finish) state[key].start = state[key].finish - 1;
    }
    else if(type.endsWith('start')) {
        state[key].start = value||0;
        if(state[key].start > state[key].finish) state[key].finish = state[key].start + 1;
    }
}

function updateBuildingCosts(state, key) {
    const costs = building_costs[key].cost;
    const start = state[key].start;
    const finish = state[key].finish;

    const per_idx_costs = _.map(_.range(start+1, finish+1), (idx) => {
        return _.map(_.keys(costs), (label) => {
            const cost = costs[label];
            return {label: label, value: cost.base * Math.pow(cost.factor, (idx-1))};
        });
    });

    // start each resource's value @ 0
    let initAccum = {};
    _.each(_.keys(costs), (label) => {initAccum[label] = 0;});

    // sum the costs per resource
    const totalCosts = _.reduce(per_idx_costs, (accum, idx_cost) => {
        _.each(idx_cost, ({label, value}) => {
            accum[label] += value;
        });
        return accum;
    }, initAccum);

    _.each(_.keys(totalCosts), (label) => {state[key][label] = totalCosts[label].toFixed(0);});
}

const actionPrefixes = _.keys(building_costs) + 'test';
export function getKingdomCalculators(initState) {
    const calculators = {};
    let defaultState = _.get(initState, 'kingdom', initState);

    const simpleReducer = (state, action) => {
        // set simple state value
        if(!_.find(actionPrefixes, (pre)=>{return action.type.startsWith(pre);})) return state||defaultState;
        let newState = Object.assign({}, state);
        newState = _.set(newState, action.type, action.value||0);

        const key = action.type.split('.')[0];
        // validate start<finish
        validateStartFinish(newState, key, action.type, action.value);
        // calculate cost values
        updateBuildingCosts(newState, key);

        const costValues = _.values(_.omit(newState, 'costs'));
        const costs = _.reduce(costValues, (accum, costs) => {
            _.forIn(costs, (costValue, costKey) => {
                let val = parseInt(_.get(accum, costKey, 0));
                val += parseInt(costValue);
                _.set(accum, costKey, val);
            });
            return accum;
        }, {});
        newState.costs = costs;

        return newState;
    };

    _.forIn(config, (res, key) => {
        calculators[key] = {
            title: <h4>{res.label}</h4>,
            stateKey: res.stateKeyPrefix,
            /*
            currently this creates N 'res' reducers that overwrite each other in reducers.jsx
            ideally there would either be a single reducer or the reducers dict would not use stateKey
            //*/
            reducer: simpleReducer,
            cols: res.cols(res)
        }
    });

    return calculators;
};
