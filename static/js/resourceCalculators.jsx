// set up resource cost configuration
let resources = {
    wood: {label: 'Wood', stateKey: 'resources', resourceKey: 'wood'},
    ore: {label: 'Ore', stateKey: 'resources', resourceKey: 'ore'},
    plant: {label: 'Plant', stateKey: 'resources', resourceKey: 'plant'},
    fish: {label: 'Fish', stateKey: 'resources', resourceKey: 'fish'}
};
let resourceReducerHelper = (stateKey, resourceKey, state, action) => {
    if(action.stateKey!=stateKey || !action.valueKey) return state||defaultState[stateKey];
    let newState = Object.assign({}, state);
    newState[action.type][action.valueKey] = action.value||0;
    return newState;
};
let resourceCostCalculators = {};
_.each(_.values(resources), (resource) => {
    resourceCostCalculators[resource.resourceKey] = {
        title: <h4>{resource.label}</h4>,
        stateKey: resource.stateKey,
        /*
        currently this creates 4 'resources' reducers that overwrite each other in reducers.jsx
        ideally there would either be a single reducer or the reducers dict would not use stateKey
        //*/
        reducer: _.partial(resourceReducerHelper, resource.stateKey, resource.resourceKey),
        cols: [
            {id: resource.resourceKey, title: 'T1 '+resource.label, type: 'number', placeholder: 0, cls: 'input', stateKey: resource.stateKey, valueKey: 't1', fn: (state)=>{return state[resource.stateKey][resource.resourceKey]['t1']}},
            {id: resource.resourceKey, title: 'T2 '+resource.label, type: 'number', placeholder: 0, cls: 'input', stateKey: resource.stateKey, valueKey: 't2', fn: (state)=>{return state[resource.stateKey][resource.resourceKey]['t2']}},
            {id: resource.resourceKey, title: 'T3 '+resource.label, type: 'number', placeholder: 0, cls: 'input', stateKey: resource.stateKey, valueKey: 't3', fn: (state)=>{return state[resource.stateKey][resource.resourceKey]['t3']}},
            {id: resource.resourceKey, title: 'T4 '+resource.label, type: 'number', placeholder: 0, cls: 'input', stateKey: resource.stateKey, valueKey: 't4', fn: (state)=>{return state[resource.stateKey][resource.resourceKey]['t4']}},
            {id: resource.resourceKey, title: 'T5 '+resource.label, type: 'number', placeholder: 0, cls: 'input', stateKey: resource.stateKey, valueKey: 't5', fn: (state)=>{return state[resource.stateKey][resource.resourceKey]['t5']}}
        ]
    }
});
