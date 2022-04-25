import { createSlice } from '@reduxjs/toolkit'

const conversationSlice = createSlice({
    name: 'conversation',
    initialState: {
        conversations: [],
        isFetching: false,
        error: false,
    },
    reducers: {
        //GET CONVERSATIONS
        getConversationsStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        getConversationsSuccess: (state, action) => {
            state.isFetching = false;
            state.conversations = action.payload;
            state.error = false;
        },
        getConversationsFailure: (state) => {
            state.error = true; state.isFetching = false;
        },
        //DELETE CONVERSATION
        deleteConversationStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        deleteConversationSuccess: (state, action) => {
            state.isFetching = false;
            state.conversations.splice(
                state.conversations.findIndex(item => item.id === action.payload), 1
            )
            state.error = false;
        },
        deleteConversationFailure: (state) => {
            state.error = true; state.isFetching = false;
        },
        //UPDATE CONVERSATION
        updateConversationStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        updateConversationSuccess: (state, action) => {
            state.isFetching = false;
            action.payload.map(conversation => {
                state.conversations[state.conversations.findIndex(item => item.id === conversation.id)] = conversation;
            })
            state.error = false;
        },
        updateConversationFailure: (state) => {
            state.error = true; state.isFetching = false;
        },
        //ADD CONVERSATION
        addConversationStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        addConversationSuccess: (state, action) => {
            state.isFetching = false;
            state.conversations.push(action.payload)
            state.error = false;
        },
        addConversationFailure: (state) => {
            state.error = true; state.isFetching = false;
        },
        //ADD MESSAGE
        addMessageStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        addMessageSuccess: (state, action) => {
            state.isFetching = false;
            state.conversations[state.conversations.findIndex(item => item.id === action.payload.conversation_id)].Messages.push(action.payload)
            state.error = false;
        },
        addMessageFailure: (state) => {
            state.error = true; state.isFetching = false;
        },
    },
})

export const {
    getConversationsStart, getConversationsSuccess, getConversationsFailure,
    deleteConversationStart, deleteConversationSuccess, deleteConversationFailure,
    updateConversationFailure, updateConversationSuccess, updateConversationStart,
    addConversationFailure, addConversationSuccess, addConversationStart,
    addMessageFailure, addMessageSuccess, addMessageStart,
} = conversationSlice.actions
export default conversationSlice.reducer