// ==UserScript==
// @name MQO Resource Tracker
// @namespace https://github.com/trigunshin/miden_quest
// @description MQO resource tracker; need to run clearTSResults() to reset tile% after moving
// @homepage https://trigunshin.github.com/miden_quest
// @version 26
// @downloadURL http://trigunshin.github.io/miden_quest/trackResources.user.js
// @updateURL http://trigunshin.github.io/miden_quest/trackResources.user.js
// @include http://midenquest.com/Game.aspx
// @include http://www.midenquest.com/Game.aspx
// @include https://www.midenquest.com/Game.aspx
// @grant GM_log
// ==/UserScript==

/*
INSTRUCTIONS
Copy/paste the entire script into console & hit enter. It should track gather rates (%) for Gathering, Fishing,
Mining and Woodcutting. It will update the results after every gather; please note that this will never give
exact values, and you should probably wait for 500-1000+ attempts on a tile to draw conclusions.

To reset the values (necessary if you move tiles) you can copy/paste the whole script again or just enter
this into the console:  "clearTSResults();". For tampermonkey this will require the "Tampermonkey" frame
option instead of the "Top" frame option at the top-left part of the console.

This *should* be compatible with Ryalane's script if Ryalane's script loads first.

TODO
	fix data_reset in tampermonkey?
//*/
// preferences; data is still tracked, this only affects output
var outputItems = true;
var outputTaxes = true;
var outputTiers = true;
var outputQuests = true;
var outputPerks = true;
var printItemDrops = true;
var outputToConsole = false;
var saveLogText = false;

var logText = [];
var tsXPRegex = /(\d+) skill exp/;
var questItemRegex = /(\d+) \/ (\d+)/;
var itemDropCountRegex = /^\[.+\] Found (\d+)/;
var scoutRelicRegex = / (\d+) relics/;
var resourceListId = 'resourceLogList';

