// expeditions
function expeditionReducerHelper(stateKey, state, action) {
    if(action.stateKey!=stateKey || !action.valueKey) return state||defaultState[stateKey];
    let newState = Object.assign({}, state);
    newState[action.valueKey] = action.value||0;
    return newState;
};
// set up resource cost configuration
const expeditions = {
    armor: {label: 'Wood/Armor', stateKey: 'armor', valueKey: 'level', resourceKey: 'wood'},
    weapons: {label: 'Ore/Weapons', stateKey: 'weapons', valueKey: 'level', resourceKey: 'ore'},
    survival: {label: 'Plant/Survival', stateKey: 'survival', valueKey: 'level', resourceKey: 'plant'},
    advLevel: {label: 'Fish/Adv', stateKey: 'advLevel', valueKey: 'level', resourceKey: 'fish'}
};
const expeditionTierInfo = {
    t1: {baseCost: 1000, levelOffset: 0},
    t2: {baseCost: 950, levelOffset: 1},
    t3: {baseCost: 900, levelOffset: 2},
    t4: {baseCost: 750, levelOffset: 3},
    t5: {baseCost: 500, levelOffset: 4}
};
let expeditionCostCalculators = {};
function expeditionResourceCost(stateKey, baseCost, levelOffset, state) {
    let level = state[stateKey].level;
    return (Math.max(level-levelOffset, 0)*((level-levelOffset)+1)/2)*baseCost;
}
function expeditionGoldCost(expeditionKey, resourceKey, state) {
    let exped = state[expeditionKey];
    let resCosts = state[resourceKey];
    let levelCost = _.sum(_.map(tiers, (tier) => {
        let info = expeditionTierInfo[tier];
        let amt = expeditionResourceCost(expeditionKey, info.baseCost, info.levelOffset, state);
        return amt * resCosts[tier];
    })) || 0;

    return levelCost;
}

_.each(_.values(expeditions), (expedition) => {
    expeditionCostCalculators[expedition.stateKey] = {
        title: <h4>{expedition.label}</h4>,
        stateKey: expedition.stateKey,
        reducer: _.partial(expeditionReducerHelper, expedition.stateKey),
        cols: [{id: expedition.stateKey, title: expedition.label, type: 'number', placeholder: 0, cls: 'input', stateKey: expedition.stateKey, valueKey: expedition.valueKey}]
    }
    // amt per tier
    _.each(_.keys(expeditionTierInfo), (tier) => {
        let info = expeditionTierInfo[tier];
        let col = {id: tier, title: _.upperCase(tier), cls: 'label', fn: _.partial(expeditionResourceCost, expedition.stateKey, info.baseCost, info.levelOffset)};
        expeditionCostCalculators[expedition.stateKey].cols.push(col);
    });
    // total cost of all tiers
    expeditionCostCalculators[expedition.stateKey].cols.push(
        {id: expedition.stateKey.concat('cost'), title: 'Cost', cls: 'label', fn: _.partial(expeditionGoldCost, expedition.stateKey, expedition.resourceKey)});
});
