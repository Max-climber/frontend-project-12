import { createSlice, createEntityAdapter  } from '@reduxjs/toolkit'

const channelsAdapter = createEntityAdapter()
const initialState = channelsAdapter.getInitialState({ currentChannelId: 1 })

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: channelsAdapter.setAll, //обновляем таким образом все данные
    addChannel: channelsAdapter.addOne,
    removeChannel: channelsAdapter.removeOne,
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload
    },
  },
})

export const channelsSelectors = channelsAdapter.getSelectors(state => state.channels)
export const { setChannels, addChannel, removeChannel, setCurrentChannelId } = channelsSlice.actions

export default channelsSlice.reducer
