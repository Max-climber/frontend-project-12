import { createSlice } from '@reduxjs/toolkit'

// Начальное значение
const initialState = {
  list: [],
}

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: (state, action) => {
      state.list = action.payload
    },
  },
})

export const { setChannels } = channelsSlice.actions
export default channelsSlice.reducer
