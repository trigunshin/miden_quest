var printResultsFlag = false;
var postToURL = true;
var kingdomPostURL = '';

function parseKingdom(msg) {
	var results = [];
	var postData = {};
	var resourceParent = $("div:contains('T1 Wood')").last().parent();
	var nodes = $(resourceParent).find("div").slice(-72);
	// 4 types * 5 tiers = 20 iterations
	for(var i=0,iLen=40;i<iLen;i+=2) {
		var labelNode = nodes[i];
		var dataNode = nodes[i+1];

		var labelText = labelNode.textContent.replace(':', '');
		results.push({
			label: labelText,
			total: parseInt(dataNode.textContent)
		});
		postData[labelText] = parseInt(dataNode.textContent);
	}

	if(printResultsFlag) printKingdomResults(results);
	if(postToURL) updateGoogleSheets(postData);
}
function printKingdomResults(results) {
	var arr = [];
	for(var i=0,iLen=results.length;i<iLen;i++) {
		arr = arr.concat([results[i].label+'\t'+results[i].total+'\n']);
	}
	console.info.apply(console, arr);
}
function updateGoogleSheets(data) {
	var request = $.ajax({
		url: kingdomPostURL,
		type: 'post',
		data: data
	});
}
function track_kingdom_onmsg(evt) {
	track_kingdom_original_msg(evt);
	
	var arr = evt.data.split('|');
	// check loadpage, then check if kingdom page
	if (arr[0] != 'LOADPAGE' || arr[1].indexOf("KingdomMap") < 0) {return;}
	else {
		var divList = $("div:contains('T1 Wood')");
		if(divList.length > 0) {
			// T1 Wood is the first of the tier info
			var resourceParent = divList.last().parent();
			parseKingdom(arr[1]);
		}
	}
}
// set up handler & hook original game handler in
if(typeof track_kingdom_original_msg === 'undefined') {
	console.info('resource tracker not yet loaded, loading...');
	var track_kingdom_original_msg = ws.onmessage;
	ws.onmessage=track_kingdom_onmsg;
} else {
	ws.onmessage=track_kingdom_onmsg;
}
