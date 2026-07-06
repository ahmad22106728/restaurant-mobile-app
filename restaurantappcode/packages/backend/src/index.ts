import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Order, OrderStatus } from '@restaurant/shared';

admin.initializeApp();
const db = admin.firestore();

export const createOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  const { restaurantId, items, orderType, deliveryDetails, discountCode, subtotal, tax } = data;
  if (!restaurantId || !items || items.length === 0) throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  try {
    const order: Omit<Order, 'id'> = {
      restaurantId, customerId: context.auth.uid, items, orderType, deliveryDetails: orderType === 'delivery' ? deliveryDetails : undefined,
      status: 'pending', subtotal, discountAmount: 0, discountCode, tax, total: subtotal + tax,
      paymentStatus: 'pending', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    const docRef = await db.collection('orders').add(order);
    return { id: docRef.id, ...order };
  } catch (error) {
    console.error('Error creating order:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create order');
  }
});

export const updateOrderStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  const { orderId, status } = data;
  if (!orderId || !status) throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  const validStatuses: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) throw new functions.https.HttpsError('invalid-argument', 'Invalid status');
  try {
    await db.collection('orders').doc(orderId).update({ status, updatedAt: new Date().toISOString() });
    return { success: true, orderId, status };
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update order');
  }
});

export const applyDiscount = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  const { orderId, discountCode } = data;
  if (!orderId || !discountCode) throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  try {
    const discountSnapshot = await db.collection('discounts').where('code', '==', discountCode).where('isActive', '==', true).limit(1).get();
    if (discountSnapshot.empty) throw new functions.https.HttpsError('not-found', 'Discount code not found');
    const discount = discountSnapshot.docs[0].data();
    const now = new Date();
    if (new Date(discount.startDate) > now || new Date(discount.endDate) < now) throw new functions.https.HttpsError('invalid-argument', 'Discount code expired');
    return { success: true, discount };
  } catch (error) {
    console.error('Error applying discount:', error);
    throw new functions.https.HttpsError('internal', 'Failed to apply discount');
  }
});
