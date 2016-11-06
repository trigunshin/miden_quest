import _ from 'lodash';
import {observable, computed} from "mobx";
import {tiers, tierFactors, tierPrice, tiersXp} from '../defaultStates';
import {getActionXp} from './tsExperience';
import {getTSChance} from './tradeskillChance';
//import {tiers, tiersXp, tierFactors, tsAmountFactors, tradeskillResourceMap, relicBonusFactors} from './defaultStates';

export class Tradeskill {
    @observable currentTrade = 'selling';
    @observable level = 1;
    
    @observable gemXp = 0;
    @observable relicXp = 0;
    @observable navigationXp = 0;

    @observable gemGold = 0;
    @observable gemResource = 0;
    @observable relicResource = 0;
    @observable kingdomResource = 0;
    @observable workEfficiency = 0;
    @observable globalBonus = 1;

    @observable relicLuck = 0;
    @observable kingdomLuck = 0;
    @observable t0 = 100;
    @observable t1 = 90;
    @observable t2 = 60;
    @observable t3 = 30;
    @observable t4 = 15;
    @observable t5 = 5;

    @computed get xpPerAction() {
        return getActionXp(tiers, this).toFixed(1);
    }

    @computed get t1Chance() {
        return getTSChance('t1', this);
    }
    @computed get t2Chance() {
        return getTSChance('t2', this);
    }
    @computed get t3Chance() {
        return getTSChance('t3', this);
    }
    @computed get t4Chance() {
        return getTSChance('t4', this);
    }
    @computed get t5Chance() {
        return getTSChance('t5', this);
    }
}

