# Chapter 13: Advanced State Management

**Duration:** 90-120 minutes  
**Difficulty:** Advanced  

---

## 🎯 Learning Objectives

By the end of this chapter, you'll understand:
- When to use advanced state management
- Zustand for simple global state
- Redux Toolkit basics
- Comparing state management solutions
- Async actions and middleware
- Persisting state
- DevTools integration

---

## 🤔 Do You Need Advanced State Management?

### When useState + Context is Enough

✅ Use **useState + Context** for:
- Small to medium apps
- Simple state (theme, user, settings)
- Not many global state changes
- Team comfortable with React basics

### When You Need Advanced Solutions

❌ Consider **Zustand/Redux** when:
- Large, complex app
- Frequent global state updates
- Need time-travel debugging
- Complex async operations
- Team prefers structured patterns
- Need middleware (logging, analytics)

---

## 🐻 Zustand - Simple and Modern

Zustand is a minimalist state management library. It's **easier than Redux** and **more performant than Context**.

### Installation

```bash
npm install zustand
```

### Basic Store

```typescript
// stores/useUserStore.ts
import {create} from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: (user) => set({user, isAuthenticated: true}),
  
  logout: () => set({user: null, isAuthenticated: false}),
}));
```

### Using the Store

```typescript
import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useUserStore} from '../stores/useUserStore';

function ProfileScreen() {
  // Subscribe to specific state
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  if (!user) {
    return <Text>Not logged in</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Pressable style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </View>
  );
}

function LoginButton() {
  const login = useUserStore((state) => state.login);

  const handleLogin = () => {
    login({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    });
  };

  return (
    <Pressable style={styles.button} onPress={handleLogin}>
      <Text style={styles.buttonText}>Login</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

---

## 🛒 Complete Example: Shopping Cart with Zustand

```typescript
// stores/useCartStore.ts
import {create} from 'zustand';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? {...item, quantity: item.quantity + 1}
              : item
          ),
        };
      }

      return {
        items: [...state.items, {...product, quantity: 1}],
      };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => {
      if (quantity === 0) {
        return {
          items: state.items.filter((item) => item.id !== id),
        };
      }

      return {
        items: state.items.map((item) =>
          item.id === id ? {...item, quantity} : item
        ),
      };
    }),

  clearCart: () => set({items: []}),

  getTotal: () => {
    const state = get();
    return state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },

  getItemCount: () => {
    const state = get();
    return state.items.reduce((count, item) => count + item.quantity, 0);
  },
}));
```

### Cart Screen

```typescript
import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import {useCartStore} from '../stores/useCartStore';

function CartScreen() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const renderItem = ({item}) => (
    <View style={styles.cartItem}>
      <Image source={{uri: item.image}} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        <View style={styles.quantity}>
          <Pressable
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </Pressable>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <Pressable
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </Pressable>
        </View>
      </View>
      <Pressable
        style={styles.removeButton}
        onPress={() => removeItem(item.id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </Pressable>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={styles.emptyCart}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${getTotal().toFixed(2)}</Text>
        </View>
        <Pressable style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </Pressable>
        <Pressable style={styles.clearButton} onPress={clearCart}>
          <Text style={styles.clearButtonText}>Clear Cart</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quantity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 16,
    fontWeight: '600',
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    color: '#ff3b30',
    fontSize: 14,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
  footer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#ff3b30',
    fontSize: 16,
  },
});

export default CartScreen;
```

---

## 🔄 Async Actions with Zustand

```typescript
// stores/useProductsStore.ts
import {create} from 'zustand';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({loading: true, error: null});
    try {
      const response = await fetch('https://api.example.com/products');
      const data = await response.json();
      set({products: data, loading: false});
    } catch (error) {
      set({error: error.message, loading: false});
    }
  },

  searchProducts: async (query) => {
    set({loading: true, error: null});
    try {
      const response = await fetch(
        `https://api.example.com/products/search?q=${query}`
      );
      const data = await response.json();
      set({products: data, loading: false});
    } catch (error) {
      set({error: error.message, loading: false});
    }
  },
}));
```

---

## 💾 Persist State

Keep state after app closes:

```bash
npm install zustand @react-native-async-storage/async-storage
```

```typescript
import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleNotifications: () => void;
  setLanguage: (language: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      notifications: true,
      language: 'en',

      setTheme: (theme) => set({theme}),

      toggleNotifications: () =>
        set((state) => ({notifications: !state.notifications})),

      setLanguage: (language) => set({language}),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

---

## 🔴 Redux Toolkit - The Traditional Way

Redux is more verbose but provides strong patterns for large teams.

### Installation

```bash
npm install @reduxjs/toolkit react-redux
```

### Creating a Slice

```typescript
// store/slices/counterSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
});

export const {increment, decrement, incrementByAmount, reset} =
  counterSlice.actions;

export default counterSlice.reducer;
```

### Configuring Store

```typescript
// store/store.ts
import {configureStore} from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Provider Setup

```typescript
// App.tsx
import React from 'react';
import {Provider} from 'react-redux';
import {store} from './store/store';
import {NavigationContainer} from '@react-navigation/native';

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        {/* Your app */}
      </NavigationContainer>
    </Provider>
  );
}

export default App;
```

### Using Redux in Components

```typescript
import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from './store/store';
import {increment, decrement, reset} from './store/slices/counterSlice';

function CounterScreen() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text style={styles.count}>{count}</Text>
      <View style={styles.buttons}>
        <Pressable
          style={styles.button}
          onPress={() => dispatch(increment())}
        >
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => dispatch(decrement())}
        >
          <Text style={styles.buttonText}>-</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.resetButton]}
          onPress={() => dispatch(reset())}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    fontSize: 72,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    width: 100,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CounterScreen;
```

---

## 📊 Comparison Table

| Feature | useState + Context | Zustand | Redux Toolkit |
|---------|-------------------|---------|---------------|
| **Learning Curve** | Easy | Easy | Moderate |
| **Boilerplate** | Low | Very Low | Moderate |
| **Performance** | Can cause re-renders | Excellent | Excellent |
| **DevTools** | React DevTools | Redux DevTools | Redux DevTools |
| **Middleware** | Manual | Easy | Built-in |
| **TypeScript** | Good | Excellent | Excellent |
| **Best For** | Small apps | Small-Medium apps | Large apps |

---

## 🎓 Key Takeaways

1. **Start simple** - useState + Context is often enough
2. **Zustand** is the modern, easy choice
3. **Redux** for large teams and complex apps
4. **Persist state** for better UX
5. **Selector optimization** prevents unnecessary re-renders
6. **Async actions** handle API calls in state
7. **DevTools** help debug state changes

---

## ✅ Checkpoint

You should now be able to:
- ✅ Choose the right state management solution
- ✅ Use Zustand for global state
- ✅ Create stores with actions
- ✅ Handle async operations
- ✅ Persist state to storage
- ✅ Understand Redux Toolkit basics
- ✅ Compare different solutions

---

## 🎯 Practice Challenge

**Build a Task Management App:**

Requirements:
- Use Zustand for state management
- Multiple task lists (Work, Personal, Shopping)
- Add, edit, delete, complete tasks
- Filter by status (All, Active, Completed)
- Persist to AsyncStorage
- Search functionality

---

## 🔜 What's Next?

In **Chapter 14**, we'll master **Async Operations & Data Fetching** with React Query!

**Ready for advanced data management? Let's go! 🚀**
