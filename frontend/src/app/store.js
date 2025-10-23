import { configureStore } from '@reduxjs/toolkit';
import channelReducer from '..features/channels/configureSlice';
import messagesReducer from '..features/messages/messagesSlice';

export default configureStore({
  reducer: {
    channels: channelReducer,    // Свойство channels будет внутри объекта общего состояния: state.channels
    messages: messagesReducer,   // Свойство messages будет внутри объекта общего состояния: state.messages
  },
})