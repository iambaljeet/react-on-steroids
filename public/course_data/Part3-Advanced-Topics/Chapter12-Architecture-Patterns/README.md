# Chapter 12: Architecture Patterns - Organizing Your Code

**Duration:** 90-120 minutes  
**Difficulty:** Advanced  

---

## 🎯 Learning Objectives

By the end of this chapter, you'll understand:
- Why architecture matters
- Folder structure best practices
- Component composition patterns
- Custom Hooks for logic reuse
- Services and API layers
- Feature-based vs layer-based organization
- MVVM pattern basics
- Clean Architecture principles

---

## 🏗️ Why Architecture Matters

### The Problem with No Structure

```
src/
  App.js (1500 lines)
  Screen1.js (800 lines)
  Screen2.js (900 lines)
  utils.js (500 lines)
```

**Issues:**
- Hard to find code
- Difficult to test
- Can't reuse logic
- Merge conflicts
- Onboarding takes weeks

### The Solution: Architecture

Good architecture makes code:
- **Organized** - Easy to find things
- **Testable** - Easy to write tests
- **Reusable** - Don't repeat yourself
- **Scalable** - Grows with your app
- **Maintainable** - Easy to change

---

## 📁 Folder Structure - Best Practices

### Option 1: Feature-Based Structure (Recommended)

Organize by feature/domain:

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── SignupScreen.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── services/
│   │   │   └── authService.ts
│   │   └── types.ts
│   │
│   ├── products/
│   │   ├── components/
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductList.tsx
│   │   ├── screens/
│   │   │   ├── ProductsScreen.tsx
│   │   │   └── ProductDetailsScreen.tsx
│   │   ├── hooks/
│   │   │   └── useProducts.ts
│   │   ├── services/
│   │   │   └── productsService.ts
│   │   └── types.ts
│   │
│   └── cart/
│       ├── components/
│       ├── screens/
│       ├── hooks/
│       └── services/
│
├── shared/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   └── useAsync.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   └── validators.ts
│   └── constants/
│       └── theme.ts
│
├── navigation/
│   ├── AppNavigator.tsx
│   └── types.ts
│
├── services/
│   ├── api.ts
│   └── storage.ts
│
└── App.tsx
```

**Benefits:**
- Related code stays together
- Easy to find feature code
- Can delete entire features easily
- Clear boundaries

---

### Option 2: Layer-Based Structure

Organize by technical layer:

```
src/
├── components/
│   ├── buttons/
│   ├── forms/
│   └── cards/
├── screens/
├── hooks/
├── services/
├── utils/
├── navigation/
└── App.tsx
```

**Use when:**
- Small apps (< 20 screens)
- Simple domain
- Few developers

---

## 🧩 Component Composition Patterns

### Pattern 1: Compound Components

Build components that work together:

```typescript
import React, {createContext, useContext, useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';

// Context for sharing state
const AccordionContext = createContext();

// Main component
function Accordion({children}) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <AccordionContext.Provider value={{openIndex, setOpenIndex}}>
      <View style={styles.accordion}>{children}</View>
    </AccordionContext.Provider>
  );
}

// Item component
function AccordionItem({children, index}) {
  const {openIndex, setOpenIndex} = useContext(AccordionContext);
  const isOpen = openIndex === index;

  return (
    <View style={styles.item}>
      {React.Children.map(children, child =>
        React.cloneElement(child, {isOpen, index, setOpenIndex})
      )}
    </View>
  );
}

// Header component
function AccordionHeader({children, isOpen, index, setOpenIndex}) {
  return (
    <Pressable
      style={styles.header}
      onPress={() => setOpenIndex(isOpen ? null : index)}
    >
      <Text style={styles.headerText}>{children}</Text>
      <Text>{isOpen ? '▼' : '▶'}</Text>
    </Pressable>
  );
}

