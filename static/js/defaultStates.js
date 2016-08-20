export const base_costs = {
    t1: 17500,
    t2: 12250,
    t3: 7875,
    t4: 3150,
    t5: 1400,
    gem: 10,
    gold: 100000,
    relic: 350,
    expedition_gold: 200000,
    silo: 1050
};
export const building_costs = {
    locator: {
        cost: {
            'Gold': {base: base_costs.gold, factor: 1.35},
            't1 Ore': {base: base_costs.t1, factor: 1.35},
            't1 Plant': {base: base_costs.t1, factor: 1.35},
            't4 Plant': {base: base_costs.t4, factor: 1.35}
        },
        upkeep: 125,
        label: 'Locator'
    },
    mine: {
        cost: {
            'Gold': {base: base_costs.gold, factor: 1.25},
            't1 Wood': {base: base_costs.t1, factor: 1.25},
            't4 Ore': {base: base_costs.t4, factor: 1.25},
            't4 Plant': {base: base_costs.t4, factor: 1.25}
        },
        upkeep: 125,
        label: 'Mine'
    },
    watchtower: {
        cost: {
            'Gold': {base: base_costs.gold, factor: 1.25},
            't4 Wood': {base: base_costs.t4, factor: 1.25},
            't4 Ore': {base: base_costs.t4, factor: 1.25},
            't3 Plant': {base: base_costs.t3, factor: 1.25}
        },
        upkeep: 125,
        label: 'Watch Tower'
    },
    lumber_camp: {
        cost: {
            'Gold': {base: base_costs.gold, factor: 1.25},
            't2 Plant': {base: base_costs.t2, factor: 1.25},
            't5 Wood': {base: base_costs.t5, factor: 1.25},
            't5 Ore': {base: base_costs.t5, factor: 1.25}
        },
        upkeep: 125,
        label: 'Lumber Camp'
    },
    fishing_hut: {
        cost: {
            'Gold': {base: base_costs.gold, factor: 1.25},
            't2 Wood': {base: base_costs.t2, factor: 1.25},
            't1 Fish': {base: base_costs.t1, factor: 1.25},
            't5 Fish': {base: base_costs.t5, factor: 1.25}
        },
        upkeep: 125,
        label: 'Fishing Hut'
    },
    trade_center: {
        cost: {
            'Gold': {base: base_costs.gold, factor: 1.25},
            't3 Ore': {base: base_costs.t3, factor: 1.25},
            't2 Plant': {base: base_costs.t2, factor: 1.25},
            't3 Fish': {base: base_costs.t3, factor: 1.25}
        },
        upkeep: 125,
        label: 'Tradecenter'
    },
    botanist_house: {
        cost: {
            'Gold': {base: base_costs.gold, factor: 1.25},
            't3 Wood': {base: base_costs.t3, factor: 1.25},
            't5 Plant': {base: base_costs.t5, factor: 1.25},
            't2 Fish': {base: base_costs.t2, factor: 1.25}
        },
        upkeep: 125,
        label: 'Botanist House'
    },
    gem_mine: {
        cost: {
            'Gold': {base: base_costs.gold, factor: 1.25},
            'Gem': {base: base_costs.gem, factor: 1.35},
            't1 Fish': {base: base_costs.t1, factor: 1.25},
            't2 Plant': {base: base_costs.t2, factor: 1.25},
            't3 Wood': {base: base_costs.t3, factor: 1.25},
            't4 Ore': {base: base_costs.t4, factor: 1.25}
        },
        upkeep: 125,
        label: 'Gem Mine'
    },
    billboard: {
        cost: {
            'Gold': {base: base_costs.gold, factor: 1.25},
            't1 Wood': {base: base_costs.t1, factor: 1.25},
            't2 Wood': {base: base_costs.t2, factor: 1.25},
            't1 Ore': {base: base_costs.t1, factor: 1.25},
            't1 Plant': {base: base_costs.t3, factor: 1.25}
        },
        upkeep: 125,
        label: 'Billboard'
    },
    barracks: {
        cost: {
            'Gold': {base: base_costs.gold, factor: 1.25},
            't3 Wood': {base: base_costs.t3, factor: 1.25},
            't1 Ore': {base: base_costs.t1, factor: 1.25},
            't2 Ore': {base: base_costs.t2, factor: 1.25},
            't1 Plant': {base: base_costs.t1, factor: 1.25}
        },
        upkeep: 125,
        label: 'Barracks'
    },
    keep: {
        cost: {
            'Gold': {base: base_costs.gold, factor: 1.25},
            't3 Wood': {base: base_costs.t3, factor: 1.25},
            't1 Ore': {base: base_costs.t1, factor: 1.25},
            't3 Ore': {base: base_costs.t3, factor: 1.25},
            't5 Plant': {base: base_costs.t5, factor: 1.25}
        },
        upkeep: 125,
        label: 'Keep'
    },
    farm: {
        cost: {
            'Gold': {base: base_costs.gold, factor: 1.25},
            't1 Wood': {base: base_costs.t1, factor: 1.25},
            't2 Plant': {base: base_costs.t2, factor: 1.25},
            't4 Fish': {base: base_costs.t4, factor: 1.25},
        },
        upkeep: 0,
        label: 'Farm'
    },
    silo: {
        cost: {
            'Gold': {base: base_costs.gold, factor: 1.25},
            't5 Wood': {base: base_costs.t5, factor: 1.25},
            't5 Ore': {base: base_costs.t5, factor: 1.25},
            't5 Plant': {base: base_costs.t5, factor: 1.25}
        },
        upkeep: 125,
        label: 'Silo'
    },
    adventurer_guild: {
        cost: {
            'Gold': {base: base_costs.expedition_gold, factor: 1.35},
            't1 Wood': {base: base_costs.t4, factor: 1.35},
            't4 Wood': {base: base_costs.t4, factor: 1.35},
            't2 Plant': {base: base_costs.t2, factor: 1.35},
            't2 Fish': {base: base_costs.t2, factor: 1.35},
        },
        upkeep: 125,
        label: 'Adventurer Guild'
    },
    inn: {
        cost: {
            'Gold': {base: base_costs.expedition_gold, factor: 1.25},
            't2 Ore': {base: base_costs.t2, factor: 1.35},
            't1 Plant': {base: base_costs.t1, factor: 1.35},
            't4 Fish': {base: base_costs.t4, factor: 1.25}
        },
        upkeep: 125,
        label: 'Inn'
    },
    workshop: {
        cost: {
            't2 Fish': {base: base_costs.t2, factor: 1.35},
            't4 Ore': {base: base_costs.t4, factor: 1.35},
            't4 Fish': {base: base_costs.t4, factor: 1.35},
            't5 Wood': {base: base_costs.t5, factor: 1.35}
        },
        upkeep: 125,
        label: 'Workshop'
    },
    academy: {
        cost: {
            'Gold': {base: base_costs.expedition_gold, factor: 1.35},
            'Relics': {base: base_costs.relic, factor: 1.25},
            't1 Ore': {base: base_costs.t1, factor: 1.35},
            't3 Ore': {base: base_costs.t3, factor: 1.35},
            't4 Fish': {base: base_costs.t4, factor: 1.35},
            't5 Wood': {base: base_costs.t5, factor: 1.35}
        },
        upkeep: 125,
        label: 'Academy'
    },
    toolshed: {
        cost: {
            'Gold': {base: base_costs.expedition_gold, factor: 1.25},
            't1 Fish': {base: base_costs.t1, factor: 1.25},
            't2 Plant': {base: base_costs.t2, factor: 1.25},
            't3 Wood': {base: base_costs.t3, factor: 1.25},
            't3 Plant': {base: base_costs.t3, factor: 1.25}
        },
        upkeep: 125,
        label: 'Toolshed'
    }
};

