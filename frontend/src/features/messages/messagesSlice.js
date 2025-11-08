import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'

const messagesAdapter = createEntityAdapter()
const initialState = messagesAdapter.getInitialState({ list: [] })

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: messagesAdapter.setAll,
    addMessage: messagesAdapter.addOne,
    removeMessagesByChannelsId: (state, action) => {
      const channelId = action.payload
      const messages = Object.values(state.entities || {})
      const idsToRemove = messages
        .filter((m) => m.channelId === channelId)
        .map((m) => m.id) // тут массив ID-шников на выходе
      messagesAdapter.removeMany(state, idsToRemove)
    },
  },
})

export const messagesSelectors = messagesAdapter.getSelectors((state) => state.messages)

export const { setMessages, addMessage, removeMessagesByChannelsId } = messagesSlice.actions
export default messagesSlice.reducer
