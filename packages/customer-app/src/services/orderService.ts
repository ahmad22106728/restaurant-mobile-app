import { collection, query, where, getDocs, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db } from '../config/firebase';
import { Order, OrderItem, DeliveryDetails } from '@restaurant/shared';

export const orderService = {
  async createOrder(
    restaurantId: string,
    items: OrderItem[],
    orderType: 'pickup' | 'delivery',
    deliveryDetails: DeliveryDetails | undefined,
    subtotal: number,
    tax: number,
    discountCode?: string
  ): Promise<{ id: string; order: Order }> {
    try {
      const createOrderFn = httpsCallable(require('firebase/functions').getFunctions(), 'createOrder');
      const result = await createOrderFn({
        restaurantId,
        items,
        orderType,
        deliveryDetails,
        discountCode,
        subtotal,
        tax,
      });
      return result.data as { id: string; order: Order };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const q = query(collection(db, 'orders'), where('customerId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  onUserOrdersChange(userId: string, callback: (orders: Order[]) => void): Unsubscribe {
    const q = query(collection(db, 'orders'), where('customerId', '==', userId));
    return onSnapshot(q, snapshot => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      callback(orders);
    });
  },

  async validateDiscountCode(code: string): Promise<{ valid: boolean; discountAmount?: number }> {
    try {
      const applyDiscountFn = httpsCallable(require('firebase/functions').getFunctions(), 'applyDiscount');
      const result = await applyDiscountFn({ discountCode: code });
      return result.data as { valid: boolean; discountAmount?: number };
    } catch (error) {
      console.error('Error validating discount:', error);
      return { valid: false };
    }
  },
};
