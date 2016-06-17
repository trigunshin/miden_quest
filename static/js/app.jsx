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
    wood: {t1: 0, t2: 0, t3: 0, t4: 0, t5: 0},
    ore: {t1: 0, t2: 0, t3: 0, t4: 0, t5: 0},
    plant: {t1: 0, t2: 0, t3: 0, t4: 0, t5: 0},
    fish: {t1: 0, t2: 0, t3: 0, t4: 0, t5: 0},
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

// set up kingdom building configs
const buildingReducerHelper = (key, state, action) => {
    if(!action.type || !action.type.startsWith(key)) return state||defaultState[key];

    // update state value
    let newState = Object.assign({}, state);
    if(action.type.endsWith('finish')) {
        newState.finish = action.value||0;
        if(newState.start > newState.finish) newState.start = newState.finish - 1;
    }
    else if(action.type.endsWith('start')) {
        newState.start = action.value||0;
        if(newState.start > newState.finish) newState.finish = newState.start + 1;
    }
    else return state||defaultState[key];

    // calculate values
    const costs = building_costs[key].cost;
    const start = newState.start;
    const finish = newState.finish;

    const per_idx_costs = _.map(_.range(start+1, finish+1), (idx) => {
        return _.map(_.keys(costs), (label) => {
            const cost = costs[label];
            return {label: label, value: cost.base * Math.pow(cost.factor, (idx-1))};
        });
    });

    // start each resource's value @ 0
    let initAccum = {};
    _.each(_.keys(costs), (label) => {initAccum[label] = 0;});

    // sum the costs per resource
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

const building_configs = _.map(_.keys(building_costs), (building_id) => {
    const building = building_costs[building_id];
    let ret = {
        title: <h4>{building.label}</h4>,
        stateKey: building_id,
        reducer: buildingReducers[building_id],
        cols: [
            {id: ''+building_id+'_start', title: '# Start', type: 'number', placeholder: 0, cls: 'input', stateKey: building_id, valueKey: 'start'},
            {id: ''+building_id+'_finish', title: '# Finished', type: 'number', placeholder: 0, cls: 'input', stateKey: building_id, valueKey: 'finish'}
        ]
    }

    const labels = _.map(_.keys(building.cost), (label) => {
        const cost = building.cost;
        return {id: label, title: label, cls: 'label'};
    });
    ret.cols = ret.cols.concat(labels);

    return ret;
});


// set up misc config configuration
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
    newState.luckTier2 = (newState.luckTier1 * Math.pow(.67, 1)).toFixed(2);
    newState.luckTier3 = (newState.luckTier1 * Math.pow(.67, 2)).toFixed(2);
    newState.luckTier4 = (newState.luckTier1 * Math.pow(.67, 3)).toFixed(2);
    newState.luckTier5 = (newState.luckTier1 * Math.pow(.67, 4)).toFixed(2);

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
const configs = {
    dropConfig: {
        title: <h4>Drop Information</h4>,
        stateKey: 'dropCalculator',
        reducer: dropReducer,
        cols: [
            {id: 'tsDropRate', title: 'TS Drop Rate %', type: 'number', placeholder: 1, cls: 'input', stateKey: 'dropCalculator', valueKey: 'tsDropRate'},
            {id: 'tsSecondsPer', title: 'Sec/Attempt', type: 'number', placeholder: 5, cls: 'input', stateKey: 'dropCalculator', valueKey: 'tsSecondsPer'},
            {id: 'relicDropRate', title: 'Relic %', type: 'number', placeholder: 0, cls: 'input', stateKey: 'dropCalculator', valueKey: 'relicDropRate'},
            {id: 'gemDropRate', title: 'Gem %', type: 'number', placeholder: 0, cls: 'input', stateKey: 'dropCalculator', valueKey: 'gemDropRate'},
            {id: 'hoursFarming', title: 'Hours', type: 'number', placeholder: 1, cls: 'input', stateKey: 'dropCalculator', valueKey: 'hoursFarming'},
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
            {id: 'luckPersonal', title: 'Personal Luck', type: 'number', placeholder: 0, cls: 'input', stateKey: 'luckCalculator', valueKey: 'luckPersonal'},
            {id: 'luckKingdom', title: 'Kingdom Luck', type: 'number', placeholder: 0, cls: 'input', stateKey: 'luckCalculator', valueKey: 'luckKingdom'},

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
            {id: 'xpRelicCost', title: 'XP Cost', type: 'number', placeholder: 0, cls: 'input', stateKey: 'relicCalculator', valueKey: 'xpRelicCost'},
            {id: 'resourceRelicCost', title: 'Res% Cost', type: 'number', placeholder: 0, cls: 'input', stateKey: 'relicCalculator', valueKey: 'resourceRelicCost'},
            {id: 'workloadRelicCost', title: 'Workload Cost', type: 'number', placeholder: 0, cls: 'input', stateKey: 'relicCalculator', valueKey: 'workloadRelicCost'},
            {id: 'dropRelicCost', title: 'Drop% Cost', type: 'number', placeholder: 0, cls: 'input', stateKey: 'relicCalculator', valueKey: 'dropRelicCost'},
            {id: 'luckRelicCost', title: 'Res Luck% Cost', type: 'number', placeholder: 0, cls: 'input', stateKey: 'relicCalculator', valueKey: 'luckRelicCost'},
            {id: 'relicsSpent', title: 'Relics Spent', cls: 'label'}
        ]
    }
};

// set up resource cost configuration
let resources = {
    wood: {label: 'Wood', stateKey: 'wood'},
    ore: {label: 'Ore', stateKey: 'ore'},
    plant: {label: 'Plant', stateKey: 'plant'},
    fish: {label: 'Fish', stateKey: 'fish'}
};
let resourceReducerHelper = (stateKey, state, action) => {
    if(action.stateKey!=stateKey || !action.valueKey) return state||defaultState[stateKey];
    let newState = Object.assign({}, state);
    newState[action.valueKey] = action.value||0;
    return newState;
};
let resourceCostCalculators = {};
_.each(_.values(resources), (resource) => {
    resourceCostCalculators[resource.stateKey] = {
        title: <h4>{resource.label}</h4>,
        stateKey: resource.stateKey,
        reducer: _.partial(resourceReducerHelper, resource.stateKey),
        cols: [
            {id: 't1'+resource.stateKey, title: 'T1 '+resource.label, type: 'number', placeholder: 0, cls: 'input', stateKey: resource.stateKey, valueKey: 't1'},
            {id: 't2'+resource.stateKey, title: 'T2 '+resource.label, type: 'number', placeholder: 0, cls: 'input', stateKey: resource.stateKey, valueKey: 't2'},
            {id: 't3'+resource.stateKey, title: 'T3 '+resource.label, type: 'number', placeholder: 0, cls: 'input', stateKey: resource.stateKey, valueKey: 't3'},
            {id: 't4'+resource.stateKey, title: 'T4 '+resource.label, type: 'number', placeholder: 0, cls: 'input', stateKey: resource.stateKey, valueKey: 't4'},
            {id: 't5'+resource.stateKey, title: 'T5 '+resource.label, type: 'number', placeholder: 0, cls: 'input', stateKey: resource.stateKey, valueKey: 't5'}
        ]
    }
});
// populate the reducers & create the store
const reducers = _.reduce(_.values(configs), (accum, config) => {
    accum[config.stateKey] = config.reducer;
    return accum;
}, {});
_.each(resourceCostCalculators, (config) => {
    reducers[config.stateKey] = config.reducer;
});
_.each(_.keys(buildingReducers), (key) => {
    reducers[key] = buildingReducers[key];
});
let store = null;
let combinedReducers = Redux.combineReducers(reducers);
// DEBUG MODE?
if(window.devToolsExtension) store = Redux.createStore(combinedReducers, defaultState, window.devToolsExtension && window.devToolsExtension());
else store = Redux.createStore(combinedReducers);


// Composable components
const InputElement = React.createClass({
    handleChange(event) {
        let newValue = parseInt(event.target.value);
        this.props.onInputChange(this.props.id, this.props.stateKey, this.props.valueKey, newValue);
    },
    render() {
        return (<div className='col-md-1'>
            <input type={this.props.type} className="form-control" id={this.props.id} placeholder={this.props.placeholder} value={this.props.value} onChange={this.handleChange} />
        </div>);
    }
});
const StatefulInputElement = ReactRedux.connect(
    (state, ownProps) => {return {value: state[ownProps.stateKey][ownProps.valueKey]}}
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
const StatefulCalculator = ReactRedux.connect(
    (state, ownProps) => {return state[ownProps.stateKey]},
    (dispatch) => {return {onInputChange: (id, stateKey, valueKey, value) => {dispatch({type: id, stateKey: stateKey, valueKey: valueKey, value: value})}}}
)(Calculator);

// display configured components
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
