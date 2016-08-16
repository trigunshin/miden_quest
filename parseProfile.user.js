// ==UserScript==
// @name MQO Profile Parser
// @namespace https://github.com/trigunshin/miden_quest
// @description MQO profile parser. Currently prints TS attempts and title+username to console
// @homepage https://trigunshin.github.com/miden_quest
// @version 2
// @downloadURL http://trigunshin.github.io/miden_quest/parseProfile.user.js
// @updateURL http://trigunshin.github.io/miden_quest/parseProfile.user.js
// @include http://midenquest.com/Game.aspx
// @include http://www.midenquest.com/Game.aspx
// @include https://www.midenquest.com/Game.aspx
// @grant GM_log
// ==/UserScript==
function getTSAttempts(data) {
	var tmp = $(data).find("div:contains('tradeskill attempts')");
	if(tmp.length === 0) return -1;

	var tsDiv = tmp;
	var tsNode = tsDiv[tsDiv.length-1];
	var tsNodeParent = tsNode.parentElement;
	var tsSiblings = tsNodeParent.childNodes;
	var tsAttemptNode = tsSiblings[3];
	var tsAttempts = tsAttemptNode.innerText.replace(/ /g, '');
	return tsAttempts;
}
function getName(data) {
	var barDiv = $("div.CrumbBar")[0];
	var parent = barDiv.parentElement;
	var barParentChildren = parent.childNodes;
	// from top level down to target child
	// order is div,script,div plus some misc text in between
	var profileContentChild = barParentChildren[4];
	// now we want first children of next 3 nodes to hit the title div
	var titleDiv = profileContentChild.childNodes[1].childNodes[1].childNodes[1]
	return titleDiv.innerText;
}
function parseProfile(data) {
	var arr = data.split('|');
	if (arr[0] != 'LOADPAGE') return;
	var msg = arr[1];

	var tsAttempts = getTSAttempts(msg);
	var name = getName(msg);

	console.info(tsAttempts, 'attempts by', name);
}

function listen_profile_msg(evt) {
	listen_profile_original_msg(evt);
	parseProfile(evt.data);
}
// set up handler & hook original game handler in
if(typeof listen_profile_original_msg === 'undefined') {
	console.info('TS attempt parser not yet loaded, loading...');
	var listen_profile_original_msg = ws.onmessage;
	ws.onmessage=listen_profile_msg;
} else {
	ws.onmessage=listen_profile_msg;
}
