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
    }
};


let defaultState = {
    wood: {t1wood: 0, t2wood: 0, t3wood: 0, t4wood: 0, t5wood: 0},
    ore: {t1ore: 0, t2ore: 0, t3ore: 0, t4ore: 0, t5ore: 0},
    plant: {t1plant: 0, t2plant: 0, t3plant: 0, t4plant: 0, t5plant: 0},
    fish: {t1fish: 0, t2fish: 0, t3fish: 0, t4fish: 0, t5fish: 0},
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
    }
};
_.each(_.keys(building_costs), (building_key) => {
    defaultState[building_key] = {};
    defaultState[building_key]['start'] = 0;
    defaultState[building_key]['finish'] = 0;
});


const dropReducer = (state=defaultState.dropCalculator, action) => {
    let newState = Object.assign({}, state);
    const op = {
        tsDropRate: (value) => {newState.tsDropRate=value;},
        tsSecondsPer: (value) => {newState.tsSecondsPer=value;},
        relicDropRate: (value) => {newState.relicDropRate=value;},
        gemDropRate: (value) => {newState.gemDropRate=value;},
        hoursFarming: (value) => {newState.hoursFarming=value;}
    }
    // does the action key match what we expect?
    if(!action.type || _.indexOf(_.keys(op), action.type) < 0) return state;    
    op[action.type](action.value||0);

    // state updated, update calculated values
    const seconds = 60*60;
    let totalRate = (newState.tsDropRate/100) * (1 + (newState.gemDropRate+newState.relicDropRate)/100);
    let hourlyAttempts = seconds / newState.tsSecondsPer;
    let hourlyDrops = hourlyAttempts * totalRate;
    let totalDrops = hourlyDrops * newState.hoursFarming;
    
    newState.totalDropRate = totalRate.toFixed(2);
    newState.dropHourlyAttempts = hourlyAttempts.toFixed(2);
    newState.hourlyDrops = hourlyDrops.toFixed(2);
    newState.totalDrops = totalDrops.toFixed(2);

    return newState;
};
const luckReducer = (state=defaultState.luckCalculator, action) => {
    let newState = Object.assign({}, state);
    const op = {
        luckPersonal: (value) => {newState.luckPersonal=value;},
        luckKingdom: (value) => {newState.luckKingdom=value;}
    }
    // does the action key match what we expect?
    if(!action.type || _.indexOf(_.keys(op), action.type) < 0) return state;    
    op[action.type](action.value||0);

    // state updated, update calculated values
    newState.luckTier1 = newState.luckPersonal + newState.luckKingdom;
    newState.luckTier2 = (newState.luckTier1 * Math.pow(2/3, 1)).toFixed(2);
    newState.luckTier3 = (newState.luckTier2 * Math.pow(2/3, 2)).toFixed(2);
    newState.luckTier4 = (newState.luckTier3 * Math.pow(2/3, 3)).toFixed(2);
    newState.luckTier5 = (newState.luckTier4 * Math.pow(2/3, 4)).toFixed(2);

    return newState;
};
const relicReducer = (state=defaultState.relicCalculator, action) => {
    let newState = Object.assign({}, state);
    const op = {
        xpRelicCost: (value) => {newState.xpRelicCost=value;},
        resourceRelicCost: (value) => {newState.resourceRelicCost=value;},
        workloadRelicCost: (value) => {newState.workloadRelicCost=value;},
        dropRelicCost: (value) => {newState.dropRelicCost=value;},
        luckRelicCost: (value) => {newState.luckRelicCost=value;}
    }
    // does the action key match what we expect?
    if(!action.type || _.indexOf(_.keys(op), action.type) < 0) return state;    
    op[action.type](action.value||0);

    // state updated, update calculated values
    let total = 0;

    total += newState.xpRelicCost * (newState.xpRelicCost - 1) / 2;
    total += newState.resourceRelicCost * (newState.resourceRelicCost - 1) / 2;
    total += newState.workloadRelicCost * (newState.workloadRelicCost - 1) / 2;
    total += newState.dropRelicCost * (newState.dropRelicCost - 1) / 2;
    total += newState.luckRelicCost * (newState.luckRelicCost - 1) / 2;

    newState.relicsSpent = total;

    return newState;
};
const buildingReducerHelper = (key, state, action) => {
    if(!action.type || !action.type.startsWith(key)) return state||defaultState[key];

    // input fields use key+_value, so also populate those
    let newState = Object.assign({}, state);
    if(action.type.endsWith('finish')) {
        newState.finish = action.value||0;
        newState[key+'_finish'] = action.value||0;
    }
    else if(action.type.endsWith('start')) {
        newState.start = action.value||0;
        newState[key+'_start'] = action.value||0;
        if(newState.start > newState.finish) {
            newState.finish = newState.start + 1;
            newState[key+'_finish'] = newState.finish;
        }
    }
    else return state||defaultState[key];

    const costs = building_costs[key].cost;
    const start = newState.start;
    const finish = newState.finish;

    const per_idx_costs = _.map(_.range(start+1, finish+1), (idx) => {
        return _.map(_.keys(costs), (label) => {
            const cost = costs[label];
            return {label: label, value: cost.base * Math.pow(cost.factor, (idx-1))};
        });
    });

    let initAccum = {};
    _.each(_.keys(costs), (label) => {initAccum[label] = 0;});

    const totalCosts = _.reduce(per_idx_costs, (accum, idx_cost) => {
        _.each(idx_cost, ({label, value}) => {
            accum[label] += value;
        });
        return accum;
    }, initAccum);

    _.each(_.keys(totalCosts), (label) => {newState[label] = totalCosts[label].toFixed(0);});

    return newState;
};
const buildingReducers = {};
_.each(_.keys(building_costs), (building_key) => {
    buildingReducers[building_key] = _.partial((key, state, action) => {
        return buildingReducerHelper(key, state, action);
    }, building_key);
});

