import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { orderService } from '../../services/orderService';
import { setCurrentOrder, setLoading } from '../../store/ordersSlice';
import { formatCurrency, formatDate, formatTime } from '@restaurant/shared';
import type { Order } from '@restaurant/shared';

interface OrderConfirmationScreenProps {
  route: any;
  navigation: any;
}

export default function OrderConfirmationScreen({ route, navigation }: OrderConfirmationScreenProps) {
  const { orderId, order: initialOrder } = route.params;
  const [order, setOrder] = React.useState<Order | null>(initialOrder);
  const [loading, setLoadingState] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Subscribe to order status updates
    if (orderId) {
      setLoadingState(true);
      const unsubscribe = orderService.onUserOrdersChange(initialOrder.customerId, (orders) => {
        const updatedOrder = orders.find(o => o.id === orderId);
        if (updatedOrder) {
          setOrder(updatedOrder);
          dispatch(setCurrentOrder(updatedOrder));
        }
        setLoadingState(false);
      });

      return unsubscribe;
    }
  }, [orderId, initialOrder.customerId, dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#ff9800';
      case 'confirmed':
        return '#2196f3';
      case 'preparing':
        return '#9c27b0';
      case 'ready':
        return '#4caf50';
      case 'completed':
        return '#4caf50';
      case 'cancelled':
        return '#f44336';
      default:
        return '#999';
    }
  };

  if (!order) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading order...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Confirmed!</Text>
      </View>

      <View style={styles.confirmationContainer}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
        </View>

        <View style={styles.orderIdContainer}>
          <Text style={styles.orderIdLabel}>Order ID</Text>
          <Text style={styles.orderId}>{orderId}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order Date & Time</Text>
            <View>
              <Text style={styles.infoValue}>{formatDate(order.createdAt)}</Text>
              <Text style={styles.infoValue}>{formatTime(order.createdAt)}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order Type</Text>
            <Text style={styles.infoValue}>
              {order.orderType === 'pickup' ? 'Pickup' : 'Delivery'}
            </Text>
          </View>

          {order.orderType === 'delivery' && order.deliveryDetails && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Delivery Address</Text>
                <View>
                  <Text style={styles.infoValue}>{order.deliveryDetails.location}</Text>
                  {order.deliveryDetails.buildingName && (
                    <Text style={styles.infoValue}>{order.deliveryDetails.buildingName}</Text>
                  )}
                  {order.deliveryDetails.unitNumber && (
                    <Text style={styles.infoValue}>Unit {order.deliveryDetails.unitNumber}</Text>
                  )}
                </View>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Contact Phone</Text>
                <Text style={styles.infoValue}>{order.deliveryDetails.phoneNumber}</Text>
              </View>
            </>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        {order.items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.summaryRow}>
          <Text>Subtotal</Text>
          <Text>{formatCurrency(order.subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Tax</Text>
          <Text>{formatCurrency(order.tax)}</Text>
        </View>
        {order.discountAmount > 0 && (
          <View style={styles.summaryRow}>
            <Text>Discount</Text>
            <Text style={styles.discount}>-{formatCurrency(order.discountAmount)}</Text>
          </View>
        )}
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>{formatCurrency(order.total)}</Text>
        </View>
      </View>

      <View style={styles.messageContainer}>
        <Text style={styles.messageTitle}>What's Next?</Text>
        <Text style={styles.message}>
          {order.orderType === 'pickup'
            ? 'Your order is being prepared. Please pick it up at the restaurant.'
            : 'Your order will be delivered to the address provided.'}
        </Text>
        <Text style={styles.message}>
          You'll receive updates as we prepare your order. You can track the status anytime in your
          order history.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('HomeTab')}
        >
          <Text style={styles.continueButtonText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => navigation.navigate('Menu')}
        >
          <Text style={styles.browseButtonText}>Continue Shopping</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  confirmationContainer: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 15,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  orderIdContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  orderIdLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  orderId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  infoContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
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
  discount: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  messageContainer: {
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 8,
  },
  buttonContainer: {
    padding: 15,
    paddingBottom: 25,
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  browseButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    alignItems: 'center',
  },
  browseButtonText: {
    color: '#4CAF50',
    fontWeight: '500',
    fontSize: 16,
  },
});
