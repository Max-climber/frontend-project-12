import { createSlice } from '@reduxjs/toolkit'

// Начальное значение
const initialState = {
  list: [],
  currentChannelId: 1,
}

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: (state, action) => {
      state.list = action.payload
    },
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload
    },
    addChannel: (state, action) => {
        state.list.push(action.payload)
    }
  },
})

export const { setChannels, setCurrentChannelId, addChannel } = channelsSlice.actions
export default channelsSlice.reducer
