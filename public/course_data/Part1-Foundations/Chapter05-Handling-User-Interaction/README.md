# Chapter 5: Handling User Interaction

**Duration:** 60-75 minutes  
**Difficulty:** Beginner  

---

## 🎯 Learning Objectives

By the end of this chapter, you'll understand:
- How to handle touch events in React Native
- Different touchable components and when to use them
- Creating and managing forms
- Handling text input and keyboard
- Building interactive UIs

---

## 👆 Touch Events in React Native

Unlike web where you have mouse events (`onclick`, `onhover`), mobile apps use **touch events**.

React Native provides several components for handling touches:
- `TouchableOpacity` - Decreases opacity on press
- `TouchableHighlight` - Shows highlight color on press
- `Pressable` - Modern, flexible touchable component (recommended)
- `Button` - Simple button component

---

## 🔘 The Button Component

The simplest way to add a button:

```typescript
import React from 'react';
import {View, Button, Alert} from 'react-native';

function App() {
  const handlePress = () => {
    Alert.alert('Button Pressed!', 'You clicked the button');
  };

  return (
    <View style={{padding: 20}}>
      <Button
        title="Click Me"
        onPress={handlePress}
        color="#007AFF"
      />
    </View>
  );
}

export default App;
```

**Pros:**
- ✅ Simple to use
- ✅ Platform-specific styling (looks native)

**Cons:**
- ❌ Limited customization
- ❌ Can't add custom styles

**When to use:** Quick prototypes, simple actions

---

## ✨ TouchableOpacity

The most popular touchable component. Reduces opacity when pressed.

```typescript
import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

function CustomButton() {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => console.log('Pressed!')}
      activeOpacity={0.7}  // Opacity when pressed (default: 0.2)
    >
      <Text style={styles.buttonText}>Press Me</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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

export default CustomButton;
```

**Props:**
- `onPress` - Function called when pressed
- `onPressIn` - When touch starts
- `onPressOut` - When touch ends
- `onLongPress` - Long press (hold)
- `activeOpacity` - Opacity level (0 to 1)
- `disabled` - Disable the button

---

## 🌟 TouchableHighlight

Shows a highlight color when pressed.

```typescript
import React from 'react';
import {TouchableHighlight, Text, StyleSheet} from 'react-native';

function HighlightButton() {
  return (
    <TouchableHighlight
      style={styles.button}
      onPress={() => console.log('Pressed!')}
      underlayColor="#005BB5"  // Color when pressed
      onLongPress={() => console.log('Long pressed!')}
    >
      <Text style={styles.buttonText}>Press & Hold</Text>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
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

export default HighlightButton;
```

**When to use:** When you want a visual highlight effect

---

## 🎯 Pressable (Recommended for New Projects)

The modern, flexible way to handle touches. Introduced in React Native 0.63.

```typescript
import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';

function ModernButton() {
  return (
    <Pressable
      style={({pressed}) => [
        styles.button,
        pressed && styles.buttonPressed,  // Style when pressed
      ]}
      onPress={() => console.log('Pressed!')}
      onLongPress={() => console.log('Long pressed!')}
    >
      {({pressed}) => (
        <Text style={styles.buttonText}>
          {pressed ? 'Pressing...' : 'Press Me'}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#005BB5',
    transform: [{scale: 0.98}],  // Slightly smaller when pressed
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ModernButton;
```

**Why Pressable is better:**
- ✅ More flexible
- ✅ Access to `pressed` state
- ✅ Can customize any aspect
- ✅ Better performance
- ✅ Supports hover (web) and focus (accessibility)

**Advanced Pressable Example:**