const woodReducer = (state=defaultState.wood, action) => {
    let newState = Object.assign({}, state);
    const op = {
        t1wood: (value) => {newState.t1wood=value;},
        t2wood: (value) => {newState.t2wood=value;},
        t3wood: (value) => {newState.t3wood=value;},
        t4wood: (value) => {newState.t4wood=value;},
        t5wood: (value) => {newState.t5wood=value;}
    }
    // does the action key match what we expect?
    if(!action.type || _.indexOf(_.keys(op), action.type) < 0) return state;
    op[action.type](action.value||0);

    return newState;
};
const oreReducer = (state=defaultState.ore, action) => {
    let newState = Object.assign({}, state);
    const op = {
        t1ore: (value) => {newState.t1ore=value;},
        t2ore: (value) => {newState.t2ore=value;},
        t3ore: (value) => {newState.t3ore=value;},
        t4ore: (value) => {newState.t4ore=value;},
        t5ore: (value) => {newState.t5ore=value;}
    }
    // does the action key match what we expect?
    if(!action.type || _.indexOf(_.keys(op), action.type) < 0) return state;
    op[action.type](action.value||0);
    return newState;
};
const plantReducer = (state=defaultState.plant, action) => {
    let newState = Object.assign({}, state);
    const op = {
        t1plant: (value) => {newState.t1plant=value;},
        t2plant: (value) => {newState.t2plant=value;},
        t3plant: (value) => {newState.t3plant=value;},
        t4plant: (value) => {newState.t4plant=value;},
        t5plant: (value) => {newState.t5plant=value;}
    }
    // does the action key match what we expect?
    if(!action.type || _.indexOf(_.keys(op), action.type) < 0) return state;
    op[action.type](action.value||0);
    return newState;
};
const fishReducer = (state=defaultState.fish, action) => {
    let newState = Object.assign({}, state);
    const op = {
        t1fish: (value) => {newState.t1fish=value;},
        t2fish: (value) => {newState.t2fish=value;},
        t3fish: (value) => {newState.t3fish=value;},
        t4fish: (value) => {newState.t4fish=value;},
        t5fish: (value) => {newState.t5fish=value;}
    }
    // does the action key match what we expect?
    if(!action.type || _.indexOf(_.keys(op), action.type) < 0) return state;
    op[action.type](action.value||0);
    return newState;
};
const configs = {
    dropConfig: {
        title: <h4>Drop Information</h4>,
        stateKey: 'dropCalculator',
        reducer: dropReducer,
        cols: [
            {id: 'tsDropRate', title: 'TS Drop Rate %', type: 'number', placeholder: 1, cls: 'input'},
            {id: 'tsSecondsPer', title: 'Sec/Attempt', type: 'number', placeholder: 5, cls: 'input'},
            {id: 'relicDropRate', title: 'Relic %', type: 'number', placeholder: 0, cls: 'input'},
            {id: 'gemDropRate', title: 'Gem %', type: 'number', placeholder: 0, cls: 'input'},
            {id: 'hoursFarming', title: 'Hours', type: 'number', placeholder: 1, cls: 'input'},
            {id: 'totalDropRate', title: 'Drop Rate', cls: 'label'},
            {id: 'dropHourlyAttempts', title: 'Hourly Attempts', cls: 'label'},
            {id: 'hourlyDrops', title: 'Hourly Drops', cls: 'label'},
            {id: 'totalDrops', title: 'Total Drops', cls: 'label'}
        ]
    },
    luckConfig: {
        title: <h4>Luck Information</h4>,
        stateKey: 'luckCalculator',
        reducer: luckReducer,
        cols: [
            {id: 'luckPersonal', title: 'Personal Luck', type: 'number', placeholder: 0, cls: 'input'},
            {id: 'luckKingdom', title: 'Kingdom Luck', type: 'number', placeholder: 0, cls: 'input'},

            {id: 'luckTier1', title: 'Tier 1', cls: 'label'},
            {id: 'luckTier2', title: 'Tier 2', cls: 'label'},
            {id: 'luckTier3', title: 'Tier 3', cls: 'label'},
            {id: 'luckTier4', title: 'Tier 4', cls: 'label'},
            {id: 'luckTier5', title: 'Tier 5', cls: 'label'}
        ]
    },
    relicConfig: {
        title: <h4>Relic Cost Info</h4>,
        stateKey: 'relicCalculator',
        reducer: relicReducer,
        cols: [
            {id: 'xpRelicCost', title: 'XP Cost', type: 'number', placeholder: 0, cls: 'input'},
            {id: 'resourceRelicCost', title: 'Res% Cost', type: 'number', placeholder: 0, cls: 'input'},
            {id: 'workloadRelicCost', title: 'Workload Cost', type: 'number', placeholder: 0, cls: 'input'},
            {id: 'dropRelicCost', title: 'Drop% Cost', type: 'number', placeholder: 0, cls: 'input'},
            {id: 'luckRelicCost', title: 'Res Luck% Cost', type: 'number', placeholder: 0, cls: 'input'},
            {id: 'relicsSpent', title: 'Relics Spent', cls: 'label'}
        ]
    }
};
let resourceCostCalculators = {
    woodCalculator: {
        title: <h4>Wood Cost</h4>,
        stateKey: 'wood',
        reducer: woodReducer,
        cols: [
            {id: 't1wood', title: 'T1 Wood', type: 'number', placeholder: 0, cls: 'input'},
            {id: 't2wood', title: 'T2 Wood', type: 'number', placeholder: 0, cls: 'input'},
            {id: 't3wood', title: 'T3 Wood', type: 'number', placeholder: 0, cls: 'input'},
            {id: 't4wood', title: 'T4 Wood', type: 'number', placeholder: 0, cls: 'input'},
            {id: 't5wood', title: 'T5 Wood', type: 'number', placeholder: 0, cls: 'input'}
        ]
    },
    oreCalculator: {
        title: <h4>Ore Cost</h4>,
        stateKey: 'ore',
        reducer: oreReducer,
        cols: [
            {id: 't1ore', title: 'T1 Ore', type: 'number', placeholder: 0, cls: 'input'},
            {id: 't2ore', title: 'T2 Ore', type: 'number', placeholder: 0, cls: 'input'},
            {id: 't3ore', title: 'T3 Ore', type: 'number', placeholder: 0, cls: 'input'},
            {id: 't4ore', title: 'T4 Ore', type: 'number', placeholder: 0, cls: 'input'},
            {id: 't5ore', title: 'T5 Ore', type: 'number', placeholder: 0, cls: 'input'}
        ]
    },
    plantCalculator: {
        title: <h4>Plant Cost</h4>,
        stateKey: 'plant',
        reducer: plantReducer,
        cols: [
            {id: 't1plant', title: 'T1 Plant', type: 'number', placeholder: 0, cls: 'input'},
            {id: 't2plant', title: 'T2 Plant', type: 'number', placeholder: 0, cls: 'input'},
            {id: 't3plant', title: 'T3 Plant', type: 'number', placeholder: 0, cls: 'input'},
            {id: 't4plant', title: 'T4 Plant', type: 'number', placeholder: 0, cls: 'input'},
            {id: 't5plant', title: 'T5 Plant', type: 'number', placeholder: 0, cls: 'input'}
        ]
    },
    fishCalculator: {
        title: <h4>Fish Cost</h4>,
        stateKey: 'fish',
        reducer: fishReducer,
        cols: [
            {id: 't1fish', title: 'T1 Fish', type: 'number', placeholder: 0, cls: 'input'},
            {id: 't2fish', title: 'T2 Fish', type: 'number', placeholder: 0, cls: 'input'},
            {id: 't3fish', title: 'T3 Fish', type: 'number', placeholder: 0, cls: 'input'},
            {id: 't4fish', title: 'T4 Fish', type: 'number', placeholder: 0, cls: 'input'},
            {id: 't5fish', title: 'T5 Fish', type: 'number', placeholder: 0, cls: 'input'}
        ]
    }
};

