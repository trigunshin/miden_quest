const base_costs = {
    t1: 17500,
    t2: 12250,
    t3: 7875,
    t4: 3150,
    t5: 1400,
    gem: 10,
    gold: 100000,
    expedition_gold: 200000,
    silo: 1050
};
const building_costs = {
    locator: {
        cost: {
            'Gold': {base: base_costs.gold, factor: 1.35},
            't1 Wood': {base: base_costs.t1, factor: 1.35},
            't1 Ore': {base: base_costs.t1, factor: 1.35},
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
        label: 'Mining Camp'
    },
    watchtower: {
        cost: {
            'Gold': {base: base_costs.gold, factor: 1.25},
            't4 Wood': {base: base_costs.t4, factor: 1.25},
            't4 Ore': {base: base_costs.t4, factor: 1.25},
            't3 Plant': {base: base_costs.t3, factor: 1.25}
        },
        upkeep: 125,
        label: 'Watchtower'
    },
    lumber_camp: {
        cost: {
            'Gold': {base: base_costs.gold, factor: 1.25},
            't2 Wood': {base: base_costs.t2, factor: 1.25},
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
        label: 'Trade Center'
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
            't3 Wood': {base: base_costs.t3, factor: 1.25},
            't4 Ore': {base: base_costs.t4, factor: 1.25},
            't2 Plant': {base: base_costs.t2, factor: 1.25},
            't1 Fish': {base: base_costs.t1, factor: 1.25}
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
        label: 'Adventurer\'s Guild'
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
            't5 Wood': {base: base_costs.t5, factor: 1.35},
        },
        upkeep: 125,
        label: 'Workshop'
    }
};

let defaultState = {
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
    resources: {
        wood: {t1: 0, t2: 0, t3: 0, t4: 0, t5: 0},
        ore: {t1: 0, t2: 0, t3: 0, t4: 0, t5: 0},
        plant: {t1: 0, t2: 0, t3: 0, t4: 0, t5: 0},
        fish: {t1: 0, t2: 0, t3: 0, t4: 0, t5: 0},
        gem: 0, relic: 0, me: 0
    },
    expeditions: {adventurer: 0, weapons: 0, armor: 0, survival: 0},
    ts: {
        currentTS: 'selling',
        level: 1,
        xp: {gem: 0, relic: 0},
        amount: {gem: 0, relic: 0, kingdom: 0, we: 0, global: 1},
        luck: {relic: 0, kingdom: 0, t1: 0, t2: 0, t3: 0, t4: 0, t5: 0, t0: 100}
    }
};
_.each(_.keys(building_costs), (building_key) => {
    defaultState[building_key] = {};
    defaultState[building_key]['start'] = 0;
    defaultState[building_key]['finish'] = 0;
});
const tiers = ['t1', 't2', 't3', 't4', 't5'];
const tierFactors = {t0: 1, 't1': Math.pow(.67, 0), 't2': Math.pow(.67, 1), 't3': Math.pow(.67, 2), 't4': Math.pow(.67, 3), 't5': Math.pow(.67, 4)};
const tiersXp = {t0: 1, t1: 2, t2: 3, t3: 4, t4: 5, t5: 7};
const salesAmountFactor = 1+(1000/100);
const tsAmountFactors = {
    selling: {t1: 2*salesAmountFactor, t2: 7*salesAmountFactor, t3: 18*salesAmountFactor, t4: 45*salesAmountFactor, t5: 100*salesAmountFactor},
    scouting: {t1: 1, t2: 2, t3: 4, t4: 5, t5: 10}
}
const tradeskillNames = ['Selling', 'Gathering', 'Mining', 'Fishing', 'Woodcutting', 'Scouting'];
const relicBonusFactors = {amount: 1.5, xp: .2, luck: .3, load: 3, drop: .5};
