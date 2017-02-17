import React from 'react';
import _ from 'lodash';

const marketURLTemplate = "getMarket.aspx?SelectMarketType=<%= type %>&SelectMarketSubType=<%= subType %>&SelectMarketSub2Type=<%= subSubType %>";
const compiledMarketURLTemplate = _.template(marketURLTemplate);

const simpleURLTemplate = "getMarket.aspx?SelectMarketType=<%= type %>";
const compiledSimpleURLTemplate = _.template(simpleURLTemplate);

// currently template is resource-only
const marketLinkData = [
	{type: 2, subType: 1, subSubType: 1, label: 't1 ore'},
	{type: 2, subType: 1, subSubType: 2, label: 't2 ore'},
	{type: 2, subType: 1, subSubType: 3, label: 't3 ore'},
	{type: 2, subType: 1, subSubType: 4, label: 't4 ore'},
	{type: 2, subType: 1, subSubType: 5, label: 't5 ore'},

	{type: 2, subType: 2, subSubType: 1, label: 't1 wood'},
	{type: 2, subType: 2, subSubType: 2, label: 't2 wood'},
	{type: 2, subType: 2, subSubType: 3, label: 't3 wood'},
	{type: 2, subType: 2, subSubType: 4, label: 't4 wood'},
	{type: 2, subType: 2, subSubType: 5, label: 't5 wood'},

	{type: 2, subType: 3, subSubType: 1, label: 't1 fish'},
	{type: 2, subType: 3, subSubType: 2, label: 't2 fish'},
	{type: 2, subType: 3, subSubType: 3, label: 't3 fish'},
	{type: 2, subType: 3, subSubType: 4, label: 't4 fish'},
	{type: 2, subType: 3, subSubType: 5, label: 't5 fish'},

	{type: 2, subType: 4, subSubType: 1, label: 't1 plant'},
	{type: 2, subType: 4, subSubType: 2, label: 't2 plant'},
	{type: 2, subType: 4, subSubType: 3, label: 't3 plant'},
	{type: 2, subType: 4, subSubType: 4, label: 't4 plant'},
	{type: 2, subType: 4, subSubType: 5, label: 't5 plant'}
];

const linkData = [
    {url: 'getExpedition.aspx?null=', label: 'Inn'},
    {url: 'getNavigation.aspx?screen=2&gambling=1&null=', label: 'Gamble'},
	{url: 'getInfoPerk.aspx?null=', label: 'Perks'},
	{url: compiledSimpleURLTemplate({type: 4}), label: 'Relics'},
    {url: compiledSimpleURLTemplate({type: 5}), label: 'Gems'},
	{url: compiledSimpleURLTemplate({type: 6}), label: 'Orbs'},
    {url: 'getKingdom.aspx?null=', label: 'Kingdom'},
    {url: 'getMap.aspx?null=', label: 'Map'},
    {url: 'getShop.aspx?null=', label: 'Shop'},
    {url: compiledSimpleURLTemplate({type: 3}), label: 'M. Elements'},
];

function getMarketClickElement(label, clickHandler) {
	var html = compiledLinkTemplate({url: clickHandler, label: label});
	return $(html);
}

function ClickableLink ({linkValue, linkText}) {
    const clickHandler = _.partial(sendRequestContentFill, linkValue);
    return <a href="#" onClick={clickHandler}>
        {linkText}
    </a>
}

export function LinkContainer() {
    return <div>
        <div>Quick Links</div>
        <ul>
            {_.map(linkData, ({url, label}) => {
                return <li key={label}><ClickableLink linkValue={url} linkText={label} /></li>;
            })}
            {_.map(marketLinkData, ({type, subType, subSubType, label}) => {
                const url = compiledMarketURLTemplate({type, subType, subSubType});
                return <li key={label}><ClickableLink linkValue={url} linkText={label} /></li>;
            })}
        </ul>
    </div>
}
