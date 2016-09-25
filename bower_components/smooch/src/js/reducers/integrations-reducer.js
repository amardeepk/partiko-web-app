import { RESET_APP } from '../actions/app-actions';
import { RESET } from '../actions/common-actions';
import { SET_WECHAT_QR_CODE, SET_WECHAT_ERROR, UNSET_WECHAT_ERROR, SET_TWILIO_INTEGRATION_STATE, RESET_TWILIO_INTEGRATION_STATE, RESET_INTEGRATIONS } from '../actions/integrations-actions';

const INITIAL_STATE = {
    wechat: {
        hasError: false,
        qrCode: ''
    },
    twilio: {
        linkState: 'unlinked',
        appUserNumber: '',
        hasError: false
    }
};

export function IntegrationsReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case RESET:
        case RESET_APP:
        case RESET_INTEGRATIONS:
            return {
                ...INITIAL_STATE
            };
        case SET_WECHAT_QR_CODE:
            return {
                ...state,
                wechat: {
                    ...state.wechat,
                    qrCode: action.code
                }
            };
        case SET_WECHAT_ERROR:
            return {
                ...state,
                wechat: {
                    ...state.wechat,
                    hasError: true
                }
            };
        case UNSET_WECHAT_ERROR:
            return {
                ...state,
                wechat: {
                    ...state.wechat,
                    hasError: false
                }
            };
        case SET_TWILIO_INTEGRATION_STATE:
            return {
                ...state,
                twilio: {
                    ...state.twilio,
                    ...action.attrs
                }
            };
        case RESET_TWILIO_INTEGRATION_STATE:
            return INITIAL_STATE;
        default:
            return state;
    }
}