```typescript
<Pressable
  onPress={() => console.log('Pressed')}
  onLongPress={() => console.log('Long pressed')}
  delayLongPress={500}  // How long to hold (ms)
  onPressIn={() => console.log('Touch started')}
  onPressOut={() => console.log('Touch ended')}
  disabled={false}
  hitSlop={10}  // Extend touchable area by 10px on all sides
  pressRetentionOffset={20}  // How far finger can move before canceling
  style={({pressed}) => [
    styles.button,
    pressed && {opacity: 0.5},
  ]}
>
  <Text>Advanced Button</Text>
</Pressable>
```

---

## ⌨️ TextInput - Handling Text

### Basic TextInput

```typescript
import React, {useState} from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';

function TextInputExample() {
  const [text, setText] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}  // Update state on every keystroke
        placeholder="Enter your name"
      />
      <Text>You typed: {text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
});

export default TextInputExample;
```

**Key concepts:**
- `value={text}` - Controlled component
- `onChangeText={setText}` - Update state
- This is a **controlled input** (React controls its value)

---

### Common TextInput Props

```typescript
<TextInput
  // Value
  value={text}
  onChangeText={setText}
  defaultValue="Initial text"  // Uncontrolled input
  
  // Appearance
  placeholder="Enter text..."
  placeholderTextColor="#999"
  style={styles.input}
  multiline={false}  // Single line (default)
  numberOfLines={4}  // For multiline
  
  // Keyboard
  keyboardType="default"  // See keyboard types below
  autoCapitalize="sentences"  // 'none', 'sentences', 'words', 'characters'
  autoCorrect={true}
  autoFocus={false}  // Focus on mount
  
  // Security
  secureTextEntry={false}  // For passwords
  
  // Behavior
  editable={true}
  maxLength={50}
  returnKeyType="done"  // 'done', 'go', 'next', 'search', 'send'
  
  // Events
  onFocus={() => console.log('Focused')}
  onBlur={() => console.log('Blurred')}
  onSubmitEditing={() => console.log('Submitted')}
/>
```

---

### Keyboard Types

```typescript
keyboardType="default"        // Standard keyboard
keyboardType="numeric"        // Numbers only
keyboardType="email-address"  // Email keyboard (@, .com)
keyboardType="phone-pad"      // Phone number pad
keyboardType="decimal-pad"    // Numbers with decimal
keyboardType="url"            // URL keyboard (.com, /)
keyboardType="number-pad"     // Numeric keypad
```

---

## 📝 Building a Login Form

Let's build a complete, interactive login form:

```typescript
import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    // Basic validation
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', `Welcome back, ${email}!`);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="your.email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry={true}
            returnKeyType="done"
            onSubmitEditing={handleLogin}  // Submit when "done" pressed
          />
        </View>

        {/* Login Button */}
        <Pressable
          style={({pressed}) => [
            styles.button,
            pressed && styles.buttonPressed,
            isLoading && styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Text>
        </Pressable>

        {/* Forgot Password */}
        <Pressable onPress={() => Alert.alert('Forgot Password clicked')}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    backgroundColor: '#005BB5',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotText: {
    color: '#007AFF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default LoginForm;
```

---

## ⌨️ Keyboard Handling

### KeyboardAvoidingView

Prevents keyboard from covering inputs:

```typescript
import {KeyboardAvoidingView, Platform} from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{flex: 1}}
>
  {/* Your form here */}
</KeyboardAvoidingView>
```

**Behaviors:**
- `padding` - Add padding (iOS)
- `height` - Adjust height (Android)
- `position` - Adjust position

---

### Dismissing the Keyboard

```typescript
import {Keyboard, TouchableWithoutFeedback} from 'react-native';

<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  <View style={styles.container}>
    <TextInput style={styles.input} />
  </View>
</TouchableWithoutFeedback>
```

**Or programmatically:**

```typescript
import {Keyboard} from 'react-native';

const hideKeyboard = () => {
  Keyboard.dismiss();
};
```

---

### Listening to Keyboard Events

```typescript
import React, {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';

function MyComponent() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });

    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <View>
      <Text>Keyboard is {keyboardVisible ? 'visible' : 'hidden'}</Text>
    </View>
  );
}
```

