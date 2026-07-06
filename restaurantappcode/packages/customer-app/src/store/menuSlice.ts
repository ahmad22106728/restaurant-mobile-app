import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem } from '@restaurant/shared';

interface MenuState {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;
  categories: string[];
}

const initialState: MenuState = {
  items: [],
  loading: false,
  error: null,
  selectedCategory: null,
  categories: [],
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setMenuItems(state, action: PayloadAction<MenuItem[]>) {
      state.items = action.payload;
      const categories = Array.from(new Set(action.payload.map(item => item.category)));
      state.categories = ['All', ...categories];
      if (!state.selectedCategory) {
        state.selectedCategory = 'All';
      }
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { setLoading, setMenuItems, setError, setSelectedCategory, clearError } = menuSlice.actions;
export default menuSlice.reducer;
