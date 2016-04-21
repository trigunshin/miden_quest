// set up handler array & hook game's handler in
var eventHandlers = [ServerReceptionHandler];
function onmsg(evt) {
	for(var i=0,iLen=eventHandlers.length; i<iLen;i++) {
		eventHandlers[i](evt.data);
	}
};
ws.onmessage=onmsg;

var tsResults = {
	actions:0,
	1: 0,
	2: 0,
	3: 0,
	4: 0,
	5: 0,
	lumber:{
		items: ['Pine', 'Oak', 'Maple', 'Ironwood', 'Ygddrasil']
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
		if(msg.indexOf('You cut') >= 0) {
			for(var i=0,iLen=tsResults.lumber.items.length;i<iLen;i++) {
				if(msg.indexOf(tsResults.lumber.items[i]) >= 0) {
					tsResults[i+1] += 1;
				}
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
