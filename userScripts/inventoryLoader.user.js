// ==UserScript==
// @name MQO Inventory Helper
// @namespace https://github.com/trigunshin/miden_quest
// @description MQO inventory helper; reforges, enchants, quicksearch (load any item first!)
// @homepage https://trigunshin.github.com/miden_quest
// @version 18
// @downloadURL http://trigunshin.github.io/miden_quest/userScripts/inventoryLoader.user.js
// @updateURL http://trigunshin.github.io/miden_quest/userScripts/inventoryLoader.user.js
// @include http://midenquest.com/Game.aspx
// @include http://www.midenquest.com/Game.aspx
// @include https://www.midenquest.com/Game.aspx
// ==/UserScript==
(function () {
    // include version in ajax request to 'bust' out of old, cached versions
    const version = 18;
    const url = "https://trigunshin.github.io/miden_quest/userScripts/inventory.js?&preventCache="+version;
    var scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.src = url;
    document.body.appendChild(scriptElement);
})();
