import { configureStore } from '@reduxjs/toolkit';
import channelReducer from '../features/channels/channelsSlice.js';
import messagesReducer from '../features/messages/messagesSlice.js';
import userReducer from '../features/users/userSlice.js';

export default configureStore({
  reducer: {
    channels: channelReducer,    // Свойство channels будет внутри объекта общего состояния: state.channels
    messages: messagesReducer,   // Свойство messages будет внутри объекта общего состояния: state.messages
    user: userReducer, // Свойство user будет внутри объекта общего состояния: state.user
  },
})