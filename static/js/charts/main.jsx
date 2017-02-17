import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import $ from 'jquery';
import {Chart} from 'react-google-charts';
import {tiers, tierFactors} from '../defaultStates';

const resources = ['wood', 'fish', 'ore', 'plant'];

function getRows(resData, keyList) {
    return _.map(resData, (resDatum) => {
        const timestamp = new Date(resDatum['ts']);
        const values = _.map(keyList, (key) => {
            return _.get(resDatum, key);
        });
        return [timestamp].concat(values);
    });
}

function getTradeComparison(resDatum) {
    const ts = new Date(resDatum['ts']);
    const avgValues = _.map(resources, (resource) => {
        return _.reduce(tiers, (accum, tier) => {
            return accum + resDatum[resource][tier] * tierFactors[tier];
        }, 0);
    });
    return [ts].concat(avgValues);
}

const LocalChart = ({resData, columnLabels, rowData, title}) => {
    // default options
    const chartOptions = {
        "options":{
            "legend":true,
            "hAxis":{"title":"Time", format: 'M/d/yy hh:mm'},
            "vAxis":{"title":"Gold"}
        },
        "width":"100%",
        "chartType":"LineChart"
    };
    if(title) chartOptions.options.title = title;

    // set up time column & the 5x tier columns
    const tsCol = {"label":"time","type":"datetime","p":{}};
    const cols = [tsCol].concat(_.map(columnLabels, (label) => {
        return {label,"type":"number","p":{}};
    }));
    chartOptions.rows = rowData;
    chartOptions.columns = cols;
    return <Chart {...chartOptions} />;
};

const DualAxisChart = ({resData, title}) => {
    // default options
    const chartOptions = {
        "options":{
            "legend":true,
            "hAxis":{"title":"Time", format: 'M/d/yy hh:mm'},
            "vAxis":{"title":"Gold"},
            series: {
              0: {targetAxisIndex: 0},
              1: {targetAxisIndex: 1}
            },
            vAxes: {
              // Adds titles to each axis.
              0: {title: 'Gem Gold'},
              1: {title: 'Relic Gold'}
            },
        },
        "width":"100%",
        "chartType":"LineChart"
    };
    if(title) chartOptions.options.title = title;
    const items = ['gem', 'relic'];
    // set up time column, etc
    let cols = [{"label":"time","type":"datetime","p":{}}];
    cols = cols.concat(_.map(items, (item) => {
        return {"label": item,"type":"number","p":{}};
    }));

    chartOptions.rows = getRows(resData, ['gem', 'relic']);
    chartOptions.columns = cols;
    return <Chart {...chartOptions} />;
};

const ResourceTierChart = ({resData, resource, tiers, title}) => {
    // default options
    const chartOptions = {
        "options":{
            "legend":true,
            "hAxis":{"title":"Time", format: 'M/d/yy hh:mm'},
            "vAxis":{"title":"Gold"}
        },
        "width":"100%",
        "chartType":"LineChart"
    };
    if(title) chartOptions.options.title = title;

    // set up time column & the 5x tier columns
    let cols = [{"label":"time","type":"datetime","p":{}}];
    cols = cols.concat(_.map(tiers, (tier) => {
        return {"label": resource + " " + tier,"type":"number","p":{}};
    }));

    // set up each instance's row with time then tiers 1-5
    let resourceRows = _.map(resData, (resDatum) => {
        let ret = [new Date(resDatum.ts)];
        const resTiers = _.map(tiers, (tier) => {
            const key = resource + '_' + tier;
            return resDatum[key];
        });
        return ret.concat(resTiers);
    });
    let rows = [].concat(resourceRows);

    chartOptions.rows = rows;
    chartOptions.columns = cols;
    return <Chart {...chartOptions} />;
};

const ItemChart = ({resData, items, title}) => {
    // default options
    const chartOptions = {
        "options":{
            "legend":true,
            "hAxis":{"title":"Time", format: 'M/d/yy hh:mm'},
            "vAxis":{"title":"Gold"}
        },
        "width":"100%",
        "chartType":"LineChart"
    };
    if(title) chartOptions.options.title = title;

    // set up time column & the 5x tier columns
    let cols = [{"label":"time","type":"datetime","p":{}}];
    cols = cols.concat(_.map(items, (item) => {
        return {"label": item,"type":"number","p":{}};
    }));

    // set up each instance's row with time then items
    let itemRows = _.map(resData, (resDatum) => {
        let ret = [new Date(resDatum.ts)];
        const resTiers = _.map(items, (item) => {
            return resDatum[item];
        });
        return ret.concat(resTiers);
    });
    let rows = [].concat(itemRows);

    chartOptions.rows = rows;
    chartOptions.columns = cols;
    return <Chart {...chartOptions} />;
};

export const ChartPane = React.createClass({
    fetchResourceData() {
        const aws_endpoint = 'https://miden-quest.herokuapp.com/market/list';

        $.ajax({
            url: aws_endpoint,
            type: 'GET',
            success: (data)=>{
                _.each(data, (datum) => {
                    _.each(resources, (resource) => {
                        _.each(tiers, (tier) => {
                            const label = resource + '_' + tier;
                            datum[label] = datum[resource][tier];
                        });
                    });
                });
                console.info('got data', data);
                this.setState({resourceData: _.reverse(data)});
            },
            error: ()=>{
                console.info('error getting data');
            }
        });
    },
    getInitialState() {
        return {resourceData: []};
    },
    componentWillMount() {
        this.fetchResourceData();
    },
    render() {
        const resData = this.state.resourceData;
        const gems = _.map(resData, (data) => {return data.gem});
        const chartData = gems;

        if(resData.length <= 0) return (<div>EMPTY</div>);
/*
<ItemChart resData={resData} items={['gem']} />
                <ItemChart resData={resData} items={['relic']} />
 */
        return (
            <div>
                <div>
                    <DualAxisChart resData={resData} title="Gem & Relic"/>
                </div>
                <div>
                    <ItemChart resData={resData} items={['orb', 'scroll']} title="Orb & Scroll" />
                </div>
                <div>
                    <LocalChart resData={resData} columnLabels={resources} rowData={_.map(resData, getTradeComparison)}
                    title="Tier Price * TierAmountFactor"/>
                </div>
                {resData && _.map(resources, (resource) => {
                    return <ResourceTierChart key={resource} resData={resData} resource={resource} tiers={tiers} />
                })}
            </div>
        );
    }
});
