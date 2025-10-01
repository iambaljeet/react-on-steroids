# Chapter 7: State - Making Components Dynamic

**Duration:** 75-90 minutes  
**Difficulty:** Beginner to Intermediate  

---

## 🎯 Learning Objectives

By the end of this chapter, you'll understand:
- What state is and why it's fundamental
- The `useState` hook in depth
- The difference between state and props
- How to update state correctly
- State lifting (sharing state between components)
- Managing multiple state variables
- Common state patterns

---

## 🔄 What Is State?

### The Simple Answer

**State is data that changes over time within a component.**

Think of state as the component's memory - it remembers values that can change based on user actions, time, or other events.

---

### Real-World Analogy

Imagine a light switch:

```typescript
// The light has STATE - it's either ON or OFF
const [isLightOn, setIsLightOn] = useState(false);

// When you flip the switch, the STATE changes
<Switch onPress={() => setIsLightOn(!isLightOn)} />

// The light responds to its current STATE
<Light brightness={isLightOn ? 100 : 0} />
```

The switch "remembers" whether it's on or off - that's state!

---

## 🆚 State vs Props: The KEY Difference

| Aspect | Props | State |
|--------|-------|-------|
| **Defined by** | Parent component | The component itself |
| **Can change?** | No (read-only) | Yes (via setState) |
| **Triggers re-render?** | Yes (when parent re-renders) | Yes (when state changes) |
| **Use for** | Configuration, passing data | Interactive data, dynamic values |

**Visual:**

```
Parent Component
  ├─ passes props ────→ Child Component A (can't change them)
  └─ passes props ────→ Child Component B (can't change them)

Child Component
  └─ manages state ───→ Can change its own state
```

---

## 🪝 The useState Hook

### Basic Syntax

```typescript
import React, {useState} from 'react';

function Counter() {
  // Declare a state variable
  const [count, setCount] = useState(0);
  //      ↑       ↑          ↑
  //   current  function   initial
  //    value   to update   value

  return (
    <View>
      <Text>Count: {count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />
    </View>
  );
}
```

**Breaking it down:**
1. `useState(0)` - Initialize state with value `0`
2. `count` - Current value of state
3. `setCount` - Function to update state
4. Array destructuring: `[value, setter]`

---

## 🎮 Your First Stateful Component

Let's build a simple counter:

```typescript
import React, {useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';

function Counter() {
  // Initialize state
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counter App</Text>

      <View style={styles.counterDisplay}>
        <Text style={styles.count}>{count}</Text>
      </View>

      <View style={styles.buttons}>
        <Pressable
          style={styles.button}
          onPress={() => setCount(count - 1)}
        >
          <Text style={styles.buttonText}>-</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => setCount(0)}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => setCount(count + 1)}
        >
          <Text style={styles.buttonText}>+</Text>
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
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  counterDisplay: {
    backgroundColor: '#007AFF',
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  count: {
    fontSize: 72,
    fontWeight: 'bold',
    color: 'white',
  },
  buttons: {
    flexDirection: 'row',
    gap: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
});

export default Counter;
```

**What happens when you click a button:**
1. `setCount` is called with new value
2. React re-renders the component
3. Screen updates with new count
4. All in milliseconds!

---

## ⚠️ Important: State Updates Are Asynchronous

State updates don't happen immediately:

```typescript
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(count + 1);
  console.log(count);  // ⚠️ Still shows old value!
  // React will update on next render
};
```

**Why?** React batches state updates for performance.

---

## 🔄 Updating State Correctly

### ❌ Don't Mutate State Directly

```typescript
// ❌ WRONG - Direct mutation
const [user, setUser] = useState({name: 'John', age: 30});
user.age = 31;  // This won't trigger re-render!

// ✅ CORRECT - Create new object
setUser({...user, age: 31});
```

### ✅ Functional Updates

When new state depends on old state, use functional update:

```typescript
// ❌ Can have bugs with multiple rapid updates
setCount(count + 1);

// ✅ BETTER - Functional update
setCount(prevCount => prevCount + 1);
```

**Why?** The functional form guarantees you're working with the latest state.

---

## 📝 Practical Example: Todo List

Let's build a todo list to see state in action:

