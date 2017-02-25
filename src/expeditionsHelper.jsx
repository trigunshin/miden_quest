//import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import moment from 'moment';
import {observer} from "mobx-react";

import {parseItemData, SearchContainer} from './searchBox.jsx';
import {parseCurrentItem} from './crafting.jsx';
import {getBulkSellAnchor} from './selling.jsx';
import Toggle from './components/toggle.jsx';
import ExpeditionState from './components/expeditions/expeditionParser.jsx';
import ExpeditionContainer from './components/expeditions/expeditions.jsx';
// jquery & UI: comes on the MQO page

const expeditionState = new ExpeditionState();

// initialize UI
@observer
class HelperContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (<div className='widget'>
            <Toggle label="[-]">
                <fieldset>
                    <div className="controlgroup-vertical">
                        <Toggle label="Expo's">{expeditionState && <ExpeditionContainer expeditionState={this.props.expeditionState} />}</Toggle>
                    </div>
                </fieldset>
            </Toggle>
        </div>);
    }
}
HelperContainer.defaultProps = {
    expeditionState: React.PropTypes.instanceOf(ExpeditionState)
};
function initSearchBox(container) {
	let ctr = $('#expeditionContainer');
    if(ctr.length == 0) {
        ctr = jQuery('<div/>', {
            id: 'expeditionContainer',
            text: '',
            style: 'float: left; width: 200px;'
        });
        ctr.prependTo('body');

        let react = jQuery('<div/>', {id: 'reactContainer'});
        ctr.append(react);
    }
    ReactDOM.render(container, document.getElementById('reactContainer'));
}
function track_inventory_onmsg(evt) {
    track_inventory_original_msg(evt);
    // used for searchbox and, eventually, others
    // FIXME results should be kept in top-level state here, scoped, & exposed to children via props
    parseItemData(evt.data);
    // selling items should be removed as it overlaps with Bulk
    // this is for craft view
    parseCurrentItem(evt.data);

    // its like a reducer! except with mobx. kind of. should probably be static.
    if(expeditionState) {
        ExpeditionState.parseExpeditionSetup(evt.data, expeditionState);
        expeditionState.currentTime = moment();
    }
}
// set up handler & hook original game handler in
if(typeof track_inventory_original_msg === 'undefined') {
    console.info('inventoryHelper not yet loaded, loading...');
    var track_inventory_original_msg = ws.onmessage;
    ws.onmessage=track_inventory_onmsg;
} else {
    ws.onmessage=track_inventory_onmsg;
}

const container = <HelperContainer expeditionState={expeditionState} />;
initSearchBox(container);


const subscreenTS = $('div#SubScreenTS');
const tooltipChildren = subscreenTS.find('div.infoplusMenu');
const resourceMap = _.filter(_.map(tooltipChildren, (node) => {
    // gold, gem, relic tooltip doesn't include label text
    if (node.childNodes.length <= 1) return;
    return {
        value: node.childNodes[0].data.replace(/\s/g, ''),
        key: node.childNodes[2].data
    }
}));
const resourceIndexes = {ore: 0, plant: 1, wood: 2, fish: 3};
const resNameByIndex = {0: 'ore', 1: 'plant', 2: 'wood', 3: 'fish'};
const tierByIndex = {};

const tierChunks = _.chunk(resourceMap, 4);
_.reduce(resourceMap, (accum, resource, idx) => {
    const label = resNameByIndex[idx % 4] + '_' + (parseInt(idx/4)+1);
    accum[label] = resource.value;
    return accum;
}, {});
