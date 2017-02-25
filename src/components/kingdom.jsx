import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

const kingdomMoveTemplate = _.template('getKingdom.aspx?NewX=<%= x %>&NewY=<%= y %>');

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
        </div>);
    }
}
KingdomContainer.propTypes = {};
// sendRequestContentFill('getKingdom.aspx?NewX=642&NewY=535');
