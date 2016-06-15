var resourceNameMappings = {
	'Pine log': 'T1 Wood',
	'Oak log': 'T2 Wood',
	'Maple log': 'T3 Wood',
	'Ironwood log': 'T4 Wood',
	'Yggdrasil log': 'T5 Wood',

	'Iron ore': 'T1 Ore',
	'Silver ore': 'T2 Ore',
	'Obsidian ore': 'T3 Ore',
	'Mythril ore': 'T4 Ore',
	'Ethernium ore': 'T5 Ore',

	'Plant Stem': 'T1 Plant',
	'Cotton': 'T2 Plant',
	'Living Leather': 'T3 Plant',
	'Silver Vine': 'T4 Plant',
	'Nimbus Fruit': 'T5 Plant',

	'Tuna': 'T1 Fish',
	'Salmon': 'T2 Fish',
	'Flyfish': 'T3 Fish',
	'Marlin': 'T4 Fish',
	'Dragonfish': 'T5 Fish',

	'Gems': 'Gems',
	'Relics': 'Relics',
	'Mag. Elements': 'ME',
};
var postToURL = true;
var marketPostURL = '';
function parseMarket(msg) {
	var container = $("div:contains('Per unit')").last().parent().parent();
	var auctions = container.children().slice(2);
	var auctionNodes = auctions.children();
	var resourceName = getResourceName(container);

	var printme = [];
	var auctionData = {
		name: resourceName,
		units: 0,
		price: 0
	};
	for(var i=0,iLen=auctionNodes.length;i<iLen;i+=5) {
		var itemCount = parseInt(auctionNodes[i].textContent.replace(/ /g,''));
		var perUnit = parseInt(auctionNodes[i+1].textContent.replace(/ /g,''));
		// what's raw value? this is shortened with k or m
		var totalCost = parseInt(auctionNodes[i+2].textContent.replace(/ /g,''));
		var seller = auctionNodes[i+3].innerText;
		//var button = auctionNodes[i+4];
		printme = printme.concat('', itemCount, '\t', perUnit, '\t', totalCost, '\t', seller, '\n');
		auctionData.units += itemCount;
		auctionData.price += perUnit * itemCount;
	}

	console.info(resourceName, '\ttotal units:\t', auctionData.units,
		'total price:\t', auctionData.price,
		'price/unit:\t', (auctionData.price / auctionData.units).toFixed(2));

	if(postToURL) updateGoogleSheets(auctionData);
}
function getResourceName(container) {
	var headerLine = container.children()[1];
	var headers = $(headerLine).children();
	return headers[0].textContent;
}
function updateGoogleSheets(auctionData) {
	var perUnit = (auctionData.price / auctionData.units).toFixed(2);
	var sheetName = resourceNameMappings[auctionData.name];
	var data = {};
	data[sheetName] = perUnit;

	var request = $.ajax({
		url: marketPostURL,
		type: 'post',
		data: data
	});
}

function track_market_onmsg(evt) {
	track_market_original_msg(evt);
	
	var arr = evt.data.split('|');
	// check loadpage, then check if relevant market page
	if (arr[0] != 'LOADPAGE' || arr[1].indexOf("Per unit") < 0) {return;}
	parseMarket(arr[1]);
}
// set up handler & hook original game handler in
if(typeof track_market_original_msg === 'undefined') {
	console.info('market tracker not yet loaded, loading...');
	var track_market_original_msg = ws.onmessage;
	ws.onmessage=track_market_onmsg;
} else {
	ws.onmessage=track_market_onmsg;
}
