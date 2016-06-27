function getResourceColumns(resType, tiers, ts) {
    return _.map(tiers, (tier) => {
        const stateKey = resType.concat(tier);
        const title = _.upperFirst(tier);
        const fn = (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.', stateKey));};
        return {title, type: 'number', placeholder: 0, cls: 'input', stateKey, fn};
    });
}
function getMiscResourceCols(ts) {
    return getResourceColumns('', ['gem', 'relic', 'me'], ts);
}

let resourceCostCalculatorsConfig = {
    wood: {label: 'Wood', stateKeyPrefix: 'resources', cols: _.partial(getResourceColumns, 'wood.', tiers)},
    ore: {label: 'Ore', stateKeyPrefix: 'resources', cols: _.partial(getResourceColumns, 'ore.', tiers)},
    plant: {label: 'Plant', stateKeyPrefix: 'resources', cols: _.partial(getResourceColumns, 'plant.', tiers)},
    fish: {label: 'Fish', stateKeyPrefix: 'resources', cols: _.partial(getResourceColumns, 'fish.', tiers)},

    misc: {label: 'Misc Resources', stateKeyPrefix: 'resources', cols: getMiscResourceCols},
};
let resourceActionPrefixes = ['gem', 'relic', 'me', 'wood', 'ore', 'fish', 'plant'];
let miscResourceReducerHelper = (state, action) => {
    if(!_.find(resourceActionPrefixes, (pre)=>{return action.type.startsWith(pre);})) return state||defaultState;
    let newState = Object.assign({}, state);
    return _.set(newState, action.type, action.value||0);
};
let resourceCostCalculators = {};
_.forIn(resourceCostCalculatorsConfig, (res, key) => {
    resourceCostCalculators[key] = {
        title: <h4>{res.label}</h4>,
        stateKey: res.stateKeyPrefix,
        /*
        currently this creates N 'res' reducers that overwrite each other in reducers.jsx
        ideally there would either be a single reducer or the reducers dict would not use stateKey
        //*/
        reducer: miscResourceReducerHelper,
        cols: res.cols(res)
    }
});
