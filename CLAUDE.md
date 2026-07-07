# Restaurant Mobile App - Development Guide

## Project Overview

A full-stack restaurant mobile app with customer and admin interfaces, built with React Native, Firebase, and Sunmi V3 device integration.

## Repository Structure

```
packages/
├── customer-app/          # Expo React Native app for customers
│   ├── src/
│   │   ├── screens/       # UI screens (auth, menu, cart, etc)
│   │   ├── store/         # Redux slices (auth, cart)
│   │   ├── services/      # Firebase services (authService, etc)
│   │   ├── config/        # Firebase configuration
│   │   └── App.tsx        # Root component
│   ├── app.json           # Expo configuration
│   └── .env.example       # Environment variables template
│
├── admin-app/             # Expo React Native app for administrators
│   ├── src/
│   │   ├── screens/       # UI screens (orders, menu management, etc)
│   │   ├── store/         # Redux slices (auth, orders, menu)
│   │   ├── services/      # Firebase services
│   │   ├── config/        # Firebase configuration
│   │   └── App.tsx        # Root component
│   ├── app.json           # Expo configuration
│   └── .env.example       # Environment variables template
│
├── backend/               # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts       # Function handlers
│   ├── firestore.rules    # Firestore security rules
│   └── .env.example       # Environment variables template
│
├── shared/                # Shared TypeScript types & utils
│   ├── src/
│   │   ├── types.ts       # Type definitions
│   │   ├── utils.ts       # Utility functions
│   │   └── index.ts       # Exports
│   └── tsconfig.json      # TypeScript config
│
└── sunmi-module/          # Native Android module (TBD)
    └── [Native Android code for Sunmi V3 integration]
```

## Key Technologies

- **React Native (Expo)** - Cross-platform mobile development
- **Redux Toolkit** - State management
- **Firebase** - Backend (Auth, Firestore, Functions, Storage)
- **TypeScript** - Type safety
- **Turborepo** - Monorepo build orchestration
- **Yarn Workspaces** - Dependency management

## Development Workflow

### Starting Development

1. Install dependencies: `yarn install`
2. Set up environment variables in `.env.local` files
3. Start Firebase emulators: `firebase emulators:start`
4. Run dev servers: `yarn dev`

### Redux Architecture

Each app has its own Redux store in `src/store/`:

**Customer App:**
- `authSlice.ts` - User authentication state
- `cartSlice.ts` - Shopping cart management

**Admin App:**
- `authSlice.ts` - Admin authentication state
- `ordersSlice.ts` - Order management
- `menuSlice.ts` - Menu item management

### Firebase Services

Services are in `src/services/` and handle Firebase operations:
- `authService.ts` - Authentication (signup, signin, logout)
- Other services will be added for orders, menu, payments, etc.

### Firestore Collections

- `users/` - User profiles (customers & admins)
- `restaurants/` - Restaurant information
- `menuItems/` - Menu items with pricing
- `orders/` - Customer orders
- `discounts/` - Promotional codes
- `deliveryDetails/` - Order delivery addresses

### Authentication Flow

1. User signs up/in via Firebase Auth
2. User document created in Firestore with role (customer/admin)
3. Redux stores user state
4. Navigation changes based on auth state
5. Firestore rules enforce role-based access

## Common Tasks

### Adding a New Screen

1. Create file in `src/screens/{feature}/ScreenName.tsx`
2. Define navigation route in `App.tsx`
3. Add Redux actions if needed
4. Style with React Native StyleSheet

### Adding a Redux Slice

1. Create file in `src/store/featureSlice.ts`
2. Define state interface
3. Create reducers/actions
4. Export from `store/store.ts`
5. Use with `useSelector`/`useDispatch`

### Adding a Firebase Service

1. Create file in `src/services/featureService.ts`
2. Use Firebase SDK (auth, firestore, etc)
3. Export service object with methods
4. Use in Redux thunks or directly in components

### Updating Firestore Rules

1. Edit `packages/backend/firestore.rules`
2. Deploy: `firebase deploy --only firestore:rules`

## Phase Checklist

- [x] Phase 1: Setup & Auth
  - [x] Monorepo structure
  - [x] Firebase setup
  - [x] Redux store
  - [x] Authentication screens
  - [x] Shared types

- [ ] Phase 2: Menu Display
  - [ ] Menu browsing screen
  - [ ] Category filtering
  - [ ] Item details
  - [ ] Real-time sync

- [ ] Phase 3: Cart & Orders
  - [ ] Shopping cart screen
  - [ ] Checkout flow
  - [ ] Delivery options
  - [ ] Order placement

- [ ] Phase 4: Sunmi Payment
  - [ ] Payment processing
  - [ ] Receipt printing
  - [ ] Device integration

- [ ] Phase 5: Discounts
  - [ ] Discount management
  - [ ] Code validation
  - [ ] Application logic

- [ ] Phase 6: Notifications
  - [ ] FCM setup
  - [ ] Order tracking
  - [ ] Push notifications

- [ ] Phase 7: Admin App
  - [ ] Order queue
  - [ ] Kitchen display
  - [ ] Menu management
  - [ ] Analytics

- [ ] Phase 8: Testing & Deploy
  - [ ] QA
  - [ ] Optimization
  - [ ] App Store submission

## Important Notes

1. **Environment Variables**: Never commit `.env` files - use `.env.example` templates
2. **Firestore Rules**: Test rules locally with emulator before deploying
3. **Type Safety**: Always define types in `shared/src/types.ts`
4. **Firebase Emulator**: Use for local development; don't connect to production
5. **Git Branch**: Develop on `claude/restaurant-mobile-app-a5pg18`

## Useful Commands

```bash
# Monorepo commands
yarn install              # Install all dependencies
yarn dev                  # Start all dev servers
yarn build                # Build all packages
yarn type-check          # Type check all packages
yarn lint                # Lint all packages

# Individual package commands
cd packages/customer-app && yarn dev
cd packages/admin-app && yarn dev
cd packages/backend && yarn serve

# Firebase
firebase login           # Login to Firebase
firebase deploy          # Deploy functions & rules
firebase emulators:start # Start local emulators
firebase functions:log   # View function logs
```

## Next Steps

1. Configure Firebase project credentials in `.env` files
2. Test authentication flow with emulator
3. Proceed to Phase 2: Menu display and browsing
