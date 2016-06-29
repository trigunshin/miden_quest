import React from 'react';
import _ from 'lodash';
import {defaultState} from './defaultStates';

// set up misc config configuration
const dropReducer = (state=defaultState.dropCalculator, action) => {
    let newState = Object.assign({}, state);
    const op = {
        tsDropRate: (value) => {newState.tsDropRate=1;},
        tsSecondsPer: (value) => {newState.tsSecondsPer=value;},
        relicDropRate: (value) => {newState.relicDropRate=value;},
        gemDropRate: (value) => {newState.gemDropRate=value;},
        hoursFarming: (value) => {newState.hoursFarming=value;}
    }
    // does the action key match what we expect?
    if(!action.type || _.indexOf(_.keys(op), action.type) < 0) return state;    
    op[action.type](action.value||0);

    // state updated, update calculated values
    const seconds = 60*60;
    let totalRate = (newState.tsDropRate/100) * (1 + (newState.gemDropRate+newState.relicDropRate)/100);
    let hourlyAttempts = seconds / newState.tsSecondsPer;
    let hourlyDrops = hourlyAttempts * totalRate;
    let totalDrops = hourlyDrops * newState.hoursFarming;
    
    newState.totalDropRate = totalRate.toFixed(2);
    newState.dropHourlyAttempts = hourlyAttempts.toFixed(2);
    newState.hourlyDrops = hourlyDrops.toFixed(2);
    newState.totalDrops = totalDrops.toFixed(2);

    return newState;
};
const luckReducer = (state=defaultState.luckCalculator, action) => {
    let newState = Object.assign({}, state);
    const op = {
        luckPersonal: (value) => {newState.luckPersonal=value;},
        luckKingdom: (value) => {newState.luckKingdom=value;}
    }
    // does the action key match what we expect?
    if(!action.type || _.indexOf(_.keys(op), action.type) < 0) return state;    
    op[action.type](action.value||0);

    // state updated, update calculated values
    newState.luckTier1 = newState.luckPersonal + newState.luckKingdom;
    newState.luckTier2 = (newState.luckTier1 * Math.pow(.67, 1)).toFixed(2);
    newState.luckTier3 = (newState.luckTier1 * Math.pow(.67, 2)).toFixed(2);
    newState.luckTier4 = (newState.luckTier1 * Math.pow(.67, 3)).toFixed(2);
    newState.luckTier5 = (newState.luckTier1 * Math.pow(.67, 4)).toFixed(2);

    return newState;
};
const relicReducer = (state=defaultState.relicCalculator, action) => {
    let newState = Object.assign({}, state);
    const op = {
        xpRelicCost: (value) => {newState.xpRelicCost=value;},
        resourceRelicCost: (value) => {newState.resourceRelicCost=value;},
        workloadRelicCost: (value) => {newState.workloadRelicCost=value;},
        dropRelicCost: (value) => {newState.dropRelicCost=value;},
        luckRelicCost: (value) => {newState.luckRelicCost=value;}
    }
    // does the action key match what we expect?
    if(!action.type || _.indexOf(_.keys(op), action.type) < 0) return state;
    op[action.type](action.value||0);

    // state updated, update calculated values
    let total = 0;

    total += newState.xpRelicCost * (newState.xpRelicCost - 1) / 2;
    total += newState.resourceRelicCost * (newState.resourceRelicCost - 1) / 2;
    total += newState.workloadRelicCost * (newState.workloadRelicCost - 1) / 2;
    total += newState.dropRelicCost * (newState.dropRelicCost - 1) / 2;
    total += newState.luckRelicCost * (newState.luckRelicCost - 1) / 2;

    newState.relicsSpent = total;

    return newState;
};
const enchantReducer = (state=defaultState.enchantCalculator, action) => {
    let newState = Object.assign({}, state);
    if(action.stateKey!='enchantCalculator') return state||defaultState.enchantCalculator;
    newState[action.valueKey] = action.value;

    // state updated, update calculated values
    let totalXp = _.sum(_.range(newState.currentLevel+1, newState.targetLevel+1)) * 100;
    let totalAttempts = totalXp / (newState.xpSuccess + newState.xpRemove);

    newState.enchantXPRequired = totalXp;
    newState.enchantTotalEnchants = totalAttempts;
    newState.enchantMEUsed = totalAttempts * (newState.meSuccess - newState.meRemove);

    return newState;
};
const miscCostCalculators = {
    dropConfig: {
        title: <h4>Drop Information</h4>,
        stateKey: 'dropCalculator',
        reducer: dropReducer,
        cols: [
            {id: 'tsDropRate', title: 'TS Drop Rate %', type: 'number', placeholder: 1, cls: 'input', stateKey: 'dropCalculator', valueKey: 'tsDropRate'},
            {id: 'tsSecondsPer', title: 'Sec/Attempt', type: 'number', placeholder: 5, cls: 'input', stateKey: 'dropCalculator', valueKey: 'tsSecondsPer'},
            {id: 'relicDropRate', title: 'Relic %', type: 'number', placeholder: 0, cls: 'input', stateKey: 'dropCalculator', valueKey: 'relicDropRate'},
            {id: 'gemDropRate', title: 'Gem %', type: 'number', placeholder: 0, cls: 'input', stateKey: 'dropCalculator', valueKey: 'gemDropRate'},
            {id: 'hoursFarming', title: 'Hours', type: 'number', placeholder: 1, cls: 'input', stateKey: 'dropCalculator', valueKey: 'hoursFarming'},
            {id: 'totalDropRate', title: 'Drop Rate', cls: 'label'},
            {id: 'dropHourlyAttempts', title: 'Hourly Attempts', cls: 'label'},
            {id: 'hourlyDrops', title: 'Hourly Drops', cls: 'label'},
            {id: 'totalDrops', title: 'Total Drops', cls: 'label'}
        ]
    },
    luckConfig: {
        title: <h4>Luck Information</h4>,
        stateKey: 'luckCalculator',
        reducer: luckReducer,
        cols: [
            {id: 'luckPersonal', title: 'Personal Luck', type: 'number', placeholder: 0, cls: 'input', stateKey: 'luckCalculator', valueKey: 'luckPersonal'},
            {id: 'luckKingdom', title: 'Kingdom Luck', type: 'number', placeholder: 0, cls: 'input', stateKey: 'luckCalculator', valueKey: 'luckKingdom'},

            {id: 'luckTier1', title: 'Tier 1', cls: 'label'},
            {id: 'luckTier2', title: 'Tier 2', cls: 'label'},
            {id: 'luckTier3', title: 'Tier 3', cls: 'label'},
            {id: 'luckTier4', title: 'Tier 4', cls: 'label'},
            {id: 'luckTier5', title: 'Tier 5', cls: 'label'}
        ]
    },
    relicConfig: {
        title: <h4>Relic Cost Info</h4>,
        stateKey: 'relicCalculator',
        reducer: relicReducer,
        cols: [
            {id: 'xpRelicCost', title: 'XP Cost', type: 'number', placeholder: 0, cls: 'input', stateKey: 'relicCalculator', valueKey: 'xpRelicCost'},
            {id: 'resourceRelicCost', title: 'Res% Cost', type: 'number', placeholder: 0, cls: 'input', stateKey: 'relicCalculator', valueKey: 'resourceRelicCost'},
            {id: 'workloadRelicCost', title: 'Workload Cost', type: 'number', placeholder: 0, cls: 'input', stateKey: 'relicCalculator', valueKey: 'workloadRelicCost'},
            {id: 'dropRelicCost', title: 'Drop% Cost', type: 'number', placeholder: 0, cls: 'input', stateKey: 'relicCalculator', valueKey: 'dropRelicCost'},
            {id: 'luckRelicCost', title: 'Res Luck% Cost', type: 'number', placeholder: 0, cls: 'input', stateKey: 'relicCalculator', valueKey: 'luckRelicCost'},
            {id: 'relicsSpent', title: 'Relics Spent', cls: 'label'}
        ]
    },
    enchantConfig: {
        title: <div><h4>Enchanting Information</h4><h6>Default:L1 dex</h6></div>,
        stateKey: 'enchantCalculator',
        reducer: enchantReducer,
        cols: [
            {id: 'enchCurrentLevel', title: 'CurrentLevel', type: 'number', placeholder: 0, cls: 'input', stateKey: 'enchantCalculator', valueKey: 'currentLevel'},
            {id: 'enchTargetLevel', title: 'Target Level', type: 'number', placeholder: 0, cls: 'input', stateKey: 'enchantCalculator', valueKey: 'targetLevel'},
            {id: 'enchXPSuccess', title: 'XP per Success', type: 'number', placeholder: 0, cls: 'input', stateKey: 'enchantCalculator', valueKey: 'xpSuccess'},
            {id: 'enchXPRemove', title: 'XP per Removal', type: 'number', placeholder: 0, cls: 'input', stateKey: 'enchantCalculator', valueKey: 'xpRemove'},
            {id: 'enchMESuccess', title: 'ME per Success', type: 'number', placeholder: 0, cls: 'input', stateKey: 'enchantCalculator', valueKey: 'meSuccess'},
            {id: 'enchMERemove', title: 'ME per Removal', type: 'number', placeholder: 0, cls: 'input', stateKey: 'enchantCalculator', valueKey: 'meRemove'},

            {id: 'enchantXPRequired', title: 'XP Required', cls: 'label'},
            {id: 'enchantTotalEnchants', title: 'Total Enchants', cls: 'label'},
            {id: 'enchantMEUsed', title: 'ME Used', cls: 'label'}
        ]
    }
};

export function getMiscCalculators(defaultState) {
    return miscCostCalculators;
};
