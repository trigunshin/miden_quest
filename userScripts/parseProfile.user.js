// ==UserScript==
// @name MQO Profile Parser
// @namespace https://github.com/trigunshin/miden_quest
// @description MQO profile parser. Currently prints TS attempts and title+username to console
// @homepage https://trigunshin.github.com/miden_quest
// @version 6
// @downloadURL http://trigunshin.github.io/miden_quest/userScripts/parseProfile.user.js
// @updateURL http://trigunshin.github.io/miden_quest/userScripts/parseProfile.user.js
// @include http://midenquest.com/Game.aspx
// @include http://www.midenquest.com/Game.aspx
// @include https://www.midenquest.com/Game.aspx
// @grant GM_log
// ==/UserScript==
var postToURL = true;
var marketPostURL = 'https://midenquest.info/players/';
var titles = ["Leafy", "Harvester", "Harvest Soul","Wanderer","Talkative","Voluble","Mouthy","Crafter","Enchanter","Catcher","Clear-Minded","Sharky","Super-Reeler","Sailor","Salmon League","Flyfish League","Picker","Herbalist","Shaman","Witch","Alchemist","Green Thumb","Plant Whisperer","Nimbus Picker","Lucky","Charmed","Fortunate","Blessed","Serendipity","Successful","Combatant","Gladiator","Brave","Mercenary","Digger","Dirty","Mountainman","Dwarfy","Iron-Veined","Silver-Veined","Obsidian-Veined","Mythril-Veined","Quester","Examiner","Inquirer","Town Hero","Accomplished","Boyscout","Snooper","Swifty","Light-Footed","Headhunter","Prospector","Inspector","Spy","Master Scout","Part-Timer","Employee","Seller","Entrepreneur","Businessman","Mogul","Tycoon","Magnate","Market Manipulator","Strong","Tough","Vigorous","Zealous","Fervent","Hobbyist","Packrat","Hoarder","Collector","Winner","Workhorse","Busy bee","Pro","Dedicated","Focused","Idler","Insane","Crazed","Obessed","Traveler","Explorer","Adventurer","Seeker","Nomad","Discoverer","Globetrotter","Seen-It-All","Cutter","Logger","Forestman","Nature's Foe","Pine Arm","Oak Arm","Maple Arm","Rescuer","Savior","Practitioner","Workaholic","Runaway Princess","Maniac", "Fishmonger", "Molten Lord", "Heatstroked", "Sun Champion", "Dragon League", "Diamond Skin", "Obsessed", "Forest Mover", "Earth's Avatar", "Cave Dweller"];

function getTSAttempts(data) {
	var tsDiv = $(data).find("div:contains('tradeskill attempts')");
	var tsNode = tsDiv[tsDiv.length-1];
	var tsNodeParent = tsNode.parentElement;
	var tsSiblings = tsNodeParent.childNodes;
	var tsAttemptNode = tsSiblings[3];
	var tsAttempts = tsAttemptNode.innerText.replace(/ /g, '');
	return tsAttempts;
}
function stripTitle(titledName) {
	for(var i=0,iLen=titles.length;i<iLen;i++) {
		if(titledName.startsWith(titles[i])) {
			return titledName.replace(titles[i], '').trim();
		}
	}
	return null;
}
function getName(data) {
	var barDiv = $("div.CrumbBar")[0];
	var parent = barDiv.parentElement;
	var barParentChildren = parent.childNodes;
	// from top level down to target child
	// order is div,script,div plus some misc text in between
	var profileContentChild = barParentChildren[4];
	// now we want first children of next 3 nodes to hit the title div
	var titleDiv = profileContentChild.childNodes[1].childNodes[1].childNodes[1];
	return stripTitle(titleDiv.innerText);
}
function postData(name, tsAttempts) {
	var postData = {
		user: {'username': name.toLowerCase()},
		profile: {'actions': tsAttempts}
	};
	var request = $.ajax({
		url: marketPostURL,
		type: 'post',
		dataType: "json",
		contentType: 'application/json',
		data: JSON.stringify(postData)
	});
}
function parseProfile(data) {
	var arr = data.split('|');
	if (arr[0] != 'LOADPAGE') return;
	var msg = arr[1];
	// technically done twice, here & in getTSAttempts
	var profilePageTest = $(data).find("div:contains('tradeskill attempts')");
	if(profilePageTest.length <= 0) return;

	try {
		var tsAttempts = getTSAttempts(msg);
		var name = getName(msg);
		if(tsAttempts > 0 && name != null) {
			console.info(tsAttempts, 'attempts by', name);
			if(postToURL) {
				postData(name, tsAttempts);
			}
		} else {
			console.info('problem parsing. name:', name, 'tsAttempts:', tsAttempts);
		}
	} catch(err) {
		console.info('error occurred; page layout was updated, profile validation is off, or something else');
	}
}

function listen_profile_msg(evt) {
	listen_profile_original_msg(evt);
	parseProfile(evt.data);
}
// set up handler & hook original game handler in
if(typeof listen_profile_original_msg === 'undefined') {
	console.info('listen_profile_original_msg not yet loaded, loading...');
	var listen_profile_original_msg = ws.onmessage;
	ws.onmessage=listen_profile_msg;
} else {
	ws.onmessage=listen_profile_msg;
}
