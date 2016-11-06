import {getTSChance} from './tradeskillChance';
import {tierFactors, tsAmountFactors, tradeskillResourceMap} from './defaultStates';

function _getTierOutput(tsLevel, relicRes, workEff, kingdomBonus, gemBonus, globalBonus, amountFactor, tierFactor) {
    // amountFactor * (Level + Efficiency + Relics) * Kingdom * Gem * Global
    let ret = ((1+tsLevel/100*tierFactor) + (workEff+relicRes)/100*tierFactor) * (1+kingdomBonus/100) * (1+gemBonus/100) * globalBonus * amountFactor;
    return ret.toFixed(2);
}
function _getTierOutputArgs(tier, state) {
    let currentTS = state.currentTrade;
    return {
        level: state.level,
        relic: state.relicResource,
        we: state.workEfficiency,
        kingdom: state.kingdomResource,
        gem: currentTS === 'selling' ? state.gemGold : state.gemResource,
        global: state.globalBonus,
        amount: _.get(tsAmountFactors, currentTS.concat('.', tier), 1),
        tierFactor: tierFactors[tier]
    };
}
function getTierOutput(tier, state) {
    let args = _.values(_getTierOutputArgs(tier, state));
    return _getTierOutput.apply(this, args);
}
// get chance-weighted outputs, and weight outputs by res value
function getWeightedOutput(tier, state) {
    let tierOutput = getTierOutput(tier, state);
    let tierChance = getTSChance(tier, state)/100;
    return (tierOutput * tierChance).toFixed(2)||0;
}

function _factorAmountsByCost(tiers, tierAmounts, state) {
    const currentTS = state.currentTrade;
    return _.map(_.zipObject(tiers, tierAmounts), (amount, tier) => {
        return amount * _.get(state, 'resources.'.concat(tradeskillResourceMap[currentTS], '.', tier), 0);
    });
}
function getTotalWeightedOutput(tiers, state) {
    const perTierAmounts = _.map(tiers, (tier) => {
        return parseFloat(getWeightedOutput(tier, state));
    });
    return _.sum(_factorAmountsByCost(tiers, perTierAmounts, state)).toFixed(2);
}
