function printGlobal(datum) {
    var arr = datum.split('|');
    if (arr[0] != 'SETLVL') {return;}
    console.info("GLOBAL LEVEL:", arr[1]);
}
function trackGlobalLevelOnMsg(evt) {
    track_global_original_msg(evt);
    printGlobal(evt.data);
}
// set up handler & hook original game handler in
if(typeof track_global_original_msg === 'undefined') {
    console.info('trackGlobal not yet loaded, loading...');
    var track_global_original_msg = ws.onmessage;
    ws.onmessage=trackGlobalLevelOnMsg;
} else {
    ws.onmessage=trackGlobalLevelOnMsg;
}
