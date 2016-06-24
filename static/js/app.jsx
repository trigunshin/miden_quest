//Display/input data
const FnInputElement = React.createClass({
    handleChange(event) {
        let newValue = parseInt(event.target.value);
        this.props.onInputChange(this.props.stateKey, newValue);
    },
    render() {
        return (<div className='col-md-1'>
            <input type={this.props.type} className="form-control" placeholder={this.props.placeholder} value={this.props.value} onChange={this.handleChange} />
        </div>);
    }
});
const FnStatefulInputElement = ReactRedux.connect(
    (state, ownProps) => {if(ownProps.fn) return {value: ownProps.fn(state)}; else return {value: _.get(state, ownProps.stateKey)}}
)(FnInputElement);
// Display non-input data
const FnValueHolderDiv = ({id, value}) => {
    return <div id={id} className='col-md-1'>{value}</div>;
};
const FnStatefulDiv = ReactRedux.connect(
    (state, ownProps) => {if(ownProps.fn) return {value: ownProps.fn(state)}; else return {value: _.get(state, ownProps.stateKey)}}
)(FnValueHolderDiv);
// Selectable options
const SelectElement = ({options, value, onInputChange}) => {
    return <select className="form-control" value={value} onChange={onInputChange}>
        {_.map(options, (option) => {return <option value={_.lowerCase(option)}>{option}</option>})}
    </select>;
};
const StatefulSelectElement = ReactRedux.connect(
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
                return <div className='col-md-1'>{col.title}</div>
            })}
        </div>
        <div className='row'>
            {_.map(cols, (col) => {
                if(col.type == 'number') return <FnStatefulInputElement {...col} onInputChange={onInputChange} />;
                else return <FnStatefulDiv {...col} />;
            })}
        </div>
    </div>;
};
const FnStatefulCalculator = ReactRedux.connect(
    (state, ownProps) => {return _.get(state, ownProps.stateKey)},
    (dispatch) => {return {onInputChange: (stateKey, value) => {dispatch({type: stateKey, stateKey: stateKey, value: value})}}}
)(FnCalculator);


// Composable components
//Display/input data
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
    (state, ownProps) => {if(ownProps.fn) return {value: ownProps.fn(state)}; else return {value: state[ownProps.stateKey][ownProps.valueKey]}}
)(InputElement);
// Display non-input data
const ValueHolderDiv = ({id, value}) => {
    return <div id={id} className='col-md-1'>{value}</div>;
};
const StatefulDiv = ReactRedux.connect(
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
                return <div className='col-md-1'>{col.title}</div>
            })}
        </div>
        <div className='row'>
            {_.map(cols, (col) => {
                if(col.type == 'number') return <StatefulInputElement {...col} onInputChange={onInputChange} stateKey={stateKey} />;
                else return <StatefulDiv {...col} stateKey={stateKey} />;
            })}
        </div>
    </div>;
};
const StatefulCalculator = ReactRedux.connect(
    (state, ownProps) => {return state[ownProps.stateKey]},
    (dispatch) => {return {onInputChange: (id, stateKey, valueKey, value) => {dispatch({type: id, stateKey: stateKey, valueKey: valueKey, value: value})}}}
)(Calculator);

// Higher order components
const Tradeskills = ({tsCalculators}) => {
    return <div>
        <div className='row'>
            <div className='col-sm-2'>
                <StatefulSelectElement options={tradeskillNames} stateKey={'currentTS'} fn={(state)=>{return state.ts.currentTS;}} />
            </div>
        </div>
        {_.map(props.tsCalculators, (config) => {
            return <LStatefulCalculator {...config} />
        })}
    </div>;
};
const Expeditions = ({expeditionCostCalculators}) => {
    return <div>
        {_.map(expeditionCostCalculators, (config) => {
            return <StatefulCalculator {...config} />
        })}
    </div>;
};
const ResourceCosts = ({resourceCostCalculators}) => {
    return <div>        
        {_.map(resourceCostCalculators, (config) => {
            return <StatefulCalculator {...config} />
        })}
    </div>;
};
const KingdomCalculator = (props) => {
    return <div>
        {_.map(buildingCostCalculators, (config) => {
            return <StatefulCalculator {...config} />
        })}
    </div>
};
const Container = React.createClass({
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
    render() {
        const currentTab = this.state.currentTab;
        let toRender;

        if(this.state.currentTab == 'kingdom')
            toRender = <KingdomCalculator/>;
        else if(this.state.currentTab == 'resources')
            toRender = <ResourceCosts resourceCostCalculators={resourceCostCalculators} />;
        else if(this.state.currentTab == 'expeditions')
            toRender = <Expeditions expeditionCostCalculators={expeditionCostCalculators} />;
        else if(this.state.currentTab == 'ts')
            toRender = <Tradeskills tsCalculators={tsCalculators} />;
        else
            toRender = _.map(_.values(miscCostCalculators), (config) => {
                return <StatefulCalculator {...config}/>
            });
        return <ReactRedux.Provider store={store}>
            <div className='container'>
                <div>
                    <ul className="nav nav-tabs">
                        <li role="presentation" className={currentTab=='ts' ? "active" : ''} onClick={this.setTSTab}><a href="#">TS</a></li>
                        <li role="presentation" className={currentTab=='misc' ? "active" : ''} onClick={this.setMiscTab}><a href="#">Misc</a></li>
                        <li role="presentation" className={currentTab=='resources' ? "active" : ''} onClick={this.setResourceTab}><a href="#">Resources</a></li>
                        <li role="presentation" className={currentTab=='kingdom' ? "active" : ''} onClick={this.setKingdomTab}><a href="#">Kingdom</a></li>
                        <li role="presentation" className={currentTab=='expeditions' ? "active" : ''} onClick={this.setExpeditionTab}><a href="#">Expeditions</a></li>
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
