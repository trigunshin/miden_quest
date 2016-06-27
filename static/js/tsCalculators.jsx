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
//*/

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

// Calculator column generators
function getTierColumns(tiers, viewFn, ts) {
    return _.map(tiers, (tier) => {
        return {title: _.upperFirst(tier), placeholder: 0, cls: 'label', fn: _.partial(viewFn, ts.stateKeyPrefix, tier)};
    });
}
function getTSInputCols(resType, tiers, ts) {
    return _.map(tiers, (tier) => {
        const stateKey = resType.concat(tier);
        const title = _.upperFirst(tier);
        const fn = (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.', stateKey));};
        return {title, type: 'number', placeholder: 0, cls: 'input', stateKey, fn};
    });
}
function getTSXPCols(ts) {
    let ret = [{title: 'TS Level', type: 'number', placeholder: 0, cls: 'input', stateKey: 'level', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.level'));}}];
    return ret.concat(getTSInputCols('xp.', ['relic', 'gem'], ts));
}
function getTSAmountCols(ts) {
    let ret = [{title: 'TS Level', type: 'number', placeholder: 0, cls: 'input', stateKey: 'level', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.level'));}}];
    return ret.concat(getTSInputCols('amount.', ['relic', 'gem', 'we', 'kingdom', 'global'], ts));
}
function getTSAmountOutputCols(tiers, ts) {
    return getTierColumns(tiers, getTierOutput, ts)
}
function getTSChanceCols(ts) {
    let ret = getTSInputCols('luck.', ['relic', 'kingdom'], ts);
    ret = ret.concat([
        {title: 'Tile T1', type: 'number', placeholder: 0, cls: 'input', stateKey: 'luck.t1', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.luck.t1'));}},
        {title: 'Tile T2', type: 'number', placeholder: 0, cls: 'input', stateKey: 'luck.t2', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.luck.t2'));}},
        {title: 'Tile T3', type: 'number', placeholder: 0, cls: 'input', stateKey: 'luck.t3', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.luck.t3'));}},
        {title: 'Tile T4', type: 'number', placeholder: 0, cls: 'input', stateKey: 'luck.t4', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.luck.t4'));}},
        {title: 'Tile T5', type: 'number', placeholder: 0, cls: 'input', stateKey: 'luck.t5', fn: (state)=>{return _.get(state, ts.stateKeyPrefix.concat('.luck.t5'));}}
    ]);
    return ret;
}
function getCalculatedLuckCols(tiers, ts) {
    return getTierColumns(tiers, getTSChance, ts);
}
function getTSWeightedCols(tiers, ts) {
    const ret = getTierColumns(tiers, getWeightedOutput, ts);
    ret.push({title: 'EV Total', placeholder: 0, cls: 'label', fn: _.partial(getTotalWeightedOutput, ts.stateKeyPrefix, tiers)});
    return ret;
}
function getRelicResAmountCols(tiers, ts) {
    const ret = getTierColumns(tiers, relicAmountROITier, ts);
    ret.push({title: 'Total EV +15% Res', placeholder: 0, cls: 'label', fn: _.partial(getRelicAmountROI, ts.stateKeyPrefix, tiers)});
    return ret;
}
function getRelicLuckAmountCols(tiers, ts) {
    const ret = getTierColumns(tiers, relicLuckROITier, ts);
    ret.push({title: 'Total EV +3% Luck', placeholder: 0, cls: 'label', fn: _.partial(getRelicLuckROI, ts.stateKeyPrefix, tiers)});
    return ret;
}
function getGemCols(tiers, ts) {
    const ret = getTierColumns(tiers, gemROITier, ts);
    ret.push({title: 'Total Gem +1%', placeholder: 0, cls: 'label', fn: _.partial(getGemROI, ts.stateKeyPrefix, tiers)});
    ret.push({title: 'Gem +1% Cost', placeholder: 0, cls: 'label', fn: _.partial(getGemCost, ts.stateKeyPrefix, tiers)});
    return ret;
}
// Calculator row configs
let ts = {
    xp: {label: 'XP', stateKeyPrefix: 'ts', cols: getTSXPCols},
    amount: {label: 'Amount', stateKeyPrefix: 'ts', cols: getTSAmountCols},
    luck: {label: 'Luck', stateKeyPrefix: 'ts', cols: getTSChanceCols},
    totalLuck: {label: 'Calculated Luck', stateKeyPrefix: 'ts', cols: _.partial(getCalculatedLuckCols, tiers)},
    amountOutput: {label: 'TS Output', stateKeyPrefix: 'ts', cols: _.partial(getTSAmountOutputCols, tiers)},
    weightedOutput: {label: 'Output EV', stateKeyPrefix: 'ts', cols: _.partial(getTSWeightedCols, tiers)},
    relicAmountOutput: {label: 'Output EV (+15 Relic Amount)', stateKeyPrefix: 'ts', cols: _.partial(getRelicResAmountCols, tiers)},
    relicLuckOutput: {label: 'Output EV (+3 Relic Luck)', stateKeyPrefix: 'ts', cols: _.partial(getRelicLuckAmountCols, tiers)},
    gemOutput: {label: 'Output EV (+1% Gem)', stateKeyPrefix: 'ts', cols: _.partial(getGemCols, tiers)}
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
