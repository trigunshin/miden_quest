// ==UserScript==
// @name MQO Resource Tracker
// @namespace https://github.com/trigunshin/miden_quest
// @description MQO resource tracker; need to run clearTSResults() to reset tile% after moving
// @homepage https://trigunshin.github.com/miden_quest
// @version 1
// @downloadURL http://trigunshin.github.io/miden_quest/track_resources.js
// @updateURL http://trigunshin.github.io/miden_quest/track_resources.js
// @include http://midenquest.com/Game.aspx
// @include http://www.midenquest.com/Game.aspx
// @include https://www.midenquest.com/Game.aspx
// ==/UserScript==

/*
INSTRUCTIONS
Copy/paste this whole section into console & hit enter. It should track gather rates (%) for Gathering, Fishing,
Mining and Woodcutting. It will print the results after every gather; please note that this will never give
exact values, and you should probably wait for 300-500+ attempts on a tile to draw conclusions.

To reset the values (necessary if you move tiles) you can copy/paste the whole script again or just enter
this into the console:  "clearTSResults();".

This *should* be compatible with Ryalane's script if Ryalane's script loads first.
TODO:
	total amount of resources gained
	taxes
//*/
// preferences; data is still tracked, this only affects output
var outputItems = true;
var outputTaxes = true;
var outputTiers = true;
var outputQuests = true;
var outputScouting = true;
var printItemDrops = true;
var outputToConsole = false;
var saveLogText = false;

