import React, { Component, PropTypes } from 'react';
import StripeCheckout from 'react-stripe-checkout';

import { store } from '../stores/app-store';
import { createTransaction } from '../services/stripe-service';
import { immediateUpdate } from '../services/user-service';
import { postPostback } from '../services/conversation-service';

import { getIntegration } from '../utils/app';

import { LoadingComponent } from './loading';

export class ActionComponent extends Component {
    static contextTypes = {
        app: PropTypes.object.isRequired,
        ui: PropTypes.object.isRequired
    };

    static propTypes = {
        text: PropTypes.string.isRequired,
        type: PropTypes.string,
        buttonColor: PropTypes.string,
        amount: PropTypes.string,
        currency: PropTypes.string,
        uri: PropTypes.string,
        state: PropTypes.string
    };

    static defaultProps = {
        type: 'link'
    };

    constructor(...args) {
        super(...args);

        this.state = {
            state: this.props.state,
            hasToken: false
        };
    }

    onPostbackClick = () => {
        this.setState({
            state: 'processing'
        });

        postPostback(this.props._id)
            .then(() => {
                this.setState({
                    state: ''
                });
            })
            .catch(() => {
                this.setState({
                    state: ''
                });
            });
    };

    onStripeToken(token) {
        this.setState({
            hasToken: true
        });

        const user = store.getState().user;
        const promises = [];
        if (!user.email) {
            promises.push(immediateUpdate({
                email: token.email
            }));
        }

        const transactionPromise = createTransaction(this.props._id, token.id)
            .then(() => {
                this.setState({
                    state: 'paid'
                });
            })
            .catch(() => {
                this.setState({
                    state: 'offered'
                });
            });

        promises.push(transactionPromise);

        return Promise.all(promises);
    }

    onStripeClick() {
        this.setState({
            state: 'processing'
        });
    }

    onStripeClose() {
        if (!this.state.hasToken) {
            this.setState({
                state: 'offered'
            });
        }
    }

    render() {
        const {app, ui: {text: {actionPaymentCompleted}}} = this.context;
        const {buttonColor, amount, currency, text, uri, type} = this.props;
        const {state} = this.state;

        const stripeIntegration = getIntegration(app.integrations, 'stripeConnect');

        let style = {};
        if (buttonColor) {
            style.backgroundColor = style.borderColor = `#${buttonColor}`;
        }

        // the public key is necessary to use with Checkout
        // use the link fallback if this happens
        if (type === 'buy' && stripeIntegration) {
            const user = store.getState().user;

            // let's change this when we support other providers
            const stripeAccount = app.stripe;
            if (state === 'offered') {
                return <StripeCheckout componentClass='div'
                                       className='sk-action'
                                       token={ this.onStripeToken.bind(this) }
                                       stripeKey={ stripeIntegration.publicKey }
                                       email={ user.email }
                                       amount={ amount }
                                       currency={ currency.toUpperCase() }
                                       name={ stripeAccount.appName }
                                       image={ stripeAccount.iconUrl }
                                       closed={ this.onStripeClose.bind(this) }>
                           <button className='btn btn-sk-primary'
                                   onClick={ this.onStripeClick.bind(this) }
                                   style={ style }>
                               { text }
                           </button>
                       </StripeCheckout>;
            } else {
                const buttonText = state === 'paid' ?
                    actionPaymentCompleted :
                    <LoadingComponent />;

                if (state === 'paid') {
                    style = {};
                }

                return <div className='sk-action'>
                           <div className={ `btn btn-sk-action-${state}` }
                                style={ style }>
                               { buttonText }
                           </div>
                       </div>;
            }
        } else if (type === 'postback') {
            const isProcessing = state === 'processing';
            const buttonText = isProcessing ?
                <LoadingComponent /> :
                text;

            return <div className='sk-action'>
                       <button className='btn btn-sk-primary'
                               style={ style }
                               onClick={ !isProcessing && this.onPostbackClick }>
                           { buttonText }
                       </button>
                   </div>;
        } else {
            const isJavascript = uri.startsWith('javascript:');

            return <div className='sk-action'>
                       <a className='btn btn-sk-primary'
                          href={ uri }
                          target={ isJavascript ? '_self' : '_blank' }
                          style={ style }>
                           { text }
                       </a>
                   </div>;
        }
    }
}
