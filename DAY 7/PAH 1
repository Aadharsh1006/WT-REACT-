import React, { Component } from 'react';

class Lifecycle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: 'Hello, React!',
        };
        console.log('Constructor called');
    }

    componentDidMount() {
        console.log('ComponentDidMount called');
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('ComponentDidUpdate called');
    }

    componentWillUnmount() {
        console.log('ComponentWillUnmount called');
    }

    handleClick = () => {
        this.setState({ message: 'Updated message!' });
    };

    render() {
        console.log('Render called');
        return (
            <div>
                <p>{this.state.message}</p>
                <button onClick={this.handleClick}>Update Message</button>
            </div>
        );
    }
}

export default Lifecycle;
