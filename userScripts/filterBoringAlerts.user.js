// ==UserScript==
// @name MQO Boring Alert Filter
// @namespace https://github.com/trigunshin/miden_quest
// @description MQO Blue Alert filter; will filter away incoming blue alerts if you leave the tab open.
// @homepage https://trigunshin.github.com/miden_quest
// @version 1
// @downloadURL http://trigunshin.github.io/miden_quest/userScripts/filterBoringAlerts.user.js
// @updateURL http://trigunshin.github.io/miden_quest/userScripts/filterBoringAlerts.user.js
// @include http://midenquest.com/Game.aspx
// @include http://www.midenquest.com/Game.aspx
// @include https://www.midenquest.com/Game.aspx
// ==/UserScript==

// examples
// CHATNEW|<div id='chatShout1'>[13:36]<span style='font-weight: bold; color: #253ECC; word-wrap: break-word;'>timity achieved Fishing level 300 !</span></div><br />
// CHATNEW|<div id='chatShout1'>[13:36]<span style='display: inline-block; font-weight: bold;'><a class="CharLink" style="color:#000000; text-shadow: -1px 0 #FF1ADD, 0 1px #FF1ADD, 1px 0 #FF1ADD, 0 -1px #FF1ADD;" href='#' onclick="sendRequestContentFill('getInfoPlayer.aspx?t=1957&null='); event.preventDefault();"><span style="font-size:smaller;"><span style="color:#0052D6; text-shadow: 0px 0px #FFF;">[Help]</span> [Runaway Princess]</span> Boxsalesgirl</a></span>: <span style='font-weight: normal; color: #000000; word-wrap: break-word;'>LEAVE that house</span></div><br />

function chat_alert_filter_onmsg(evt) {
    const [tag, data] = evt.data.split('|', 2);
    if(tag === 'CHATNEW') {
        const isBoringAlert = data.indexOf('color: #253ECC') > 0;  // annoying alerts are this shade of blue
        if(isBoringAlert) return;  // skip boring alerts
        else chat_alert_filter_original_msg(evt);  // if valid chat msg, let it through
    } else {
        chat_alert_filter_original_msg(evt);
    }
}

// set up handler & hook original game handler in
if(typeof chat_alert_filter_original_msg === 'undefined') {
    console.info('boring chat alert filter not yet loaded, loading...');
    var chat_alert_filter_original_msg = ws.onmessage;
    ws.onmessage = chat_alert_filter_onmsg;
} else {
    ws.onmessage = chat_alert_filter_onmsg;
}
