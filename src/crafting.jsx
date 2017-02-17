import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

// orb reroll
function getOrbTransformPath(itemId) {
    return 'getCustomize.aspx?id=' + itemId + '&action=transform&null=';
}
function transformItem() {
    if(currentItemId && !hasMiden) sendRequestContentFill(getOrbTransformPath(currentItemId));
}
function transformAllstatItem() {
    if(currentItemId) sendRequestContentFill(getOrbTransformPath(currentItemId));
}


// load3: 55, force3: 60, str5: 8, relic2: 64
const LOAD_3 = 55;
const FORCE_3 = 60;
const RELIC_2 = 64;
const LINE_2 = 45;
const COL_2 = 48;

let currentItemId = null;
let hasMiden = false;
const itemIdPattern = /getCustomize\.aspx\?id=(\d+)/;
// one button enchanting
let enchantTarget = false;

function enchantItem(idGenerator) {
    if(enchantTarget && currentItemId) {
        const enchantId = idGenerator(enchantTarget);
        sendRequestContentFill('getCustomize.aspx?id='+currentItemId+'&seg='+enchantTarget+'&nseg='+enchantId+'&action=enchant&null=');
    }
}
// one button reforging
let forgeTarget = false;
const currentForgeSlots = _.range(20);

function masterReforge() {
    if(forgeTarget && currentItemId)
        sendRequestContentFill('getCustomize.aspx?id='+currentItemId+'&seg='+forgeTarget+'&action=forge&null=);return false;');
}

function masterTier16(curEnchant, slot) {
    var ret = 48;
    switch(slot) {
        // row 1
        case 1:
        case 2:
        case 3:
        //row 2
        case 5:
        case 6:
        case 7:
        // row 3
        case 9:
        case 10:
        case 11:
        // corner
        case 20:
            // stam3, wf3
            ret = curEnchant;
            break;
        case 4:
        case 8:
        case 12:
            // line2
            ret = LINE_2;
            break;
        case 13:
        case 14:
        case 15:
        case 16:
        case 17:
        case 18:
        case 19:
            // col2
            ret = COL_2;
            break;
        default:
            ret = curEnchant;
    }
    return ret;
}

function masterTier13(curEnchant, slot) {
    var ret = 48;
    switch(slot) {
        // row 1
        case 1:
            // relic2
            ret = RELIC_2;
            break;
        case 2:
        case 3:
        //row 2
        case 5:
        case 6:
        case 7:
        // row 3
        case 9:
        case 10:
        case 11:
        // corner
        case 16:
            // stam3, wf3
            ret = curEnchant;
            break;
        case 4:
        case 8:
        case 12:
            // line2
            ret = LINE_2;
            break;
        case 13:
        case 14:
        case 15:
            // col2
            ret = COL_2;
            break;
        default:
            ret = null;
    }
    return ret;
}
function masterTier12(curEnchant, slot) {
    var ret = 48;
    switch(slot) {
        case 1:
        case 2:
        case 4:
        case 5:
        case 7:
        case 8:
        case 12:
            // stam3, wf3
            ret = curEnchant;
            break;
        case 3:
        case 6:
        case 9:
            // line2
            ret = LINE_2;
            break;
        case 10:
        case 11:
            // col2
            ret = COL_2;
            break;
        default:
            ret = null;
    }
    return ret;
}
function masterTier10(curEnchant, slot) {
    var ret = 48;
    switch(slot) {
        case 1:
            // relic2
            ret = 64;
            break;
        case 2:
        case 4:
        case 5:
        case 7:
        case 8:
        case 12:
            // stam3, wf3
            ret = curEnchant;
            break;
        case 3:
        case 6:
        case 9:
            // line2
            ret = LINE_2;
            break;
        case 10:
        case 11:
            // col2
            ret = COL_2;
            break;
        default:
            ret = null;
    }
    return ret;
}

