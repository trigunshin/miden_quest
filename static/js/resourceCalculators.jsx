// set up resource cost configuration
let resources = {
    wood: {label: 'Wood', stateKey: 'wood'},
    ore: {label: 'Ore', stateKey: 'ore'},
    plant: {label: 'Plant', stateKey: 'plant'},
    fish: {label: 'Fish', stateKey: 'fish'}
};
let resourceReducerHelper = (stateKey, state, action) => {
    if(action.stateKey!=stateKey || !action.valueKey) return state||defaultState[stateKey];
    let newState = Object.assign({}, state);
    newState[action.valueKey] = action.value||0;
    return newState;
};
let resourceCostCalculators = {};
_.each(_.values(resources), (resource) => {
    resourceCostCalculators[resource.stateKey] = {
        title: <h4>{resource.label}</h4>,
        stateKey: resource.stateKey,
        reducer: _.partial(resourceReducerHelper, resource.stateKey),
        cols: [
            {id: 't1'+resource.stateKey, title: 'T1 '+resource.label, type: 'number', placeholder: 0, cls: 'input', stateKey: resource.stateKey, valueKey: 't1'},
            {id: 't2'+resource.stateKey, title: 'T2 '+resource.label, type: 'number', placeholder: 0, cls: 'input', stateKey: resource.stateKey, valueKey: 't2'},
            {id: 't3'+resource.stateKey, title: 'T3 '+resource.label, type: 'number', placeholder: 0, cls: 'input', stateKey: resource.stateKey, valueKey: 't3'},
            {id: 't4'+resource.stateKey, title: 'T4 '+resource.label, type: 'number', placeholder: 0, cls: 'input', stateKey: resource.stateKey, valueKey: 't4'},
            {id: 't5'+resource.stateKey, title: 'T5 '+resource.label, type: 'number', placeholder: 0, cls: 'input', stateKey: resource.stateKey, valueKey: 't5'}
        ]
    }
});