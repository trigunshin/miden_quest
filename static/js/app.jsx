import React from 'react';
import ReactDOM from 'react-dom';
import {connect, Provider} from 'react-redux';
import _ from 'lodash';

import {defaultState, tradeskillNames} from './defaultStates';
import {getTradeskillCalculators} from './tsCalculators.jsx';
import {getResourceCalculators} from './resourceCalculators.jsx';
import {getExpeditionCalculators} from './expeditionCalculators.jsx';
import {getMiscCalculators} from './miscCalculators.jsx';
import {getBuildingCalculators} from './buildings.jsx';
import {getCraftingCalculators} from './craftingCalculator.jsx';
import {getStore} from './reducers.jsx';

const tsCalculators = getTradeskillCalculators(defaultState);
const resourceCalculators = getResourceCalculators(defaultState);
const expeditionCalculators = getExpeditionCalculators(defaultState);
const miscCalculators = getMiscCalculators(defaultState);
const buildingCalculators = getBuildingCalculators(defaultState);
const craftingCalculators = getCraftingCalculators(defaultState);

const costCalculators = {
    resourceCalculators,
    expeditionCalculators,
    buildingCalculators,
    miscCalculators,
    tsCalculators,
    craftingCalculators
};

//Display/input data
const FnInputElement = React.createClass({
    handleChange(event) {
        let newValue = parseFloat(event.target.value);
        this.props.onInputChange(this.props.stateKey, newValue);
    },
    render() {
        let inp = null;
        if(this.props.type=='number') {
            inp = <input type='number' step="0.01" min='0' className="form-control" placeholder={this.props.placeholder} value={this.props.value} onChange={this.handleChange} />
        }
        return (<div className='col-md-1'>
            {inp}
        </div>);
    }
});
const FnStatefulInputElement = connect(
    (state, ownProps) => {if(ownProps.fn) return {value: ownProps.fn(state)}; else return {value: _.get(state, ownProps.stateKey)}}
)(FnInputElement);
// Display non-input data
const FnValueHolderDiv = ({id, value}) => {
    return <div id={id} className='col-md-1'>{value}</div>;
};
const FnStatefulDiv = connect(
    (state, ownProps) => {if(ownProps.fn) return {value: ownProps.fn(state)}; else return {value: _.get(state, ownProps.stateKey)}}
)(FnValueHolderDiv);
// Selectable options
const SelectElement = ({options, value, onInputChange}) => {
    return <select className="form-control" value={value} onChange={onInputChange}>
        {_.map(options, (option) => {const lowerOption = _.lowerCase(option);return <option value={lowerOption} key={lowerOption}>{option}</option>})}
    </select>;
};
const StatefulSelectElement = connect(
    (state, ownProps) => {return {value: ownProps.fn(state)};},
    (dispatch, ownProps) => {return {onInputChange: (e) => {dispatch({type: ownProps.stateKey, value: e.target.value})}}}
)(SelectElement);

// Formatted input/outputs
const FnCalculator = ({stateKey, onInputChange, title, cols}) => {
    return <div>
        <div className='row'>
            {title}
        </div>
        <div className='row'>
            {_.map(cols, (col) => {
                return <div className='col-md-1' key={'title'.concat(col.title)}>{col.title}</div>
            })}
        </div>
        <div className='row'>
            {_.map(cols, (col) => {
                if(col.type == 'number') return <FnStatefulInputElement {...col} onInputChange={onInputChange} key={'el'.concat(col.title)} />;
                else return <FnStatefulDiv {...col} key={'el'.concat(col.title)} />;
            })}
        </div>
    </div>;
};
const FnStatefulCalculator = connect(
    (state, ownProps) => {return _.get(state, ownProps.stateKey)},
    (dispatch) => {return {onInputChange: (stateKey, value) => {dispatch({type: stateKey, stateKey: stateKey, value: value})}}}
)(FnCalculator);


// Composable components
//Display/input data
const InputElement = React.createClass({
    handleChange(event) {
        let newValue = parseFloat(event.target.value);
        this.props.onInputChange(this.props.id, this.props.stateKey, this.props.valueKey, newValue);
    },
    render() {
        return (<div className='col-md-1'>
            <input type={this.props.type} className="form-control" id={this.props.id} placeholder={this.props.placeholder} value={this.props.value} onChange={this.handleChange} />
        </div>);
    }
});
const StatefulInputElement = connect(
    (state, ownProps) => {if(ownProps.fn) return {value: ownProps.fn(state)}; else return {value: state[ownProps.stateKey][ownProps.valueKey]}}
)(InputElement);
// Display non-input data
const ValueHolderDiv = ({id, value}) => {
    return <div id={id} className='col-md-1'>{value}</div>;
};
const StatefulDiv = connect(
    (state, ownProps) => {if(ownProps.fn) return {value: ownProps.fn(state)}; else return {value: state[ownProps.stateKey][ownProps.id]}}
)(ValueHolderDiv);

