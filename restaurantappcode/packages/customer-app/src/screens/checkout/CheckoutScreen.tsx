import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { clearCart } from '../../store/cartSlice';
import { setCurrentOrder, setLoading, setError } from '../../store/ordersSlice';
import { orderService } from '../../services/orderService';
import { formatCurrency, calculateOrderTotal } from '@restaurant/shared';

interface CheckoutScreenProps {
  navigation: any;
}

export default function CheckoutScreen({ navigation }: CheckoutScreenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, orderType, deliveryDetails, discountCode } = useSelector(
    (state: RootState) => state.cart
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading } = useSelector((state: RootState) => state.orders);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile'>('cash');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = calculateOrderTotal(subtotal, tax);

  const handlePlaceOrder = async () => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Error', 'Cart is empty');
      return;
    }

    if (orderType === 'delivery' && !deliveryDetails) {
      Alert.alert('Error', 'Please provide delivery details');
      return;
    }

    dispatch(setLoading(true));
    try {
      const result = await orderService.createOrder(
        'restaurant-1', // This should come from app context
        items,
        orderType,
        deliveryDetails,
        subtotal,
        tax,
        discountCode || undefined
      );

      dispatch(setCurrentOrder(result.order));
      dispatch(clearCart());
      dispatch(setError(null));

      // Navigate to confirmation screen
      navigation.replace('OrderConfirmation', { orderId: result.id, order: result.order });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to place order';
      dispatch(setError(errorMessage));
      Alert.alert('Error', errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Review</Text>
      </View>

      {/* Order Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        {items.map((item) => (
          <View key={item.itemId} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>
              {formatCurrency(item.price * item.quantity)}
            </Text>
          </View>
        ))}
      </View>

      {/* Order Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Order Type</Text>
          <Text style={styles.detailValue}>
            {orderType === 'pickup' ? 'Pickup' : 'Delivery'}
          </Text>
        </View>
        {orderType === 'delivery' && deliveryDetails && (
          <>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{deliveryDetails.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{deliveryDetails.phoneNumber}</Text>
            </View>
            {deliveryDetails.buildingName && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Building</Text>
                <Text style={styles.detailValue}>{deliveryDetails.buildingName}</Text>
              </View>
            )}
            {deliveryDetails.unitNumber && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Unit</Text>
                <Text style={styles.detailValue}>{deliveryDetails.unitNumber}</Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* Payment Method */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        {(['cash', 'card', 'mobile'] as const).map((method) => (
          <TouchableOpacity
            key={method}
            style={styles.paymentOption}
            onPress={() => setPaymentMethod(method)}
          >
            <View
              style={[
                styles.radioButton,
                paymentMethod === method && styles.radioButtonSelected,
              ]}
            />
            <Text style={styles.paymentLabel}>
              {method === 'cash' ? 'Cash' : method === 'card' ? 'Card' : 'Mobile Payment'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Price Summary */}
      <View style={styles.section}>
        <View style={styles.summaryRow}>
          <Text>Subtotal</Text>
          <Text>{formatCurrency(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Tax (10%)</Text>
          <Text>{formatCurrency(tax)}</Text>
        </View>
        {discountCode && (
          <View style={styles.summaryRow}>
            <Text>Discount Code</Text>
            <Text>{discountCode}</Text>
          </View>
        )}
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>{formatCurrency(total)}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.placeOrderButton, loading && styles.buttonDisabled]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.placeOrderButtonText}>Place Order</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Back to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
  },
  radioButtonSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50',
  },
  paymentLabel: {
    fontSize: 14,
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingTop: 15,
    marginTop: 5,
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalPrice: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#4CAF50',
  },
  buttonContainer: {
    padding: 15,
    paddingBottom: 25,
  },
  placeOrderButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  placeOrderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 16,
  },
});
