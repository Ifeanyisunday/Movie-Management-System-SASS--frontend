import { createSlice} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthTokens, User } from "../../lib/types";

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
}

// Hydrate from localStorage
const storedTokens = localStorage.getItem("tokens");
const storedUser = localStorage.getItem("user");

const initialState: AuthState = {
  tokens: storedTokens ? JSON.parse(storedTokens) : null,
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedTokens,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ tokens: AuthTokens; user?: User }>) {
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
      if (action.payload.user) state.user = action.payload.user;
      localStorage.setItem("tokens", JSON.stringify(action.payload.tokens));
      if (action.payload.user) localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout(state) {
      state.tokens = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("tokens");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
