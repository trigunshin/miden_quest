import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

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
    return <div id={id} className='col-md-1'>{value||0}</div>;
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
export const StatefulCalculator = connect(
    (state, ownProps) => {return state[ownProps.stateKey]},
    (dispatch) => {return {onInputChange: (id, stateKey, valueKey, value) => {dispatch({type: id, stateKey: stateKey, valueKey: valueKey, value: value})}}}
)(Calculator);
