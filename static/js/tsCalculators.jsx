// set up ts configuration
//let levelCol = {id: 'level', title: 'Level', type: 'number', placeholder: 0, cls: 'input', stateKey: 'ts', valueKey: 'level', fn: (state)=>{return state[ts.stateKey]['level']}},
/*

TODO:
    √switch between
    √    gathering, mining, logging, fishing, scouting, selling
    make switch hide unused divs
        others:
            hide the total field
        selling:
            extra field for gold/action
        scouting:
            extra fields for landmarks/action, actions/relic and relics/action
    tie relic boosts on TS page in with fields on Misc page
    add a fn layer to allow for x10 luck/res% forecasting
        ie, get state then call a sub-function, not get state & immediately do the calcs


each input should have a 'a.b.c' state key
this will use
    _.get(state, valueKey, 0)
    _.set(state, valueKey, value)
//*/

let actionPrefixes = ['level', 'currentTS', 'xp', 'amount', 'luck', 'load'];
function getTSXPCols(ts) {
    return [
        {title: 'TS Level', type: 'number', placeholder: 0, cls: 'input', stateKey: 'level', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.level'));}},
        {title: 'Relic XP', type: 'number', placeholder: 0, cls: 'input', stateKey: 'xp.relic', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.xp.relic'));}},
        {title: 'Gem XP', type: 'number', placeholder: 0, cls: 'input', stateKey: 'xp.gem', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.xp.gem'));}}
    ];
}
function getTSAmountCols(ts) {
    return [
        {title: 'TS Level', type: 'number', placeholder: 0, cls: 'input', stateKey: 'level', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.level'));}},
        {title: 'Relic %', type: 'number', placeholder: 0, cls: 'input', stateKey: 'amount.relic', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.amount.relic'));}},
        {title: 'Work Eff', type: 'number', placeholder: 0, cls: 'input', stateKey: 'amount.we', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.amount.we'));}},
        {title: 'Kingdom %', type: 'number', placeholder: 0, cls: 'input', stateKey: 'amount.kingdom', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.amount.kingdom'));}},
        {title: 'Gem %', type: 'number', placeholder: 0, cls: 'input', stateKey: 'amount.gem', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.amount.gem'));}},
        {title: 'Global Bonus', type: 'number', placeholder: 1, cls: 'input', stateKey: 'amount.global', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.amount.global'));}},
    ];
}
function getTSChance(tsPrefix, tier, state) {
    let tierVal = parseInt(_.get(state, tsPrefix.concat('.luck.', tier), 0));
    let relic = parseInt(_.get(state, tsPrefix.concat('.luck.relic'), 0));
    let kingdom = parseInt(_.get(state, tsPrefix.concat('.luck.kingdom'), 0));
    let tierFactor = tierFactors[tier];

    return Math.min(100, (tierVal + (relic + kingdom) * tierFactor).toFixed(3));
}
function getTierOutput(tsPrefix, tier, state) {
    let currentTS = _.get(state, 'ts.currentTS', 'selling');

    let tierVal = parseInt(_.get(state, tsPrefix.concat('.luck.', tier), 0));

    let tsLevel = _.get(state, tsPrefix.concat('.level'), 0);
    let relic = parseInt(_.get(state, tsPrefix.concat('.amount.relic'), 0));
    let we = parseInt(_.get(state, tsPrefix.concat('.amount.we'), 0));
    
    let kingdom = parseInt(_.get(state, tsPrefix.concat('.amount.kingdom'), 0));
    let gem = parseInt(_.get(state, tsPrefix.concat('.amount.gem'), 0));
    let globalBonus = parseInt(_.get(state, tsPrefix.concat('.amount.global'), 0));

    let tierFactor = tierFactors[tier];
    // sales/scout have an extra multiple
    let amountFactor = _.get(tsAmountFactors, currentTS.concat('.', tier), 1);

    // (Level + Efficiency + Relics) * Kingdom * Gem * Global
    let ret = ((1+tsLevel/100*tierFactor) + (we+relic)/100*tierFactor) * (1+kingdom/100) * (1+gem/100) * globalBonus * amountFactor;

    return ret.toFixed(2);
}
function getTotalOutput(tsPrefix, tiers, state) {
    let ret = _.sum(_.map(tiers, (tier) => {
        return parseInt(getTierOutput(tsPrefix, tier, state));
    }));
    return ret.toFixed(2);
}
function getWeightedOutput(tsPrefix, tier, state) {
    let tierOutput = getTierOutput(tsPrefix, tier, state);
    let tierChance = getTSChance(tsPrefix, tier, state)/100;

    return (tierOutput * tierChance).toFixed(2)||0;
}
function getWeightedOutputRelicRes(tsPrefix, tier, state) {
    let tierOutput = getTierOutput(tsPrefix, tier, state);
    let tierChance = getTSChance(tsPrefix, tier, state)/100;
    let relicRes = .15;

    return (tierOutput * tierChance).toFixed(2)||0;
}
function getWeightedOutputRelicLuck(tsPrefix, tiers, state) {

    let initial = getTotalWeightedOutput(tsPrefix, tiers, state);
    //getTotalWeightedOutput

    let tierOutput = getTierOutput(tsPrefix, tier, state);
    let tierChance = getTSChance(tsPrefix, tier, state)/100;
    let luck = 3/100 * tierFactors[tier];
    console.info('luckweight', tierOutput, tierChance, luck);
    return (tierOutput * (tierChance+luck)).toFixed(2)||0;
}


function getTotalWeightedOutput(tsPrefix, tiers, state) {
    return _.sum(_.map(tiers, (tier) => {return parseInt(getWeightedOutput(tsPrefix, tier, state));}));
}
function getTSAmountOutputCols(ts) {
    let ret = [
        {title: 'T1', placeholder: 0, cls: 'label', fn: _.partial(getTierOutput, ts.stateKeyPrefix, 't1')},
        {title: 'T2', placeholder: 0, cls: 'label', fn: _.partial(getTierOutput, ts.stateKeyPrefix, 't2')},
        {title: 'T3', placeholder: 0, cls: 'label', fn: _.partial(getTierOutput, ts.stateKeyPrefix, 't3')},
        {title: 'T4', placeholder: 0, cls: 'label', fn: _.partial(getTierOutput, ts.stateKeyPrefix, 't4')},
        {title: 'T5', placeholder: 0, cls: 'label', fn: _.partial(getTierOutput, ts.stateKeyPrefix, 't5')}
    ];
    //let currentTS = _.get(state, 'ts.currentTS', 'selling');
    //if(currentTS=='scouting') {
    //    ret.push({title: 'T5', placeholder: 0, cls: 'label', fn: _.partial(getTotalOutput, ts.stateKeyPrefix, tiers)});
    //}

    return ret;
}
function getTSChanceCols(ts) {
    return [
        {title: 'Relic Luck', type: 'number', placeholder: 0, cls: 'input', stateKey: 'luck.relic', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.luck.relic'));}},
        {title: 'Kingdom Luck', type: 'number', placeholder: 0, cls: 'input', stateKey: 'luck.kingdom', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.luck.kingdom'));}},
        {title: 'Tile T1', type: 'number', placeholder: 0, cls: 'input', stateKey: 'luck.t1', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.luck.t1'));}},
        {title: 'Tile T2', type: 'number', placeholder: 0, cls: 'input', stateKey: 'luck.t2', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.luck.t2'));}},
        {title: 'Tile T3', type: 'number', placeholder: 0, cls: 'input', stateKey: 'luck.t3', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.luck.t3'));}},
        {title: 'Tile T4', type: 'number', placeholder: 0, cls: 'input', stateKey: 'luck.t4', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.luck.t4'));}},
        {title: 'Tile T5', type: 'number', placeholder: 0, cls: 'input', stateKey: 'luck.t5', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.luck.t5'));}},
        {title: 'Tile T1', placeholder: 0, cls: 'label', fn: _.partial(getTSChance, ts.stateKeyPrefix, 't1')},
        {title: 'Tile T2', placeholder: 0, cls: 'label', fn: _.partial(getTSChance, ts.stateKeyPrefix, 't2')},
        {title: 'Tile T3', placeholder: 0, cls: 'label', fn: _.partial(getTSChance, ts.stateKeyPrefix, 't3')},
        {title: 'Tile T4', placeholder: 0, cls: 'label', fn: _.partial(getTSChance, ts.stateKeyPrefix, 't4')},
        {title: 'Tile T5', placeholder: 0, cls: 'label', fn: _.partial(getTSChance, ts.stateKeyPrefix, 't5')},
    ];
}
function getTSWeightedCols(ts) {
    return [
        {title: 'EV T1', placeholder: 0, cls: 'label', fn: _.partial(getWeightedOutput, ts.stateKeyPrefix, 't1')},
        {title: 'EV T2', placeholder: 0, cls: 'label', fn: _.partial(getWeightedOutput, ts.stateKeyPrefix, 't2')},
        {title: 'EV T3', placeholder: 0, cls: 'label', fn: _.partial(getWeightedOutput, ts.stateKeyPrefix, 't3')},
        {title: 'EV T4', placeholder: 0, cls: 'label', fn: _.partial(getWeightedOutput, ts.stateKeyPrefix, 't4')},
        {title: 'EV T5', placeholder: 0, cls: 'label', fn: _.partial(getWeightedOutput, ts.stateKeyPrefix, 't5')},
        {title: 'EV Total', placeholder: 0, cls: 'label', fn: _.partial(getTotalWeightedOutput, ts.stateKeyPrefix, tiers)},
        //{title: 'EV +3% Res', placeholder: 0, cls: 'label', fn: _.partial(getTotalWeightedOutput, ts.stateKeyPrefix, tiers)},
        //{title: 'EV +3% Luck', placeholder: 0, cls: 'label', fn: _.partial(getWeightedOutputRelicLuck, ts.stateKeyPrefix, tiers)}
    ];
}
let ts = {
    xp: {label: 'XP', stateKeyPrefix: 'ts', cols: getTSXPCols},
    amount: {label: 'Amount', stateKeyPrefix: 'ts', cols: getTSAmountCols},
    luck: {label: 'Luck', stateKeyPrefix: 'ts', cols: getTSChanceCols},
    amountOutput: {label: 'TS Output', stateKeyPrefix: 'ts', cols: getTSAmountOutputCols},
    weightedOutput: {label: 'Output EV', stateKeyPrefix: 'ts', cols: getTSWeightedCols}
};
let tsReducerHelper = (state, action) => {
    if(!_.find(actionPrefixes, (pre)=>{return action.type.startsWith(pre);})) return state||defaultState;
    let newState = Object.assign({}, state);
    return _.set(newState, action.type, action.value||0);
};
let tsCalculators = {};
_.forIn(ts, (ts, key) => {
    tsCalculators[key] = {
        title: <h4>{ts.label}</h4>,
        stateKey: ts.stateKeyPrefix,
        /*
        currently this creates N 'ts' reducers that overwrite each other in reducers.jsx
        ideally there would either be a single reducer or the reducers dict would not use stateKey
        //*/
        reducer: tsReducerHelper,
        cols: ts.cols(ts)
    }
});
