// ==UserScript==
// @name MQO Inventory Search
// @namespace https://github.com/trigunshin/miden_quest
// @description MQO inventory searcher
// @homepage https://trigunshin.github.com/miden_quest
// @version 1
// @downloadURL http://trigunshin.github.io/miden_quest/searchBox.user.js
// @updateURL http://trigunshin.github.io/miden_quest/searchBox.user.js
// @include http://midenquest.com/Game.aspx
// @include http://www.midenquest.com/Game.aspx
// @include https://www.midenquest.com/Game.aspx
// ==/UserScript==
(function () {
    var scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.src = "https://code.jquery.com/ui/1.11.4/jquery-ui.js";
    document.body.appendChild(scriptElement);

    scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.src = "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.11.1/lodash.min.js";
    document.body.appendChild(scriptElement);
})();

const searchBoxId = 'inventorySearch';
const searchBoxSelector = '#' + searchBoxId;
const sellPageCheckString = 'Select an item to customize';

function parseItemData(datum) {
    var arr = datum.split('|');
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
    $(searchBoxSelector).autocomplete( "option", "source", _.values(itemData));
}
function initSearchUI(target) {
    let searchBox = $(searchBoxSelector);
    if(searchBox.length > 0) return;

    searchBox = jQuery('<input/>', {
        id: searchBoxId,
        type: 'text',
        placeholder: 'search term here'
    });
    searchBox.autocomplete({
        source: [],
        select: function(event, ui) {
            if(ui && ui.item && ui.item.value) sendRequestContentFill('getCustomize.aspx?id=' + ui.item.value + '&null=');
        }
    });
    $(target).append(searchBox);
}

// initialize UI
function initSearchBox() {
    let ctr = $('#inventoryContainer');
    if(ctr.length == 0) {
        ctr = jQuery('<div/>', {
            id: 'inventoryContainer',
            text: '',
            style: 'float: left;'
        });
        ctr.prependTo('body');
    }
    initSearchUI(ctr);
}
function track_inventory_onmsg(evt) {
    track_inventory_original_msg(evt);
    parseItemData(evt.data);
}
// set up handler & hook original game handler in
if(typeof track_inventory_original_msg === 'undefined') {
    console.info('searchbox not yet loaded, loading...');
    var track_inventory_original_msg = ws.onmessage;
    ws.onmessage=track_inventory_onmsg;
} else {
    ws.onmessage=track_inventory_onmsg;
}
initSearchBox();
