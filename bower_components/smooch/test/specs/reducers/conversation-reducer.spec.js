import { ConversationReducer } from '../../../src/js/reducers/conversation-reducer';
import { ADD_MESSAGE, REPLACE_MESSAGE, RESET_CONVERSATION, REMOVE_MESSAGE, SET_CONVERSATION, RESET_UNREAD_COUNT, INCREMENT_UNREAD_COUNT, ADD_MESSAGES, SET_MESSAGES } from '../../../src/js/actions/conversation-actions';

const INITIAL_STATE = ConversationReducer(undefined, {});
const MESSAGE_1 = {
    text: 'hi!',
    role: 'appUser',
    received: 123.456,
    authorId: '8a9445dadad4862c2322db52',
    name: 'Calm Chimpanzee',
    _id: '123456'
};
const MESSAGE_2 = {
    text: 'hello',
    role: 'appUser',
    received: 789.101,
    authorId: '8a9445dadad4862c2322db52',
    name: 'Calm Chimpanzee',
    _id: '789101'
};
const MESSAGES = [MESSAGE_1, MESSAGE_2];
const MESSAGE_FROM_APP_USER = {
    text: 'hey there!',
    role: 'appUser',
    received: 234.678,
    authorId: '8a9445dadad4862c2322db52',
    name: 'Calm Chimpanzee',
    _clientId: '123498001'
};
const MESSAGE_FROM_APP_MAKER_1 = {
    text: 'hello',
    role: 'appMaker',
    received: 823.4,
    authorId: '435nkglksdgf',
    name: 'Chloe',
    _id: '129381203'
};
const MESSAGE_FROM_APP_MAKER_2 = {
    text: 'hello2',
    role: 'appMaker',
    received: 823.5,
    authorId: '435nkglksdgf',
    name: 'Chloe',
    _id: 'sdgiuq4tct'
};
const MESSAGE_FROM_APP_MAKER_3 = {
    text: 'hello3',
    role: 'appMaker',
    received: 823.6,
    authorId: '435nkglksdgf',
    name: 'Chloe',
    _id: '234tvert'
};
const MESSAGES_FROM_APP_MAKER = [MESSAGE_FROM_APP_MAKER_1, MESSAGE_FROM_APP_MAKER_2, MESSAGE_FROM_APP_MAKER_3];
const MESSAGE_FROM_DIFFERENT_APP_MAKER = {
    text: 'message',
    role: 'appMaker',
    received: 834.5,
    authorId: 'differentauthorid1234',
    name: 'Not Chloe',
    _id: '23452346'
};
const UPLOADING_IMAGE_1 = {
    mediaUrl: 'data:image/jpeg',
    mediaType: 'image/jpeg',
    role: 'appUser',
    status: 'sending',
    _clientId: 0.8288994217337065,
    _clientSent: '2016-05-19T18:33:10.788Z'
};
const UPLOADING_IMAGE_2 = {
    mediaUrl: 'data:image/jpeg',
    mediaType: 'image/jpeg',
    role: 'appUser',
    status: 'sending',
    _clientId: 0.901823905092145,
    _clientSent: '2016-05-19T19:34:10.788Z'
};
const RECEIVED_IMAGE = {
    text: 'some_media_url',
    mediaType: 'image/jpeg',
    mediaUrl: 'some_media_url',
    role: 'appUser',
    received: 1463682757.454,
    authorId: '8a9445dadad4862c2322db52',
    name: 'Calm Chimpanzee',
    _id: '573e06c550a52d2900f907c6'
};
const WHISPER_MESSAGE = {
    role: 'whisper',
    authorId: '123124214124.1242',
    name: 'Chloe',
    ruleId: '1234',
    text: 'Hey this is a whisper!',
    avatarUrl: 'avatar_url/',
    _id: '112351241cd1v5',
    received: 1234.567,
    source: {
        type: 'whisper'
    },
    actions: []
};

