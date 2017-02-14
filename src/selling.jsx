import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

const sellPageCheckString = 'Select an item to customize';

const enchantedCutoff = 10;
const sellTier11 = ['Demon', 'Planeswalker'];
const sellTier12 = ['Prophecy', 'Deva', 'Oracle'];
const sellTier14 = ['Phoenix', 'Deicide', 'Eternal Flame', 'Ethernal'];
const sellWords = _.concat(sellTier11, sellTier12, sellTier14);

const itemTierPattern = /^(\w+) [\w ]+/;
const itemEnchantPattern = /\[(\d+)\]/;

let valuesUpdated = () => {};
let sellValues = {};

export function getBulkSellAnchor() {
    return <a className="ui-button ui-widget ui-corner-all" href="#" onClick={sellBulkT14}>Bulk T14</a>;
}

const SalesSellItemLinks = () => {
    return (
        <div>
            <a className="ui-button ui-widget ui-corner-all" href="#" onClick={sellCheapItem}>Sell Item</a>
            <br/>
            {getBulkSellLink()}
        </div>
    );
};
const SalesCurrentItem = ({itemName}) => {
    return (<div>Next Item: {itemName||'None'}</div>);
};
export const SalesContainer = React.createClass({
    getInitialState() {return {sellValues: {}};},
    componentWillMount() {
        valuesUpdated = () => {
            this.setState({sellValues: sellValues});
        }
    },
    render() {
        let val = _.head(_.values(this.state.sellValues));
        let name = val ? val.innerText : null;

        return (<div>
            <SalesCurrentItem itemName={name} />
            <SalesSellItemLinks />
        </div>);
    }
});

function sellBulkT14() {
    sendRequestContentFill('getCustomize.aspx?bulk=1&bulks=14&confirmbs=1&null=');
}

function sellCheapItem() {
    if(_.values(sellValues).length == 0) return;

    const item = _.values(sellValues)[0];
    // sell the item
    sendRequestContentFill('getCustomize.aspx?id=' + item.value + '&action=sell&null=');

    // remove the item from the dict
    _.unset(sellValues, item.value);
    valuesUpdated();
}

function keepItem(itemName) {
    // check for empty/failed names & "keep" them
    const tierMatch = itemName.match(itemTierPattern);
    if(!tierMatch) return true;
    // whitelist master/elite items
    const craftTier = tierMatch[1];
    if(craftTier === 'Master' || craftTier === 'Elite') return true;

    // whitelist heavily-enchanted items
    let enchantTier = itemName.match(itemEnchantPattern);
    if(enchantTier) {
        enchantTier = parseInt(enchantTier[1]);
        return enchantTier >= enchantedCutoff;
    } else return false;
}

export function parseSellData(datum) {
    const arr = datum.split('|');
    if (arr[0] != 'LOADPAGE') {return;}
    if (arr[1].indexOf(sellPageCheckString) < 0) {return;}

    let raw = $(arr[1]);
    sellValues = {};

    raw.find('option').each(function(idx, item) {
        if(item.value == '0' || sellValues[item.value]) return;
        const itemName = item.innerText;

        const sellFlag = _.some(sellWords, function(sellWord) {
            if(keepItem(itemName)) return false;
            return item.innerText.indexOf(sellWord) >= 0;
        });
        if(sellFlag) sellValues[item.value] = item;
    });

    valuesUpdated();
}