// Formatted input/outputs
const Calculator = ({stateKey, onInputChange, title, cols}) => {
    return <div>
        <div className='row'>
            {title}
        </div>
        <div className='row'>
            {_.map(cols, (col) => {
                return <div className='col-md-1' key={'title'.concat(col.title)}>{col.title}</div>
            })}
        </div>
        <div className='row'>
            {_.map(cols, (col) => {
                if(col.type == 'number') return <StatefulInputElement {...col} onInputChange={onInputChange} stateKey={stateKey} key={'el'.concat(col.title)} />;
                else return <StatefulDiv {...col} stateKey={stateKey} key={'el'.concat(col.title)} />;
            })}
        </div>
    </div>;
};
const StatefulCalculator = connect(
    (state, ownProps) => {return state[ownProps.stateKey]},
    (dispatch) => {return {onInputChange: (id, stateKey, valueKey, value) => {dispatch({type: id, stateKey: stateKey, valueKey: valueKey, value: value})}}}
)(Calculator);

// Higher order components
const Tradeskills = () => {
    //console.info(this, state);
    return <div>
        <div className='row'>
            <div className='col-sm-2'>
                <StatefulSelectElement options={tradeskillNames} stateKey={'currentTS'} fn={(state)=>{return state.ts.currentTS;}} />
            </div>
        </div>
        {_.map(tsCalculators, (config, key) => {
            return <FnStatefulCalculator {...config} key={key} />
        })}
    </div>;
};
const Expeditions = ({expeditionCalculators}) => {
    return <div>
        {_.map(expeditionCalculators, (config, key) => {
            return <StatefulCalculator {...config} key={key} />
        })}
    </div>;
};
const ResourceCosts = ({resourceCalculators}) => {
    return <div>        
        {_.map(resourceCalculators, (config, key) => {
            return <FnStatefulCalculator {...config} key={key} />
        })}
    </div>;
};
const KingdomCalculator = (props) => {
    return <div>
        {_.map(buildingCalculators, (config, idx) => {
            return <StatefulCalculator {...config} key={idx}/>
        })}
    </div>
};
const CraftingCalculator = (props) => {
    return <div>
        {_.map(craftingCalculators, (config, idx) => {
            return <StatefulCalculator {...config} key={idx} />
        })}
    </div>
};
const Container = React.createClass({
    getDefaultProps() {
        return {store: getStore(costCalculators)};
    },
    getInitialState() {
        return {currentTab: 'ts'};
    },
    setKingdomTab() {
        this.setState({currentTab: 'kingdom'});
    },
    setMiscTab() {
        this.setState({currentTab: 'misc'});
    },
    setTSTab() {
        this.setState({currentTab: 'ts'});
    },
    setResourceTab() {
        this.setState({currentTab: 'resources'});
    },
    setExpeditionTab() {
        this.setState({currentTab: 'expeditions'});
    },
    setCraftingTab() {
        this.setState({currentTab: 'crafting'});
    },
    render() {
        const currentTab = this.state.currentTab;
        let toRender;

        if(this.state.currentTab == 'kingdom')
            toRender = <KingdomCalculator/>;
        else if(this.state.currentTab == 'crafting')
            toRender = <CraftingCalculator/>;
        else if(this.state.currentTab == 'resources')
            toRender = <ResourceCosts resourceCalculators={resourceCalculators} />;
        else if(this.state.currentTab == 'expeditions')
            toRender = <Expeditions expeditionCalculators={expeditionCalculators} />;
        else if(this.state.currentTab == 'ts')
            toRender = <Tradeskills />;
        else
            toRender = _.map(_.values(miscCalculators), (config, key) => {
                return <StatefulCalculator {...config} key={key} />
            });
        return <Provider store={this.props.store}>
            <div className='container'>
                <div>
                    <ul className="nav nav-tabs">
                        <li role="presentation" className={currentTab=='ts' ? "active" : ''} onClick={this.setTSTab}><a href="#" key={'ts_pane'}>TS</a></li>
                        <li role="presentation" className={currentTab=='misc' ? "active" : ''} onClick={this.setMiscTab}><a href="#" key={'misc_pane'}>Misc</a></li>
                        <li role="presentation" className={currentTab=='resources' ? "active" : ''} onClick={this.setResourceTab}><a href="#" key={'resources_pane'}>Resources</a></li>
                        <li role="presentation" className={currentTab=='kingdom' ? "active" : ''} onClick={this.setKingdomTab}><a href="#" key={'kingdom_pane'}>Kingdom</a></li>
                        <li role="presentation" className={currentTab=='expeditions' ? "active" : ''} onClick={this.setExpeditionTab}><a href="#" key={'expedition_pane'}>Expeditions</a></li>
                        <li role="presentation" className={currentTab=='crafting' ? "active" : ''} onClick={this.setCraftingTab}><a href="#" key={'crafting_pane'}>Crafting (TODO)</a></li>
                    </ul>
                </div>
                {toRender}
            </div>
        </Provider>;
    }
});

ReactDOM.render(
    <Container/>,
    document.getElementById('app')
);
