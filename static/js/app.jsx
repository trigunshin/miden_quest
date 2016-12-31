import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {connect, Provider} from 'react-redux';
import _ from 'lodash';
import $ from 'jquery';

import {FnStatefulCalculator, StatefulSelectElement} from './dynamicComponents.jsx';
import {StatefulCalculator} from './staticComponents.jsx';

import {defaultState, tradeskillNames} from './defaultStates';
import {getTradeskillCalculators} from './tsCalculators.jsx';
import {getResourceCalculators} from './resourceCalculators.jsx';
import {getExpeditionCalculators} from './expeditionCalculators.jsx';
import {getMiscCalculators} from './miscCalculators.jsx';
import {getBuildingCalculators} from './buildings.jsx';
import {getCraftingCalculators} from './craftingCalculator.jsx';
import {getKingdomCalculators} from './kingdom.jsx';
import {getStore} from './reducers.jsx';

const tsCalculators = getTradeskillCalculators(defaultState);
const resourceCalculators = getResourceCalculators(defaultState);
const expeditionCalculators = getExpeditionCalculators(defaultState);
const miscCalculators = getMiscCalculators(defaultState);
const buildingCalculators = getBuildingCalculators(defaultState);
const craftingCalculators = getCraftingCalculators(defaultState);
const kingdomCalculators = getKingdomCalculators(defaultState);

const costCalculators = {
    resourceCalculators,
    expeditionCalculators,
    buildingCalculators,
    miscCalculators,
    tsCalculators,
    craftingCalculators,
    kingdomCalculators
};

// Higher order components
const Tradeskills = () => {
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
const BuildingCalculator = (props) => {
    return <div>
        {_.map(buildingCalculators, (config, idx) => {
            return <StatefulCalculator {...config} key={idx}/>
        })}
    </div>
};
const KingdomCalculator = (props) => {
    return <div>
        {_.map(kingdomCalculators, (config, idx) => {
            return <FnStatefulCalculator {...config} key={idx}/>
        })}
    </div>
};
const CraftingCalculator = (props) => {
    return <div>
        {_.map(craftingCalculators, (config, idx) => {
            return <FnStatefulCalculator {...config} key={idx} />
        })}
    </div>
};
let initializedStore = null;
const Container = React.createClass({
    getInitialState() {
        return {currentTab: 'ts', store: initializedStore};
    },
    setKingdomTab() {
        this.setState({currentTab: 'kingdom'});
    },
    setBuildingTab() {
        this.setState({currentTab: 'building'});
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

        if(this.state.currentTab == 'building')
            toRender = <BuildingCalculator/>;
        else if(this.state.currentTab == 'kingdom')
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
        return <Provider store={this.state.store}>
            <div className='container'>
                <div>
                    <ul className="nav nav-tabs">
                        <li role="presentation" className={currentTab=='ts' ? "active" : ''} onClick={this.setTSTab}><a href="#" key={'ts_pane'}>TS</a></li>
                        <li role="presentation" className={currentTab=='resources' ? "active" : ''} onClick={this.setResourceTab}><a href="#" key={'resources_pane'}>Resources</a></li>
                        {/*<li role="presentation" className={currentTab=='building' ? "active" : ''} onClick={this.setBuildingTab}><a href="#" key={'building_pane'}>Buildings</a></li>*/}
                        <li role="presentation" className={currentTab=='kingdom' ? "active" : ''} onClick={this.setKingdomTab}><a href="#" key={'kingdom_pane'}>Kingdom</a></li>
                        <li role="presentation" className={currentTab=='crafting' ? "active" : ''} onClick={this.setCraftingTab}><a href="#" key={'crafting_pane'}>Crafting</a></li>
                        <li role="presentation" className={currentTab=='misc' ? "active" : ''} onClick={this.setMiscTab}><a href="#" key={'misc_pane'}>Misc</a></li>
                    </ul>
                </div>
                {toRender}
            </div>
        </Provider>;
    }
});
var aws_endpoint = '//midenquest.info/market';

$.ajax({
    url: aws_endpoint,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success: (data)=>{
        initializedStore = getStore(costCalculators, {resources: data});
        ReactDOM.render(
            <Container/>,
            document.getElementById('app')
        );
    },
    error: ()=>{
        initializedStore = getStore(costCalculators);
        ReactDOM.render(
            <Container/>,
            document.getElementById('app')
        );
    }
});
