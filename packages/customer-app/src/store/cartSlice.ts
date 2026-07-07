import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderItem, OrderType, DeliveryDetails } from '@restaurant/shared';

interface CartState {
  items: OrderItem[];
  orderType: OrderType;
  deliveryDetails: DeliveryDetails | null;
  discountCode: string | null;
}

const initialState: CartState = {
  items: [],
  orderType: 'pickup',
  deliveryDetails: null,
  discountCode: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<OrderItem>) {
      const existingItem = state.items.find(item => item.itemId === action.payload.itemId);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.itemId !== action.payload);
    },
    updateItemQuantity(state, action: PayloadAction<{ itemId: string; quantity: number }>) {
      const item = state.items.find(item => item.itemId === action.payload.itemId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    setOrderType(state, action: PayloadAction<OrderType>) {
      state.orderType = action.payload;
    },
    setDeliveryDetails(state, action: PayloadAction<DeliveryDetails | null>) {
      state.deliveryDetails = action.payload;
    },
    setDiscountCode(state, action: PayloadAction<string | null>) {
      state.discountCode = action.payload;
    },
    clearCart(state) {
      state.items = [];
      state.orderType = 'pickup';
      state.deliveryDetails = null;
      state.discountCode = null;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateItemQuantity,
  setOrderType,
  setDeliveryDetails,
  setDiscountCode,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
