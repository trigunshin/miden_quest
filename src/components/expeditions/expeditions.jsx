import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import {moment} from 'moment';
import {observer} from "mobx-react";

import ExpeditionState from './expeditionParser.jsx';


class Select extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <select value={this.props.value} onChange={this.props.onChange}>
                {_.map(this.props.names, (name) => {
                    return <option key={name} value={name}>{name}</option>;
                })}
            </select>
        );
    }
}
Select.propTypes = {
    names: React.PropTypes.arrayOf(React.PropTypes.string),
    value: React.PropTypes.string,
    onChange: React.PropTypes.func
};
Select.defaultProps = {
    names: [],
    value: '',
    onChange: ()=>{}
};

@observer
class ExpeditionContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resources: {
                Warrior: 'wood',
                Hunter: 'wood',
                Mage: 'wood',
                Healer: 'wood'
            },
            levels: {
                Warrior: 10,
                Hunter: 10,
                Mage: 10,
                Healer: 10
            },
        };
    }
    onTargetChange = (type, e) => {
        const updater = this.state.levels;
        updater[type] = e.target.value;
        this.setState({levels: updater});
    };
    onResourceChange = (type, e) => {
        const updater = this.state.resources;
        updater[type] = e.target.value;
        this.setState({resources: updater});
    };
    levelNext = () => {
        const expState = this.props.expeditionState;
        expState.levelExpedition(this.state.levels, this.state.resources);
    };
    render() {
        const expState = this.props.expeditionState;
        const targets = this.state.levels;
        const inputStyle = {width: '30px'};

        return (
            <div>
                {_.map(expState.expeditionColumns, (name) => {
                    return (
                        <div key={name}>{name}: {expState[name]} />
                            <input id={name+"Target"} type='number' value={targets[name]} style={inputStyle} onChange={_.partial(this.onTargetChange, name)} />
                            <Select onChange={_.partial(this.onResourceChange, name)} names={_.keys(expState.expeditionResourceTypes)} value={this.state.resources[name]} />
                        </div>
                    );
                })}
                <a href='#' onClick={this.levelNext}>Level Up</a>
                <div>Done {expState && expState.doneAt && expState.currentTime.to(expState.doneAt)}</div>
            </div>
        );
    }
}
ExpeditionContainer.propTypes = {
    expeditionState: React.PropTypes.instanceOf(ExpeditionState)
};
ExpeditionContainer.defaultProps = {
    //expeditionState: React.PropTypes.instanceOf(ExpeditionState)
};

export default ExpeditionContainer;
