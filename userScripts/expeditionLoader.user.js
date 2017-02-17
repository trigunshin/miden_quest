// ==UserScript==
// @name MQO Expedition Helper
// @namespace https://github.com/trigunshin/miden_quest
// @description MQO expedition level helper; saves clicks setting up expedition
// @homepage https://trigunshin.github.com/miden_quest
// @version 3
// @downloadURL http://trigunshin.github.io/miden_quest/userScripts/expeditionLoader.user.js
// @updateURL http://trigunshin.github.io/miden_quest/userScripts/expeditionLoader.user.js
// @include http://midenquest.com/Game.aspx
// @include http://www.midenquest.com/Game.aspx
// @include https://www.midenquest.com/Game.aspx
// ==/UserScript==
(function () {
    // include version in ajax request to 'bust' out of old, cached versions
    const version = 3;
    const url = "https://trigunshin.github.io/miden_quest/build/expeditions.js?&preventCache="+version;
    var scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.src = url;
    document.body.appendChild(scriptElement);
})();
