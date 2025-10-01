# Chapter 14: Async Operations & Data Fetching

**Duration:** 90-120 minutes  
**Difficulty:** Advanced  

---

## 🎯 Learning Objectives

By the end of this chapter, you'll understand:
- Async/await and Promises in depth
- React Query (TanStack Query) for data fetching
- Caching strategies
- Optimistic updates
- Error handling patterns
- Pagination and infinite scroll
- Real-time data with polling
- Request cancellation

---

## 📚 Async/Await Refresher

### The Evolution

```javascript
// 1. Callbacks (Callback Hell)
fetchUser(userId, (user) => {
  fetchPosts(user.id, (posts) => {
    fetchComments(posts[0].id, (comments) => {
      // Finally got comments...
    });
  });
});

// 2. Promises (Better)
fetchUser(userId)
  .then((user) => fetchPosts(user.id))
  .then((posts) => fetchComments(posts[0].id))
  .then((comments) => {
    // Got comments
  })
  .catch((error) => {
    // Handle error
  });

// 3. Async/Await (Best)
async function loadData() {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    // Got comments
  } catch (error) {
    // Handle error
  }
}
```

---

## 🔍 The Problem with Manual Data Fetching

### Traditional Approach

```typescript
import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';

function ProductsScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.example.com/products');
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <FlatList
      data={products}
      renderItem={({item}) => <ProductCard product={item} />}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}
```

**Problems:**
- 😓 Lots of boilerplate (loading, error, data)
- 🔄 No caching (refetch on every mount)
- 🐛 No refetch on focus/reconnect
- 📦 No request deduplication
- ⏰ No background refresh
- 🎯 Hard to share data between components

---

## 🚀 React Query (TanStack Query) - The Solution

React Query handles all the complexity of async state management.

### Installation

```bash
npm install @tanstack/react-query
```

### Setup

```typescript
// App.tsx
import React from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {NavigationContainer} from '@react-navigation/native';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        {/* Your app */}
      </NavigationContainer>
    </QueryClientProvider>
  );
}

export default App;
```

---

## 📖 Basic Usage - useQuery

```typescript
import React from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import {useQuery} from '@tanstack/react-query';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('https://api.example.com/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

function ProductsScreen() {
  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error: {error.message}</Text>
        <Pressable onPress={() => refetch()}>
          <Text>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={({item}) => <ProductCard product={item} />}
      keyExtractor={(item) => item.id.toString()}
      onRefresh={refetch}
      refreshing={isLoading}
    />
  );
}
```

**Benefits:**
- ✅ Auto caching
- ✅ Auto refetch on window focus
- ✅ Auto refetch on reconnect
- ✅ Background updates
- ✅ Request deduplication
- ✅ Less code!

---

## 🔑 Query Keys - The Identifier

Query keys identify unique queries:

```typescript
// Simple key
useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
});

// Key with parameters
useQuery({
  queryKey: ['product', productId],
  queryFn: () => fetchProduct(productId),
});

// Complex key with filters
useQuery({
  queryKey: ['products', {category: 'electronics', sort: 'price'}],
  queryFn: () => fetchProducts({category: 'electronics', sort: 'price'}),
});
```

**Key Rules:**
1. **Unique** - Different data = different key
2. **Deterministic** - Same input = same key
3. **Serializable** - Must be JSON-serializable

---

## 📝 Mutations - Creating, Updating, Deleting

Use `useMutation` for data changes:

