import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

const searchBoxId = 'inventorySearch';
const searchBoxSelector = '#' + searchBoxId;
const sellPageCheckString = 'Select an item to customize';

let valuesUpdated = () => {};

const SearchBox = React.createClass({
    getDefaultProps() {return {inputId: searchBoxId, itemData: {}};},
    setAutocomplete() {
        $(searchBoxSelector).autocomplete({
            source: this.props.itemData,
            select: function(event, ui) {
                if(ui && ui.item && ui.item.value) sendRequestContentFill('getCustomize.aspx?id=' + ui.item.value + '&null=');
            }
        });
    },
    componentDidMount: function() {
        this.setAutocomplete();
    },
    componentDidUpdate() {
        this.setAutocomplete();
    },
    componentWillUnmount: function() {
        $(searchBoxSelector).autocomplete('destroy');
    },
    render() {
        return (<input id={this.props.inputId} type='text' placeholder='Item Name Here' />);
    }
});

export const SearchContainer = React.createClass({
    getInitialState() {return {itemData: {}};},
    componentWillMount() {
        valuesUpdated = (itemData) => {
            this.setState({itemData: itemData});
        }
    },
    render() {
        return (<SearchBox itemData={this.state.itemData} />);
    }
});

export function parseItemData(datum) {
    const arr = datum.split('|');
    if (arr[0] != 'LOADPAGE') {return;}
    if (arr[1].indexOf(sellPageCheckString) < 0) {return;}

    // parse valid items
    const raw = $(arr[1]);
    const itemData = {};
    raw.find('option').each(function(idx, item) {
        if(item.value == '0') return;
        itemData[item.value] = {label: item.innerText, value: item.value};
    });

    // update with new data
    valuesUpdated(_.values(itemData));
}