describe('Conversation reducer', () => {

    describe('SET_CONVERSATION action', () => {
        it('should set state conversation with messages from action', () => {
            const beforeState = {
                messages: MESSAGES
            };
            const afterState = ConversationReducer(beforeState, {
                type: SET_CONVERSATION,
                conversation: {}
            });
            afterState.messages.length.should.eq(2);
            afterState.messages.should.contain(MESSAGE_1);
            afterState.messages.should.contain(MESSAGE_2);
        });

        it('should not add a duplicate message', () => {
            const beforeState = {
                unreadCount: 4,
                messages: MESSAGES
            };
            const afterState = ConversationReducer(beforeState, {
                type: SET_CONVERSATION,
                conversation: {
                    messages: [...MESSAGES, MESSAGE_1],
                    appUsers: [],
                    appMakers: []
                }
            });
            afterState.messages.length.should.eq(2);
            afterState.messages.should.eql(MESSAGES);
        });
    });

    describe('ADD_MESSAGE action', () => {
        it('should add message', () => {
            const beforeState = INITIAL_STATE;
            const afterState = {
                messages: [MESSAGE_FROM_APP_USER],
                unreadCount: 0,
                hasMoreMessages: false,
                isFetchingMoreMessagesFromServer: false
            };
            ConversationReducer(beforeState, {
                type: ADD_MESSAGE,
                message: MESSAGE_FROM_APP_USER
            }).should.eql(afterState);
        });

        it('should keep uploading image at the end of the messages array', () => {
            const beforeState = {
                messages: [MESSAGE_1, UPLOADING_IMAGE_1],
                unreadCount: 0
            };
            const afterState = ConversationReducer(beforeState, {
                type: ADD_MESSAGE,
                message: MESSAGE_FROM_APP_USER
            });
            afterState.messages.length.should.eq(3);
            afterState.messages[0].should.eql(MESSAGE_1);
            afterState.messages[1].should.eql(MESSAGE_FROM_APP_USER);
            afterState.messages[2].should.eql(UPLOADING_IMAGE_1);
        });

        it('should add appMaker message', () => {
            const beforeState = {
                messages: MESSAGES,
                unreadCount: 0
            };
            const afterState = ConversationReducer(beforeState, {
                type: ADD_MESSAGE,
                message: MESSAGE_FROM_APP_MAKER_1
            });
            afterState.messages.length.should.eq(3);
            afterState.messages[0].should.eql(MESSAGE_1);
            afterState.messages[1].should.eql(MESSAGE_2);
            afterState.messages[2].should.eql(MESSAGE_FROM_APP_MAKER_1);
        });

        it('should add multiple messages from same appMaker', () => {
            let state = INITIAL_STATE;
            MESSAGES_FROM_APP_MAKER.forEach((appMakerMessage) => {
                state = ConversationReducer(state, {
                    type: ADD_MESSAGE,
                    message: appMakerMessage
                });
            });
            state.messages.length.should.eq(3);
            state.messages[0].should.eql(MESSAGE_FROM_APP_MAKER_1);
            state.messages[1].should.eql(MESSAGE_FROM_APP_MAKER_2);
            state.messages[2].should.eql(MESSAGE_FROM_APP_MAKER_3);
        });

        it('should add messages from different appMakers', () => {
            const appMakerMessages = [MESSAGE_FROM_APP_MAKER_1, MESSAGE_FROM_DIFFERENT_APP_MAKER];
            let state = INITIAL_STATE;
            appMakerMessages.forEach((appMakerMessage) => {
                state = ConversationReducer(state, {
                    type: ADD_MESSAGE,
                    message: appMakerMessage
                });
            });
            state.messages.length.should.eq(2);
            state.messages[0].should.eql(MESSAGE_FROM_APP_MAKER_1);
            state.messages[1].should.eql(MESSAGE_FROM_DIFFERENT_APP_MAKER);
        });

        it('should add a whisper message', () => {
            const beforeState = INITIAL_STATE;
            const afterState = ConversationReducer(beforeState, {
                type: ADD_MESSAGE,
                message: WHISPER_MESSAGE,
                hasMoreMessages: false,
                isFetchingMoreMessagesFromServer: false
            });
            afterState.messages.length.should.eq(1);
            afterState.messages[0].should.eql(WHISPER_MESSAGE);
        });
    });

    describe('REPLACE_MESSAGE action', () => {
        it('should replace uploading image with received image', () => {
            const beforeState = {
                messages: [MESSAGE_1, UPLOADING_IMAGE_1],
                unreadCount: 0
            };
            const afterState = ConversationReducer(beforeState, {
                type: REPLACE_MESSAGE,
                message: RECEIVED_IMAGE,
                queryProps: {
                    _clientId: UPLOADING_IMAGE_1._clientId
                }
            });
            afterState.messages.length.should.eq(2);
            afterState.messages[1].should.not.eql(UPLOADING_IMAGE_1);
            afterState.messages[1].should.eql({
                ...RECEIVED_IMAGE,
                _clientId: UPLOADING_IMAGE_1._clientId,
                firstInGroup: undefined,
                lastInGroup: false
            });
        });

        it('should not remove anything if message to be removed does not exist', () => {
            const beforeState = {
                messages: [MESSAGE_1, UPLOADING_IMAGE_1],
                unreadCount: 0
            };
            const afterState = ConversationReducer(beforeState, {
                type: REPLACE_MESSAGE,
                message: RECEIVED_IMAGE,
                queryProps: {
                    _clientId: 1234
                }
            });
            afterState.messages.length.should.eq(2);
            afterState.should.eql(beforeState);
        });

        it('should keep uploading images at bottom', () => {
            const beforeState = {
                messages: [UPLOADING_IMAGE_2, UPLOADING_IMAGE_1],
                unreadCount: 0
            };
            const afterState = ConversationReducer(beforeState, {
                type: REPLACE_MESSAGE,
                message: RECEIVED_IMAGE,
                queryProps: {
                    _clientId: UPLOADING_IMAGE_1._clientId
                }
            });
            afterState.messages.length.should.eq(2);
            afterState.messages[0].should.eql({
                ...RECEIVED_IMAGE,
                _clientId: UPLOADING_IMAGE_1._clientId,
                firstInGroup: undefined,
                lastInGroup: false
            });
            afterState.messages[1].should.eql(UPLOADING_IMAGE_2);
        });
    });

    describe('REMOVE_MESSAGE action', () => {
        it('should remove a message', () => {
            const beforeState = {
                messages: [MESSAGE_FROM_APP_USER],
                unreadCount: 0
            };
            const afterState = ConversationReducer(beforeState, {
                type: REMOVE_MESSAGE,
                queryProps: {
                    _clientId: MESSAGE_FROM_APP_USER._clientId
                }
            });
            afterState.messages.length.should.eq(0);
        });
    });

    describe('SET_MESSAGES action', () => {
        it('should set action messages to state', () => {
            const beforeState = INITIAL_STATE;
            const afterState = ConversationReducer(beforeState, {
                type: SET_MESSAGES,
                messages: MESSAGES
            });
            afterState.messages.should.eql(MESSAGES);
        });

        it('should not add duplicate messages', () => {
            const beforeState = INITIAL_STATE;
            const afterState = ConversationReducer(beforeState, {
                type: SET_MESSAGES,
                messages: [...MESSAGES, ...MESSAGES]
            });
            afterState.messages.should.eql(MESSAGES);
        });
    });

    describe('ADD_MESSAGES action', () => {
        [true, false].forEach((shouldAppend) => {
            describe(`append option is set to ${shouldAppend}`, () => {
                it(`should add messages to the ${shouldAppend ? 'end' : 'beginning'} of the state messages`, () => {
                    const beforeState = {
                        messages: [MESSAGE_1]
                    };
                    const afterState = ConversationReducer(beforeState, {
                        type: ADD_MESSAGES,
                        messages: [MESSAGE_2],
                        append: shouldAppend
                    });
                    const messages = shouldAppend ? [...MESSAGE_1, ...MESSAGE_2] : [...MESSAGE_1, ...MESSAGE_2];
                    afterState.messages.should.eql(messages);
                });
            });
        });

        it('should not add duplicates', () => {
            const beforeState = {
                messages: [MESSAGE_1]
            };
            const afterState = ConversationReducer(beforeState, {
                type: ADD_MESSAGES,
                messages: [MESSAGE_1],
                append: true
            });
            afterState.messages.length.should.eq(1);
            afterState.messages[0].should.eq(MESSAGE_1);
        });
    });

    it('should set to initial state on RESET_CONVERSATION', () => {
        const beforeState = {
            unreadCount: 123,
            messages: MESSAGES
        };
        const afterState = INITIAL_STATE;
        ConversationReducer(beforeState, {
            type: RESET_CONVERSATION
        }).should.eql(afterState);
    });

    it('should increment unread count on INCREMENT_UNREAD_COUNT', () => {
        const beforeState = INITIAL_STATE;
        const afterState = {
            messages: [],
            unreadCount: 1,
            hasMoreMessages: false,
            isFetchingMoreMessagesFromServer: false
        };
        ConversationReducer(beforeState, {
            type: INCREMENT_UNREAD_COUNT
        }).should.eql(afterState);
    });

    it('should reset unread count on RESET_UNREAD_COUNT', () => {
        const beforeState = {
            messages: [],
            unreadCount: 100,
            hasMoreMessages: false,
            isFetchingMoreMessagesFromServer: false
        };
        const afterState = INITIAL_STATE;
        ConversationReducer(beforeState, {
            type: RESET_UNREAD_COUNT
        }).should.eql(afterState);
    });
});
