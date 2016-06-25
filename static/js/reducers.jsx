// populate the reducers & create the store
let reducers = {};
let costCalculators = {
    resources: resourceCostCalculators,
    expeditions: expeditionCostCalculators,
    buildings: buildingCostCalculators,
    misc: miscCostCalculators,
    ts: tsCalculators
};
_.each(costCalculators, (costCalc) => {
    _.each(costCalc, (config)=> {
        reducers[config.stateKey] = config.reducer;
    });
});
let store = null;
let combinedReducers = Redux.combineReducers(reducers);
// DEBUG MODE?
if(window.devToolsExtension) store = Redux.createStore(combinedReducers, defaultState, window.devToolsExtension && window.devToolsExtension());
else store = Redux.createStore(combinedReducers);
