# Restaurant Mobile App

A comprehensive mobile application for restaurant management with customer-facing and admin interfaces, featuring menu management, order processing, and Sunmi V3 device integration for payments and printing.

## Project Structure

```
restaurant-mobile-app/
├── packages/
│   ├── customer-app/        # Customer-facing React Native app (Expo)
│   ├── admin-app/           # Admin React Native app for order & menu management
│   ├── backend/             # Firebase Cloud Functions
│   ├── shared/              # Shared TypeScript types and utilities
│   └── sunmi-module/        # Native Android module for Sunmi V3 integration
├── firebase.json            # Firebase configuration
├── turbo.json              # Turborepo configuration
└── package.json            # Root monorepo configuration
```

## Tech Stack

- **Frontend:** React Native (Expo)
- **State Management:** Redux Toolkit
- **Backend:** Firebase (Firestore, Auth, Cloud Functions, Storage)
- **Push Notifications:** Firebase Cloud Messaging (FCM)
- **Device Integration:** Sunmi V3 (Android native module)
- **Build System:** Turborepo, Yarn Workspaces

## Features

### Phase 1: Authentication & Setup (Complete)
✅ Monorepo structure with Turborepo
✅ Redux store for state management
✅ Firebase authentication (signup/login)
✅ Role-based access control (customer/admin)
✅ Shared TypeScript types

### Phase 2: Menu Display (Upcoming)
- Menu browsing with categories
- Item descriptions and pricing
- Real-time availability sync

### Phase 3: Orders & Checkout (Upcoming)
- Shopping cart with item management
- Pickup and delivery options
- Delivery details (address, phone, building, unit)
- Order placement and tracking

### Phase 4: Sunmi Integration (Upcoming)
- Payment processing via Sunmi V3
- Receipt printing
- Device management from admin app

### Phase 5: Discounts (Upcoming)
- Create and manage promotional codes
- Apply discounts at checkout
- Track discount usage

### Phase 6: Notifications (Upcoming)
- FCM push notifications
- Order status updates
- Real-time order tracking

### Phase 7: Admin Dashboard (Upcoming)
- Order queue and kitchen display system
- Menu management (enable/disable items)
- Order analytics

### Phase 8: Testing & Deployment (Upcoming)
- QA and optimization
- App Store / Play Store deployment

## Getting Started

### Prerequisites
- Node.js >= 18
- Yarn >= 4
- Firebase CLI
- Expo CLI

### Installation

```bash
# Install dependencies
yarn install

# Copy environment files
cp packages/customer-app/.env.example packages/customer-app/.env.local
cp packages/admin-app/.env.example packages/admin-app/.env.local
cp packages/backend/.env.example packages/backend/.env.local
```

### Development

```bash
# Start all development servers
yarn dev

# Or run individual packages
cd packages/customer-app && yarn dev
cd packages/admin-app && yarn dev

# Build all packages
yarn build

# Type checking
yarn type-check

# Linting
yarn lint
```

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Update `.env.local` files with your Firebase credentials
3. Deploy Firestore rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Local Emulation

```bash
# Start Firebase emulators
firebase emulators:start

# This starts:
# - Auth emulator (port 9099)
# - Firestore emulator (port 8080)
# - Storage emulator (port 9199)
# - Functions emulator (port 5001)
# - Emulator UI (port 4000)
```

## Data Structure

### Collections

#### `users/`
```typescript
{
  id: string;
  email: string;
  displayName: string;
  role: 'customer' | 'admin';
  createdAt: string;
  updatedAt: string;
}
```

#### `menuItems/`
```typescript
{
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### `orders/`
```typescript
{
  id: string;
  restaurantId: string;
  customerId: string;
  items: OrderItem[];
  orderType: 'pickup' | 'delivery';
  deliveryDetails?: DeliveryDetails;
  status: OrderStatus;
  total: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}
```

#### `discounts/`
```typescript
{
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## API Functions

### createOrder
Creates a new order for a customer.

### updateOrderStatus
Updates the status of an order (admin only).

### applyDiscount
Applies a discount code to an order.

## Deployment

### Expo EAS (Mobile Apps)

```bash
# Login to Expo
eas login

# Build for production
eas build --platform all --auto-submit

# Submit to stores
eas submit --platform all
```

### Firebase Cloud Functions

```bash
# Deploy functions
firebase deploy --only functions
```

## Environment Variables

### Customer App (`packages/customer-app/.env.local`)
```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

### Admin App (`packages/admin-app/.env.local`)
Same as customer app

### Backend (`packages/backend/.env.local`)
```
FIREBASE_PROJECT_ID=
FIREBASE_API_KEY=
SUNMI_API_URL=
SUNMI_API_KEY=
```

## Security

- Firestore security rules enforce role-based access
- Customers can only view their own orders
- Admins can manage menu items and orders
- Authentication required for order creation

## Support

For issues or feature requests, please create an issue in the repository.

## License

MIT License - See LICENSE file for details
