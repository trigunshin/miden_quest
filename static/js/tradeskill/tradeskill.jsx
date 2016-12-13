import React, {Component, PropTypes, cloneElement} from 'react';
import _ from 'lodash';
import {observer} from "mobx-react";
import {connect} from 'react-redux';
import {observable, computed} from "mobx";
import {InputElement, SelectElement} from '../forms/mobx.jsx';

import {tradeskillNames, tradeskillResourceMap} from '../defaultStates';

function getTradeskillInput(field, props, defaultValue) {
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
class TradeExperienceRow extends Component {
    getInputs() {
        return {
            level: getTradeskillInput('level', this.props, 1),
            gemXp: getTradeskillInput('gemXp', this.props, 0),
            relicXp: getTradeskillInput('relicXp', this.props, 0),
            navigationXp: getTradeskillInput('navigationXp', this.props, 0),
        };
    }
    render() {
        const config = this.getInputs();
        return <div>
            <div className='row'>
                <h4>XP</h4>
            </div>
            <div className='row'>
                <div className='col-md-1'>Level</div>
                <div className='col-md-1'>Relic XP</div>
                <div className='col-md-1'>Gem XP</div>
                <div className='col-md-1'>Island XP</div>
            </div>
            <div className='row'>
                <InputElement {...config.level} />
                <InputElement {...config.relicXp} />
                <InputElement {...config.gemXp} />
                <InputElement {...config.navigationXp} />
                <div className='col-md-1'>{this.props.data.xpPerAction}</div>
            </div>
        </div>;
    }
};

@observer
class TradeAmountRow extends Component {
    static propTypes = {data: PropTypes.object.isRequired};
    getInputs() {
        return {
            level: getTradeskillInput('level', this.props, 1),
            relicResource: getTradeskillInput('relicResource', this.props, 0),
            gemGold: getTradeskillInput('gemGold', this.props, 0),
            gemResource: getTradeskillInput('gemResource', this.props, 0),
            kingdomResource: getTradeskillInput('kingdomResource', this.props, 0),
            workEfficiency: getTradeskillInput('workEfficiency', this.props, 0),
            globalBonus: getTradeskillInput('globalBonus', this.props, 1),
        };
    }
    render() {
        const config = this.getInputs();
        return <div>
            <div className='row'>
                <h4>Amount</h4>
            </div>
            <div className='row'>
                <div className='col-md-1'>Level</div>
                <div className='col-md-1'>Relic</div>
                <div className='col-md-1'>Gem Gold</div>
                <div className='col-md-1'>Gem Res</div>
                <div className='col-md-1'>Work Eff</div>
                <div className='col-md-1'>Kingdom</div>
                <div className='col-md-1'>Global</div>
            </div>
            <div className='row'>
                <InputElement {...config.level} />
                <InputElement {...config.relicResource} />
                <InputElement {...config.gemGold} />
                <InputElement {...config.gemResource} />
                <InputElement {...config.workEfficiency} />
                <InputElement {...config.kingdomResource} />
                <InputElement {...config.globalBonus} />
            </div>
        </div>;
    }
};

@observer
class TradeLuckRow extends Component {
    static propTypes = {data: PropTypes.object.isRequired};
    getInputs() {
        return {
            relicLuck: getTradeskillInput('relicLuck', this.props, 1),
            kingdomLuck: getTradeskillInput('kingdomLuck', this.props, 0),
            t1: getTradeskillInput('t1', this.props, 0),
            t2: getTradeskillInput('t2', this.props, 0),
            t3: getTradeskillInput('t3', this.props, 0),
            t4: getTradeskillInput('t4', this.props, 0),
            t5: getTradeskillInput('t5', this.props, 1),
        };
    }
    render() {
        const config = this.getInputs();
        return <div>
            <div className='row'>
                <h4>Luck</h4>
            </div>
            <div className='row'>
                <div className='col-md-1'>Relic Luck</div>
                <div className='col-md-1'>Kingdom Luck</div>
                <div className='col-md-1'>T1</div>
                <div className='col-md-1'>T2</div>
                <div className='col-md-1'>T3</div>
                <div className='col-md-1'>T4</div>
                <div className='col-md-1'>T5</div>
            </div>
            <div className='row'>
                <InputElement {...config.relicLuck} />
                <InputElement {...config.kingdomLuck} />
                <InputElement {...config.t1} />
                <InputElement {...config.t2} />
                <InputElement {...config.t3} />
                <InputElement {...config.t4} />
                <InputElement {...config.t5} />
            </div>
        </div>;
    }
};

@observer
class TradeSelector extends Component {
    static propTypes = {data: PropTypes.object.isRequired};
    getOnChange(data, field) {
        return _.partial((obj, field, e) => {
            const val = e.target.value;
            _.set(obj, field, val);
        }, data, field)
    }
    render() {
        const data = this.props.data;
        return <div>
            <div className='row'>
                <div className='col-sm-2'>
                    <SelectElement options={tradeskillNames} value={data.currentTrade} onChange={this.getOnChange(data, 'currentTrade')} />
                </div>
            </div>
        </div>
    }
}

@observer
class TierChanceRow extends Component {
    static propTypes = {data: PropTypes.object.isRequired};
    render() {
        return <div>
            <div className='row'>
                <h4>Overall Tier Chance</h4>
            </div>
            <div className='row'>
                <div className='col-md-1'>T1</div>
                <div className='col-md-1'>T2</div>
                <div className='col-md-1'>T3</div>
                <div className='col-md-1'>T4</div>
                <div className='col-md-1'>T5</div>
            </div>
            <div className='row'>
                <div className='col-md-1'>{this.props.data.t1Chance}</div>
                <div className='col-md-1'>{this.props.data.t2Chance}</div>
                <div className='col-md-1'>{this.props.data.t3Chance}</div>
                <div className='col-md-1'>{this.props.data.t4Chance}</div>
                <div className='col-md-1'>{this.props.data.t5Chance}</div>
            </div>
        </div>
    }
}

@observer
class TierAmountRow extends Component {
    static propTypes = {data: PropTypes.object.isRequired};
    render() {
        return <div>
            <div className='row'>
                <h4>Tier Amounts</h4>
            </div>
            <div className='row'>
                <div className='col-md-1'>T1</div>
                <div className='col-md-1'>T2</div>
                <div className='col-md-1'>T3</div>
                <div className='col-md-1'>T4</div>
                <div className='col-md-1'>T5</div>
            </div>
            <div className='row'>
                <div className='col-md-1'>{this.props.data.t1Amount}</div>
                <div className='col-md-1'>{this.props.data.t2Amount}</div>
                <div className='col-md-1'>{this.props.data.t3Amount}</div>
                <div className='col-md-1'>{this.props.data.t4Amount}</div>
                <div className='col-md-1'>{this.props.data.t5Amount}</div>
            </div>
        </div>
    }
}

@observer
class TierAverageAmountRow extends Component {
    static propTypes = {data: PropTypes.object.isRequired};
    render() {
        return <div>
            <div className='row'>
                <h4>Average Tier Amount per Action</h4>
            </div>
            <div className='row'>
                <div className='col-md-1'>T1</div>
                <div className='col-md-1'>T2</div>
                <div className='col-md-1'>T3</div>
                <div className='col-md-1'>T4</div>
                <div className='col-md-1'>T5</div>
            </div>
            <div className='row'>
                <div className='col-md-1'>{this.props.data.t1AmountEv}</div>
                <div className='col-md-1'>{this.props.data.t2AmountEv}</div>
                <div className='col-md-1'>{this.props.data.t3AmountEv}</div>
                <div className='col-md-1'>{this.props.data.t4AmountEv}</div>
                <div className='col-md-1'>{this.props.data.t5AmountEv}</div>
            </div>
        </div>
    }
}

@observer
class TierValueEvRow extends Component {
    static propTypes = {data: PropTypes.object.isRequired};
    render() {
        return <div>
            <div className='row'>
                <h4>Average {this.props.data.currentTrade === 'scouting' ? 'Landmarks' : 'Gold'} per Action</h4>
            </div>
            <div className='row'>
                <div className='col-md-1'>Value</div>
            </div>
            <div className='row'>
                <div className='col-md-1'>{this.props.data.weightedValue}</div>
            </div>
        </div>
    }
}

@observer
class TierUpgradesRow extends Component {
    static propTypes = {data: PropTypes.object.isRequired};
    render() {
        const gemString = this.props.data.currentTrade === 'selling' ? 'Gold' : 'Resources';
        const tradeResultString = this.props.data.currentTrade === 'scouting' ? 'Landmarks' : 'Gold';

        return <div>
            <div className='row'>
                <h4>Average {tradeResultString} per Action</h4>
            </div>
            <div className='row'>
                <div className='col-md-1'>Relic Amount</div>
                <div className='col-md-1'>Relic Luck</div>
                <div className='col-md-1'>Gem {gemString}</div>
            </div>
            <div className='row'>
                <div className='col-md-1'>{this.props.data.relicAmountUpgrade}</div>
            </div>
        </div>
    }
}

@observer
class TradeskillView extends Component {
    static propTypes = {data: PropTypes.object.isRequired};
    render() {
        return <div>
            <TradeSelector data={this.props.data} />
            <TradeExperienceRow data={this.props.data} />
            <TradeAmountRow data={this.props.data} />
            <TradeLuckRow data={this.props.data} />

            <TierChanceRow data={this.props.data} />
            <TierAmountRow data={this.props.data} />
            <TierAverageAmountRow data={this.props.data} />
            <TierValueEvRow data={this.props.data} />
            <TierUpgradesRow data={this.props.data} />
        </div>;
    }
};

export const TradeskillPage = React.createClass({
    propTypes: {
        data: PropTypes.object.isRequired
    },
    render() {
        return (<TradeskillView data={this.props.data} />);
    }
});