```typescript
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';

function TodoApp() {
  // State for input field
  const [inputText, setInputText] = useState('');

  // State for todos array
  const [todos, setTodos] = useState([]);

  const addTodo = () => {
    if (inputText.trim() === '') {
      Alert.alert('Error', 'Please enter a task');
      return;
    }

    // Create new todo object
    const newTodo = {
      id: Date.now().toString(),
      text: inputText,
      completed: false,
    };

    // Add to todos array (functional update)
    setTodos(prevTodos => [newTodo, ...prevTodos]);

    // Clear input
    setInputText('');
  };

  const toggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? {...todo, completed: !todo.completed}
          : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Tasks</Text>

      {/* Stats */}
      <View style={styles.stats}>
        <Text style={styles.statText}>
          Total: {todos.length}
        </Text>
        <Text style={styles.statText}>
          Completed: {todos.filter(t => t.completed).length}
        </Text>
      </View>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="What needs to be done?"
          returnKeyType="done"
          onSubmitEditing={addTodo}
        />
        <Pressable style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      {/* Todo List */}
      <FlatList
        data={todos}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.todoItem}>
            <Pressable
              style={styles.todoContent}
              onPress={() => toggleTodo(item.id)}
            >
              <View
                style={[
                  styles.checkbox,
                  item.completed && styles.checkboxCompleted,
                ]}
              >
                {item.completed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text
                style={[
                  styles.todoText,
                  item.completed && styles.todoTextCompleted,
                ]}
              >
                {item.text}
              </Text>
            </Pressable>
            <Pressable onPress={() => deleteTodo(item.id)}>
              <Text style={styles.deleteButton}>🗑️</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  statText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 32,
    fontWeight: '300',
  },
  todoItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  todoContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 12,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  todoText: {
    fontSize: 16,
    color: '#1a1a1a',
    flex: 1,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteButton: {
    fontSize: 24,
    paddingHorizontal: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
});

export default TodoApp;
```

**Key State Concepts in This Example:**

1. **Multiple State Variables:**
   ```typescript
   const [inputText, setInputText] = useState('');
   const [todos, setTodos] = useState([]);
   ```

2. **Array Updates:**
   ```typescript
   // Adding
   setTodos(prev => [newTodo, ...prev]);
   
   // Updating
   setTodos(prev => prev.map(todo => 
     todo.id === id ? {...todo, completed: !todo.completed} : todo
   ));
   
   // Deleting
   setTodos(prev => prev.filter(todo => todo.id !== id));
   ```

3. **Derived Values:**
   ```typescript
   // These are computed from state, not stored in state
   todos.length
   todos.filter(t => t.completed).length
   ```

---

## 🔝 State Lifting

When multiple components need to share state, move it to their common parent.

### Problem: Siblings Can't Share State Directly

```typescript
// ❌ Won't work - siblings can't communicate directly
<ComponentA />  {/* Has count state */}
<ComponentB />  {/* Needs to know count */}
```

### Solution: Lift State Up

```typescript
function ParentComponent() {
  // Lift state to parent
  const [count, setCount] = useState(0);

  return (
    <View>
      <ComponentA count={count} setCount={setCount} />
      <ComponentB count={count} />
    </View>
  );
}

function ComponentA({count, setCount}) {
  return (
    <Button 
      title="Increment" 
      onPress={() => setCount(count + 1)} 
    />
  );
}

function ComponentB({count}) {
  return <Text>Count is: {count}</Text>;
}
```

---

### Practical Example: Color Picker

```typescript
import React, {useState} from 'react';
import {View, Text, Slider, StyleSheet} from 'react-native';

function ColorPicker() {
  // Lift state to parent
  const [red, setRed] = useState(128);
  const [green, setGreen] = useState(128);
  const [blue, setBlue] = useState(128);

  const color = `rgb(${red}, ${green}, ${blue})`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Color Picker</Text>

      {/* Color Preview */}
      <View style={[styles.preview, {backgroundColor: color}]} />

      {/* RGB Values */}
      <Text style={styles.colorText}>{color}</Text>

      {/* Sliders */}
      <ColorSlider
        label="Red"
        value={red}
        onValueChange={setRed}
        color="#FF0000"
      />
      <ColorSlider
        label="Green"
        value={green}
        onValueChange={setGreen}
        color="#00FF00"
      />
      <ColorSlider
        label="Blue"
        value={blue}
        onValueChange={setBlue}
        color="#0000FF"
      />
    </View>
  );
}

// Child component receives state and setter as props
function ColorSlider({label, value, onValueChange, color}) {
  return (
    <View style={styles.sliderContainer}>
      <Text style={styles.label}>
        {label}: {Math.round(value)}
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={255}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor={color}
        maximumTrackTintColor="#ddd"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  preview: {
    height: 200,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  colorText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 30,
    color: '#333',
  },
  sliderContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default ColorPicker;
```

---

## 🎯 Managing Complex State

### Objects in State

```typescript
const [user, setUser] = useState({
  name: 'John',
  email: 'john@example.com',
  age: 30,
});

// Update single property (spread operator)
const updateEmail = (newEmail) => {
  setUser(prevUser => ({
    ...prevUser,
    email: newEmail,
  }));
};

// Update multiple properties
const updateProfile = (updates) => {
  setUser(prevUser => ({
    ...prevUser,
    ...updates,
  }));
};
```

### Arrays in State

```typescript
const [items, setItems] = useState([]);

// Add item
setItems(prev => [...prev, newItem]);

// Add at beginning
setItems(prev => [newItem, ...prev]);

// Remove item
setItems(prev => prev.filter(item => item.id !== id));

// Update item
setItems(prev =>
  prev.map(item =>
    item.id === id ? {...item, updated: true} : item
  )
);

// Sort items
setItems(prev => [...prev].sort((a, b) => a.name.localeCompare(b.name)));
```

---

## 🎮 Practical Example: Shopping Cart

