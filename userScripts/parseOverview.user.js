// ==UserScript==
// @name MQO Market Overview Parser
// @namespace https://github.com/trigunshin/miden_quest
// @description MQO market overview parser. Sends data to server.
// @homepage https://trigunshin.github.com/miden_quest
// @version 2
// @downloadURL http://trigunshin.github.io/miden_quest/userScripts/parseProfile.user.js
// @updateURL http://trigunshin.github.io/miden_quest/userScripts/parseProfile.user.js
// @include http://midenquest.com/Game.aspx
// @include http://www.midenquest.com/Game.aspx
// @include https://www.midenquest.com/Game.aspx
// @grant GM_log
// ==/UserScript==
var resource_data_ids = {
	'orb': '6',
	'scroll': '7',
	'me': '3',
	'relic': '4',
	'gem': '5',
	'wood': '3',
	'fish': '4',
	'plant': '2',
	'ore': '1'
};
var resource_id_prefix = 'div#ShortcutRes';
var simple_keys = ['orb', 'scroll', 'me', 'relic', 'gem'];
var deep_keys = ['wood', 'fish', 'plant', 'ore'];
var tiers = ['1','2','3','4','5'];
var aws_endpoint = 'http://midenquest.info/market/';

function sendDataUpdate(data) {
	$.ajax({
        url: aws_endpoint,
        type: 'POST',
        processData: false,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        success: ()=>{console.info('sent data');},
        error: ()=>{console.info('error sending data');}
    });
}
function parseKey(key) {
	var value = $(key)[0].innerText;
	if(value.indexOf(' ') > 0) {
		var arr = value.split(' ');
		value = parseFloat(arr[0]);
		
		if(arr[1].indexOf('b') >= 0) value *= 1000000000;
		if(arr[1].indexOf('m') >= 0) value *= 1000000;
		if(arr[1].indexOf('k') >= 0) value *= 1000;
	}
	return value;
}

function parseOverview(data) {
	var arr = data.split('|');
	if (arr[0] != 'LOADPAGE') return;
	var msg = arr[1];
	// technically done twice, here & in getTSAttempts
	var overviewPageTest = $('div#ShortcutRes1_1');
	if(overviewPageTest.length <= 0) return;

	var post_data = {};
	// parse simple keys
	for(var i=0,iLen=simple_keys.length;i<iLen;i++) {
		var res_key = simple_keys[i];
		var res_suffix = resource_data_ids[res_key];
		var res_id = resource_id_prefix + res_suffix;
		post_data[res_key] = parseKey(res_id);
	}
	// parse resource tier keys
	for(var i=0,iLen=deep_keys.length;i<iLen;i++) {
		var res_key = deep_keys[i];
		post_data[res_key] = {};

		for(var j=1,jLen=6;j<jLen;j++) {
			var res_suffix = resource_data_ids[res_key] + '_' + j;
			var res_id = resource_id_prefix + res_suffix;

			post_data[res_key]['t'+j] = parseKey(res_id);
		}
	}

	console.info(post_data);
	sendDataUpdate(post_data);
}
function listen_market_overview_msg(evt) {
	listen_market_overview_original_msg(evt);
	parseOverview(evt.data);
}
// set up handler & hook original game handler in
if(typeof listen_market_overview_original_msg === 'undefined') {
	console.info('TS attempt parser not yet loaded, loading...');
	var listen_market_overview_original_msg = ws.onmessage;
	ws.onmessage=listen_market_overview_msg;
} else {
	ws.onmessage=listen_market_overview_msg;
}
