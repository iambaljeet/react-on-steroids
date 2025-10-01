# Chapter 11: Context API - Global State Management

**Duration:** 60-90 minutes  
**Difficulty:** Intermediate  

---

## 🎯 Learning Objectives

By the end of this chapter, you'll understand:
- What is "prop drilling" and why it's a problem
- When to use Context API vs props
- Creating and providing context
- Using the useContext hook
- Common patterns (Theme, Auth, User data)
- Context performance considerations
- When NOT to use Context

---

## 🤔 The Problem: Prop Drilling

### Before Context

Imagine passing data through many levels:

```typescript
function App() {
  const [user, setUser] = useState({name: 'John', role: 'admin'});

  return <Layout user={user} />;
}

function Layout({user}) {
  return <Header user={user} />;
}

function Header({user}) {
  return <UserMenu user={user} />;
}

function UserMenu({user}) {
  return <Text>Hello, {user.name}!</Text>;
}
```

**The Problem:**
- `Layout` and `Header` don't use `user` at all
- They just pass it down
- Adding new data means updating ALL levels
- This is called **"prop drilling"**

---

## 💡 The Solution: Context API

Context lets you **share data globally** without passing props through every level.

### Real-World Analogy

**Without Context (Prop Drilling):**
Like passing a message person-to-person across a room:
```
You → Person 1 → Person 2 → Person 3 → Recipient
```

**With Context:**
Like broadcasting a message everyone can hear:
```
You (broadcast) → Everyone hears it
```

---

## 🏗️ Creating Context - Step by Step

### Step 1: Create the Context

```typescript
import React, {createContext, useState} from 'react';

// Create the context
const UserContext = createContext();
```

### Step 2: Create a Provider Component

```typescript
function UserProvider({children}) {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
  });

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
}
```

### Step 3: Wrap Your App

```typescript
function App() {
  return (
    <UserProvider>
      <Layout />
    </UserProvider>
  );
}
```

### Step 4: Use the Context

```typescript
import {useContext} from 'react';

function UserMenu() {
  const {user, setUser} = useContext(UserContext);

  return (
    <View>
      <Text>Hello, {user.name}!</Text>
      <Text>Role: {user.role}</Text>
    </View>
  );
}
```

---

## 📖 Complete Example: Theme Context

Let's build a dark mode toggle:

```typescript
import React, {createContext, useContext, useState} from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// 1. Create Theme Context
const ThemeContext = createContext();

// 2. Theme Provider Component
function ThemeProvider({children}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = {
    dark: isDarkMode,
    colors: {
      background: isDarkMode ? '#000' : '#fff',
      text: isDarkMode ? '#fff' : '#000',
      card: isDarkMode ? '#1c1c1e' : '#f2f2f7',
      border: isDarkMode ? '#38383a' : '#c6c6c8',
      primary: '#007AFF',
    },
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Custom Hook for easier access
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// 4. Screen Component using Theme
function HomeScreen() {
  const {theme} = useTheme();

  return (
    <View style={[styles.screen, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.title, {color: theme.colors.text}]}>
        Home Screen
      </Text>
      <Text style={[styles.text, {color: theme.colors.text}]}>
        This screen uses the theme from Context!
      </Text>
    </View>
  );
}

// 5. Settings Screen with Theme Toggle
function SettingsScreen() {
  const {theme, toggleTheme} = useTheme();

  return (
    <View style={[styles.screen, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.title, {color: theme.colors.text}]}>
        Settings
      </Text>

      <View
        style={[
          styles.setting,
          {backgroundColor: theme.colors.card, borderColor: theme.colors.border},
        ]}
      >
        <Text style={[styles.settingText, {color: theme.colors.text}]}>
          Dark Mode
        </Text>
        <Switch
          value={theme.dark}
          onValueChange={toggleTheme}
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={theme.dark ? '#007AFF' : '#f4f3f4'}
        />
      </View>
    </View>
  );
}

// 6. Main App
function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

// 7. App Content that uses Theme
function ThemedApp() {
  const {theme} = useTheme();

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <HomeScreen />
      <SettingsScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  settingText: {
    fontSize: 16,
  },
});

export default App;
```

---

## 🔐 Authentication Context Pattern

A very common use case - managing user authentication:

```typescript
import React, {createContext, useContext, useState, useEffect} from 'react';

const AuthContext = createContext();

function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      // Check AsyncStorage or secure storage
      const userToken = await getStoredToken();
      if (userToken) {
        const userData = await fetchUserData(userToken);
        setUser(userData);
      }
    } catch (error) {
      console.error('Login check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('https://api.example.com/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        await storeToken(data.token);
        return {success: true};
      } else {
        return {success: false, error: data.message};
      }
    } catch (error) {
      return {success: false, error: 'Network error'};
    }
  };

  const logout = async () => {
    setUser(null);
    await removeToken();
  };

  const signup = async (email, password, name) => {
    try {
      const response = await fetch('https://api.example.com/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password, name}),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        await storeToken(data.token);
        return {success: true};
      } else {
        return {success: false, error: data.message};
      }
    } catch (error) {
      return {success: false, error: 'Network error'};
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        signup,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Helper functions (mock implementations)
async function getStoredToken() {
  // Implementation using AsyncStorage or SecureStore
  return null;
}

async function storeToken(token) {
  // Store token securely
}

async function removeToken() {
  // Remove token
}

async function fetchUserData(token) {
  // Fetch user data from API
  return null;
}

export {AuthProvider, useAuth};
```

### Using Auth Context

