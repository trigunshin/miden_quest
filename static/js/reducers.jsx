import _ from 'lodash';
import {createStore, combineReducers} from 'redux';
import {defaultState} from './defaultStates';

export function getStore(costCalculators) {
	// populate the reducers & create the store
	let reducers = {};
	_.each(costCalculators, (costCalc) => {
	    _.each(costCalc, (config)=> {
	        reducers[config.stateKey] = config.reducer;
	    });
	});
	let combinedReducers = combineReducers(reducers);

	let reduxStore = null;
	// DEBUG MODE?
	if(window.devToolsExtension) reduxStore = createStore(combinedReducers, defaultState, window.devToolsExtension && window.devToolsExtension());
	else reduxStore = createStore(combinedReducers);

	return reduxStore;
};
