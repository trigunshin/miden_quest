import _ from 'lodash';

import {getTSChance} from './tradeskillChance';
import {getTierOutput, getTotalWeightedOutput, _getTierOutputArgs, _getTierOutput, _factorAmountsByCost} from './tradeskillAmount';


//Relic amount:
function relicAmountROITier(tier, state) {
    let args = _getTierOutputArgs(tier, state);
    args.relic += 15;
    let ret = _getTierOutput.apply(this, _.values(args));
    ret *= getTSChance(tier, state)/100;
    console.info('relicAmountROITier', tier, args, ret);
    return ret;
}
function getRelicAmountROI(tiers, state) {
    // for each tier, call _getTierOutput with current arguments except for relic
    const tierAmounts = _.map(tiers, (tier) => {
        return { tier: tier, amount: parseFloat(relicAmountROITier(tier, state))};});
    console.info('tier amounts', getRelicAmountROI);
    const tierValues = _factorAmountsByCost(tierAmounts, state);
    return _.sum(tierValues).toFixed(2);
}
export function getRelicAmountROIDiff(tiers, state) {
    const roi = getRelicAmountROI(tiers, state);
    const baseValue = state.weightedValue;//getTotalWeightedOutput(tiers, state);
    console.info('roi, base', roi, baseValue);
    return (roi - baseValue).toFixed(2);
}

// Relic luck: per-tier, total, upgrade ROI total, upgrade ROI diff
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
    const tierAmounts = _.map(tiers, (tier) => {return parseFloat(relicLuckROITier(tsPrefix, tier, state));});
    const tierValues = _factorAmountsByCost(tiers, tierAmounts, state);
    return _.sum(tierValues).toFixed(2);
}
function getRelicLuckROIDiff(tsPrefix, tiers, state) {
    const roi = getRelicLuckROI(tsPrefix, tiers, state);
    const baseValue = getTotalWeightedOutput(tsPrefix, tiers, state);
    return (roi - baseValue).toFixed(2);
}

// Gem %
function gemROITier(tsPrefix, tier, state) {
    let args = _getTierOutputArgs(tsPrefix, tier, state);
    args.gem += 1;
    let ret = _getTierOutput.apply(this, _.values(args));
    ret *= getTSChance(tsPrefix, tier, state)/100;
    return parseFloat(ret).toFixed(2);
}
function getGemROI(tsPrefix, tiers, state) {
    // for each tier, call _getTierOutput with current arguments except for relic
    const tierAmounts = _.map(tiers, (tier) => {return parseFloat(gemROITier(tsPrefix, tier, state));});
    const tierValues = _factorAmountsByCost(tiers, tierAmounts, state);
    return _.sum(tierValues).toFixed(2);
}
function getGemROIDiff(tsPrefix, tiers, state) {
    const roi = getGemROI(tsPrefix, tiers, state);
    const baseValue = getTotalWeightedOutput(tsPrefix, tiers, state);
    return (roi - baseValue).toFixed(2);
}

// determine ROI efficiency
function roiDifference(roiFn, tsPrefix, tiers, state) {
    const roi = roiFn(tsPrefix, tiers, state);
    const baseValue = getTotalWeightedOutput(tsPrefix, tiers, state);
    return (roi - baseValue).toFixed(2);
}
function costPerROI(roiFn, costFn, tsPrefix, tiers, state) {
    const roiDiff = roiDifference(roiFn, tsPrefix, tiers, state);
    const roiCost = costFn(state);
    return numbro(roiCost/roiDiff).format('0a.00');
}
// forecast upgrade prices
function relicsForUpdate(currentBonus, bonusFactor) {
    const currentCost = currentBonus / bonusFactor;
    return currentCost + 1;
}
function getRelicCost(tsPrefix, bonusFactor, bonusKey, state) {
    const numUpgrades = 10;
    const relicCost = parseInt(_.get(state, 'resources.relic'), 0);
    const currentBonus = parseFloat(_.get(state, tsPrefix.concat(bonusKey)), 0);
    const nextRelicUpgrade = relicsForUpdate(currentBonus, bonusFactor) * numUpgrades + _.sum(_.range(numUpgrades));
    return (nextRelicUpgrade * relicCost).toFixed(0);
}
function gemsForUpdate(tsPrefix, state) {
    let gems = parseInt(_.get(state, tsPrefix.concat('.amount.gem'), 0));
    let nextUpdate = _.floor(gems / 5 + 5); // increment every 5, up to 50/ea
    nextUpdate = _.min([50, nextUpdate]);
    return nextUpdate;
}
function getGemCost(tsPrefix, state) {
    let nextUpdateCost = gemsForUpdate(tsPrefix, state);
    let gemCost = parseInt(_.get(state, 'resources.gem'), 0);
    return gemCost * nextUpdateCost;
}

