import _ from 'lodash';
import {createStore, combineReducers} from 'redux';
import {defaultState} from './defaultStates';

export function getStore(costCalculators, stateUpdate) {
	// populate the reducers & create the store
	let reducers = {};
	_.each(costCalculators, (costCalc) => {
	    _.each(costCalc, (config)=> {
	        reducers[config.stateKey] = config.reducer;
	    });
	});
	let combinedReducers = combineReducers(reducers);

	// _.assign doesn't deeply compare; currently we only fetch resource values, initially
	_.assign(defaultState.resources, stateUpdate.resources);

	let reduxStore = null;
	// DEBUG MODE?
	if(window.devToolsExtension) reduxStore = createStore(combinedReducers, defaultState, window.devToolsExtension && window.devToolsExtension());
	else reduxStore = createStore(combinedReducers, defaultState);

	return reduxStore;
};
