import {tierFactors, tiersXp} from '../defaultStates';
import {getTSChance} from './tradeskillChance';

function getTierXp(tier, tsLevel, relicXp, gemXp, globalBonus, navigationXp) {
    return relicXp + (1 + (tsLevel*1.485)/45 + gemXp / 100) * tiersXp[tier] * (globalBonus + navigationXp/100);
}
export function getActionXp(tiers, state) {
    const {relicXp, level, gemXp, globalBonus, navigationXp} = state;

    const tiersDescending = _.reverse(_.slice(tiers)).concat('t0');
    const finalIndex = _.findIndex(tiersDescending, (tier) => {return getTSChance(tier, state) >= 100});
    const activeTiers = _.slice(tiersDescending, 0, finalIndex+1);

    let ret = 0, p = 1;
    for(let i=0;i<activeTiers.length;i++) {
        const tier = activeTiers[i];
        const tierChance = getTSChance(tier, state) / 100;
        const tierXp = getTierXp(tier, level, relicXp, gemXp, globalBonus, navigationXp).toFixed(2);

        ret += p * tierChance * tierXp;
        p *= (1 - tierChance);
    }
    return ret;
}
