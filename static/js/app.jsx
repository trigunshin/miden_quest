import React from 'react';
import ReactDOM from 'react-dom';
import {connect, Provider} from 'react-redux';
import _ from 'lodash';

import {FnStatefulCalculator, StatefulSelectElement} from './dynamicComponents.jsx';
import {StatefulCalculator} from './staticComponents.jsx';

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
            return <FnStatefulCalculator {...config} key={idx} />
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
                        <li role="presentation" className={currentTab=='crafting' ? "active" : ''} onClick={this.setCraftingTab}><a href="#" key={'crafting_pane'}>Crafting</a></li>
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
