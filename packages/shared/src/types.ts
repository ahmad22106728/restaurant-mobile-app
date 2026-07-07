export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type OrderType = 'pickup' | 'delivery';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface DeliveryDetails {
  location: string;
  phoneNumber: string;
  buildingName?: string;
  unitNumber?: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  customerId: string;
  items: OrderItem[];
  orderType: OrderType;
  deliveryDetails?: DeliveryDetails;
  status: OrderStatus;
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentDetails?: PaymentDetails;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentDetails {
  method: 'cash' | 'card' | 'mobile';
  transactionId?: string;
  amount: number;
}

export interface Discount {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  location: string;
  phoneNumber: string;
  email: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}
