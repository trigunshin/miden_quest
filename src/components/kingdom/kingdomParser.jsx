import _ from 'lodash';
import moment from 'moment';
import {observable} from 'mobx';
//import {building_costs} from './../../defaults';

const resourceNames = ['ore', 'plant', 'wood', 'fish'];
const resourceTiers = ['t1', 't2', 't3', 't4', 't5'];

// residents page
const residentPageChallenge = 'King (All access)';
const playerLinkTemplate = _.template('getInfoPlayer.aspx?t=<%= playerId %>&null=');
const playerIdRegex = /(\d+)/;

function getKingdomResourceFormat(names, tiers) {
    let ret = [];
    ret = _.map(resourceNames, (name) => {return name + '_' + resourceTiers[0];});
    ret.push('gold');
    ret = ret.concat(_.map(resourceNames, (name) => {return name + '_' + resourceTiers[1];}));
    ret.push('relics');
    ret = ret.concat(_.map(resourceNames, (name) => {return name + '_' + resourceTiers[2];}));
    ret.push('gems');
    ret = ret.concat(_.map(resourceNames, (name) => {return name + '_' + resourceTiers[3];}));
    ret = ret.concat(_.map(resourceNames, (name) => {return name + '_' + resourceTiers[4];}));

    return ret;
}

function getKingdomBuildings() {
    const kdParent = $($("#SubScreenBuild")[0]);
    const buildingString = kdParent[0].innerText.replace(/\s/g, '');
    const buildingRegex = /(\w+?)x(\d+)/g;

    // not the cleanest loop, easy c/p from
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
    const output = [];
    let arrayCondition;
    while ((arrayCondition = buildingRegex.exec(buildingString)) !== null) {
        output.push(arrayCondition[0]);
    }

    // form is NamexCount, so split into [[Name, Count], ...]
    const pairs = _.map(output, (item) => {return item.split('x');});

    return _.reduce(pairs, (accum, [name, count]) => {
        accum[name.toLowerCase()] = parseInt(count, 10);
        accum.total += parseInt(count, 10);
        return accum;
    }, {total: 0});
}


function parseKingdomResources(kdResourceMappings) {
    const kdParent = $($("#SubScreenTS")[0]);
    const resourceFields = kdParent.find("div.infoplusMenu");

    const resources = _.reduce(
        _.zip(resourceFields, kdResourceMappings), (accum, data) => {
            const value = data[0];
            const label = data[1];

            if (value.innerText) {
                accum[label] = value.innerText.split('\n')[0].replace(/\W/g, '');
            } else {
                accum[label] = value.innerText.replace(/\W/g, '');;
            }

            return accum;
        },
        {});

    return resources;
}

function assignKingdomResources(format, state, resources) {
    _.each(format, (label) => {state[label] = resources[label];});
    return state;
}

/*
const kdResourceMappings = getKingdomResourceFormat(resourceNames, resourceTiers);
let resources = parseKingdomResources(kdResourceMappings);
//*/

function checkIfKingdomPage() {
    // All 3 of these are currently available on the same page
    // SubScreenTS
    // SubScreenBuild
    // SubScreenBonus
    return $("#SubScreenTS").length > 0;
}

function checkIfResidentPage(datum) {
    return datum.indexOf(residentPageChallenge) > 0;
}
function parseKingdomResidents(datum, state) {
    const residentData = {};
    const playerList = $('<div/>').html(datum).contents().find('a.CharLink');
    playerList.map((i, player) => {
        const playerName = player.text;
        const playerId = player.onclick.toString().match(playerIdRegex)[0];  // could fail, meh
        const playerLink = playerLinkTemplate({playerId});

        residentData[playerName] = {playerName, playerLink}
    });
    state.residents = residentData;
    return state;
}

class KingdomState {
    @observable wood_t1 =    -1;
    @observable wood_t2 =    -1;
    @observable wood_t3 =    -1;
    @observable wood_t4 =    -1;
    @observable wood_t5 =    -1;
    @observable ore_t1 =    -1;
    @observable ore_t2 =    -1;
    @observable ore_t3 =    -1;
    @observable ore_t4 =    -1;
    @observable ore_t5 =    -1;
    @observable fish_t1 =    -1;
    @observable fish_t2 =    -1;
    @observable fish_t3 =    -1;
    @observable fish_t4 =    -1;
    @observable fish_t5 =    -1;
    @observable plant_t1 =    -1;
    @observable plant_t2 =    -1;
    @observable plant_t3 =    -1;
    @observable plant_t4 =    -1;
    @observable plant_t5 =    -1;

    @observable gold =    -1;
    @observable relics =    -1;
    @observable gems =    -1;

    @observable currentTime = moment();

    @observable residents = {};

    constructor() {}

    getBuildingCost = (label, nextLevel) => {
        // tl;dr mimic the calculator here
        const building = buildingCosts[label];
        const resources = _.keys(building.cost);
        _.map(resources, (resource) => {
            //base_costs[resource]
            Math.pow(factor, nextLevel);
        });
        // buildingCosts: baseCost[val] * building
    };

    static parseKingdom = (datum, state) => {
        const arr = datum.split('|');
        if (arr[0] != 'LOADPAGE') {return;}
        // check for resource/building/other page
        if (checkIfKingdomPage()) {
            console.info('parsing kingdom resources');
            const kdResourceMappings = getKingdomResourceFormat(resourceNames, resourceTiers);
            const resources = parseKingdomResources(kdResourceMappings);
            return assignKingdomResources(kdResourceMappings, state, resources);
        } else if (checkIfResidentPage(datum)) {
            console.info('parsing kingdom residents');
            return parseKingdomResidents(datum, state);
        }
        return;
    };
}

export default KingdomState;
