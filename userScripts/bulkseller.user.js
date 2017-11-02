// ==UserScript==
// @name MQO Bulk Equipment Helper
// @namespace https://github.com/trigunshin/miden_quest
// @description MQO equipment bulk helper; saves clicks bulkselling <= t14
// @homepage https://trigunshin.github.com/miden_quest
// @version 1
// @downloadURL http://trigunshin.github.io/miden_quest/userScripts/bulkseller.user.js
// @updateURL http://trigunshin.github.io/miden_quest/userScripts/bulkseller.user.js
// @include http://midenquest.com/Game.aspx
// @include http://www.midenquest.com/Game.aspx
// @include https://www.midenquest.com/Game.aspx
// ==/UserScript==

// sendRequestContentFill('getCustomize.aspx?bulk=1&bulks=14&bulkq=4&bulke=1&confirmbs=1&null=');
let bulkCheckRegex = /\d+ out of (\d+) items of/;

function bulkItemData(datum) {
	var arr = datum.split('|');
    if (arr[0] != 'LOADPAGE') {return;}
    if(arr[1].indexOf("Items about to get sold") >= 0 && arr[1].indexOf("Bulk Selling" >= 0)) {
    	let match = arr[1].match(bulkCheckRegex);
    	if(match.length > 0 && parseInt(match[1], 10) > 0) {
    		sendRequestContentFill('getCustomize.aspx?bulk=1&bulks=14&bulkq=4&bulke=1&confirmbs=1&null=');
    	}
    }
}

function bulk_items_onmsg(evt) {
    bulk_items_original_msg(evt);
    bulkItemData(evt.data);
}

if(typeof bulk_items_original_msg === 'undefined') {
    console.info('bulk helper not yet loaded, loading...');
    bulk_items_original_msg = ws.onmessage;
    ws.onmessage=bulk_items_onmsg;
} else {
    ws.onmessage=bulk_items_onmsg;
}
