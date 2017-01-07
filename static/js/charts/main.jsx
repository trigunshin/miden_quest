import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import $ from 'jquery';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const tiers = ['t1','t2','t3','t4','t5'];
const resources = ['wood', 'fish', 'ore', 'plant'];

export const ChartPane = React.createClass({
    fetchResourceData() {
        const aws_endpoint = 'https://www.midenquest.info/market/list';

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
                this.setState({resourceData: data});
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
    getResourceColor(resource) {
        if(resource === 'fish') {
            return '#0000ff';
        } else if (resource === 'ore') {
            return '#808080';
        } else if (resource === 'plant') {
            return '#00ff00';
        } else {
            return '#8B4513';
        }
    },
    render() {
        const resData = this.state.resourceData;
        const gems = _.map(resData, (data) => {return data.gem});
        const chartOptions = {};
        const chartData = gems;

        return (
            <LineChart width={700} height={200} data={resData}>
                {
                    _.map(resources, (resource) => {
                        return _.map(tiers, (tier) => {
                            return <Line type="monotone" dataKey={resource + '_' + tier} stroke={this.getResourceColor(resource)} />
                        })
                    })
                }
                <Line type="monotone" dataKey="wood_t1" stroke="#8884d8" />
                <XAxis dataKey='ts' />
                <YAxis />
                <Tooltip />
                <Legend />
            </LineChart>
        );
    }
});