// Content component
function AccordionContent({children, isOpen}) {
  if (!isOpen) return null;

  return (
    <View style={styles.content}>
      <Text style={styles.contentText}>{children}</Text>
    </View>
  );
}

// Attach sub-components
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Content = AccordionContent;

// Usage
function FAQScreen() {
  return (
    <Accordion>
      <Accordion.Item index={0}>
        <Accordion.Header>What is React Native?</Accordion.Header>
        <Accordion.Content>
          React Native is a framework for building native apps using React.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item index={1}>
        <Accordion.Header>How does it work?</Accordion.Header>
        <Accordion.Content>
          React Native uses JavaScript to control native components.
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item index={2}>
        <Accordion.Header>Is it production-ready?</Accordion.Header>
        <Accordion.Content>
          Yes! Used by Facebook, Instagram, Discord, and many others.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

const styles = StyleSheet.create({
  accordion: {
    padding: 16,
  },
  item: {
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },
});
```

---

### Pattern 2: Render Props

Pass rendering logic as a prop:

```typescript
import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';

function DataFetcher({url, children}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  return children({data, loading, error});
}

// Usage
function UsersScreen() {
  return (
    <DataFetcher url="https://api.example.com/users">
      {({data, loading, error}) => {
        if (loading) return <ActivityIndicator />;
        if (error) return <Text>Error: {error}</Text>;
        return (
          <View>
            {data.map(user => (
              <Text key={user.id}>{user.name}</Text>
            ))}
          </View>
        );
      }}
    </DataFetcher>
  );
}
```

---

### Pattern 3: Higher-Order Components (HOC)

Add functionality to existing components:

```typescript
import React from 'react';
import {View, ActivityIndicator} from 'react-native';

function withLoading(Component) {
  return function WithLoadingComponent({isLoading, ...props}) {
    if (isLoading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return <Component {...props} />;
  };
}

// Usage
function UserList({users}) {
  return (
    <View>
      {users.map(user => (
        <Text key={user.id}>{user.name}</Text>
      ))}
    </View>
  );
}

const UserListWithLoading = withLoading(UserList);

// In your screen
function UsersScreen() {
  const {users, loading} = useUsers();

  return <UserListWithLoading users={users} isLoading={loading} />;
}
```

---

## 🎣 Custom Hooks for Logic Reuse

### Pattern: Extract Logic into Hooks

**Before (Logic in Component):**

```typescript
function ProductsScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://api.example.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error}</Text>;

  return <ProductList products={products} />;
}
```

**After (Logic in Custom Hook):**

```typescript
// hooks/useProducts.ts
function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://api.example.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return {products, loading, error};
}

// ProductsScreen.tsx
function ProductsScreen() {
  const {products, loading, error} = useProducts();

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error}</Text>;

  return <ProductList products={products} />;
}
```

---

### Useful Custom Hooks Library

```typescript
// hooks/useDebounce.ts
import {useState, useEffect} from 'react';

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// hooks/useAsync.ts
import {useState, useEffect, useCallback} from 'react';

export function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(() => {
    setStatus('pending');
    setData(null);
    setError(null);

    return asyncFunction()
      .then(response => {
        setData(response);
        setStatus('success');
      })
      .catch(error => {
        setError(error);
        setStatus('error');
      });
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {execute, status, data, error};
}

// hooks/useToggle.ts
import {useState, useCallback} from 'react';

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);

  return [value, toggle];
}

// hooks/useForm.ts
import {useState} from 'react';

export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setValues(prev => ({...prev, [name]: value}));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: ''}));
    }
  };

  const setFieldError = (name, error) => {
    setErrors(prev => ({...prev, [name]: error}));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    setFieldError,
    reset,
  };
}
```

**Usage:**

```typescript
function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    // API call with debounced value
    searchAPI(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <TextInput
      value={searchTerm}
      onChangeText={setSearchTerm}
      placeholder="Search..."
    />
  );
}

