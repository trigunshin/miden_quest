import {tierFactors} from '../defaultStates';

function getTierValue(tier, state) {
    switch(tier) {
        case 't1':
            return state.t1;
            break;
        case 't2':
            return state.t2;
            break;
        case 't3':
            return state.t3;
            break;
        case 't4':
            return state.t4;
            break;
        case 't5':
            return state.t5;
            break;
        default:
            return state.t0;
    }
}

// get tier/ts chance
function _getTSChance(baseLuck, relicLuck, kingdomLuck, tierFactor) {
    return Math.min(100, (baseLuck + (relicLuck + kingdomLuck) * tierFactor).toFixed(3));
}
function _getTSChanceArgs(tier, state) {
    return {
        base: getTierValue(tier, state),
        relic: state.relicLuck,
        kingdom: state.kingdomLuck,
        tierFactors: tierFactors[tier]
    };
}
export function getTSChance(tier, state) {
    const args = _getTSChanceArgs(tier, state);
    return _getTSChance.apply(this, _.values(args));
}
