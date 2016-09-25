import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { immediateUpdate } from '../services/user-service';
import { hideSettings } from '../actions/app-state-actions';

export class EmailSettingsComponent extends Component {
    static contextTypes = {
        ui: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired
    };

    static defaultProps = {
        settings: {}
    };

    state = {
        email: this.props.user.email,
        hasError: false
    };

    onChange = (e) => {
        this.setState({
            email: e.target.value,
            hasError: false
        });
    };

    save = (e) => {
        e.preventDefault();

        // http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        const regex = /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        const email = this.state.email;

        var isValid = regex.test(email);

        if (isValid) {
            return immediateUpdate({
                email: email
            }).then(() => {
                this.props.actions.hideSettings();
            });
        } else {
            return Promise.resolve().then(() => {
                this.setState({
                    hasError: true
                });
            });
        }
    };

    render() {
        const hasError = this.state.hasError;
        const {settings, ui: {text}} = this.context;
        const {appState, user} = this.props;

        const style = {};

        if (settings.linkColor) {
            style.backgroundColor = style.borderColor = `#${settings.linkColor}`;
        }

        const button = appState.readOnlyEmail ? null : (
            <div className='input-group'>
                <button ref='button'
                        disabled={ hasError }
                        type='button'
                        className='btn btn-sk-primary'
                        style={ style }
                        onClick={ this.save }>
                    { text.settingsSaveButtonText }
                </button>
            </div>
            );

        return <div className='settings-wrapper content-wrapper'>
                   <p ref='description'>
                       { appState.readOnlyEmail ? text.settingsReadOnlyText : text.settingsText }
                   </p>
                   <form onSubmit={ this.save }>
                       <div className={ hasError ? 'input-group has-error' : 'input-group' }>
                           <i className='fa fa-envelope-o before-icon'></i>
                           <input disabled={ appState.readOnlyEmail }
                                  ref='input'
                                  type='email'
                                  placeholder={ text.settingsInputPlaceholder }
                                  className='input email-input'
                                  onChange={ this.onChange }
                                  defaultValue={ user.email } />
                       </div>
                       { button }
                   </form>
               </div>;
    }
}

export const EmailSettings = connect((state) => {
    return {
        appState: state.appState,
        user: state.user
    };
}, (dispatch) => {
    return {
        actions: bindActionCreators({
            hideSettings
        }, dispatch)
    };
})(EmailSettingsComponent);
