/*
INSTRUCTIONS
Copy/paste this whole  section into console & hit enter. It should track gather rates for Gathering, Fishing,
Mining and Woodcutting. It will print the results after every gather; please note that this will never give
exact values, and you should probably wait for 300-500+ attempts on a tile to draw conclusions.

To reset the values (necessary if you move tiles) you can copy/paste the whole script again or just enter
this into the console:  "clearTSResults();".

THIS IS PROBABLY (100%) NOT COMPATIBLE WITH RYALANE'S CHAT SCRIPT
//*/

// set up handler array & hook game's handler in
var eventHandlers = [ServerReceptionHandler];
function onmsg(evt) {
	for(var i=0,iLen=eventHandlers.length; i<iLen;i++) {
		eventHandlers[i](evt.data);
	}
};
ws.onmessage=onmsg;

// results aren't stored under the resource because we aren't tracking tile changes/types
var tsResults = {
	actions:0,
	1: 0,
	2: 0,
	3: 0,
	4: 0,
	5: 0,
	lumber:{
		items: ['Pine', 'Oak', 'Maple', 'Ironwood', 'Ygddrasil']
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
	for(var i=1, iLen=6; i<iLen;i++) {
		tsResults[i] = 0;
	}
}
function parseTSLog(datum) {
	var arr = datum.split('|');
	if (arr[0] != 'NLOG') {return;}
	
	var channel = arr[1];
	var msg = arr[2];
	
	// skip relic, item, gem drops
	if(channel == 3) return;
	else if(channel == 2) {
		tsResults.actions += 1;
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
		}

		for(var i=0,iLen=itemTypes.length;i<iLen;i++) {
			if(msg.indexOf(itemTypes[i]) >= 0) {
				tsResults[i+1] += 1;
			}
		}

		console.info(
			't1:', (100*tsResults[1]/tsResults.actions).toFixed(2),
			't2:', (100*tsResults[2]/tsResults.actions).toFixed(2),
			't3:', (100*tsResults[3]/tsResults.actions).toFixed(2),
			't4:', (100*tsResults[4]/tsResults.actions).toFixed(2),
			't5:', (100*tsResults[5]/tsResults.actions).toFixed(2),
			'actions:', tsResults.actions,
			'\tmsg:', msg);
	}
}
eventHandlers.push(parseTSLog);