function SettingsScreen() {
  const [isEnabled, toggle] = useToggle(false);

  return (
    <Switch value={isEnabled} onValueChange={toggle} />
  );
}
```

---

## 🌐 Services and API Layer

### Create a Centralized API Service

```typescript
// services/api.ts
const API_BASE_URL = 'https://api.example.com';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get(endpoint: string) {
    return this.request(endpoint);
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();
```

### Feature-Specific Services

```typescript
// features/products/services/productsService.ts
import {api} from '../../../services/api';
import {Product} from '../types';

export const productsService = {
  getAll: (): Promise<Product[]> => {
    return api.get('/products');
  },

  getById: (id: number): Promise<Product> => {
    return api.get(`/products/${id}`);
  },

  create: (product: Omit<Product, 'id'>): Promise<Product> => {
    return api.post('/products', product);
  },

  update: (id: number, product: Partial<Product>): Promise<Product> => {
    return api.put(`/products/${id}`, product);
  },

  delete: (id: number): Promise<void> => {
    return api.delete(`/products/${id}`);
  },

  search: (query: string): Promise<Product[]> => {
    return api.get(`/products/search?q=${encodeURIComponent(query)}`);
  },
};
```

### Using Services in Hooks

```typescript
// features/products/hooks/useProducts.ts
import {useState, useEffect} from 'react';
import {productsService} from '../services/productsService';
import {Product} from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsService.getAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    loadProducts();
  };

  return {products, loading, error, refresh};
}

export function useProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productsService.getById(id);
      setProduct(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {product, loading, error};
}
```

---

## 🎯 MVVM Pattern (Model-View-ViewModel)

### Structure

```
features/products/
├── models/          # Data structures
│   └── Product.ts
├── viewModels/      # Business logic
│   └── ProductsViewModel.ts
├── views/           # UI components
│   ├── ProductsScreen.tsx
│   └── ProductCard.tsx
└── services/        # API calls
    └── productsService.ts
```

### Implementation

```typescript
// models/Product.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

// viewModels/ProductsViewModel.ts
import {useState, useEffect} from 'react';
import {productsService} from '../services/productsService';
import {Product} from '../models/Product';

export function useProductsViewModel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsService.getAll();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await productsService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  return {
    products,
    loading,
    error,
    loadProducts,
    deleteProduct,
  };
}

// views/ProductsScreen.tsx
import React from 'react';
import {View, FlatList, ActivityIndicator, Text} from 'react-native';
import {useProductsViewModel} from '../viewModels/ProductsViewModel';
import {ProductCard} from './ProductCard';

export function ProductsScreen() {
  const {products, loading, error, deleteProduct} = useProductsViewModel();

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <FlatList
      data={products}
      renderItem={({item}) => (
        <ProductCard
          product={item}
          onDelete={() => deleteProduct(item.id)}
        />
      )}
      keyExtractor={item => item.id.toString()}
    />
  );
}
```

---

## 🎓 Key Takeaways

1. **Feature-based folders** for large apps
2. **Custom hooks** extract reusable logic
3. **Services layer** centralizes API calls
4. **Compound components** for flexible APIs
5. **Separation of concerns** (UI, logic, data)
6. **Type safety** with TypeScript
7. **Consistent patterns** across features

---

## ✅ Checkpoint

You should now be able to:
- ✅ Organize code with feature-based structure
- ✅ Create reusable custom hooks
- ✅ Build compound components
- ✅ Implement services layer
- ✅ Apply MVVM pattern
- ✅ Separate concerns properly

---

## 🎯 Practice Challenge

**Build a Notes App with proper architecture:**

Requirements:
- Feature-based folder structure
- Custom hooks (useNotes, useNote)
- Services layer for API
- Compound components (NotesList, NoteCard)
- MVVM pattern
- TypeScript types

---

## 🔜 What's Next?

In **Chapter 13**, we'll explore **Advanced State Management** with Zustand and Redux Toolkit!

**Ready to master state? Let's go! 🚀**