---

## 🎯 Practical Exercise: Todo Input Form

Let's build an interactive todo input:

```typescript
import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';

function TodoApp() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);

  const addTodo = () => {
    if (task.trim() === '') {
      Alert.alert('Error', 'Please enter a task');
      return;
    }

    const newTodo = {
      id: Date.now().toString(),
      text: task,
      completed: false,
    };

    setTodos([newTodo, ...todos]);
    setTask('');  // Clear input
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? {...todo, completed: !todo.completed} : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Tasks</Text>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={task}
          onChangeText={setTask}
          placeholder="What needs to be done?"
          returnKeyType="done"
          onSubmitEditing={addTodo}
        />
        <Pressable
          style={({pressed}) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
          ]}
          onPress={addTodo}
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      {/* Todo List */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
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
            <Pressable
              onPress={() => deleteTodo(item.id)}
              hitSlop={10}
            >
              <Text style={styles.deleteButton}>×</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet. Add one above!</Text>
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
    marginBottom: 20,
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
    borderRadius: 8,
    padding: 12,
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
  addButtonPressed: {
    backgroundColor: '#005BB5',
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
    borderRadius: 8,
    marginBottom: 8,
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
    fontSize: 16,
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
    color: '#FF3B30',
    fontSize: 32,
    fontWeight: '300',
    paddingHorizontal: 8,
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

**This example demonstrates:**
- ✅ Text input handling
- ✅ Form submission
- ✅ List rendering
- ✅ Touch interactions
- ✅ State management
- ✅ Conditional styling

---

## 🎓 Key Takeaways

1. **Pressable is the modern choice** for touch handling
2. **TextInput needs controlled state** - use `value` and `onChangeText`
3. **KeyboardAvoidingView** prevents keyboard from covering inputs
4. **Always validate user input** before processing
5. **Provide visual feedback** when users interact (pressed states, loading indicators)
6. **hitSlop** makes small buttons easier to tap
7. **returnKeyType** improves form UX

---

## ✅ Checkpoint

You should now be able to:
- ✅ Handle touch events with Pressable
- ✅ Create custom buttons
- ✅ Build forms with TextInput
- ✅ Manage keyboard behavior
- ✅ Validate user input
- ✅ Create interactive UIs

---

## 🤔 Common Questions

**Q: Why use controlled components?**  
A: So React manages the state, making it predictable and easier to validate/transform input.

**Q: When should I use Button vs Pressable?**  
A: Use Button for quick prototypes. Use Pressable for production apps (more control).

**Q: How do I handle forms with many fields?**  
A: Use an object state or a form library (we'll cover this in advanced chapters).

**Q: What's the difference between onPress and onPressIn?**  
A: `onPress` fires when released, `onPressIn` fires immediately when touched.

---

## 🎯 Practice Challenges

### Challenge 1: Sign Up Form
Build a registration form with:
- Name, Email, Password, Confirm Password
- Validation for each field
- Submit button that checks all validations

### Challenge 2: Calculator
Create a simple calculator with:
- Number buttons (0-9)
- Operation buttons (+, -, ×, ÷)
- Display showing current calculation
- Clear button

### Challenge 3: Search Bar
Build a search bar component with:
- Search icon
- Clear button (appears when typing)
- Loading indicator
- Debounced search (search after user stops typing)

---

## 🔜 What's Next?

**Congratulations! You've completed Part 1: Foundations! 🎉**

You now understand:
- What React Native is and how it works
- Setting up your environment
- Components and composition
- Styling with Flexbox
- Handling user interaction

In **Part 2: Core Concepts**, we'll dive deeper into:
- Props - Passing data between components
- State - Making your app dynamic
- Lists - Efficiently displaying data
- useEffect - Side effects and lifecycle
- Navigation - Multi-screen apps
- Context API - Global state

**Ready to level up? Let's continue to Chapter 6! 🚀**
