import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import {observer} from "mobx-react";
import {observable, computed} from "mobx";
//import {extendObservable} from "mobx";
//import {Sum} from './testPaneState';
import {InputElement} from '../forms/mobx.jsx';

@observer
class TestView extends Component {
    getInputs() {
        return {
            firstInput: {
                type: 'number',
                classNames: '',
                value: _.get(this.props.sum, 'first', 1),
                onChange: _.partial((obj, field, e) => {
                    const val = parseInt(e.target.value);
                    _.set(obj, field, val);
                }, this.props.sum, 'first')
            },
            secondInput: {
                type: 'number',
                classNames: '',
                value: _.get(this.props.sum, 'second', 1),
                onChange: _.partial((obj, field, e) => {
                    const val = parseInt(e.target.value);
                    _.set(obj, field, val);
                }, this.props.sum, 'second')
            }
        };
    }
    render() {
        const config = this.getInputs();
        return (<div className='row'>
            <div>testing</div>
            <div>
                <InputElement {...config.firstInput} />
            </div>
            <div>
                <InputElement {...config.secondInput} />
            </div>
            <div>{this.props.sum.sumTotal}</div>
        </div>);
    }
};

export const TestPane = React.createClass({
    propTypes: {
        sum: PropTypes.object.isRequired
    },
    render() {
        return (<TestView sum={this.props.sum} />);
    }
});
