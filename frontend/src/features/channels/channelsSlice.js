import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'

const channelsAdapter = createEntityAdapter()
const initialState = channelsAdapter.getInitialState({ currentChannelId: 1 })

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: channelsAdapter.setAll, // обновляем таким образом все данные
    addChannel: channelsAdapter.addOne,
    removeChannel: channelsAdapter.removeOne,
    renameChannel: channelsAdapter.updateOne,
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload
    },
  },
})

// Безопасный селектор для получения state.channels
// Важно: проверяем, что state существует и имеет свойство channels
const selectChannelsState = (state) => {
  if (!state || !state.channels) {
    return initialState
  }
  return state.channels
}

export const channelsSelectors = channelsAdapter.getSelectors(selectChannelsState)
export const { setChannels, addChannel, removeChannel, renameChannel, setCurrentChannelId } = channelsSlice.actions

export default channelsSlice.reducer
