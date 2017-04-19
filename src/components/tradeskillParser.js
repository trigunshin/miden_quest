import _ from 'lodash';
import moment from 'moment';
import {observable, computed} from 'mobx';

const tsBonusOffsets = {
    xp: 1, relic: 2, wl: 3, drop: 4, luck: 5,
    // idx+5 = x1 relic costs
};

function getRelic10x(baseCost) {
    return (baseCost + baseCost + 9) * 5;
}

function parseTSBonus(dataArray, state) {
    //state.ts_relic_xp = dataArray[tsBonusOffsets.xp];
    state.ts_relic_xp_cost = dataArray[tsBonusOffsets.xp+5];

    //state.ts_relic_res = dataArray[tsBonusOffsets.relic];
    state.ts_relic_res_cost = dataArray[tsBonusOffsets.relic+5];

    //state.ts_relic_wl = dataArray[tsBonusOffsets.wl];
    state.ts_relic_wl_cost = dataArray[tsBonusOffsets.wl+5];

    //state.ts_relic_drop = dataArray[tsBonusOffsets.drop];
    state.ts_relic_drop_cost = dataArray[tsBonusOffsets.drop+5];

    //state.ts_relic_luck = dataArray[tsBonusOffsets.luck];
    state.ts_relic_luck_cost = dataArray[tsBonusOffsets.luck+5];

    return state;
}

function parseTSLvl(dataArray, state) {
    state.ts_level = parseInt(dataArray[3]);
    return state;
}

class ROIState {
    @observable ts_level = 1;
    //@observable ts_relic_xp = 0;
    @observable ts_relic_xp_cost = 1;
    //@observable ts_relic_res = 0;
    @observable ts_relic_res_cost = 1;
    //@observable ts_relic_wl = 0;
    @observable ts_relic_wl_cost = 1;
    //@observable ts_relic_drop = 0;
    @observable ts_relic_drop_cost = 1;
    //@observable ts_relic_luck = 0;
    @observable ts_relic_luck_cost = 1;

    @observable currentTime = moment();

    @computed get relic_xp() {
        return (this.ts_relic_xp_cost - 1) * .2;
    }
    @computed get relic_res() {
        return (this.ts_relic_res_cost - 1) * (this.ts_level ^ 1.15)/5500;
    }
    @computed get relic_wl() {
        return (this.ts_relic_wl_cost - 1) * 3;
    }
    @computed get relic_drop() {
        return (this.ts_relic_drop_cost - 1) * .5;
    }
    @computed get relic_luck() {
        return (this.ts_relic_luck_cost - 1) * .3;
    }

    constructor() {}

    static parse = (datum, state) => {
        // SEND: "TSGET|1"
        // RECV: TSBONUS
        const arr = datum.split('|');
        if (arr[0] === 'TSBONUS') {return parseTSBonus(arr, state);}
        if (arr[0] === 'TSLVL') {return parseTSLvl(arr, state);}

        return state;
    }
}

export default ROIState;
