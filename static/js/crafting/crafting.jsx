import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import {observer} from "mobx-react";
import {observable, computed} from "mobx";
import {InputElement} from '../forms/mobx.jsx';

function getCraftInput(field, props, defaultValue) {
    return {
        type: 'number',
        classNames: '',
        value: _.get(props.data, field, defaultValue || 1),
        onChange: _.partial((obj, field, e) => {
            const val = parseInt(e.target.value);
            _.set(obj, field, val);
        }, props.data, field)
    }
}

@observer
class CraftingView extends Component {
    getInputs() {
        return {
            level: getCraftInput('level', this.props),
            workshops: getCraftInput('workshops', this.props),
            tier: getCraftInput('tier', this.props),
            start: getCraftInput('start', this.props),
            end: getCraftInput('end', this.props),
        };
    }
    render() {
        const config = this.getInputs();
        return <div>
            <div className='row'>
                <h4>Crafting</h4>
            </div>
            <div className='row'>
                <div className='col-md-1'>Level</div>
                <div className='col-md-1'>Workshops</div>
                <div className='col-md-1'>Tier</div>
                <div className='col-md-1'>Start</div>
                <div className='col-md-1'>End</div>
                <div className='col-md-1'>Next Slot</div>
                <div className='col-md-1'>All Slots</div>
            </div>
            <div className='row'>
                <InputElement {...config.level} />
                <InputElement {...config.workshops} />
                <InputElement {...config.tier} />
                <InputElement {...config.start} />
                <InputElement {...config.end} />
                <div className='col-md-1'>{this.props.data.nextCost}</div>
                <div className='col-md-1'>{this.props.data.masterCost}</div>
            </div>
        </div>;
    }
};


export const CraftingPage = React.createClass({
    propTypes: {
        data: PropTypes.object.isRequired
    },
    render() {
        return (<CraftingView data={this.props.data} />);
    }
});
