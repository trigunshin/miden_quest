import React, {PropTypes} from 'react';
import _ from 'lodash';

export const InputElement = React.createClass({
	propTypes: {
        type: PropTypes.string.isRequired,
        classNames: PropTypes.string,
        value: PropTypes.any.isRequired,
        onChange: PropTypes.func.isRequired
    },
    render() {
        let inp = null;
        if(this.props.type=='number') {
            inp = <input type={'number'} step={'1'} min={'0'} className={'form-control'} value={this.props.value} onChange={this.props.onChange} />;
        } else if(this.props.type=='text') {
            inp = <input type={'text'} className={'form-control'} value={this.props.value} onChange={this.props.onChange} />;
        }
        let classString = 'col-md-1';
        if(this.props.classNames) classString = _.join(_.concat(['col-md-1'], this.props.classNames),' ');

        return (<div className={classString}>
            {inp}
        </div>);
    }
});

// Selectable options
export const SelectElement = ({options, value, onChange}) => {
    return <select className="form-control" value={value} onChange={onChange}>
        {_.map(options, (option) => {const lowerOption = _.lowerCase(option);return <option value={lowerOption} key={lowerOption}>{option}</option>})}
    </select>;
};