const initialState = {
    dropCalculator: {
        tsDropRate: 1,
        tsSecondsPer: 5,
        relicDropRate: 5,
        gemDropRate: 5,
        hoursFarming: 1
    },
    luckCalculator: {
        luckPersonal: 0,
        luckKingdom: 0
    },
    relicCalculator: {
        xpRelicCost: 0,
        resourceRelicCost: 0,
        workloadRelicCost: 0,
        dropRelicCost: 0,
        luckRelicCost: 0
    },
    enchantCalculator: {
        currentLevel: 3,
        targetLevel: 15,
        xpSuccess: 2,
        xpRemove: 2,
        meSuccess: 3,
        meRemove: 1,
        enchantXPRequired: 11400,
        enchantTotalEnchants: 2850,
        enchantMEUsed: 5700
    },
    crafting: {
        craftLevel: 0,
        workshops: 20,
        tier: 10,
        start: 4,
        end: 12
    },
    resources: {
        wood: {t1: 0, t2: 0, t3: 0, t4: 0, t5: 0},
        ore: {t1: 0, t2: 0, t3: 0, t4: 0, t5: 0},
        plant: {t1: 0, t2: 0, t3: 0, t4: 0, t5: 0},
        fish: {t1: 0, t2: 0, t3: 0, t4: 0, t5: 0},
        // value for selling/scouting weighted total is 1:1
        gold: {t1: 1, t2: 1, t3: 1, t4: 1, t5: 1},
        landmark: {t1: 1, t2: 1, t3: 1, t4: 1, t5: 1},
        gem: 0, relic: 0, me: 0, scroll: 0, orb: 0
    },
    expeditions: {adventurer: 0, weapons: 0, armor: 0, survival: 0},
    ts: {
        currentTS: 'selling',
        level: 1,
        xp: {gem: 0, relic: 0},
        amount: {gem: 0, relic: 0, kingdom: 0, we: 0, global: 1},
        luck: {relic: 0, kingdom: 0, t1: 90, t2: 60, t3: 30, t4: 15, t5: 5, t0: 100}
    },
    kingdom: {'costs': {}}
};
_.each(_.keys(building_costs), (building_key) => {
    initialState[building_key] = {};
    initialState[building_key]['start'] = 0;
    initialState[building_key]['finish'] = 0;

    initialState.kingdom[building_key] = {'start': 0, 'finish': 0};
});

