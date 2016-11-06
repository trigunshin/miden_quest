import _ from 'lodash';
import {observable, computed} from "mobx";
//import {tiers, tierFactors, tierPrice, tiersXp} from '../defaultStates';

export class Resources {
    @observable woodT1 = 0;
    @observable woodT2 = 0;
    @observable woodT3 = 0;
    @observable woodT4 = 0;
    @observable woodT5 = 0;

    @observable oreT1 = 0;
    @observable oreT2 = 0;
    @observable oreT3 = 0;
    @observable oreT4 = 0;
    @observable oreT5 = 0;

    @observable plantT1 = 0;
    @observable plantT2 = 0;
    @observable plantT3 = 0;
    @observable plantT4 = 0;
    @observable plantT5 = 0;

    @observable fishT1 = 0;
    @observable fishT2 = 0;
    @observable fishT3 = 0;
    @observable fishT4 = 0;
    @observable fishT5 = 0;

    // value for selling/scouting weighted total is 1:1
    gold = {t1: 1, t2: 1, t3: 1, t4: 1, t5: 1};
    landmark = {t1: 1, t2: 1, t3: 1, t4: 1, t5: 1};
    @observable gem = 0;
    @observable relic = 0;
    @observable me = 0;
    @observable scroll = 0;
    @observable orb = 0;

}
