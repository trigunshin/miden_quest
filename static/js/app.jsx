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
        else
            toRender = _.map(_.values(miscCostCalculators), (config) => {
                return <StatefulCalculator {...config}/>
            });
        return <ReactRedux.Provider store={store}>
            <div className='container'>
                <div>
                    <ul className="nav nav-tabs">
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