var logText = [];
var questItemRegex = /(\d+) \/ (\d+)/;
var resourceListId = 'resourceLogList';
// results aren't stored under the resource because we aren't tracking tile changes/types
var tsResults = {
	actions: 0,
	taxedActions: 0,
	items: 0,
	regularItems: 0,
	scoutingItems: 0,
	questActive: false,
	questActions: 0,
	questItems: 0,
	1: 0,
	2: 0,
	3: 0,
	4: 0,
	5: 0,
	lumber:{
		items: ['Pine', 'Oak', 'Maple', 'Ironwood', 'Yggdrasil']
	},
	ore: {
		items: ['Iron', 'Silver', 'Obsidian', 'Mythril', 'Ethernium']
	},
	plant: {
		items: ['Plant Stem', 'Cotton', 'Living Leather', 'Silver Vine', 'Nimbus Fruit']
	},
	fish: {
		items: ['Tuna', 'Salmon', 'Flyfish', 'Marlin', 'Dragonfish']
	},
	itemInfo: {
		equipDrop: 0,
		resourceBagDrop: 0,
		keyDrop: 0,
		magicElementsDrop: 0,
		magicElementsTotal: 0,
		goldDrop: 0,
		goldTotal: 0,
		gemDrop: 0,
		relicDrop: 0,
		relicTotal: 0
	}
};
function clearTSResults() {
	tsResults.actions = 0;
	tsResults.items = 0;
	tsResults.regularItems = 0;
	tsResults.scoutingItems = 0;
	tsResults.questActive = false;
	tsResults.questActions = 0;
	tsResults.questItems = 0;
	tsResults.taxedActions = 0;
	tsResults.itemInfo = {
		equipDrop: 0,
		resourceBagDrop: 0,
		keyDrop: 0,
		magicElementsDrop: 0,
		magicElementsTotal: 0,
		goldDrop: 0,
		goldTotal: 0,
		gemDrop: 0,
		relicDrop: 0,
		relicTotal: 0
	};

	for(var i=1, iLen=6; i<iLen;i++) {
		tsResults[i] = 0;
	}
}
function handleQuestItem(msg) {
	var matches = msg.match(questItemRegex);
	var current = parseInt(matches[1]);
	var total = parseInt(matches[2]);

	if(current == total) {
		// this message is sent after the channel2 message, so we won't lose an action here
		tsResults.questActive = false;
	} else {
		tsResults.questActive = true;
		tsResults.questItems += 1;
	}
}
function handleItemDrop(msg) {
	if(printItemDrops) console.info(Date(), msg);

	// TODO better method than this?
	if(msg.indexOf('a resource bag') >= 0) tsResults.itemInfo.resourceBagDrop += 1;
	else if(msg.indexOf('a key') >= 0) tsResults.itemInfo.keyDrop += 1;
	else if(msg.indexOf('a gem') >= 0) tsResults.itemInfo.gemDrop += 1;

	// these will eventually be broken out by tier as well
	else if(msg.indexOf('Found Broken') >= 0) tsResults.itemInfo.equipDrop += 1;
	else if(msg.indexOf('Found Basic') >= 0) tsResults.itemInfo.equipDrop += 1;
	else if(msg.indexOf('Found Fine') >= 0) tsResults.itemInfo.equipDrop += 1;
	else if(msg.indexOf('Found Elite') >= 0) tsResults.itemInfo.equipDrop += 1;
	else if(msg.indexOf('Found Master') >= 0) tsResults.itemInfo.equipDrop += 1;
	// equips else if(msg.indexOf('a key') >= 0) tsResults.itemInfo.keyDrop += 1;
	else if(msg.indexOf('a relic') >= 0) {
		tsResults.itemInfo.relicDrop += 1;
		tsResults.itemInfo.relicTotal += 1;
	} else if(msg.indexOf('relics') >= 0) {
		var count = parseInt(msg.match(/(\d)+/)[0]);
		tsResults.itemInfo.relicDrop += 1;
		tsResults.itemInfo.relicTotal += count;
	} else if(msg.indexOf('gold coins') >= 0) {
		var count = parseInt(msg.match(/(\d)+/)[0]);
		tsResults.itemInfo.goldDrop += 1;
		tsResults.itemInfo.goldTotal += count;
	} else if(msg.indexOf('magic elements') >= 0) {
		var count = parseInt(msg.match(/(\d)+/)[0]);
		tsResults.itemInfo.magicElementsDrop += 1;
		tsResults.itemInfo.magicElementsTotal += count;
	}
}
function parseTSLog(datum) {
	var arr = datum.split('|');
	if (arr[0] != 'NLOG') {return;}

	var channel = arr[1];
	var msg = arr[2];

	// save all lines of text if requested
	if(saveLogText) {
		logText.push(msg);
	}

	// track relic, item, gem, gold drops
	if(channel == 3) {
		// track quest drops separately
		if(msg.indexOf('quest') > 0) return handleQuestItem(msg);
		// scouting vs normal
		if(msg.indexOf('*') > -1) tsResults.scoutingItems += 1;
		else tsResults.regularItems += 1;

		// track the total in addition to ts/scout
		tsResults.items += 1;
		return handleItemDrop(msg);
	} else if(channel == 2) {
		// skip level up message before counting the action
		if(msg.indexOf('gained a new tradeskill level') > -1) return;

		tsResults.actions += 1;
		if(tsResults.questActive) tsResults.questActions += 1;
		if(msg.indexOf('to taxes') > -1) tsResults.taxedActions += 1;

		// which array should be used?
		var itemTypes = null;
		if(msg.indexOf('You cut') >= 0) {
			itemTypes = tsResults.lumber.items;
		} else if(msg.indexOf('You mined') >= 0) {
			itemTypes = tsResults.ore.items;
		} else if(msg.indexOf('You gathered') >= 0) {
			itemTypes = tsResults.plant.items;
		} else if(msg.indexOf('You caught') >= 0) {
			itemTypes = tsResults.fish.items;
		} else {
			itemTypes = [];
		}

		for(var i=0,iLen=itemTypes.length;i<iLen;i++) {
			if(msg.indexOf(itemTypes[i]) >= 0) {
				tsResults[i+1] += 1;
			}
		}

		updateOutput(tsResults, msg);
	}
}
function addTierInfo(tsResults, outputArgs) {
	return outputArgs.concat([
		't1%:', (100*tsResults[1]/tsResults.actions).toFixed(2),
		't2%:', (100*tsResults[2]/tsResults.actions).toFixed(2),
		't3%:', (100*tsResults[3]/tsResults.actions).toFixed(2),
		't4%:', (100*tsResults[4]/tsResults.actions).toFixed(2),
		't5%:', (100*tsResults[5]/tsResults.actions).toFixed(2)],
		'&nbsp;', '&nbsp;');
}
function addScoutingInfo(tsResults, outputArgs) {
	return outputArgs.concat([
		'regularItem%:', (100*tsResults.regularItems/tsResults.actions).toFixed(2),
		'scoutItem%:', (100*tsResults.scoutingItems/tsResults.actions).toFixed(2)]);
}
function addItemOutput(tsResults, outputArgs) {
	return outputArgs.concat([
		'&nbsp;', '&nbsp;',
		'equip%:', (100*tsResults.itemInfo.equipDrop/tsResults.actions).toFixed(4),
		'res. bag%:', (100*tsResults.itemInfo.resourceBagDrop/tsResults.actions).toFixed(4),
		'key%:', (100*tsResults.itemInfo.keyDrop/tsResults.actions).toFixed(4),
		'gem%:', (100*tsResults.itemInfo.gemDrop/tsResults.actions).toFixed(4),
		'ME%:', (100*tsResults.itemInfo.magicElementsDrop/tsResults.actions).toFixed(4),
		'gold%:', (100*tsResults.itemInfo.goldDrop/tsResults.actions).toFixed(4),
		'relic%:', (100*tsResults.itemInfo.relicDrop/tsResults.actions).toFixed(4),

		'&nbsp;', '&nbsp;',
		'avg ME:', (tsResults.itemInfo.magicElementsTotal/tsResults.itemInfo.magicElementsDrop).toFixed(2),
		'avg Gold:', (tsResults.itemInfo.goldTotal/tsResults.itemInfo.goldDrop).toFixed(2),
		'avg Relics:', (tsResults.itemInfo.relicTotal/tsResults.itemInfo.relicDrop).toFixed(2),

		'&nbsp;', '&nbsp;',
		'Total ME:', tsResults.itemInfo.magicElementsTotal,
		'Total Gold:', tsResults.itemInfo.goldTotal,
		'Total Relics:', tsResults.itemInfo.relicTotal,
		'&nbsp;', '&nbsp;']);
}
function updateOutput(results, msg) {
	var outputArgs = ['actions:', tsResults.actions, '&nbsp;', '&nbsp;'];
	if(outputTiers) outputArgs = addTierInfo(tsResults, outputArgs);
	outputArgs = outputArgs.concat(['item%:', (100*tsResults.items/tsResults.actions).toFixed(2)]);
	if(outputScouting) outputArgs = addScoutingInfo(tsResults, outputArgs);
	if(outputItems) outputArgs = addItemOutput(tsResults, outputArgs);
	if(outputQuests)
		outputArgs = outputArgs.concat(['quest%:', (100*tsResults.questItems/tsResults.questActions).toFixed(2)]);
	if(outputTaxes)
		outputArgs = outputArgs.concat(['tax%:', (100*tsResults.taxedActions/tsResults.actions).toFixed(2)]);

	outputArgs = outputArgs.concat(['\tmsg:', msg]);

	if(outputToConsole) console.info.apply(console, outputArgs);

	// skip posting the message to the UI
	outputArgs.pop();
	outputArgs.pop();
	updateUI(outputArgs);
}
function formatResource(label, value) {
	return '<li><div>' + label + ' ' + value + '</div></li>';
}
function updateUI(outputArgs) {
	$('#'+resourceListId).empty();
	for(var i=0,iLen=outputArgs.length;i<iLen;i+=2) {
		$('#'+resourceListId).append(formatResource(outputArgs[i], outputArgs[i+1]));
	}
}
function initializeUI() {
	jQuery('<div/>', {
		id: 'resourceLogContainer',
		text: 'Resource Log',
		style: 'float: right;'
	}).prependTo('body');
	jQuery('<ul/>', {
		id: resourceListId,
	}).appendTo('div#resourceLogContainer');
}
function track_resources_onmsg(evt) {
	track_resources_original_msg(evt);
	parseTSLog(evt.data);
}
// set up handler & hook original game handler in
if(typeof track_resources_original_msg === 'undefined') {
	console.info('resource tracker not yet loaded, loading...');
	var track_resources_original_msg = ws.onmessage;
	ws.onmessage=track_resources_onmsg;
	initializeUI();
} else {
	ws.onmessage=track_resources_onmsg;
}
