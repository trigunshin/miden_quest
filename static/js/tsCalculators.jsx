/*
TODO:
    make switch hide unused divs
        others:
            hide the total field
        selling:
            extra field for gold/action
        scouting:
            extra fields for landmarks/action, actions/relic and relics/action
    tie relic boosts on TS page in with fields on Misc page

each input should have a 'a.b.c' state key
this will use
    _.get(state, valueKey, 0)
    _.set(state, valueKey, value)
//*/
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

function _getTSChance(baseLuck, relicLuck, kingdomLuck, tierFactor) {
    return Math.min(100, (baseLuck + (relicLuck + kingdomLuck) * tierFactor).toFixed(3));
}
function _getTSChanceArgs(tsPrefix, tier, state) {
    return {
        base: parseInt(_.get(state, tsPrefix.concat('.luck.', tier), 0)),
        relic: parseInt(_.get(state, tsPrefix.concat('.luck.relic'), 0)),
        kingdom: parseInt(_.get(state, tsPrefix.concat('.luck.kingdom'), 0)),
        tierFactors: tierFactors[tier]
    };
}
function getTSChance(tsPrefix, tier, state) {
    let args = _.values(_getTSChanceArgs(tsPrefix, tier, state));
    return _getTSChance.apply(this, args);
}

function _getTierOutput(tsLevel, relicRes, workEff, kingdomBonus, gemBonus, globalBonus, amountFactor, tierFactor) {
    // amountFactor * (Level + Efficiency + Relics) * Kingdom * Gem * Global
    let ret = ((1+tsLevel/100*tierFactor) + (workEff+relicRes)/100*tierFactor) * (1+kingdomBonus/100) * (1+gemBonus/100) * globalBonus * amountFactor;
    return ret.toFixed(2);
}
function _getTierOutputArgs(tsPrefix, tier, state) {
    let currentTS = _.get(state, 'ts.currentTS', 'selling');
    return {
        level: _.get(state, tsPrefix.concat('.level'), 0),
        relic: parseInt(_.get(state, tsPrefix.concat('.amount.relic'), 0)),
        we: parseInt(_.get(state, tsPrefix.concat('.amount.we'), 0)),
        kingdom: parseInt(_.get(state, tsPrefix.concat('.amount.kingdom'), 0)),
        gem: parseInt(_.get(state, tsPrefix.concat('.amount.gem'), 0)),
        global: parseInt(_.get(state, tsPrefix.concat('.amount.global'), 0)),
        amount: _.get(tsAmountFactors, currentTS.concat('.', tier), 1),
        tierFactor: tierFactors[tier]
    };
}
function getTierOutput(tsPrefix, tier, state) {
    let args = _.values(_getTierOutputArgs(tsPrefix, tier, state));
    return _getTierOutput.apply(this, args);
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

function getTotalWeightedOutput(tsPrefix, tiers, state) {
    return _.sum(_.map(tiers, (tier) => {return parseInt(getWeightedOutput(tsPrefix, tier, state));}));
}

function relicAmountROITier(tsPrefix, tier, state) {
    let args = _getTierOutputArgs(tsPrefix, tier, state);
    args.relic += 15;
    let ret = _getTierOutput.apply(this, _.values(args));
    ret *= getTSChance(tsPrefix, tier, state)/100;
    return parseFloat(ret).toFixed(2);
}
function getRelicAmountROI(tsPrefix, tiers, state) {
    // for each tier, call _getTierOutput with current arguments except for relic
    let ret = _.map(tiers, (tier) => {return parseFloat(relicAmountROITier(tsPrefix, tier, state));});
    ret = _.sum(ret).toFixed(2);
    return ret;
}

function relicLuckROITier(tsPrefix, tier, state) {
    let ret = getTierOutput(tsPrefix, tier, state);
    let args = _getTSChanceArgs(tsPrefix, tier, state);
    args.relic += 3;
    let chance = _getTSChance.apply(this, _.values(args));
    ret *= chance/100;
    return parseFloat(ret).toFixed(2);
}
function getRelicLuckROI(tsPrefix, tiers, state) {
    // for each tier, call _getTierOutput with current arguments except for relic
    let ret = _.map(tiers, (tier) => {return parseFloat(relicLuckROITier(tsPrefix, tier, state));});
    ret = _.sum(ret).toFixed(2);
    return ret;
}

function gemROITier(tsPrefix, tier, state) {
    let args = _getTierOutputArgs(tsPrefix, tier, state);
    args.gem += 1;
    let ret = _getTierOutput.apply(this, _.values(args));
    ret *= getTSChance(tsPrefix, tier, state)/100;
    return parseFloat(ret).toFixed(2);
}
function getGemROI(tsPrefix, tiers, state) {
    // for each tier, call _getTierOutput with current arguments except for relic
    let ret = _.map(tiers, (tier) => {return parseFloat(gemROITier(tsPrefix, tier, state));});
    ret = _.sum(ret).toFixed(2);
    return ret;
}

// cost of gem/relic upgrades
/*
have user input relic cost of next relic upgrade
calculate +xp/res%/luck% from cost (.2/1.5/.3)
    display value as label instead of input?

x10: val * 10 + 45;
//*/
function relicsForUpdate(tsPrefix, state) {
    return 0;
}
function getRelicCost(tsPrefix, tiers, state) {
    let relics = relicsForUpdate(tsPrefix, state);
    let relicCost = parseInt(_.get(state, 'resources.relic'), 0);
    return relics * relicCost;
}
function gemsForUpdate(tsPrefix, state) {
    let gems = parseInt(_.get(state, tsPrefix.concat('.amount.gem'), 0));
    let nextUpdate = _.floor(gems / 5 + 5);
    return nextUpdate;
}
function getGemCost(tsPrefix, tiers, state) {
    let nextUpdateCost = gemsForUpdate(tsPrefix, state);
    let gemCost = parseInt(_.get(state, 'resources.gem'), 0);
    return gemCost * nextUpdateCost;
}


function getTSColumns(resType, tiers, ts) {
    return _.map(tiers, (tier) => {
        const stateKey = resType.concat(tier);
        const title = _.upperFirst(tier);
        const fn = (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.', stateKey));};
        return {title, type: 'number', placeholder: 0, cls: 'input', stateKey, fn};
    });
}


function getTSAmountOutputCols(ts) {
    let ret = [
        {title: 'T1', placeholder: 0, cls: 'label', fn: _.partial(getTierOutput, ts.stateKeyPrefix, 't1')},
        {title: 'T2', placeholder: 0, cls: 'label', fn: _.partial(getTierOutput, ts.stateKeyPrefix, 't2')},
        {title: 'T3', placeholder: 0, cls: 'label', fn: _.partial(getTierOutput, ts.stateKeyPrefix, 't3')},
        {title: 'T4', placeholder: 0, cls: 'label', fn: _.partial(getTierOutput, ts.stateKeyPrefix, 't4')},
        {title: 'T5', placeholder: 0, cls: 'label', fn: _.partial(getTierOutput, ts.stateKeyPrefix, 't5')}
    ];
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
        {title: 'EV Total', placeholder: 0, cls: 'label', fn: _.partial(getTotalWeightedOutput, ts.stateKeyPrefix, tiers)}
    ];
}
function getRelicResAmountCols(ts) {
    return [
        {title: 'T1', placeholder: 0, cls: 'label', fn: _.partial(relicAmountROITier, ts.stateKeyPrefix, 't1')},
        {title: 'T2', placeholder: 0, cls: 'label', fn: _.partial(relicAmountROITier, ts.stateKeyPrefix, 't2')},
        {title: 'T3', placeholder: 0, cls: 'label', fn: _.partial(relicAmountROITier, ts.stateKeyPrefix, 't3')},
        {title: 'T4', placeholder: 0, cls: 'label', fn: _.partial(relicAmountROITier, ts.stateKeyPrefix, 't4')},
        {title: 'T5', placeholder: 0, cls: 'label', fn: _.partial(relicAmountROITier, ts.stateKeyPrefix, 't5')},
        {title: 'Total EV +15% Res', placeholder: 0, cls: 'label', fn: _.partial(getRelicAmountROI, ts.stateKeyPrefix, tiers)}
        // add cost?
        // add % diff?
    ];
}
function getRelicLuckAmountCols(ts) {
    return [
        {title: 'T1', placeholder: 0, cls: 'label', fn: _.partial(relicLuckROITier, ts.stateKeyPrefix, 't1')},
        {title: 'T2', placeholder: 0, cls: 'label', fn: _.partial(relicLuckROITier, ts.stateKeyPrefix, 't2')},
        {title: 'T3', placeholder: 0, cls: 'label', fn: _.partial(relicLuckROITier, ts.stateKeyPrefix, 't3')},
        {title: 'T4', placeholder: 0, cls: 'label', fn: _.partial(relicLuckROITier, ts.stateKeyPrefix, 't4')},
        {title: 'T5', placeholder: 0, cls: 'label', fn: _.partial(relicLuckROITier, ts.stateKeyPrefix, 't5')},
        {title: 'Total EV +3% Luck', placeholder: 0, cls: 'label', fn: _.partial(getRelicLuckROI, ts.stateKeyPrefix, tiers)}
    ];
}
function getGemCols(ts) {
    return [
        {title: 'T1', placeholder: 0, cls: 'label', fn: _.partial(gemROITier, ts.stateKeyPrefix, 't1')},
        {title: 'T2', placeholder: 0, cls: 'label', fn: _.partial(gemROITier, ts.stateKeyPrefix, 't2')},
        {title: 'T3', placeholder: 0, cls: 'label', fn: _.partial(gemROITier, ts.stateKeyPrefix, 't3')},
        {title: 'T4', placeholder: 0, cls: 'label', fn: _.partial(gemROITier, ts.stateKeyPrefix, 't4')},
        {title: 'T5', placeholder: 0, cls: 'label', fn: _.partial(gemROITier, ts.stateKeyPrefix, 't5')},
        {title: 'Total Gem +1%', placeholder: 0, cls: 'label', fn: _.partial(getGemROI, ts.stateKeyPrefix, tiers)},
        {title: 'Gem +1% Cost', placeholder: 0, cls: 'label', fn: _.partial(getGemCost, ts.stateKeyPrefix, tiers)}
    ];
}
let ts = {
    xp: {label: 'XP', stateKeyPrefix: 'ts', cols: getTSXPCols},
    amount: {label: 'Amount', stateKeyPrefix: 'ts', cols: getTSAmountCols},
    luck: {label: 'Luck', stateKeyPrefix: 'ts', cols: getTSChanceCols},
    amountOutput: {label: 'TS Output', stateKeyPrefix: 'ts', cols: getTSAmountOutputCols},
    weightedOutput: {label: 'Output EV', stateKeyPrefix: 'ts', cols: getTSWeightedCols},
    relicAmountOutput: {label: 'Output EV (+15 Relic Amount)', stateKeyPrefix: 'ts', cols: getRelicResAmountCols},
    relicLuckOutput: {label: 'Output EV (+3 Relic Luck)', stateKeyPrefix: 'ts', cols: getRelicLuckAmountCols},
    gemOutput: {label: 'Output EV (+1% Gem)', stateKeyPrefix: 'ts', cols: getGemCols}
};

let tsActionPrefixes = ['level', 'currentTS', 'xp', 'amount', 'luck', 'load'];
let tsReducerHelper = (state, action) => {
    if(!_.find(tsActionPrefixes, (pre)=>{return action.type.startsWith(pre);})) return state||defaultState;
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
