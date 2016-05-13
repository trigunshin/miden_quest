// captcha notification
function marketNotify(who, what, howMany, howMuch) {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.'); 
    return;
  }
  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('Notification title', {
      title: 'Resources Posted',
      body: who+' listed '+howMany+' '+what+' at '+howMuch+' gold'
    });
  }
}
var minValues = {
    'Pine log':         10,
    'Oak log':          100,
    'Maple log':        150,
    'Ironwood log':     10,
    'Ygddrasil':        550,
    'Iron ore':         5,
    'Silver ore':       5,
    'Obsidian ore':     90,
    'Mythril ore':      90,
    'Ethernium ore':    430,
    'Plant Stem':       0,
    'Cotton':           15,
    'Living Leather':   15,
    'Silver Vine':      100,
    'Nimbus Fruit':     1500,
    'Tuna':             10,
    'Salmon':           10,
    'Flyfish':          18,
    'Marlin':           600,
    'Dragonfish':       2000,
    "Gems":             250000,
    "Mag. Elements":    40,
    "Relics":           30000
};
function parseMarketData(datum) {
    var arr = datum.split('|');
    if (channelChat != 5 || arr[0] != 'CHATNEW') {return;}
    var message = $(arr[1]);
    var text = message.text().split(']')[1];
    //"derivagral listed 1 Salmon on the market for 18 gold each"
    var marketPattern = /(\w+) listed (\d+) (\w+) on the market for (\d+) gold each/;
    var results = text.match(marketPattern);

    var who = results[1];
    var howMany = results[2];
    var what = results[3];
    var howMuch = results[4];
    if (minValues[what] > howMuch) {
        marketNotify(who, what, howMany, howMuch);
    }
}
function track_market_onmsg(evt) {
    track_market_original_msg(evt);
    parseMarketData(evt.data);
}
// set up handler & hook original game handler in
if(typeof track_market_original_msg === 'undefined') {
    console.info('marketAlerts not yet loaded, loading...');
    var track_market_original_msg = ws.onmessage;
    ws.onmessage=track_market_onmsg;
} else {
    ws.onmessage=track_market_onmsg;
}
