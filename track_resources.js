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
var outputTaxes = true;
var outputTiers = true;
var outputQuests = true;
var outputScouting = true;
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
		return;
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
function updateOutput(results, msg) {
	var outputArgs = [];
	if(outputTiers) {
		outputArgs = outputArgs.concat([
			't1:', (100*tsResults[1]/tsResults.actions).toFixed(2),
			't2:', (100*tsResults[2]/tsResults.actions).toFixed(2),
			't3:', (100*tsResults[3]/tsResults.actions).toFixed(2),
			't4:', (100*tsResults[4]/tsResults.actions).toFixed(2),
			't5:', (100*tsResults[5]/tsResults.actions).toFixed(2)]);
	}
	outputArgs = outputArgs.concat(['item:', (100*tsResults.items/tsResults.actions).toFixed(2)]);
	if(outputScouting)
		outputArgs = outputArgs.concat([
			'regularItem:', (100*tsResults.regularItems/tsResults.actions).toFixed(2),
			'scoutItem:', (100*tsResults.scoutingItems/tsResults.actions).toFixed(2)]);
	if(outputQuests)
		outputArgs = outputArgs.concat(['quest:', (100*tsResults.questItems/tsResults.questActions).toFixed(2)]);
	if(outputTaxes)
		outputArgs = outputArgs.concat(['tax:', (100*tsResults.taxedActions/tsResults.actions).toFixed(2)]);

	outputArgs = outputArgs.concat([
		'actions:', tsResults.actions,
		'\tmsg:', msg]);

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
