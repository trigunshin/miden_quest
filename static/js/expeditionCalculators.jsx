// expeditions
let expeditionReducerHelper = (stateKey, state, action) => {
    if(action.stateKey!=stateKey || !action.valueKey) return state||defaultState[stateKey];
    let newState = Object.assign({}, state);
    newState[action.valueKey] = action.value||0;

    let level = action.value;
    newState.t1 = (level*(level+1)/2)*1000;
    newState.t2 = (Math.max(level-1, 0)*((level-1)+1)/2)*950;
    newState.t3 = (Math.max(level-2, 0)*((level-2)+1)/2)*900;
    newState.t4 = (Math.max(level-3, 0)*((level-3)+1)/2)*750;
    newState.t5 = (Math.max(level-4, 0)*((level-4)+1)/2)*500;

    return newState;
};
// set up resource cost configuration
let expeditions = {
    armor: {label: 'Wood/Armor', stateKey: 'armor', valueKey: 'level'},
    weapons: {label: 'Ore/Weapons', stateKey: 'weapons', valueKey: 'level'},
    survival: {label: 'Plant/Survival', stateKey: 'survival', valueKey: 'level'},
    advLevel: {label: 'Fish/Adv', stateKey: 'advLevel', valueKey: 'level'}
};
let expeditionCostCalculators = {};
_.each(_.values(expeditions), (expedition) => {
    expeditionCostCalculators[expedition.stateKey] = {
        title: <h4>{expedition.label}</h4>,
        stateKey: expedition.stateKey,
        reducer: _.partial(expeditionReducerHelper, expedition.stateKey),
        cols: [
            {id: expedition.stateKey, title: expedition.label, type: 'number', placeholder: 0, cls: 'input', stateKey: expedition.stateKey, valueKey: expedition.valueKey},
            {id: 't1', title: 'T1', cls: 'label'}, {id: 't2', title: 'T2', cls: 'label'}, {id: 't3', title: 'T3', cls: 'label'}, {id: 't4', title: 'T4', cls: 'label'}, {id: 't5', title: 'T5', cls: 'label'}
        ]
    }
});
