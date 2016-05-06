var combat = {
	en1: 0,
	en2: 0,
	golden: 0,
	elite: 0,
	berserk: 0
};

function checkNewEnemy(idx, dataArray) {
	var enemyName = dataArray[1];
	var enemyHealth = dataArray[2];

	// track enemy type
	if(enemyName == null || enemyName == 'NULL') {
		// no 2nd enemy, return here so we don't +1 it
		return;
	} else if(_.startsWith(enemyName, 'Berserk')) {
		combat.berserk++;
	} else if(_.startsWith(enemyName, 'Elite')) {
		combat.elite++;
	} else if(_.startsWith(enemyName, 'Golden')) {
		combat.golden++;
	}
	// track slots of seen enemies
	if(idx==0) combat.en1++;
	else if(idx==1) combat.en2++;
}

var handledCommands = {
	'SETEN1': _.partial(checkNewEnemy, 0),
	'SETEN2': _.partial(checkNewEnemy, 1)
}
function handleTrackEnemyData(datum) {
	var dataArray = datum.split("|");
	var handler = _.get(handledCommands, dataArray[0], function(){});
	handler(dataArray);
}

// SET UP SOCKET LISTENERS; DON'T OVERWRITE PREVIOUS LISTENER
function track_enemies_onmsg(evt) {
	trackEnemiesOriginalHandler(evt);
	handleTrackEnemyData(evt.data);
};
if(typeof trackEnemiesOriginalHandler === 'undefined') {
	console.info('track enemies not loaded, loading...');
	var trackEnemiesOriginalHandler = ws.onmessage;
	ws.onmessage=track_enemies_onmsg;
} else {
	ws.onmessage=track_enemies_onmsg;
}
