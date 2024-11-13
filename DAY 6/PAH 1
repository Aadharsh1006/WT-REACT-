import React, { Component } from 'react';

const WithLoading = (WrappedComponent) => {
    return class WithLoading extends Component {
        state = {
            isLoading: true,
        };

        componentDidMount() {
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 2000);
        }

        render() {
            const { isLoading } = this.state;

            return isLoading ? (
                <div>Loading...</div>
            ) : (
                <WrappedComponent {...this.props} />
            );
        }
    };
};

export default WithLoading;
