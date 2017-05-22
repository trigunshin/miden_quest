//import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import moment from 'moment';
import {observer} from "mobx-react";

import {parseItemData, SearchContainer} from './searchBox.jsx';
import {parseCurrentItem, CraftingContainer} from './crafting.jsx';
import {getBulkSellAnchor} from './selling.jsx';
import {LinkContainer} from './quick_links.jsx';
import ROIState from './components/tradeskillParser';
import ExpeditionState from './components/expeditions/expeditionParser.jsx';
import ExpeditionContainer from './components/expeditions/expeditions.jsx';
import KingdomContainer from './components/kingdom/kingdom.jsx';
import KingdomState from './components/kingdom/kingdomParser.jsx';
import ProfileState from './components/profiles/profileParser.jsx';
// jquery & UI: comes on the MQO page
const profileState = new ProfileState();
const kingdomState = new KingdomState();
const roiState = new ROIState();
const expeditionState = new ExpeditionState();

class Toggle extends React.Component {
    toggleVisible = (e) => {
        this.setState({visible: !this.state.visible});
    };
    constructor(props) {
        super(props);
        this.state = {visible: true};
    }
    render() {
        const label = <a href="#">{this.props.label}</a>;
        return (<div className='widget'>
            <div style={{color: 'red', 'fontSize': '2em'}} onClick={this.toggleVisible}>{label}</div>
            {this.state.visible && this.props.children}
        </div>);
    }
}
Toggle.propTypes = {label: React.PropTypes.string.isRequired};


// initialize UI
@observer
class InventoryContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        //const expeditions = <Toggle label="Expeditions">{expeditionState && <ExpeditionContainer expeditionState={this.props.expeditionState} />}</Toggle>;
        return (<div className='widget'>
            <Toggle label="[-]">
                <fieldset>
                    <div className="controlgroup-vertical">
                        <Toggle label="Inventory">
                            <SearchContainer />
                                {getBulkSellAnchor()}
                            <CraftingContainer />
                        </Toggle>
                        <br />
                        <Toggle label="Kingdom"><KingdomContainer kingdomState={kingdomState} profileState={profileState} /></Toggle>
                        <br />
                        <Toggle label="Links"><LinkContainer /></Toggle>
                    </div>
                </fieldset>
            </Toggle>
        </div>);
    }
}
InventoryContainer.defaultProps = {
    expeditionState: React.PropTypes.instanceOf(ExpeditionState)
};
function initSearchBox(container) {
	let ctr = $('#inventoryContainer');
    if(ctr.length == 0) {
        ctr = jQuery('<div/>', {
            id: 'inventoryContainer',
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

    if(kingdomState) {
        KingdomState.parseKingdom(evt.data, kingdomState);
        kingdomState.currentTime = moment();
    }

    if(roiState) {
        ROIState.parse(evt.data, roiState);
        roiState.currentTime = moment();
    }

    if(profileState) {
        ProfileState.parse(evt.data, profileState);
        ProfileState.currentTime = moment();
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

const container = <InventoryContainer expeditionState={expeditionState} />;
initSearchBox(container);
