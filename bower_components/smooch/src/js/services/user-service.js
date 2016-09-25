import deepEqual from 'deep-equal';

import { store } from '../stores/app-store';
import { setUser } from '../actions/user-actions';
import { core } from './core';
import { handleConversationUpdated } from './conversation-service';

let waitForSave = false;
const waitDelay = 5000; // ms
let pendingUserProps = {};
let previousValue = Promise.resolve();
let deviceUpdateThrottle;
let deviceUpdatePending = false;

export const EDITABLE_PROPERTIES = [
    'givenName',
    'surname',
    'email',
    'signedUpAt',
    'properties'
];

export function immediateUpdate(props) {
    const {user} = store.getState();

    props = Object.assign({}, pendingUserProps, props);
    pendingUserProps = {};

    const isDirty = EDITABLE_PROPERTIES.reduce((isDirty, prop) => {
        return isDirty || !deepEqual(user[prop], props[prop]);
    }, false);

    return isDirty ? core().appUsers.update(getUserId(), props).then((response) => {
        store.dispatch(setUser(response.appUser));
        return response;
    }) : Promise.resolve({
        user
    });
}

export function update(props) {
    Object.assign(pendingUserProps, props);

    if (waitForSave) {
        return previousValue;
    } else {
        previousValue = immediateUpdate(pendingUserProps);
        waitForSave = true;

        setTimeout(() => {
            previousValue = immediateUpdate(pendingUserProps);
            waitForSave = false;
        }, waitDelay);
    }

    return previousValue;
}

export function trackEvent(eventName, userProps) {
    return core().appUsers.trackEvent(getUserId(), eventName, userProps).then((response) => {
        if (response.conversationUpdated) {
            return handleConversationUpdated().then(() => {
                return response;
            });
        }

        return response;
    });
}

export function updateNowViewing(deviceId) {
    if (!deviceUpdateThrottle) {
        deviceUpdateThrottle = setTimeout(() => {
            deviceUpdateThrottle = null;

            if (deviceUpdatePending) {
                updateNowViewing(deviceId);
                deviceUpdatePending = false;
            }
        }, waitDelay);

        return immediateUpdateDevice(deviceId, {
            info: {
                currentUrl: document.location.href,
                currentTitle: document.title
            }
        });
    } else {
        deviceUpdatePending = true;
        return Promise.resolve();
    }
}

function immediateUpdateDevice(deviceId, device) {
    return core().appUsers.updateDevice(getUserId(), deviceId, device).then((response) => {
        if (response.conversationUpdated) {
            return handleConversationUpdated().then(() => {
                return response;
            });
        }

        return response;
    });
}

export function getUserId() {
    const {user: {_id, userId}} = store.getState();

    return userId || _id;
}
