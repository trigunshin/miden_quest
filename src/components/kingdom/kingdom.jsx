import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import {observer} from "mobx-react";

const kingdomMoveTemplate = _.template('getKingdom.aspx?NewX=<%= x %>&NewY=<%= y %>');

@observer
class ResidentContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {idx: 0};
    }
    gotoResidents = () => {
        sendRequestContentFill('getKingdom.aspx?action=residents&null=');
    };
    nextResident = () => {
        const idx = this.state.idx;
        const res = this.props.residents;
        const resKeys = _.keys(res);

        // update idx; don't go past the # of residents
        const newState = {};
        if (idx >= resKeys.length) {
            newState.idx = 0;
            console.info('output the final data here');
        } else {
            // get the current key, then get the current resident's info
            console.info('navigating to ', resKeys[idx]);
            sendRequestContentFill(res[resKeys[idx]].playerLink);

            function getTSAttempts(data) {
                var tsDiv = $(data).find("div:contains('tradeskill attempts')");
                var tsNode = tsDiv[tsDiv.length-1];
                var tsNodeParent = tsNode.parentElement;
                var tsSiblings = tsNodeParent.childNodes;
                var tsAttemptNode = tsSiblings[3];
                var tsAttempts = tsAttemptNode.innerText.replace(/ /g, '');
                return tsAttempts;
            }

            newState.idx = idx + 1;
        }
        this.setState(newState);
    };
    render() {
        const idx = this.state.idx;
        const res = this.props.residents;
        const resKeys = _.keys(res);

        return (<div>
            <a href='#' onClick={this.gotoResidents}>Load Residents</a>
            <div>{idx}/{resKeys.length}</div>
            <a href='#' onClick={this.nextResident}>Next: {resKeys[idx]}</a>
        </div>);
    };
}
ResidentContainer.propTypes = {
    residents: React.PropTypes.object.isRequired,
};

@observer
export default class KingdomContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {x: 650, y: 535};
    }
    kingdomClick = (e) => {
        sendRequestContentFill(kingdomMoveTemplate({x: this.state.x, y: this.state.y}));
    };
    onCoordinateChange = (type, e) => {
        const updater = this.state;
        updater[type] = e.target.value;
        this.setState({updater});
    };
    render() {
        return (<div>
            <div>
                X:
                <input id={"x_input"} type='number' value={this.state.x} onChange={_.partial(this.onCoordinateChange, 'x')} />
            </div>
            <div>
                Y:
                <input id={"y_input"} type='number' value={this.state.y} onChange={_.partial(this.onCoordinateChange, 'y')} />
            </div>
            <a href='#' onClick={this.kingdomClick}>Move</a>
            <ResidentContainer residents={this.props.kingdomState.residents} />
        </div>);
    }
}
KingdomContainer.propTypes = {
    kingdomState: React.PropTypes.object.isRequired,
};
// sendRequestContentFill('getKingdom.aspx?NewX=642&NewY=535');
