import React from 'react';
import _ from 'lodash';
import {building_costs} from './defaultStates';



export function getKingdomCalculators(initState) {
	const calculators = {};
	let defaultState = _.get(initState, 'ts', initState);

	const simpleReducer = (state, action) => {
        if(!_.find(tsActionPrefixes, (pre)=>{return action.type.startsWith(pre);})) return state||defaultState;
        const newState = Object.assign({}, state);
        return _.set(newState, action.type, action.value||0);
    };

	return calculators;
};
