// expeditions
function expeditionReducerHelper(stateKey, state, action) {
    if(action.stateKey!=stateKey || !action.valueKey) return state||defaultState[stateKey];
    let newState = Object.assign({}, state);
    newState[action.valueKey] = action.value||0;
    return newState;
};
// set up resource cost configuration
const expeditions = {
    armor: {label: 'Wood/Armor', stateKey: 'expeditions', valueKey: 'armor', resourceKey: 'wood'},
    weapons: {label: 'Ore/Weapons', stateKey: 'expeditions', valueKey: 'weapons', resourceKey: 'ore'},
    survival: {label: 'Plant/Survival', stateKey: 'expeditions', valueKey: 'survival', resourceKey: 'plant'},
    advLevel: {label: 'Fish/Adventurer', stateKey: 'expeditions', valueKey: 'adventurer', resourceKey: 'fish'}
};
const expeditionTierInfo = {
    t1: {baseCost: 1000, levelOffset: 0},
    t2: {baseCost: 950, levelOffset: 1},
    t3: {baseCost: 900, levelOffset: 2},
    t4: {baseCost: 750, levelOffset: 3},
    t5: {baseCost: 500, levelOffset: 4}
};
let expeditionCostCalculators = {};
function expeditionResourceCost(stateKey, valueKey, baseCost, levelOffset, state) {
    let level = state[stateKey][valueKey];
    return (Math.max(level-levelOffset, 0)*((level-levelOffset)+1)/2)*baseCost;
}
function expeditionGoldCost(stateKey, valueKey, resourceKey, state) {
    let exped = state[stateKey];
    let resCosts = state[resourceKey];
    let levelCost = _.sum(_.map(tiers, (tier) => {
        let info = expeditionTierInfo[tier];
        let amt = expeditionResourceCost(stateKey, valueKey, info.baseCost, info.levelOffset, state);
        return amt * resCosts[tier];
    })) || 0;

    return levelCost;
}

_.each(_.values(expeditions), (expedition) => {
    expeditionCostCalculators[expedition.valueKey] = {
        title: <h4>{expedition.label}</h4>,
        stateKey: expedition.stateKey,
        reducer: _.partial(expeditionReducerHelper, expedition.stateKey),
        cols: [{id: expedition.stateKey, title: expedition.label, type: 'number', placeholder: 0, cls: 'input', stateKey: expedition.stateKey, valueKey: expedition.valueKey}]
    }
    // amt per tier
    _.each(_.keys(expeditionTierInfo), (tier) => {
        let info = expeditionTierInfo[tier];
        let col = {id: tier, title: _.upperCase(tier), cls: 'label', fn: _.partial(expeditionResourceCost, expedition.stateKey, expedition.valueKey, info.baseCost, info.levelOffset)};
        expeditionCostCalculators[expedition.valueKey].cols.push(col);
    });
    // total cost of all tiers
    expeditionCostCalculators[expedition.valueKey].cols.push(
        {id: expedition.valueKey.concat('cost'), title: 'Cost', cls: 'label', fn: _.partial(expeditionGoldCost, expedition.stateKey, expedition.valueKey, expedition.resourceKey)});
});
