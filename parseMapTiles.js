/*
INSTRUCTIONS:
Modify the T1-5 cutoffs as desired.
Open map, zoom as far out as possible.
Swap to T1 view. Click "Parse T1". Repeat for all available tiers.

Once T1-5 nodes are set click "Print Data". This will output a JSON blob of the "good tile" data and
then a tile per line of the data. To avoid large amounts of output, I recommend parsing at least up to T3.
//*/
var T1_CUTOFF = 70;
var T2_CUTOFF = 55;
var T3_CUTOFF = 28;
var T4_CUTOFF = 15;
var T5_CUTOFF = 5;
var coordPattern = /x(\d+)y(\d+)/;
var tierPattern = /(\d+)%/;
var typePattern = /tile-(\w+)/;
var parsedNodes = {};
var parseT1 = null;
var parseT2 = null;
var parseT3 = null;
var parseT4 = null;
var parseT5 = null;

function getCoords(node) {
    var cur = $(node)[0];
    var matches = cur.id.match(coordPattern);
    var ret = {
        x: matches[1],
        y: matches[2],
        type: $(node).attr('class').match(typePattern)[1]
    };
    return ret;
}
function parseTier(node) {
    var cur = $(node);
    return cur.find('text')[1].textContent.match(tierPattern)[1];
}
function parseNode(node) {
    var ret = getCoords(node);
    ret.val = parseTier(node);
    return ret;
}
function isGoodNode(node) {
    ret = true;
    if(node.t1) ret = ret && node.t1 >= T1_CUTOFF;
    if(node.t2) ret = ret && node.t2 >= T2_CUTOFF;
    if(node.t3) ret = ret && node.t3 >= T3_CUTOFF;
    if(node.t4) ret = ret && node.t4 >= T4_CUTOFF;
    if(node.t5) ret = ret && node.t5 >= T5_CUTOFF;
    return ret;
}
function parseMap() {
    var map = $('svg#map>g')[0];
    map = $(map);
    var mapNodes = map.find('g');
    return _.map(mapNodes, parseNode);
}
function printData() {
    var good_nodes = _.filter(_.values(parsedNodes), isGoodNode);
    console.info('JSON blob:\n', JSON.stringify(good_nodes));
    console.info('Line per tile');
    _.each(_.values(good_nodes), function(node) {console.info(JSON.stringify(node));});
}

function parseMapTier(tier) {
    // tell the nodes what tier they are; this could be moved to parseNode/parseMap
    var nodes = _.map(parseMap(), function(node) {node.tier=tier; return node;});
    parseTierData(nodes);
}

function parseTierData(nodes) {
    function updateNodeData(node) {
        var x = node.x;
        var y = node.y;
        var key = x + ',' + y;
        if(_.has(parsedNodes, key)) {
            parsedNodes[key][node.tier] = node.val;
        } else {
            parsedNodes[key] = {
                x: x,
                y: y,
                type: node.type
            };
            parsedNodes[key][node.tier] = node.val;
        }
    }
    _.each(nodes, updateNodeData);
    console.info('done parsing');
}

function initButtons() {
    // add container, <ul>, and then the list of <li>
    jQuery('<div/>', {
        id: 'mapParsingContainer',
        text: 'Map Info',
        style: 'float: left;'
    }).prependTo('body');
    jQuery('<ul/>', {
        id: 'mapParseList',
    }).appendTo('div#mapParsingContainer');
    // buttons for t1-5
    $('ul#mapParseList').append($("<li> <a href='#' onClick='parseT1(); return false;'>Parse T1</a></li>"));
    $('ul#mapParseList').append($("<li> <a href='#' onClick='parseT2(); return false;'>Parse T2</a></li>"));
    $('ul#mapParseList').append($("<li> <a href='#' onClick='parseT3(); return false;'>Parse T3</a></li>"));
    $('ul#mapParseList').append($("<li> <a href='#' onClick='parseT4(); return false;'>Parse T4</a></li>"));
    $('ul#mapParseList').append($("<li> <a href='#' onClick='parseT5(); return false;'>Parse T5</a></li>"));
    $('ul#mapParseList').append($("<li> <a href='#' onClick='printData(); return false;'>Print Data</a></li>"));
}

$.getScript("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.11.1/lodash.min.js", function(){
    initButtons();
    parseT1 = _.partial(parseMapTier, 't1');
    parseT2 = _.partial(parseMapTier, 't2');
    parseT3 = _.partial(parseMapTier, 't3');
    parseT4 = _.partial(parseMapTier, 't4');
    parseT5 = _.partial(parseMapTier, 't5');
});
