import { createSlice } from '@reduxjs/toolkit'

// Начальное значение
const initialState = {
  list: [],
}

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.list = action.payload
    },
  },
})

export const { setMessages } = messagesSlice.actions
export default messagesSlice.reducer
