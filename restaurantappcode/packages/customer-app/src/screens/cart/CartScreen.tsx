import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import {
  removeItem,
  updateItemQuantity,
  setOrderType,
  setDeliveryDetails,
  setDiscountCode,
} from '../../store/cartSlice';
import { formatCurrency, calculateOrderTotal, validatePhoneNumber } from '@restaurant/shared';

interface CartScreenProps {
  navigation: any;
}

export default function CartScreen({ navigation }: CartScreenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, orderType, deliveryDetails, discountCode } = useSelector(
    (state: RootState) => state.cart
  );
  const [location, setLocation] = React.useState(deliveryDetails?.location || '');
  const [phoneNumber, setPhoneNumber] = React.useState(deliveryDetails?.phoneNumber || '');
  const [buildingName, setBuildingName] = React.useState(deliveryDetails?.buildingName || '');
  const [unitNumber, setUnitNumber] = React.useState(deliveryDetails?.unitNumber || '');
  const [code, setCode] = React.useState(discountCode || '');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = calculateOrderTotal(subtotal, tax);

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeItem(itemId));
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateItemQuantity({ itemId, quantity }));
    }
  };

  const handleSetDeliveryDetails = () => {
    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
      alert('Please enter a valid phone number');
      return;
    }
    if (orderType === 'delivery' && !location) {
      alert('Please enter delivery location');
      return;
    }
    dispatch(setDeliveryDetails({
      location,
      phoneNumber,
      buildingName: buildingName || undefined,
      unitNumber: unitNumber || undefined,
    }));
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Cart is empty');
      return;
    }
    if (orderType === 'delivery') {
      if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
        alert('Please enter a valid phone number');
        return;
      }
      if (!location) {
        alert('Please enter delivery location');
        return;
      }
      handleSetDeliveryDetails();
    }
    navigation.navigate('CheckoutStack', { screen: 'Checkout' });
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
      </View>
      <View style={styles.itemControls}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleUpdateQuantity(item.itemId, item.quantity - 1)}
        >
          <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleUpdateQuantity(item.itemId, item.quantity + 1)}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.itemId)}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.itemTotal}>
        {formatCurrency(item.price * item.quantity)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cart</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('Menu')}
          >
            <Text style={styles.browseButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.itemId}
            style={styles.itemsList}
          />

          <View style={styles.optionsContainer}>
            <View style={styles.orderTypeSection}>
              <Text style={styles.sectionTitle}>Order Type</Text>
              <View style={styles.orderTypeButtons}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    orderType === 'pickup' && styles.typeButtonActive,
                  ]}
                  onPress={() => dispatch(setOrderType('pickup'))}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      orderType === 'pickup' && styles.typeButtonTextActive,
                    ]}
                  >
                    Pickup
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    orderType === 'delivery' && styles.typeButtonActive,
                  ]}
                  onPress={() => dispatch(setOrderType('delivery'))}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      orderType === 'delivery' && styles.typeButtonTextActive,
                    ]}
                  >
                    Delivery
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {orderType === 'delivery' && (
              <View style={styles.deliverySection}>
                <Text style={styles.sectionTitle}>Delivery Details</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Location"
                  value={location}
                  onChangeText={setLocation}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Building Name (optional)"
                  value={buildingName}
                  onChangeText={setBuildingName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Unit Number (optional)"
                  value={unitNumber}
                  onChangeText={setUnitNumber}
                />
              </View>
            )}

            <View style={styles.discountSection}>
              <Text style={styles.sectionTitle}>Discount Code</Text>
              <View style={styles.discountInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter code"
                  value={code}
                  onChangeText={setCode}
                />
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => dispatch(setDiscountCode(code || null))}
                >
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text>Subtotal</Text>
                <Text>{formatCurrency(subtotal)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text>Tax</Text>
                <Text>{formatCurrency(tax)}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalPrice}>{formatCurrency(total)}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemsList: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  cartItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  itemControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 12,
    fontWeight: 'bold',
    minWidth: 25,
    textAlign: 'center',
  },
  removeButton: {
    marginLeft: 5,
  },
  removeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    minWidth: 60,
    textAlign: 'right',
  },
  optionsContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  orderTypeSection: {
    marginBottom: 15,
  },
  orderTypeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  deliverySection: {
    marginBottom: 15,
  },
  discountSection: {
    marginBottom: 15,
  },
  discountInput: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 8,
  },
  applyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  summaryContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTopVertical: 8,
    marginTop: 8,
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
  checkoutButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
