import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import {connect} from 'react-redux';

const InputElement = React.createClass({
    handleChange(event) {
        let newValue = event.target.value;
        if(this.props.type=='number') newValue = parseFloat(newValue);
        this.props.onInputChange(this.props.stateKey, newValue);
    },
    render() {
        let inp = null;
        if(this.props.type=='number') {
            inp = <input type={'number'} step={'0.01'} min={'0'} className={'form-control'} value={this.props.value} onChange={this.handleChange} />;
        } else if(this.props.type=='text') {
            inp = <input type={'text'} className={'form-control'} value={this.props.value} onChange={this.handleChange} />;
        }
        let classString = 'col-md-1';
        if(this.props.classNames) classString = _.join(_.concat(['col-md-1'], this.props.classNames),' ');

        return (<div className={classString}>
            {inp}
        </div>);
    }
});
const StatefulInputElement = connect(
    (state, ownProps) => {
        const ret = {};
        if(ownProps.fn) ret.value = ownProps.fn(state);
        else ret.value = _.get(state, ownProps.stateKey);
        if(ownProps.highlightGreenFn && ownProps.highlightGreenFn(state)) ret.classNames = ['bg-success'];
        return ret;
    }
)(InputElement);
// Display non-input data
const ValueHolderDiv = ({id, value}) => {
    return <div id={id} className='col-md-1'>{value||0}</div>;
};
const StatefulDiv = connect(
    (state, ownProps) => {if(ownProps.fn) return {value: ownProps.fn(state)}; else return {value: _.get(state, ownProps.stateKey)}}
)(ValueHolderDiv);
// Selectable options
const SelectElement = ({options, value, onInputChange}) => {
    return <select className="form-control" value={value} onChange={onInputChange}>
        {_.map(options, (option) => {const lowerOption = _.lowerCase(option);return <option value={lowerOption} key={lowerOption}>{option}</option>})}
    </select>;
};
export const StatefulSelectElement = connect(
    (state, ownProps) => {return {value: ownProps.fn(state)};},
    (dispatch, ownProps) => {return {onInputChange: (e) => {dispatch({type: ownProps.stateKey, value: e.target.value})}}}
)(SelectElement);

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
                if(_.includes(['number', 'text'], col.type)) return <StatefulInputElement {...col} onInputChange={onInputChange} key={'el'.concat(col.title)} />;
                else return <StatefulDiv {...col} key={'el'.concat(col.title)} />;
            })}
        </div>
    </div>;
};
export const FnStatefulCalculator = connect(
    (state, ownProps) => {return _.get(state, ownProps.stateKey)},
    (dispatch) => {return {onInputChange: (stateKey, value) => {dispatch({type: stateKey, stateKey: stateKey, value: value})}}}
)(Calculator);
