import React from 'react';
import _ from 'lodash';
import numbro from 'numbro';
import {tiers, building_costs} from './defaultStates';

function getResourceColumns(resType, tiers, ts) {
    return _.map(tiers, (tier) => {
        const type = _.join(_.dropRight(resType),'');
        const totalCostKey = _.trim(_.join([ts.stateKeyPrefix, '.costs.', tier, ' ', _.upperFirst(type)], ''));
        const currentResourceCostKey = _.trim(_.join([ts.stateKeyPrefix, '.resources.', tier, ' ', _.upperFirst(type)], ''));
        const stateKey = resType.concat(tier);
        const title = _.upperFirst(tier);
        const fn = (state)=>{
            let diff = _.max([0, _.get(state, totalCostKey) - _.get(state, currentResourceCostKey, 0)]);
            return numbro(diff).format('0a.00');
        };
        return {title, cls: 'label', stateKey, fn};
    });
}

//const tradeBuildingKeys = [{key: 'mine', label: 'Mine'}, {key: 'watchtower', label: 'Watchtower'}, {key: 'lumber_camp', label: 'Lumber Camp'}, {key: 'fishing_hut', label: 'Fishing Hut'}, {key: 'trade_center', label: 'Trade Center'}, {key: 'botanist_house', label: 'Botanist House'}];
const tradeBuildingKeys = ['mine', 'watchtower', 'lumber_camp', 'fishing_hut', 'trade_center', 'botanist_house'];
const utilityFirstRow = ['locator', 'gem_mine', 'billboard', 'barracks', 'keep', 'farm'];
const utilitySecondRow = ['silo', 'adventurer_guild', 'inn', 'academy', 'workshop', 'toolshed'];
const utilityThirdRow = ['wharf', 'townhall'];

function getBuildingPair(label, key, ts) {
    let pre = ts.stateKeyPrefix;
    let ret = [
        {title: label+' Start', type: 'number', placeholder: 0, cls: 'input', stateKey: key+'.start', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.', key, '.start'));}},
        {title: label+' End', type: 'number', placeholder: 0, cls: 'input', stateKey: key+'.finish', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.', key, '.finish'));},
            // highlight TODO buildings here
            highlightGreenFn: (state) => {
                const start = _.get(state, ts.stateKeyPrefix.concat('.', key, '.start'));
                const finish = _.get(state, ts.stateKeyPrefix.concat('.', key, '.finish'));
                return finish > start;
            }
        }
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
    kingdomBuildings: {label: 'Kingdom Info Parser (Double-click relevant field in the Kingdom view in-game & paste into box)', stateKeyPrefix: 'kingdom', cols: (ts) =>{
        return [
            {title: 'Buildings Copy/Paste', type: 'text', placeholder: 0, cls: 'input', stateKey: 'buildings', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.buildings'));}},
            {title: 'Resources Copy/Paste', type: 'text', placeholder: 0, cls: 'input', stateKey: 'resources', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.resources'));}}
        ]
    }},
    misc: {label: 'Misc (Not auto-parsed)', stateKeyPrefix: 'kingdom', cols: _.partial(getResourceColumns, '', ['Gold', 'Relics', 'Gem'])},
    wood: {label: 'Wood', stateKeyPrefix: 'kingdom', cols: _.partial(getResourceColumns, 'wood.', tiers)},
    ore: {label: 'Ore', stateKeyPrefix: 'kingdom', cols: _.partial(getResourceColumns, 'ore.', tiers)},
    plant: {label: 'Plant', stateKeyPrefix: 'kingdom', cols: _.partial(getResourceColumns, 'plant.', tiers)},
    fish: {label: 'Fish', stateKeyPrefix: 'kingdom', cols: _.partial(getResourceColumns, 'fish.', tiers)},
    trades: {label: 'Tradeskills', stateKeyPrefix: 'kingdom', cols: _.partial(getBuildings, tradeBuildingKeys)},
    utilFirst: {label: 'Buildings', stateKeyPrefix: 'kingdom', cols: _.partial(getBuildings, utilityFirstRow)},
    utilSecond: {label: 'Buildings', stateKeyPrefix: 'kingdom', cols: _.partial(getBuildings, utilitySecondRow)},
    utilThird: {label: 'Buildings', stateKeyPrefix: 'kingdom', cols: _.partial(getBuildings, utilityThirdRow)},
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
const omittedCostFields = ['costs', 'buildings'];
function updateTotalCosts(newState) {
    const costValues = _.values(_.omit(newState, ['costs', 'resources']));
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
}

const actionPrefixes = _.concat(_.keys(building_costs), 'buildings', 'resources');
const pasteSplitString = '# of ';
const buildingsByLabel = _.invert(_.mapValues(building_costs, (cur) => {return cur.label;}));
function buildingParser(infoString, newState) {
    let buildings = _.map(_.drop(infoString.split(pasteSplitString)), _.trim)
    buildings = _.map(buildings, (building)=>{return building.split(': ');});

    _.each(buildings, (building) => {
        let key = building[0];
        let count = parseInt(building[1]);
        let buildingKey = buildingsByLabel[key]

        if(buildingKey) {
            validateStartFinish(newState, buildingKey, buildingKey+'.finish', count);
            validateStartFinish(newState, buildingKey, buildingKey+'.start', count);

            updateBuildingCosts(newState, buildingKey);
        }
    });
}
//const buildingRegex = /# of (\w*): (\d*) /;
var buildingRegex = /# of (\w*): (\d*) /;
function updateBuildingState(buildingKey, type, value, newState) {
    validateStartFinish(newState, buildingKey, type, value);
    updateBuildingCosts(newState, buildingKey);

    return newState;
}
function parseKingdomResources(resourceString, newState) {
    if(!resourceString || resourceString.length === 0) {
        //resources = {};
    }
    const resArray = resourceString.split(' ');

    const resources = {};
    let tmpKey = '';
    let tmpCount = '';
    _.each(resArray, (str) => {
        if(/^T/.test(str)) {  // T1-5
            if(tmpKey.length > 0) {
                resources[tmpKey] = parseInt(tmpCount);
                tmpCount = '';
            }
            tmpKey = _.lowerFirst(str) + ' ';
        } else if (/^\D/.test(str)) {  // Ore/Wood/Fish/Plant
            tmpKey += str.replace(':', '');
        } else {  // Numbers
            tmpCount += str;
        }
    });
    // finish for t5 fish
    resources[tmpKey] = parseInt(tmpCount);

    newState.resources = resources;
    return newState;
}

export function getKingdomCalculators(initState) {
    const calculators = {};
    let defaultState = _.get(initState, 'kingdom', initState);

    const simpleReducer = (state, action) => {
        // set simple state value
        if(!_.find(actionPrefixes, (pre)=>{return action.type.startsWith(pre);})) return state||defaultState;

        let newState = Object.assign({}, state);
        newState = _.set(newState, action.type, action.value||0);

        if(action.type==='resources') {
            newState.resources = action.value;
            let resString = action.value;
            parseKingdomResources(resString, newState);

            return newState;
        }
        if(action.type==='buildings') {
            buildingParser(action.value, newState);
            updateTotalCosts(newState);
            newState.buildings = action.value;
            return newState;
        }

        const key = action.type.split('.')[0];

        updateBuildingState(key, action.type, action.value, newState);
        updateTotalCosts(newState);

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
