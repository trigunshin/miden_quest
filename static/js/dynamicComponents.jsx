import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

const InputElement = React.createClass({
    handleChange(event) {
        let newValue = parseFloat(event.target.value);
        this.props.onInputChange(this.props.stateKey, newValue);
    },
    render() {
        let inp = null;
        if(this.props.type=='number') {
            inp = <input type={'number'} step={'0.01'} min={'0'} className={'form-control'} placeholder={this.props.placeholder} value={this.props.value} onChange={this.handleChange} />;
        }
        return (<div className='col-md-1'>
            {inp}
        </div>);
    }
});
const StatefulInputElement = connect(
    (state, ownProps) => {if(ownProps.fn) return {value: ownProps.fn(state)}; else return {value: _.get(state, ownProps.stateKey)}}
)(InputElement);
// Display non-input data
const ValueHolderDiv = ({id, value}) => {
    return <div id={id} className='col-md-1'>{value}</div>;
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
                if(col.type == 'number') return <StatefulInputElement {...col} onInputChange={onInputChange} key={'el'.concat(col.title)} />;
                else return <StatefulDiv {...col} key={'el'.concat(col.title)} />;
            })}
        </div>
    </div>;
};
export const FnStatefulCalculator = connect(
    (state, ownProps) => {return _.get(state, ownProps.stateKey)},
    (dispatch) => {return {onInputChange: (stateKey, value) => {dispatch({type: stateKey, stateKey: stateKey, value: value})}}}
)(Calculator);
