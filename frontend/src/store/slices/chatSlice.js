import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentChatUser: null,
  messages: [],
  contacts: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChatUser(state, action) {
      state.currentChatUser = action.payload;
    },
    setMessages(state, action) {
      state.messages = action.payload;
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    setContacts(state, action) {
      state.contacts = action.payload;
    },
  },
});

export const {
  setCurrentChatUser,
  setMessages,
  addMessage,
  setContacts,
} = chatSlice.actions;

export default chatSlice.reducer;

// 🔄 Thunks

export const fetchContacts = () => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;

    const res = await fetch('/api/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    dispatch(setContacts(data));
  } catch (err) {
    console.error('Failed to fetch contacts', err);
  }
};

export const fetchMessages = (userId) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;

    const res = await fetch(`/api/messages/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    dispatch(setMessages(data));
  } catch (err) {
    console.error('Failed to fetch messages', err);
  }
};