```typescript
import React, {useState} from 'react';
import {View, Text, TextInput, Pressable, StyleSheet} from 'react-native';
import {useAuth} from './AuthContext';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login} = useAuth();

  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      // Navigation will happen automatically via auth state
    } else {
      alert(result.error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </View>
  );
}

function ProfileScreen() {
  const {user, logout} = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.text}>Name: {user?.name}</Text>
      <Text style={styles.text}>Email: {user?.email}</Text>
      
      <Pressable style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});
```

---

## 🛒 Shopping Cart Context

```typescript
import React, {createContext, useContext, useState} from 'react';

const CartContext = createContext();

function CartProvider({children}) {
  const [items, setItems] = useState([]);

  const addToCart = (product) => {
    setItems(currentItems => {
      // Check if item already in cart
      const existingItem = currentItems.find(item => item.id === product.id);

      if (existingItem) {
        // Increase quantity
        return currentItems.map(item =>
          item.id === product.id
            ? {...item, quantity: item.quantity + 1}
            : item
        );
      } else {
        // Add new item
        return [...currentItems, {...product, quantity: 1}];
      }
    });
  };

  const removeFromCart = (productId) => {
    setItems(currentItems =>
      currentItems.filter(item => item.id !== productId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === productId ? {...item, quantity} : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

export {CartProvider, useCart};
```

---

## 🎨 Multiple Contexts Together

You can combine multiple contexts:

```typescript
import React from 'react';
import {AuthProvider} from './AuthContext';
import {ThemeProvider} from './ThemeContext';
import {CartProvider} from './CartContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <NavigationContainer>
            {/* Your app screens */}
          </NavigationContainer>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

**Better Pattern - Combine Providers:**

```typescript
function AppProviders({children}) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <AppProviders>
      <NavigationContainer>
        {/* Your app screens */}
      </NavigationContainer>
    </AppProviders>
  );
}
```

---

## ⚡ Performance Considerations

### Problem: Re-renders

Every component using a context re-renders when ANY context value changes.

### Solution 1: Split Contexts

Instead of one big context:

```typescript
// Bad: Everything re-renders when anything changes
const AppContext = createContext({
  user,
  theme,
  cart,
  notifications,
  // ... etc
});
```

Split into separate contexts:

```typescript
// Good: Only affected components re-render
const UserContext = createContext();
const ThemeContext = createContext();
const CartContext = createContext();
```

### Solution 2: Memoize Values

```typescript
import {useMemo} from 'react';

function ThemeProvider({children}) {
  const [theme, setTheme] = useState('light');

  // Only create new object when theme actually changes
  const value = useMemo(
    () => ({theme, setTheme}),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

---

## ❌ When NOT to Use Context

### Don't use Context for:

1. **Frequent updates** (e.g., form input values)
   - Use local state instead
   
2. **Performance-critical data** (e.g., animation values)
   - Use refs or specialized libraries
   
3. **Complex state logic** (e.g., shopping cart with undo/redo)
   - Use Zustand or Redux

### Use Context for:

- ✅ Theme/Dark mode
- ✅ User authentication
- ✅ Language/Localization
- ✅ Global app settings
- ✅ Data that changes infrequently

---

## 🎯 Context vs Props vs State Management

| Use Case | Solution |
|----------|----------|
| Pass data to child | **Props** |
| Local component data | **useState** |
| Global settings (theme) | **Context API** |
| Complex global state | **Zustand/Redux** |
| Server data | **React Query** |

---

## 🎓 Key Takeaways

1. **Context solves prop drilling** - no more passing props through many levels
2. **Create context** with `createContext()`
3. **Provide context** with `<Context.Provider value={...}>`
4. **Consume context** with `useContext(Context)`
5. **Custom hooks** make context easier to use (e.g., `useAuth()`)
6. **Common patterns**: Theme, Auth, Cart, Settings
7. **Performance matters** - split contexts, memoize values
8. **Know when NOT to use it** - local state is often simpler

---

## ✅ Checkpoint

You should now be able to:
- ✅ Understand the prop drilling problem
- ✅ Create context with createContext()
- ✅ Build provider components
- ✅ Consume context with useContext()
- ✅ Create custom hooks for context
- ✅ Implement theme and auth contexts
- ✅ Combine multiple contexts
- ✅ Optimize context performance

---

## 🎯 Practice Challenges

### Challenge 1: Settings Context
Create a settings context that manages:
- Notifications enabled/disabled
- Sound enabled/disabled
- Language preference
- Font size

### Challenge 2: Todo List with Context
Build a todo app where:
- Todos are stored in context
- Multiple screens can access/modify todos
- Filter settings (All/Active/Completed) in context

### Challenge 3: Multi-Theme Support
Create a theme context with:
- Light, Dark, and Auto modes
- Custom color schemes
- Font size preferences
- Persist theme choice

---

## 🎉 Congratulations!

**You've completed Part 2: Core Concepts!**

You now know:
- ✅ Components and Props
- ✅ State Management
- ✅ Lists and Keys
- ✅ Side Effects (useEffect)
- ✅ Navigation
- ✅ Context API

**You have everything you need to build real React Native applications!**

---

## 🔜 What's Next?

In **Part 3: Advanced Topics**, we'll explore:
- Architecture patterns (MVVM, Clean Architecture)
- Advanced state management (Zustand, Redux)
- Async operations and data fetching
- Native modules and platform APIs
- Testing strategies
- Performance optimization
- Production deployment

**Ready to level up? Part 3 awaits! 🚀**