const building_configs = _.map(_.keys(building_costs), (building_id) => {
//const building_configs = _.map(['locator', 'mine'], (building_id) => {
    const building = building_costs[building_id];
    let ret = {
        title: <h4>{building.label}</h4>,
        stateKey: building_id,
        reducer: buildingReducers[building_id],
        cols: [
            {id: ''+building_id+'_'+'start', title: '# Start', type: 'number', placeholder: 0, cls: 'input'},
            {id: ''+building_id+'_'+'finish', title: '# Finished', type: 'number', placeholder: 0, cls: 'input'}
        ]
    }

    const labels = _.map(_.keys(building.cost), (label) => {
        const cost = building.cost;
        return {id: label, title: label, cls: 'label'};
    });
    ret.cols = ret.cols.concat(labels);

    return ret;
});

const InputElement = React.createClass({
    handleChange(event) {
        let newValue = parseInt(event.target.value);
        this.props.onInputChange(this.props.id, newValue);
    },
    render() {
        return (<div className='col-md-1'>
            <input type={this.props.type} className="form-control" id={this.props.id} placeholder={this.props.placeholder} value={this.props.value} onChange={this.handleChange} />
        </div>);
    }
});
const StatefulInputElement = ReactRedux.connect(
    (state, ownProps) => {return {value: state[ownProps.stateKey][ownProps.id]}}
)(InputElement);
const ValueHolderDiv = ({id, value}) => {
    return <div id={id} className='col-md-1'>{value}</div>;
};
const StatefulDiv = ReactRedux.connect(
    (state, ownProps) => {return {value: state[ownProps.stateKey][ownProps.id]}}
)(ValueHolderDiv);
const Calculator = ({stateKey, onInputChange, title, cols}) => {
    return <div>
        <div className='row'>
            {title}
        </div>
        <div className='row'>
            {_.map(cols, (col) => {
                return <div className='col-md-1'>{col.title}</div>
            })}
        </div>
        <div className='row'>
            {_.map(cols, (col) => {
                if(col.type == 'number') return <StatefulInputElement {...col} onInputChange={onInputChange} stateKey={stateKey} />;
                else return <StatefulDiv id={col.id} stateKey={stateKey} />;
            })}
        </div>
    </div>;
};
// XXX input_id, action.type & state.stateKey.___ need to match but should be different
const StatefulCalculator = ReactRedux.connect(
    (state, ownProps) => {return state[ownProps.stateKey]},
    (dispatch) => {return {onInputChange: (id, value) => {dispatch({type: id, value: value})}}}
)(Calculator);