const AnchorClickable = ({text, onClick}) => {
    return (<a href='#' onClick={onClick}>{text}</a>);
};
const ListClickable = ({text, onClick}) => {
    return (<li><AnchorClickable text={text} onClick={onClick} /></li>);
};
export const CraftingContainer = () => {
    return (
        <ul id='craftList'>
            <ListClickable text={'Reforge Item'} onClick={_.partial(masterReforge)} />
            <br/>
            <ListClickable text={'Transform Item'} onClick={_.partial(transformItem)} />
            <br/>
            <ListClickable text={'Transform Miden'} onClick={_.partial(transformAllstatItem)} />
            <br />
            <EquipmentMarketWidget itemId={currentItemId} />
            <br/>
            <ListClickable text={'Enchant T16 WE'} onClick={_.partial(_.partial(enchantItem, _.partial(masterTier16, FORCE_3)))} />
            <ListClickable text={'Enchant T13 WE'} onClick={_.partial(_.partial(enchantItem, _.partial(masterTier13, FORCE_3)))} />
            <ListClickable text={'Enchant T12 WE'} onClick={_.partial(_.partial(enchantItem, _.partial(masterTier12, FORCE_3)))} />
            <ListClickable text={'Enchant T10 WE'} onClick={_.partial(_.partial(enchantItem, _.partial(masterTier10, FORCE_3)))} />
            <br/>
            <ListClickable text={'Enchant T16 WL'} onClick={_.partial(_.partial(enchantItem, _.partial(masterTier16, LOAD_3)))} />
            <ListClickable text={'Enchant T13 WL'} onClick={_.partial(_.partial(enchantItem, _.partial(masterTier13, LOAD_3)))} />
            <ListClickable text={'Enchant T12 WL'} onClick={_.partial(_.partial(enchantItem, _.partial(masterTier12, LOAD_3)))} />
            <ListClickable text={'Enchant T10 WL'} onClick={_.partial(_.partial(enchantItem, _.partial(masterTier10, LOAD_3)))} />
        </ul>
    );
};

const equipmentTypeMappings = {
    weapon: {query: 'Right Hand', name: 'Weapon', marketType: 1},
    armor: {query: 'Armor', name: 'Armor', marketType: 2},
    helmet: {query: 'Helm', name: 'Helmet', marketType: 3},
    pants: {query: 'Leggings', name: 'Pants', marketType: 4},
    gloves: {query: 'Gloves', name: 'Gloves', marketType: 5},
    boots: {query: 'Boots', name: 'Boots', marketType: 6},
    necklace: {query: 'Necklace', name: 'Necklace', marketType: 7},
    ring: {query: 'Ring', name: 'Ring', marketType: 8},
    charm: {query: 'Charm', name: 'Charm', marketType: 9}
};
function getEquipmentType() {
    return _.find(_.values(equipmentTypeMappings), (val) => {
        //const {query, name, marketType} = val;
        const result = $("div:contains('" + val.query + "')");
        // minor hack; the select dropdown's result.length will be === 5
        // scope this to the item block to speed up parsing and obviate the hack
        return result.length > 6;
    });
}

function getEquipmentSellString(itemId, marketType, price) {
    return 'getMarket.aspx?SelectMarketType=1&SelectMarketSubType=' + marketType + '&SelectMarketSub2Type=0&SellId=' + itemId + '&SellTab=0&Qty=1&Ppu=' + price;
}

function postEquipment(itemId, marketType, price) {
    const marketString = getEquipmentSellString(itemId, marketType, price);
    console.info('posting item w/packet', marketString);
    sendRequestContentFill(marketString);
}
const EquipmentMarketWidget = React.createClass({
    getInitialState() {return {price: 12000000000};},
    getDefaultProps() {return {itemId: ''};},
    onPriceChange(e) {
        const price = e.target.value;
        this.setState({price});
    },
    updateEquipmentInfo() {
        const {query, name, marketType} = getEquipmentType();
        const price = this.state.price;
        postEquipment(currentItemId, marketType, price);
    },
    render() {
        return (
            <div>
                <input id='equipmentMarketPriceInput' type='text' value={this.state.price} onChange={this.onPriceChange} />
                <br />
                <a href="#" onClick={this.updateEquipmentInfo}>Post for {this.state.price}</a>
            </div>
        );
    }
});

export function parseCurrentItem(datum) {
    const arr = datum.split('|');
    if (arr[0] != 'LOADPAGE') {return;}

    const result = arr[1].match(itemIdPattern);
    if(result) {
        currentItemId = result[1];
        const slotParent = $("div[onclick]").parent();

        hasMiden = $("div:contains('All Stats')").length > 0;

        forgeTarget = 1 + _.find(currentForgeSlots, function(val) {
            const cur = $(slotParent .children().filter('div')[val]);
            return cur.css('background-image') != 'none';
        });
        // use currentForgeSlots since those are what we'll use here
        enchantTarget = 1 + _.find(currentForgeSlots, function(val) {
            const cur = $(slotParent .children().filter('div')[val]);
            return (cur.css('background-image') == ''|| cur.css('background-image') == 'none') && cur.children().length == 0;
        });
        console.debug('allstat', hasMiden, 'item ', currentItemId, 'slot ', forgeTarget, 'e-slot', enchantTarget);
    }
}