```typescript
import {useMutation, useQueryClient} from '@tanstack/react-query';

interface CreateProductInput {
  name: string;
  price: number;
  description: string;
}

async function createProduct(product: CreateProductInput): Promise<Product> {
  const response = await fetch('https://api.example.com/products', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(product),
  });
  return response.json();
}

function AddProductScreen() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidate and refetch products query
      queryClient.invalidateQueries({queryKey: ['products']});
    },
  });

  const handleSubmit = () => {
    mutation.mutate({
      name: 'New Product',
      price: 99.99,
      description: 'Amazing product',
    });
  };

  return (
    <View>
      {mutation.isPending && <ActivityIndicator />}
      {mutation.isError && <Text>Error: {mutation.error.message}</Text>}
      {mutation.isSuccess && <Text>Product created!</Text>}
      
      <Pressable onPress={handleSubmit} disabled={mutation.isPending}>
        <Text>Create Product</Text>
      </Pressable>
    </View>
  );
}
```

---

## ⚡ Optimistic Updates

Update UI immediately before server responds:

```typescript
function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: number) => {
      const response = await fetch(`https://api.example.com/products/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Delete failed');
      return productId;
    },
    
    // Optimistically update UI
    onMutate: async (productId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({queryKey: ['products']});

      // Snapshot previous value
      const previousProducts = queryClient.getQueryData(['products']);

      // Optimistically update
      queryClient.setQueryData(['products'], (old: Product[]) =>
        old.filter((product) => product.id !== productId)
      );

      // Return rollback data
      return {previousProducts};
    },
    
    // On error, rollback
    onError: (err, productId, context) => {
      queryClient.setQueryData(['products'], context.previousProducts);
    },
    
    // Always refetch after success or error
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['products']});
    },
  });
}

function ProductCard({product}) {
  const deleteProduct = useDeleteProduct();

  return (
    <View>
      <Text>{product.name}</Text>
      <Pressable onPress={() => deleteProduct.mutate(product.id)}>
        <Text>Delete</Text>
      </Pressable>
    </View>
  );
}
```

---

## ♾️ Infinite Queries - Pagination

Load more data as user scrolls:

```typescript
import {useInfiniteQuery} from '@tanstack/react-query';

interface ProductsResponse {
  products: Product[];
  nextPage: number | null;
}

async function fetchProducts({pageParam = 1}): Promise<ProductsResponse> {
  const response = await fetch(
    `https://api.example.com/products?page=${pageParam}&limit=20`
  );
  return response.json();
}

function InfiniteProductsScreen() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) return <ActivityIndicator />;

  // Flatten all pages
  const allProducts = data?.pages.flatMap((page) => page.products) ?? [];

  return (
    <FlatList
      data={allProducts}
      renderItem={({item}) => <ProductCard product={item} />}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? <ActivityIndicator /> : null
      }
    />
  );
}
```

---

## 🔄 Polling - Real-time Updates

Refetch data at intervals:

```typescript
function LiveScoresScreen() {
  const {data} = useQuery({
    queryKey: ['scores'],
    queryFn: fetchScores,
    refetchInterval: 5000, // Refetch every 5 seconds
    refetchIntervalInBackground: true, // Even when app in background
  });

  return (
    <View>
      {data?.map((score) => (
        <Text key={score.id}>
          {score.team1} {score.score1} - {score.score2} {score.team2}
        </Text>
      ))}
    </View>
  );
}
```

---

## 🚫 Request Cancellation

Cancel requests when component unmounts:

```typescript
async function fetchProducts(signal: AbortSignal): Promise<Product[]> {
  const response = await fetch('https://api.example.com/products', {
    signal, // Pass abort signal
  });
  return response.json();
}

function ProductsScreen() {
  const {data} = useQuery({
    queryKey: ['products'],
    queryFn: ({signal}) => fetchProducts(signal),
  });

  // Request automatically cancelled when component unmounts
}
```

---

## 🔍 Dependent Queries

Query that depends on another query:

```typescript
function UserPostsScreen({userId}: {userId: number}) {
  // First query - get user
  const {data: user} = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Second query - depends on first
  const {data: posts} = useQuery({
    queryKey: ['posts', user?.id],
    queryFn: () => fetchUserPosts(user!.id),
    enabled: !!user, // Only run when user exists
  });

  return (
    <View>
      <Text>{user?.name}</Text>
      {posts?.map((post) => (
        <Text key={post.id}>{post.title}</Text>
      ))}
    </View>
  );
}
```

---

## 💡 Complete Example: Todo App with React Query

```typescript
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from 'react-native';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// API functions
async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch('https://api.example.com/todos');
  return response.json();
}

