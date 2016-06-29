import React from 'react';
import _ from 'lodash';
import {building_costs} from './defaultStates';

// set up kingdom building configs
const buildingReducerHelper = (defaultState, key, state, action) => {
    if(!action.type || !action.type.startsWith(key)) return state||defaultState[key];

    // update state value
    let newState = Object.assign({}, state);
    if(action.type.endsWith('finish')) {
        newState.finish = action.value||0;
        if(newState.start > newState.finish) newState.start = newState.finish - 1;
    }
    else if(action.type.endsWith('start')) {
        newState.start = action.value||0;
        if(newState.start > newState.finish) newState.finish = newState.start + 1;
    }
    else return state||defaultState[key];

    // calculate values
    const costs = building_costs[key].cost;
    const start = newState.start;
    const finish = newState.finish;

    const per_idx_costs = _.map(_.range(start+1, finish+1), (idx) => {
        return _.map(_.keys(costs), (label) => {
            const cost = costs[label];
            return {label: label, value: cost.base * Math.pow(cost.factor, (idx-1))};
        });
    });

    // start each resource's value @ 0
    let initAccum = {};
    _.each(_.keys(costs), (label) => {initAccum[label] = 0;});

    // sum the costs per resource
    const totalCosts = _.reduce(per_idx_costs, (accum, idx_cost) => {
        _.each(idx_cost, ({label, value}) => {
            accum[label] += value;
        });
        return accum;
    }, initAccum);

    _.each(_.keys(totalCosts), (label) => {newState[label] = totalCosts[label].toFixed(0);});

    return newState;
};

export function getBuildingCalculators(defaultState) {
    const buildingReducers = {};
    _.each(_.keys(building_costs), (building_key) => {
        buildingReducers[building_key] = _.partial((key, state, action) => {
            return buildingReducerHelper(defaultState, key, state, action);
        }, building_key);
    });

    const buildingCalculators = _.map(_.keys(building_costs), (building_id) => {
        const building = building_costs[building_id];
        let ret = {
            title: <h4>{building.label}</h4>,
            stateKey: building_id,
            reducer: buildingReducers[building_id],
            cols: [
                {id: ''+building_id+'_start', title: '# Start', type: 'number', placeholder: 0, cls: 'input', stateKey: building_id, valueKey: 'start'},
                {id: ''+building_id+'_finish', title: '# Finished', type: 'number', placeholder: 0, cls: 'input', stateKey: building_id, valueKey: 'finish'}
            ]
        }

        const labels = _.map(_.keys(building.cost), (label) => {
            const cost = building.cost;
            return {id: label, title: label, cls: 'label'};
        });
        ret.cols = ret.cols.concat(labels);

        return ret;
    });

    return buildingCalculators;
};