const reducers = _.reduce(_.values(configs), (accum, config) => {
    accum[config.stateKey] = config.reducer;
    return accum;
}, {});
_.each(resourceCostCalculators, (config) => {
    reducers[config.stateKey] = config.reducer;
});
_.each(_.keys(buildingReducers), (key) => {
//_.each(['locator', 'mine'], (key) => {
    reducers[key] = buildingReducers[key];
});
//let store = Redux.createStore(Redux.combineReducers(reducers));
let store = Redux.createStore(Redux.combineReducers(reducers), defaultState, 
    window.devToolsExtension && window.devToolsExtension()
);


const ResourceCosts = ({resourceCostCalculators}) => {
    return <div>        
        {_.map(resourceCostCalculators, (config) => {
            return <StatefulCalculator {...config} />
        })}
    </div>;
};
const KingdomCalculator = (props) => {
    const locatorConfig= building_configs[0];
    return <div>
        {_.map(building_configs, (config) => {
            return <StatefulCalculator {...config} />
        })}
    </div>
};

const Container = React.createClass({
    getInitialState() {
        return {currentTab: 'misc'};
    },
    setKingdomTab() {
        this.setState({currentTab: 'kingdom'});
    },
    setMiscTab() {
        this.setState({currentTab: 'misc'});
    },
    setResourceTab() {
        this.setState({currentTab: 'resources'});
    },
    render() {
        const currentTab = this.state.currentTab;
        let toRender;

        if(this.state.currentTab == 'kingdom')
            toRender = <KingdomCalculator/>;
        else if(this.state.currentTab == 'resources')
            toRender = <ResourceCosts resourceCostCalculators={resourceCostCalculators} />;
        else
            toRender = _.map(_.values(configs), (config) => {
                return <StatefulCalculator {...config}/>
            });
        return <ReactRedux.Provider store={store}>
            <div className='container'>
                <div>
                    <ul className="nav nav-tabs">
                        <li role="presentation" className={currentTab=='misc' ? "active" : ''} onClick={this.setMiscTab}><a href="#">Misc</a></li>
                        <li role="presentation" className={currentTab=='resources' ? "active" : ''} onClick={this.setResourceTab}><a href="#">Resources</a></li>
                        <li role="presentation" className={currentTab=='kingdom' ? "active" : ''} onClick={this.setKingdomTab}><a href="#">Kingdom</a></li>
                    </ul>
                </div>
                {toRender}
            </div>
        </ReactRedux.Provider>;
    }
});

ReactDOM.render(
    <Container/>,
    document.getElementById('app')
);
