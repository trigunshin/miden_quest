import _ from 'lodash';
import moment from 'moment';
import {observable} from 'mobx';

function checkIfProfilePage(data) {
    const profilePageTest = $(data).find("div:contains('radeskill attempts')");
	return profilePageTest.length > 0;
}

class ProfileState {
    @observable profiles = {};
    @observable currentTime = moment();

    constructor() {}

    getProfileName(data) {
        const barDiv = $("div.CrumbBar")[0];
        const parent = barDiv.parentElement;
        const barParentChildren = parent.childNodes;
        // from top level down to target child
        // order is div,script,div plus some misc text in between
        const profileContentChild = barParentChildren[4];
        // now we want first children of next 3 nodes to hit the title div
        const titleDiv = profileContentChild.childNodes[1].childNodes[1].childNodes[1];
        const titleName = titleDiv.innerText;

        // Captain Candack is the only player with a space atm so this is fine
        const profileName = _.last(titleName.split(' '));
        return profileName;
    }

    parseTSAttempts(data) {
        const tsDiv = $(data).find("div:contains('radeskill attempts')");
        const tsNode = tsDiv[tsDiv.length - 1];
        const tsNodeParent = tsNode.parentElement;
        const tsSiblings = tsNodeParent.childNodes;
        const tsAttemptNode = tsSiblings[3];
        const tsAttempts = tsAttemptNode.innerText.replace(/ /g, '');
        return tsAttempts;
    }

    static parse = (datum, state) => {
        const arr = datum.split('|');
        if (arr[0] != 'LOADPAGE') {return;}
        // check for resource/building/other page
        if (checkIfProfilePage(datum)) {
            const tsAttempts = state.parseTSAttempts(datum);
            const name = state.getProfileName(datum);
            console.info(name, tsAttempts);
            state.profiles[name] = {...state.profiles[name], tsAttempts};
        }
        return state;
    }
}

export default ProfileState;
