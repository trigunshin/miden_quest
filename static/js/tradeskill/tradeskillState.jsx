import _ from 'lodash';
import {observable, computed} from "mobx";
import {tiers, tierFactors, tierPrice, tiersXp, tradeskillResourceMap} from '../defaultStates';
import {getActionXp} from './tsExperience';
import {getTSChance} from './tradeskillChance';
import {getTierOutput} from './tradeskillAmount';
import {getRelicAmountROIDiff} from './tradeskillUpgrades';

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

    @observable resourcePrices = {};

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

    @computed get t1Amount() {
        return getTierOutput('t1', this);
    }
    @computed get t2Amount() {
        return getTierOutput('t2', this);
    }
    @computed get t3Amount() {
        return getTierOutput('t3', this);
    }
    @computed get t4Amount() {
        return getTierOutput('t4', this);
    }
    @computed get t5Amount() {
        return getTierOutput('t5', this);
    }

    @computed get t1AmountEv() {
        const tier = 't1';
        return (getTierOutput(tier, this) * getTSChance(tier, this)/100).toFixed(2);
    }
    @computed get t2AmountEv() {
        const tier = 't2';
        return (getTierOutput(tier, this) * getTSChance(tier, this)/100).toFixed(2);
    }
    @computed get t3AmountEv() {
        const tier = 't3';
        return (getTierOutput(tier, this) * getTSChance(tier, this)/100).toFixed(2);
    }
    @computed get t4AmountEv() {
        const tier = 't4';
        return (getTierOutput(tier, this) * getTSChance(tier, this)/100).toFixed(2);
    }
    @computed get t5AmountEv() {
        const tier = 't5';
        return (getTierOutput(tier, this) * getTSChance(tier, this)/100).toFixed(2);
    }

    @computed get weightedValue() {
        const resourceName = tradeskillResourceMap[this.currentTrade];
        const resourcePrices = this.resourcePrices[resourceName];
        const tierValues = _.map(tiers, (tier) => {
            const tierOutput = getTierOutput(tier, this);
            const tierChance = getTSChance(tier, this)/100;
            const resourcePrice = resourcePrices[tier];
            return (tierOutput * tierChance * resourcePrice);
        });
        return _.sum(tierValues).toFixed(2);;
    }

    @computed get relicAmountUpgrade() {
        const roiDiff = getRelicAmountROIDiff(tiers, this);
        console.info('amount upgrade diff:', roiDiff);
        return roiDiff;
    }
}
