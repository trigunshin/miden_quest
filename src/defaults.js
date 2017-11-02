export const base_costs = {
    t1: 17500,
    t2: 12250,
    t3: 7875,
    t4: 3150,
    t5: 1400,
    gem: 10,
    gold: 100000,
    navigation_gold: 500000,
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
    lumbercamp: {
        cost: {
            'Gold': {base: base_costs.gold, factor: 1.25},
            't2 Plant': {base: base_costs.t2, factor: 1.25},
            't5 Wood': {base: base_costs.t5, factor: 1.25},
            't5 Ore': {base: base_costs.t5, factor: 1.25}
        },
        upkeep: 125,
        label: 'Lumber Camp'
    },
    fishinghut: {
        cost: {
            'Gold': {base: base_costs.gold, factor: 1.25},
            't2 Wood': {base: base_costs.t2, factor: 1.25},
            't1 Fish': {base: base_costs.t1, factor: 1.25},
            't5 Fish': {base: base_costs.t5, factor: 1.25}
        },
        upkeep: 125,
        label: 'Fishing Hut'
    },
    tradecenter: {
        cost: {
            'Gold': {base: base_costs.gold, factor: 1.25},
            't3 Ore': {base: base_costs.t3, factor: 1.25},
            't2 Plant': {base: base_costs.t2, factor: 1.25},
            't3 Fish': {base: base_costs.t3, factor: 1.25}
        },
        upkeep: 125,
        label: 'Tradecenter'
    },
    botanisthouse: {
        cost: {
            'Gold': {base: base_costs.gold, factor: 1.25},
            't3 Wood': {base: base_costs.t3, factor: 1.25},
            't5 Plant': {base: base_costs.t5, factor: 1.25},
            't2 Fish': {base: base_costs.t2, factor: 1.25}
        },
        upkeep: 125,
        label: 'Botanist House'
    },
    gemmine: {
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
            't3 Plant': {base: base_costs.t3, factor: 1.25}
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
    adventurerguild: {
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
    },
    wharf: {
        cost: {
            'Gold': {base: base_costs.navigation_gold, factor: 1.25},
            't1 Wood': {base: base_costs.t1, factor: 1.25},
            't1 Plant': {base: base_costs.t1, factor: 1.25},
            't3 Ore': {base: base_costs.t3, factor: 1.25},
            't3 Fish': {base: base_costs.t3, factor: 1.25}
        },
        upkeep: 125,
        label: 'Wharf'
    },
    townhall: {
        cost: {
            'Gold': {base: base_costs.navigation_gold, factor: 1.25},
            't1 Ore': {base: base_costs.t1 * 2, factor: 1.25},
            't1 Plant': {base: base_costs.t1 * 2, factor: 1.25},
            't4 Wood': {base: base_costs.t4 * 2, factor: 1.25},
            't5 Plant': {base: base_costs.t5 * 2, factor: 1.25}
        },
        upkeep: 125,
        label: 'Town Hall'
    }
};
