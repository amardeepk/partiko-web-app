import React, { Component, PropTypes } from 'react';
import { updateTwilioAttributes, resetTwilioAttributes, linkTwilioChannel, unlinkTwilioChannel, pingTwilioChannel } from '../../services/integrations-service';

import { ReactTelephoneInput } from '../../lib/react-telephone-input';

import { connect } from 'react-redux';
import isMobile from 'ismobilejs';

export class TwilioChannelContentComponent extends Component {

    static contextTypes = {
        settings: PropTypes.object,
        ui: PropTypes.object
    };

    linkTwilioNumber = () => {
        linkTwilioChannel(this.props.userId, {
            type: 'twilio',
            phoneNumber: this.props.appUserNumber.replace(/[()\-\s]/g, '')
        });
    }

    unlinkChannel = () => {
        unlinkTwilioChannel(this.props.userId);
    }

    handleInputChange = (telNumber) => {
        updateTwilioAttributes({
            appUserNumber: telNumber
        });
    }

    onStartTexting = () => {
        updateTwilioAttributes({
            linkState: 'linked'
        });
    }

    onSendText = () => {
        pingTwilioChannel(this.props.userId);
    }

    onNumberValid = () => {
        updateTwilioAttributes({
            appUserNumberValid: true,
            hasError: false
        });
    }

    onNumberInvalid = () => {
        updateTwilioAttributes({ 
            appUserNumberValid: false
        });
    }

    componentWillUnmount() {
        resetTwilioAttributes();
    }

    render() {
        const {appUserNumber, appUserNumberValid, phoneNumber, linkState, errorMessage, hasError} = this.props;
        const {settings: {linkColor}, ui: {text: {smsInvalidNumberError, smsLinkPending, smsStartTexting, smsCancel, smsChangeNumber, smsSendText, smsContinue}}} = this.context;
        let iconStyle = {};
        if (linkColor) {
            iconStyle = {
                color: `#${linkColor}`
            };
        }

        const linkButton = appUserNumberValid ? <button className='btn btn-sk-primary'
                                                        onClick={ this.linkTwilioNumber }>
                                                    { smsContinue }
                                                </button> : '';

        const onEnterKeyPress = appUserNumberValid ? this.linkTwilioNumber : () => {
            // Do nothing on enter if the number is invalid
        };

        const invalidNumberMessage = appUserNumber && !appUserNumberValid ? smsInvalidNumberError : '';

        const warningMessage = invalidNumberMessage || hasError ? <div className='warning-message'>
                                                                      { invalidNumberMessage ? invalidNumberMessage : errorMessage }
                                                                  </div> : '';

        const unlinkedComponent = <div className='twilio-linking unlinked-state'>
                                      <ReactTelephoneInput ref={ (c) => this._telInput = c }
                                                           defaultCountry='us'
                                                           onChange={ this.handleInputChange }
                                                           onValid={ this.onNumberValid }
                                                           onInvalid={ this.onNumberInvalid }
                                                           preferredCountries={ ['us', 'ca'] }
                                                           onEnterKeyPress={ onEnterKeyPress }
                                                           onBlur={ this.handleInputBlur } />
                                      { warningMessage }
                                      { linkButton }
                                  </div>;

        const pendingComponent = <div className='twilio-linking pending-state'>
                                     <i className='fa fa-phone'
                                        style={ iconStyle }></i>
                                     <span className='phone-number'>{ appUserNumber } - { smsLinkPending }</span>
                                     <a onClick={ this.unlinkChannel }>
                                         { smsCancel }
                                     </a>
                                 </div>;

        const sendTextUrl = `sms://${phoneNumber}`;
        const linkStyle = {
            color: 'white'
        };
        const linkedComponentButton = isMobile.phone ? <a href={ sendTextUrl }
                                                          className='btn btn-sk-primary twilio-linking'
                                                          onClick={ this.onStartTexting }
                                                          style={ linkStyle }>
                                                           { smsStartTexting }
                                                       </a> :
            <button className='btn btn-sk-primary twilio-linking'
                    onClick={ this.onSendText }>
                { smsSendText }
            </button>;

        const linkedComponent = <div>
                                    <div className='twilio-linking linked-state'>
                                        <i className='fa fa-phone'
                                           style={ iconStyle }></i>
                                        <span className='phone-number'>{ appUserNumber }</span>
                                        <a onClick={ this.unlinkChannel }>
                                            { smsChangeNumber }
                                        </a>
                                    </div>
                                    { linkedComponentButton }
                                </div>;
        if (linkState === 'pending') {
            return pendingComponent;
        } else if (linkState === 'linked') {
            return linkedComponent;
        } else {
            return unlinkedComponent;
        }
    }
}

export const TwilioChannelContent = connect((state) => {
    return {
        ...state.integrations.twilio,
        userId: state.user._id
    };
})(TwilioChannelContentComponent);
