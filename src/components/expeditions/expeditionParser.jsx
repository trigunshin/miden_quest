import _ from 'lodash';
import moment from 'moment';
import {observable} from 'mobx';

const baseSearchString = " Lv. ";
const levelRegex = /Lv\. (\d+)/;
const minsLeftRegex = /(\d+) min(s)?\. left/;

function getExpeditionLevel(name) {
    const searchString = name + baseSearchString;
    const searchResults = $("div:contains('" + searchString + "')");
    if(searchResults.length < 0) return null;

    const levelString = searchResults[searchResults.length - 1].innerText;
    const levelMatch = levelString.match(levelRegex);
    if(!levelMatch) return null;
    return parseInt(levelMatch[1]);
}

function checkIfSetupPage() {
    return $("#btnInc1_1").length > 0 && $("#btnSendExp").length >0;
}

function checkIfStatusPage() {
    const minsLeft = $("div:contains('min\. left')");
    const exposActive = $("div:contains('ctive expedition')");
    return minsLeft.length > 0 && exposActive.length > 0;
}

function handleSetupPage(expeditionState) {
    // parse data
    const columnLevels = expeditionState.expeditionColumns.map(getExpeditionLevel);
    const newState = _.zipObject(expeditionState.expeditionColumns, columnLevels);
    expeditionState.Warrior = newState.Warrior;
    expeditionState.Hunter = newState.Hunter;
    expeditionState.Mage = newState.Mage;
    expeditionState.Healer = newState.Healer;
    return expeditionState;
}
function handleStatusPage(expeditionState) {
    const minsLeft = $("div:contains('min\. left')");
    const text = minsLeft[minsLeft.length-1].innerText;
    const timeMatch = text.match(minsLeftRegex);
    if(!timeMatch) {
        console.warn('failed to match time for text', text);
        return expeditionState;
    } else {
        const minsLeft = parseInt(timeMatch[1]);

        const currentDate = moment();
        currentDate.add(minsLeft, 'minutes');
        expeditionState.doneAt = currentDate;

        console.info('matched expedition time', expeditionState.doneAt);
        return expeditionState;
    }
}

class ExpeditionState {
    @observable Warrior =   -1;
    @observable Hunter =    -1;
    @observable Mage =      -1;
    @observable Healer =    -1;
    @observable doneAt =    -1;
    @observable currentTime = moment();
    expeditionColumns = ["Warrior", "Hunter", "Mage", "Healer"];
    expeditionColumnTypes = {
        Warrior:    1,
        Hunter:     2,
        Mage:       3,
        Healer:     4
    };
    expeditionResourceTypes = {
        fish:   1,
        ore:    2,
        wood:   3,
        plant:  4
    };

    constructor() {}

    static parseExpeditionSetup = (datum, state) => {
        const arr = datum.split('|');
        if (arr[0] != 'LOADPAGE') {return;}
        if (checkIfSetupPage()) {return handleSetupPage(state);}
        else if (checkIfStatusPage()) {return handleStatusPage(state);}

        return;
    };

    getExpeditionString = (columnName, resourceName) => {
        const expoColumn = this.expeditionColumnTypes[columnName];
        const resType = this.expeditionResourceTypes[resourceName];
        return 'getExpedition.aspx?res=' + resType + '&adv=' + expoColumn + '&null=';
    };

    sendExpedition = (columnName, resourceName) => {
        const url = this.getExpeditionString(columnName, resourceName);
        console.info('incrementing expedition using url', url);
        sendRequestContentFill(url);
    };

    getExpeditionColumn = (targetLevels) => {
        /*
            need even levels (up to limits)
            so not "Level warrior to L15, then healer to L15" but 1,1,2,2,3,3 ...
         */
        // get un-maxed columns
        const nonMaxed = _.filter(this.expeditionColumns, (name) => {
            const currentLevel = this[name];
            const targetLevel = targetLevels[name];
            return currentLevel < targetLevel;
        });
        if(nonMaxed.length <= 0) return false;

        // sort by current level, return the lowest
        const sorted = _.sortBy(nonMaxed, (name) => {
            return this[name];
        });

        return _.head(sorted);
    };

    levelExpedition = (targetLevels, targetResources) => {
        const nextName = this.getExpeditionColumn(targetLevels);
        const resourceName = targetResources[nextName];

        if(!resourceName || !nextName) return;
        this.sendExpedition(nextName, resourceName);
    };
}

export default ExpeditionState;
/*
expedition info
    btnInc2_1 : A_B
        A: 1,2,3,4: columns (hunter, healer, etc)
            1: warrior,
            2: hunter,
            3: mage,
            4: healer
        B:
            1: fish,
            2: ore,
            3: wood,
            4: plant
    buttons send over:
        $("#btnInc1_1").click(function () { sendRequestContentFill('getExpedition.aspx?res=1&adv=1&null='); });
        $("#btnInc1_4").click(function () { sendRequestContentFill('getExpedition.aspx?res=4&adv=1&null='); });
        $("#btnInc3_1").click(function () { sendRequestContentFill('getExpedition.aspx?res=1&adv=3&null='); });
        $("#btnInc3_2").click(function () { sendRequestContentFill('getExpedition.aspx?res=2&adv=3&null='); });

    so use:
        sendRequestContentFill('getExpedition.aspx?res=1&adv=1&null=');
        sendRequestContentFill('getExpedition.aspx?res=4&adv=1&null=');
        sendRequestContentFill('getExpedition.aspx?res=1&adv=3&null=');
        sendRequestContentFill('getExpedition.aspx?res=2&adv=3&null=');

    Fetch adv current levels? Awkward $ selector as usual
    <div>
        <div>Helping out the adventurers by giving them resources will increase their yield.</div>
        <div>
            <div>
                "Warrior Lv. 5"
            </div>
        </div>
    </div>
 */