export const defaultState=initialState;
export const tiers = ['t1', 't2', 't3', 't4', 't5'];
export const tierFactors = {t0: 1, 't1': Math.pow(.67, 0), 't2': Math.pow(.67, 1), 't3': Math.pow(.67, 2), 't4': Math.pow(.67, 3), 't5': Math.pow(.67, 4)};
export const tiersXp = {t0: 1, t1: 2, t2: 3, t3: 4, t4: 5, t5: 7};
export const salesAmountFactor = 1+(1000/100);
export const tsAmountFactors = {
    selling: {t1: 2*salesAmountFactor, t2: 7*salesAmountFactor, t3: 18*salesAmountFactor, t4: 45*salesAmountFactor, t5: 100*salesAmountFactor},
    scouting: {t1: 1, t2: 2, t3: 4, t4: 6, t5: 10}
};
export const tradeskillNames = ['Selling', 'Gathering', 'Mining', 'Fishing', 'Woodcutting', 'Scouting'];
export const tradeskillResourceMap = {gathering: 'plant', mining: 'ore', fishing: 'fish', woodcutting: 'wood', scouting: 'landmark', selling: 'gold'};
export const relicBonusFactors = {amount: 1.5, xp: .2, luck: .3, load: 3, drop: .5};
export const tierPrice = {1: 50, 2: 225, 3: 500, 4: 1000, 5: 2500, 6: 5000, 7: 11500, 8: 25000, 9: 65000, 10: 120000, 11: 250000, 12: 515000, 13: 1000000, 14: 2500000, 15: 10000000, 16: 20000000};
export const doubleDigitFormat = '0,0.00';