var normalAverageMultiplier = 60/5*60;
var quadAverageMultiplier = 60/3*60*4;
// results aren't stored under the resource because we aren't tracking tile changes/types
var tsResults = {
	actions: 0,
	xp: 0,
	taxedActions: 0,
	items: 0,
	questActive: false,
	questActions: 0,
	questItems: 0,
    1: {drop: 0, total: 0, gained: 0, taxed: 0},
    2: {drop: 0, total: 0, gained: 0, taxed: 0},
    3: {drop: 0, total: 0, gained: 0, taxed: 0},
    4: {drop: 0, total: 0, gained: 0, taxed: 0},
    5: {drop: 0, total: 0, gained: 0, taxed: 0},
	lumber:{
		items: ['Pine', 'Oak', 'Maple', 'Ironwood', 'Yggdrasil'],
		tracker: [/(\d+) Pine/, /(\d+) Oak/, /(\d+) Maple/, /(\d+) Ironwood/, /(\d+) Yggdrasil/]
	},
	ore: {
		items: ['Iron', 'Silver', 'Obsidian', 'Mythril', 'Ethernium'],
		tracker: [/(\d+) Iron/, /(\d+) Silver/, /(\d+) Obsidian/, /(\d+) Mythril/, /(\d+) Ethernium/]
	},
	plant: {
		items: ['Plant Stem', 'Cotton', 'Living Leather', 'Silver Vine', 'Nimbus Fruit'],
		tracker: [/(\d+) Plant Stem/, /(\d+) Cotton/, /(\d+) Living Leather/, /(\d+) Silver Vine/, /(\d+) Nimbus Fruit/]
	},
	fish: {
		items: ['Tuna', 'Salmon', 'Flyfish', 'Marlin', 'Dragonfish'],
		tracker: [/(\d+) Tuna/, /(\d+) Salmon/, /(\d+) Flyfish/, /(\d+) Marlin/, /(\d+) Dragonfish/]
	},
	sales: {
		tracker: /(\d+) gold/,
		total: 0,
		taxed: 0,
		gained: 0
	},
	scouts: {
		tracker: /(\d+) landmark/,
		total: 0,
		taxed: 0,
		gained: 0,
		relicGained: 0,
		relicDouble: 0,
		relicDrop: 0,
		relicTaxedCount: 0,
		relicTaxed: 0
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
		relicTotal: 0,
		relicDouble: 0
	},
	perks: {
	    enraged: 0,
		hoarder: 0,
        drunken: 0,
        // drunken is not currently taxed, but keep this form so we can re-use the same function as the main TS
        1: {drop: 0, total: 0, gained: 0, taxed: 0},
        2: {drop: 0, total: 0, gained: 0, taxed: 0},
        3: {drop: 0, total: 0, gained: 0, taxed: 0},
        4: {drop: 0, total: 0, gained: 0, taxed: 0},
        5: {drop: 0, total: 0, gained: 0, taxed: 0},
        sales: {
            total: 0,
            taxed: 0,
            gained: 0,
            drunken: 0
        },
        scouts: {
            total: 0,
            taxed: 0,
            gained: 0,
            drunken: 0
        }
	}
};
function clearTSResults() {
	console.info('clearing results');
	tsResults.actions = 0;
	tsResults.items = 0;
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
		relicTotal: 0,
		relicDouble: 0
	};
	tsResults.xp = 0;

	tsResults.sales.total = 0;
	tsResults.sales.taxed = 0;
	tsResults.sales.gained = 0;

	tsResults.scouts.total = 0;
	tsResults.scouts.taxed = 0;
	tsResults.scouts.gained = 0;
	tsResults.scouts.relicTaxed = 0;
	tsResults.scouts.relicTaxedCount = 0;
	tsResults.scouts.relicGained = 0;
	tsResults.scouts.relicDouble = 0;
	tsResults.scouts.relicDrop = 0;
	tsResults.perks = {
		enraged: 0,
		hoarder: 0,
		drunken: 0
	};

	for(var i=1, iLen=6; i<iLen;i++) {
		tsResults[i] = {drop: 0, total: 0, gained: 0, taxed: 0};
	}
	updateOutput(tsResults, 'data reset complete');
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
	tsResults.items += 1;
	if(printItemDrops) console.info(Date(), msg);

	// TODO better method than this?
	if(msg.indexOf('a resource bag') >= 0) tsResults.itemInfo.resourceBagDrop += 1;
	else if(msg.indexOf('resource bags') >= 0) tsResults.itemInfo.resourceBagDrop += 1;
	else if(msg.indexOf('resources bag') >= 0) tsResults.itemInfo.resourceBagDrop += 1;
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
		var count = parseInt(msg.match(itemDropCountRegex)[1]);
		tsResults.itemInfo.relicDrop += 1;
		tsResults.itemInfo.relicTotal += count;
	} else if(msg.indexOf('gold coins') >= 0) {
		var count = parseInt(msg.match(itemDropCountRegex)[1]);
		tsResults.itemInfo.goldDrop += 1;
		tsResults.itemInfo.goldTotal += count;
	} else if(msg.indexOf('magic elements') >= 0) {
		var count = parseInt(msg.match(itemDropCountRegex)[1]);
		tsResults.itemInfo.magicElementsDrop += 1;
		tsResults.itemInfo.magicElementsTotal += count;
	}  else if(msg.indexOf('keys') >= 0) tsResults.itemInfo.keyDrop += 1;

	if(msg.indexOf('doubled') > -1) tsResults.itemInfo.relicDouble += 1;
}
function parsePrimaryTS(msg, resourceInfo, tierData, tsKey, wasTaxed) {
	var patterns = resourceInfo[tsKey].tracker;
	var itemTypes = resourceInfo[tsKey].items;
	for(var i=0,iLen=itemTypes.length;i<iLen;i++) {
		if(msg.indexOf(itemTypes[i]) >= 0) {
			tierData[i+1].drop += 1;
			// track total/gained/taxed counts
			var amt = parseInt(msg.match(patterns[i])[1]);
			tierData[i+1].total += amt;
			if(wasTaxed) tierData[i+1].taxed += amt;
			else tierData[i+1].gained += amt;
		}
	}
}
function parseSales(msg, resourceInfo, resourceData, wasTaxed) {
	var goldEarned = parseInt(msg.match(resourceInfo.sales.tracker)[1]);
	resourceData.sales.total += goldEarned;
	if(wasTaxed) resourceData.sales.taxed += goldEarned;
	else resourceData.sales.gained += goldEarned;
}
function parseScouts(msg, resourceInfo, resourceData, wasTaxed) {
	var marksEarned = parseInt(msg.match(resourceInfo.scouts.tracker)[1]);
	resourceData.scouts.total += marksEarned;
	if(wasTaxed) resourceData.scouts.taxed += marksEarned;
	else resourceData.scouts.gained += marksEarned;
}
function parseScoutResourceRelic(msg) {
	var count = parseInt(msg.match(scoutRelicRegex)[1]);
	// not sure if this one occurs, safety first
	if(msg.indexOf('a relic') >= 0) count = 1;
	// relics can be taxed now
	if(msg.indexOf("taxes") >=0)
		tsResults.scouts.relicTaxedCount += count;
	else
		tsResults.scouts.relicGained += count;
	// track the total relic drops for taxes/doubles
	tsResults.scouts.relicDrop += 1;
	if(msg.indexOf('double') >= 0) tsResults.scouts.relicDouble += 1;
	if(msg.indexOf('taxes') >= 0) tsResults.scouts.relicTaxed += 1;
}
function logPerk(perk, msg) {
	tsResults.perks[perk]+= 1;
	if(perk === 'drunken') {
        if(msg.indexOf('sold') >= 0) {
            tsResults.perks.sales.drunken += 1;
            parseSales(msg, tsResults, tsResults.perks, false);
        }
        else if(msg.indexOf('scouted') >= 0) {
            tsResults.perks.scouts.drunken += 1;
            parseScouts(msg, tsResults, tsResults.perks, false);
        }
        else if(msg.indexOf('mined') >= 0) {parsePrimaryTS(msg, tsResults, tsResults.perks, 'ore', false);}
        else if(msg.indexOf('gathered') >= 0) {parsePrimaryTS(msg, tsResults, tsResults.perks, 'plant', false);}
        else if(msg.indexOf('fished') >= 0) {parsePrimaryTS(msg, tsResults, tsResults.perks, 'fish', false);}
        else if(msg.indexOf('cut') >= 0) {parsePrimaryTS(msg, tsResults, tsResults.perks, 'lumber', false);}
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
		return handleItemDrop(msg);
	} else if(channel == 2) {
		// skip level up message before counting the action
		if(msg.indexOf('gained a new tradeskill level') > -1) return;
		// scouting's relic gain is in resource log now
		if(msg.indexOf('relic') > -1) return parseScoutResourceRelic(msg);
		// handle perks; note the data and return as it is not an extra action
		if(msg.indexOf('nraged\' Perk') > -1) return logPerk('enraged', msg);
		if(msg.indexOf('drunkenly') > -1) return logPerk('drunken', msg);
		if(msg.indexOf('Hoarder') > -1) return logPerk('hoarder', msg);

		tsResults.actions += 1;
		if(tsResults.questActive) tsResults.questActions += 1;
		var wasTaxed = msg.indexOf('to taxes') > -1;
		if(wasTaxed) tsResults.taxedActions += 1;

		tsResults.xp += parseInt(msg.match(tsXPRegex)[1]);

		if(msg.indexOf('You cut') >= 0) {
			parsePrimaryTS(msg, tsResults, tsResults, 'lumber', wasTaxed);
		} else if(msg.indexOf('You mined') >= 0) {
			parsePrimaryTS(msg, tsResults, tsResults, 'ore', wasTaxed);
		} else if(msg.indexOf('You gathered') >= 0) {
			parsePrimaryTS(msg, tsResults, tsResults, 'plant', wasTaxed);
		} else if(msg.indexOf('You caught') >= 0) {
			parsePrimaryTS(msg, tsResults, tsResults, 'fish', wasTaxed);
		} else if(msg.indexOf('You earned') >= 0) {
			parseSales(msg, tsResults, tsResults, wasTaxed);
		} else if(msg.indexOf('You scouted') >= 0) {
			// skip the "didn't find any" message
			if(msg.indexOf('find any') < 0) parseScouts(msg, tsResults, tsResults, wasTaxed);
		}

		updateOutput(tsResults, msg);
	}
}
function addTierInfo(tsResults, outputArgs) {
	return outputArgs.concat([
		't1%:', (100*tsResults[1].drop/tsResults.actions).toFixed(2),
		't2%:', (100*tsResults[2].drop/tsResults.actions).toFixed(2),
		't3%:', (100*tsResults[3].drop/tsResults.actions).toFixed(2),
		't4%:', (100*tsResults[4].drop/tsResults.actions).toFixed(2),
		't5%:', (100*tsResults[5].drop/tsResults.actions).toFixed(2),
		'&nbsp;', '&nbsp;',
		'&nbsp;gained', '&nbsp;',

		't1:', tsResults[1].gained,
		't2:', tsResults[2].gained,
		't3:', tsResults[3].gained,
		't4:', tsResults[4].gained,
		't5:', tsResults[5].gained,
		'&nbsp;', '&nbsp;']);
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
		'2x Relic %:', (tsResults.itemInfo.relicDouble/tsResults.itemInfo.relicDrop).toFixed(2),
		'&nbsp;', '&nbsp;']);
}
function addSalesInfo(tsResults, outputArgs) {
	var avgSale = tsResults.sales.gained/tsResults.actions;
	return outputArgs.concat([
		'Sales:', tsResults.sales.gained,
		'Avg Sale:', avgSale.toFixed(2),
		'1x Estimate:', (avgSale * normalAverageMultiplier).toFixed(2),
		'4x Estimate:', (avgSale * quadAverageMultiplier).toFixed(2),
		]);
}
function addScoutsInfo(tsResults, outputArgs) {
	var avgScout = tsResults.scouts.gained/tsResults.actions;
	return outputArgs.concat([
		'Scouts:', tsResults.scouts.gained,
		'Avg Scout:', avgScout.toFixed(2),
		'Scout Relics:', tsResults.scouts.relicGained,
		'Scout 2x Relic%:', (tsResults.scouts.relicDouble/tsResults.scouts.relicDrop*100).toFixed(2),
		'Actions/Relic', (tsResults.actions/tsResults.scouts.relicGained).toFixed(2),
		'Relics/Action', (tsResults.scouts.relicGained/tsResults.actions).toFixed(2),
		'&nbsp;', '&nbsp;',
		'1x Estimate:', (avgScout * normalAverageMultiplier).toFixed(2),
		'4x Estimate:', (avgScout * quadAverageMultiplier).toFixed(2)
	]);
}
function addTaxPercent(tsResults, outputArgs) {
	return outputArgs.concat([
		'tax%:', (100*tsResults.taxedActions/tsResults.actions).toFixed(2)]);
}
function addTaxSales(tsResults, outputArgs) {
	return outputArgs.concat([
		'sales tax:', tsResults.sales.taxed,
		'avg tax:', (tsResults.sales.taxed/tsResults.taxedActions).toFixed(2)]);
}
function addTaxScouts(tsResults, outputArgs) {
	return outputArgs.concat([
		'Relics Taxed:', tsResults.scouts.relicTaxedCount,
		'Avg tax:', (tsResults.scouts.relicTaxedCount/tsResults.scouts.relicTaxed).toFixed(2),
		'Tax %:', (tsResults.scouts.relicTaxed/tsResults.scouts.relicDrop*100).toFixed(2)
	]);
}
function addTaxedItems(tsResults, outputArgs) {
	return outputArgs.concat([
		'&nbsp;total taxed', '&nbsp;',
		't1:', tsResults[1].taxed,
		't2:', tsResults[2].taxed,
		't3:', tsResults[3].taxed,
		't4:', tsResults[4].taxed,
		't5:', tsResults[5].taxed]);
}
function addXP(tsResults, outputArgs) {
	return outputArgs.concat([
		'total XP:', tsResults.xp,
		'avg XP:', (tsResults.xp/tsResults.actions).toFixed(2),
		'&nbsp;', '&nbsp;']);
}
function addPerkInfo(tsResults, outputArgs) {
    let perkInfo = ['&nbsp;', '&nbsp;', 'Perks %', '&nbsp;'];

    const actions = tsResults.actions;
    const perks = tsResults.perks;
    const enraged = perks.enraged;
    perkInfo = perkInfo.concat(['enraged: ', (enraged/actions*100).toFixed(2)]);
    const hoarder= perks.hoarder;
    perkInfo = perkInfo.concat(['hoarder: ', (hoarder/actions*100).toFixed(2)]);
    const drunken = perks.drunken;
    perkInfo = perkInfo.concat(['drunken: ', (drunken/actions*100).toFixed(2)]);

    perkInfo = perkInfo.concat(['t1: ', (perks[1].total).toFixed(2)]);
    perkInfo = perkInfo.concat(['t2: ', (perks[2].total).toFixed(2)]);
    perkInfo = perkInfo.concat(['t3: ', (perks[3].total).toFixed(2)]);
    perkInfo = perkInfo.concat(['t4: ', (perks[4].total).toFixed(2)]);
    perkInfo = perkInfo.concat(['t5: ', (perks[5].total).toFixed(2)]);
    perkInfo = perkInfo.concat(['gold: ', (perks.sales.total).toFixed(2)]);
    perkInfo = perkInfo.concat(['avg gold: ', (perks.sales.total/perks.sales.drunken).toFixed(2)]);
    perkInfo = perkInfo.concat(['scouted: ', (perks.scouts.total).toFixed(2)]);
    perkInfo = perkInfo.concat(['avg scout: ', (perks.scouts.total/perks.scouts.drunken).toFixed(2)]);

    perkInfo.concat(['&nbsp;', '&nbsp;']);
    return outputArgs.concat(perkInfo);
}
function updateOutput(results, msg) {
	var outputArgs = ['actions:', tsResults.actions, '&nbsp;', '&nbsp;'];
	outputArgs = addXP(tsResults, outputArgs);
	// don't display tier data if sales is active
	var salesActive = tsResults.sales.total > 0;
	var scoutsActive = tsResults.scouts.total > 0;

	if(outputTiers && !salesActive && !scoutsActive) outputArgs = addTierInfo(tsResults, outputArgs);
	else if(outputTiers && salesActive && !scoutsActive) outputArgs = addSalesInfo(tsResults, outputArgs);
	else if(outputTiers && !salesActive && scoutsActive) outputArgs = addScoutsInfo(tsResults, outputArgs);

	outputArgs = outputArgs.concat(['&nbsp;', '&nbsp;', 'item%:', (100*tsResults.items/tsResults.actions).toFixed(2)]);

	if(outputItems) outputArgs = addItemOutput(tsResults, outputArgs);
	if(outputQuests) outputArgs = outputArgs.concat(['quest%:', (100*tsResults.questItems/tsResults.questActions).toFixed(2)]);
	if(outputTaxes) {
		// scouting tax functions differently
		if(!scoutsActive) outputArgs = addTaxPercent(tsResults, outputArgs);

		if(salesActive) outputArgs = addTaxSales(tsResults, outputArgs);
		else if(scoutsActive) outputArgs = addTaxScouts(tsResults, outputArgs);
		else outputArgs = addTaxedItems(tsResults, outputArgs);
	}

	if(outputPerks) outputArgs = addPerkInfo(tsResults, outputArgs);

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

	$('#'+resourceListId).append('<li><div><a href="#" onClick="clearTSResults(); return false">Reset Data</a></div></li>');
	for(var i=0,iLen=outputArgs.length;i<iLen;i+=2) {
		$('#'+resourceListId).append(formatResource(outputArgs[i], outputArgs[i+1]));
	}
}
function initializeUI() {
	$("body").append('<div id="resourceLogContainer" style="position: absolute;top: 0;right: 0; width: 210px;"><div>Resource Log <div style="float: right;"><a href="javascript:toggleUI();">[Toggle]</a></div></div> <ul id="resourceLogList" style="display"></ul></div>');
}
function toggleUI() {
    $("#resourceLogList").toggle();
}
if(typeof unsafeWindow !== 'undefined') unsafeWindow.toggleUI = toggleUI;

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
