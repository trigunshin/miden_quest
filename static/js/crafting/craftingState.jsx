import _ from 'lodash';
import {observable, computed} from "mobx";
import {tierPrice} from '../defaultStates';

export class Crafting {
    @observable level = 500;
    @observable workshops = 20;
    @observable tier = 16;
    @observable start = 4;
    @observable end = 20;

    _getCraftingCostArgs() {
        return {
            baseCost: _.get(tierPrice, this.tier, 1),
            level: this.level,
            workshops: this.workshops,
            start: this.start,
            end: this.end
        };
    }

    _getCraftingCost(baseCost, level, workshops, slot) {
        let base = (baseCost/5);
        let slotCost = Math.pow((slot-1)*2+1, 1.6) / (1+level/400);
        let workshopModifier = _.max([100-workshops, 80])/100;
        return _.ceil(base * slotCost * workshopModifier)||0;
    }

    getTotalCraftingCost() {
        let args = this._getCraftingCostArgs();
        return _.sum(_.map(_.range(args.start, args.end+1), (slot) => {
            return this._getCraftingCost(args.baseCost, args.level, args.workshops, slot);
        }));
    }

    @computed get nextCost() {
        const args = this._getCraftingCostArgs();
        return this._getCraftingCost.apply(this, _.values(args));
    }

    @computed get masterCost() {
        return this.getTotalCraftingCost();
    }
}
