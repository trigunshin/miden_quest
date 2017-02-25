import React from 'react';
import ReactDOM from 'react-dom';

class Toggle extends React.Component {
    toggleVisible = (e) => {
        this.setState({visible: !this.state.visible});
    };
    constructor(props) {
        super(props);
        this.state = {visible: true};
    }
    render() {
        const label = <a href="#">{this.props.label}</a>;
        return (<div className='widget'>
            <div style={{color: 'red', 'fontSize': '2em'}} onClick={this.toggleVisible}>{label}</div>
            {this.state.visible && this.props.children}
        </div>);
    }
}
Toggle.propTypes = {label: React.PropTypes.string.isRequired};

export default Toggle;