async function createTodo(title: string): Promise<Todo> {
  const response = await fetch('https://api.example.com/todos', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({title, completed: false}),
  });
  return response.json();
}

async function toggleTodo(id: number): Promise<Todo> {
  const response = await fetch(`https://api.example.com/todos/${id}/toggle`, {
    method: 'PATCH',
  });
  return response.json();
}

async function deleteTodo(id: number): Promise<void> {
  await fetch(`https://api.example.com/todos/${id}`, {
    method: 'DELETE',
  });
}

function TodoApp() {
  const [newTodo, setNewTodo] = useState('');
  const queryClient = useQueryClient();

  // Fetch todos
  const {data: todos, isLoading} = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  // Create todo mutation
  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['todos']});
      setNewTodo('');
    },
  });

  // Toggle todo mutation
  const toggleMutation = useMutation({
    mutationFn: toggleTodo,
    onMutate: async (todoId) => {
      await queryClient.cancelQueries({queryKey: ['todos']});
      const previousTodos = queryClient.getQueryData(['todos']);

      queryClient.setQueryData(['todos'], (old: Todo[]) =>
        old.map((todo) =>
          todo.id === todoId ? {...todo, completed: !todo.completed} : todo
        )
      );

      return {previousTodos};
    },
    onError: (err, todoId, context) => {
      queryClient.setQueryData(['todos'], context.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['todos']});
    },
  });

  // Delete todo mutation
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['todos']});
    },
  });

  const handleCreate = () => {
    if (newTodo.trim()) {
      createMutation.mutate(newTodo);
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="Add a new todo..."
          onSubmitEditing={handleCreate}
        />
        <Pressable
          style={styles.addButton}
          onPress={handleCreate}
          disabled={createMutation.isPending}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={todos}
        renderItem={({item}) => (
          <View style={styles.todoItem}>
            <Pressable
              style={styles.checkbox}
              onPress={() => toggleMutation.mutate(item.id)}
            >
              <Text>{item.completed ? '✓' : ''}</Text>
            </Pressable>
            <Text
              style={[
                styles.todoText,
                item.completed && styles.completedText,
              ]}
            >
              {item.title}
            </Text>
            <Pressable onPress={() => deleteMutation.mutate(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </Pressable>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todoText: {
    flex: 1,
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteButton: {
    color: '#ff3b30',
    fontWeight: '600',
  },
});

export default TodoApp;
```

---

## 🎓 Key Takeaways

1. **React Query simplifies** async state management
2. **useQuery** for fetching data
3. **useMutation** for creating/updating/deleting
4. **Query keys** identify and cache queries
5. **Optimistic updates** for instant UI feedback
6. **useInfiniteQuery** for pagination
7. **Polling** for real-time data
8. **Request cancellation** prevents memory leaks

---

## ✅ Checkpoint

You should now be able to:
- ✅ Use React Query for data fetching
- ✅ Implement queries with useQuery
- ✅ Create mutations with useMutation
- ✅ Handle optimistic updates
- ✅ Implement infinite scroll
- ✅ Set up polling for real-time data
- ✅ Cancel requests properly

---

## 🎯 Practice Challenge

**Build a Social Media Feed:**

Requirements:
- Infinite scroll for posts
- Pull-to-refresh
- Like/unlike with optimistic updates
- Add new post
- Delete post
- Real-time updates every 30 seconds
- Error handling and retry

---

## 🔜 What's Next?

In **Chapter 15**, we'll explore **Native Modules & Platform APIs**!

**Ready to go native? Let's dive in! 🚀**