```typescript
import React, {useState} from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';

function ShoppingCart() {
  const [cart, setCart] = useState([]);

  // Available products
  const products = [
    {id: 1, name: 'Laptop', price: 999},
    {id: 2, name: 'Mouse', price: 29},
    {id: 3, name: 'Keyboard', price: 79},
    {id: 4, name: 'Monitor', price: 299},
  ];

  const addToCart = (product) => {
    setCart(prevCart => {
      // Check if item already exists
      const existingItem = prevCart.find(item => item.id === product.id);

      if (existingItem) {
        // Increase quantity
        return prevCart.map(item =>
          item.id === product.id
            ? {...item, quantity: item.quantity + 1}
            : item
        );
      } else {
        // Add new item
        return [...prevCart, {...product, quantity: 1}];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart(prevCart =>
      prevCart
        .map(item =>
          item.id === productId
            ? {...item, quantity: Math.max(0, item.quantity + delta)}
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Remove all items from cart?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Clear', onPress: () => setCart([]), style: 'destructive'},
      ]
    );
  };

  // Derived values
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>

      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Items: {totalItems}</Text>
        <Text style={styles.summaryText}>
          Total: ${totalPrice.toFixed(2)}
        </Text>
      </View>

      {/* Products */}
      <Text style={styles.sectionTitle}>Products</Text>
      <View style={styles.productsGrid}>
        {products.map(product => (
          <Pressable
            key={product.id}
            style={styles.productCard}
            onPress={() => addToCart(product)}
          >
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>${product.price}</Text>
          </Pressable>
        ))}
      </View>

      {/* Cart */}
      <Text style={styles.sectionTitle}>Cart</Text>
      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <View style={styles.cartItem}>
                <View style={styles.cartItemInfo}>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemPrice}>
                    ${item.price} × {item.quantity}
                  </Text>
                </View>
                <View style={styles.cartItemActions}>
                  <Pressable
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, -1)}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </Pressable>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <Pressable
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, 1)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </Pressable>
                  <Pressable onPress={() => removeFromCart(item.id)}>
                    <Text style={styles.removeButton}>🗑️</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
          <Pressable style={styles.clearButton} onPress={clearCart}>
            <Text style={styles.clearButtonText}>Clear Cart</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  summaryText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  productCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#666',
  },
  cartItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantityButton: {
    backgroundColor: '#007AFF',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    fontSize: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ShoppingCart;
```

---

## 🎓 Key Takeaways

1. **State is for dynamic data** that changes over time
2. **Use useState** to create state variables
3. **State updates are asynchronous** - don't rely on immediate values
4. **Never mutate state directly** - always use the setter function
5. **Use functional updates** when new state depends on old state
6. **Lift state up** when multiple components need to share it
7. **Derived values** should be calculated, not stored in state

---

## ✅ State Update Patterns Cheatsheet

```typescript
// Simple value
const [count, setCount] = useState(0);
setCount(5);                        // Set to value
setCount(prev => prev + 1);         // Based on previous

// Object
const [user, setUser] = useState({name: '', age: 0});
setUser({...user, age: 31});        // Update property
setUser(prev => ({...prev, age: prev.age + 1}));

// Array
const [items, setItems] = useState([]);
setItems([...items, newItem]);      // Add
setItems(items.filter(i => i.id !== id));  // Remove
setItems(items.map(i => i.id === id ? {...i, updated: true} : i));  // Update
```

---

## 🤔 Common Questions

**Q: How many state variables should I use?**  
A: Use separate state variables for independent data. Group related data in objects.

**Q: Why isn't my state updating?**  
A: Remember, state updates are asynchronous. Also check if you're mutating instead of creating new objects/arrays.

**Q: Should I store derived values in state?**  
A: No! Calculate them from existing state instead.

```typescript
// ❌ Don't store derived values
const [todos, setTodos] = useState([]);
const [completedCount, setCompletedCount] = useState(0);

// ✅ Calculate derived values
const [todos, setTodos] = useState([]);
const completedCount = todos.filter(t => t.completed).length;
```

---

## ✅ Checkpoint

You should now be able to:
- ✅ Use useState to create state variables
- ✅ Update state correctly (without mutation)
- ✅ Manage arrays and objects in state
- ✅ Lift state up to share between components
- ✅ Build interactive applications with state

---

## 🎯 Practice Challenges

### Challenge 1: Toggle Switch
Create a component with:
- A switch that toggles between light/dark theme
- Different background colors based on state
- State persists across toggles

### Challenge 2: Form with Validation
Build a form with:
- Multiple input fields (name, email, password)
- Each stored in separate state
- Validation that shows errors
- Submit button that checks all fields

### Challenge 3: Timer App
Create a timer that:
- Counts up from 0
- Has start, pause, and reset buttons
- Shows minutes and seconds
- Uses setInterval (we'll learn this properly in Chapter 9!)

---

## 🔜 What's Next?

In **Chapter 8**, we'll learn about **Lists & Keys** - efficiently rendering large amounts of dynamic data using FlatList!

You now understand props (passing data in) and state (managing changing data). Next, we'll handle displaying that data efficiently!

**Ready to work with lists? Let's go! 🚀**
