import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  searchQuery: string;
  selectedGenre: string;
  currentPage: number;
}

const initialState: UiState = {
  searchQuery: "",
  selectedGenre: "",
  currentPage: 1,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setSelectedGenre(state, action: PayloadAction<string>) {
      state.selectedGenre = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
  },
});

export const { setSearchQuery, setSelectedGenre, setCurrentPage } = uiSlice.actions;
export default uiSlice.reducer;
