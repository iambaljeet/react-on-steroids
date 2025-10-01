# Chapter 16: Testing Your React Native App

**Duration:** 120-150 minutes  
**Difficulty:** Advanced  

---

## 🎯 Learning Objectives

By the end of this chapter, you'll understand:
- Why testing matters
- Unit testing with Jest
- Component testing with React Native Testing Library
- Integration testing
- E2E testing with Detox
- Mocking API calls
- Test coverage
- Testing best practices

---

## 🤔 Why Test?

### The Cost of Bugs

**Without Tests:**
- 😰 Fear of breaking things
- 🐛 Bugs reach production
- ⏰ Hours debugging
- 💰 Lost user trust
- 🔥 Hot fixes and stress

**With Tests:**
- ✅ Confidence in changes
- 🛡️ Catch bugs early
- 📚 Living documentation
- ♻️ Easy refactoring
- 😌 Sleep well at night

---

## 🧪 Types of Tests

### The Testing Pyramid

```
        /\
       /E2E\        Few, slow, expensive
      /------\
     /        \
    /Integration\   Some, medium speed
   /--------------\
  /                \
 /   Unit Tests     \ Many, fast, cheap
/--------------------\
```

1. **Unit Tests** - Test individual functions/components
2. **Integration Tests** - Test multiple components together
3. **E2E Tests** - Test entire user flows

---

## ⚙️ Setup Testing Environment

### Installation

```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
```

### Jest Configuration

Create `jest.config.js`:

```javascript
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/index.{js,ts}',
  ],
};
```

### Update package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## 🔬 Unit Testing Functions

### Simple Function Tests

```typescript
// utils/math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}
```

```typescript
// utils/math.test.ts
import {add, multiply, divide} from './math';

describe('Math utilities', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should add negative numbers', () => {
      expect(add(-2, -3)).toBe(-5);
    });

    it('should handle zero', () => {
      expect(add(0, 5)).toBe(5);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers', () => {
      expect(multiply(3, 4)).toBe(12);
    });

    it('should handle zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });
  });

  describe('divide', () => {
    it('should divide two numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
    });
  });
});
```

---

## 🧩 Component Testing

### Testing a Simple Component

```typescript
// components/Button.tsx
import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export function Button({title, onPress, disabled}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled]}
      testID="custom-button"
    >
      <Text style={styles.text}>{title}</Text>
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
  disabled: {
    backgroundColor: '#ccc',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

```typescript
// components/Button.test.tsx
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Button} from './Button';

describe('Button Component', () => {
  it('should render with correct title', () => {
    const {getByText} = render(
      <Button title="Click Me" onPress={() => {}} />
    );

    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const {getByTestId} = render(
      <Button title="Click Me" onPress={mockOnPress} />
    );

    fireEvent.press(getByTestId('custom-button'));

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const mockOnPress = jest.fn();
    const {getByTestId} = render(
      <Button title="Click Me" onPress={mockOnPress} disabled />
    );

    fireEvent.press(getByTestId('custom-button'));

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should apply disabled style when disabled', () => {
    const {getByTestId} = render(
      <Button title="Click Me" onPress={() => {}} disabled />
    );

    const button = getByTestId('custom-button');
    expect(button).toHaveStyle({backgroundColor: '#ccc'});
  });
});
```

---

## 📝 Testing Form Components

```typescript
// components/LoginForm.tsx
import React, {useState} from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import {Button} from './Button';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
}

export function LoginForm({onSubmit}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({email: '', password: ''});

  const validate = () => {
    const newErrors = {email: '', password: ''};
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(email, password);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        testID="email-input"
      />
      {errors.email ? (
        <Text style={styles.error} testID="email-error">
          {errors.email}
        </Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        testID="password-input"
      />
      {errors.password ? (
        <Text style={styles.error} testID="password-error">
          {errors.password}
        </Text>
      ) : null}

      <Button title="Login" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  error: {
    color: '#ff3b30',
    marginBottom: 10,
  },
});
```

```typescript
// components/LoginForm.test.tsx
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {LoginForm} from './LoginForm';

describe('LoginForm', () => {
  it('should render email and password inputs', () => {
    const {getByTestId} = render(<LoginForm onSubmit={() => {}} />);

    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
  });

  it('should show error when email is empty', () => {
    const {getByTestId, getByText} = render(
      <LoginForm onSubmit={() => {}} />
    );

    fireEvent.press(getByText('Login'));

    expect(getByTestId('email-error')).toHaveTextContent('Email is required');
  });

  it('should show error when email is invalid', () => {
    const {getByTestId, getByText} = render(
      <LoginForm onSubmit={() => {}} />
    );

    fireEvent.changeText(getByTestId('email-input'), 'invalid-email');
    fireEvent.press(getByText('Login'));

    expect(getByTestId('email-error')).toHaveTextContent('Email is invalid');
  });

  it('should show error when password is too short', () => {
    const {getByTestId, getByText} = render(
      <LoginForm onSubmit={() => {}} />
    );

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), '123');
    fireEvent.press(getByText('Login'));

    expect(getByTestId('password-error')).toHaveTextContent(
      'Password must be at least 6 characters'
    );
  });

  it('should call onSubmit with valid credentials', () => {
    const mockOnSubmit = jest.fn();
    const {getByTestId, getByText} = render(
      <LoginForm onSubmit={mockOnSubmit} />
    );

    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    fireEvent.press(getByText('Login'));

    expect(mockOnSubmit).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});
```

---

## 🔌 Mocking API Calls

```typescript
// services/api.ts
export async function fetchUsers() {
  const response = await fetch('https://api.example.com/users');
  return response.json();
}

export async function createUser(user: {name: string; email: string}) {
  const response = await fetch('https://api.example.com/users', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(user),
  });
  return response.json();
}
```

```typescript
// services/api.test.ts
import {fetchUsers, createUser} from './api';

// Mock global fetch
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchUsers', () => {
    it('should fetch users successfully', async () => {
      const mockUsers = [
        {id: 1, name: 'John'},
        {id: 2, name: 'Jane'},
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockUsers,
      });

      const users = await fetchUsers();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/users'
      );
      expect(users).toEqual(mockUsers);
    });

    it('should handle fetch error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(fetchUsers()).rejects.toThrow('Network error');
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const newUser = {name: 'John', email: 'john@example.com'};
      const createdUser = {id: 1, ...newUser};

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => createdUser,
      });

      const result = await createUser(newUser);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(newUser),
        }
      );
      expect(result).toEqual(createdUser);
    });
  });
});
```

---

## 🎣 Testing Custom Hooks

```typescript
// hooks/useCounter.ts
import {useState, useCallback} from 'react';

export function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount((c) => c - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  return {count, increment, decrement, reset};
}
```

```typescript
// hooks/useCounter.test.ts
import {renderHook, act} from '@testing-library/react-native';
import {useCounter} from './useCounter';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const {result} = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('should initialize with custom value', () => {
    const {result} = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('should increment count', () => {
    const {result} = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('should decrement count', () => {
    const {result} = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });

  it('should reset to initial value', () => {
    const {result} = renderHook(() => useCounter(10));

    act(() => {
      result.current.increment();
      result.current.increment();
    });

    expect(result.current.count).toBe(12);

    act(() => {
      result.current.reset();
    });

    expect(result.current.count).toBe(10);
  });
});
```

---

## 🌐 Integration Testing

Test multiple components together:

```typescript
// screens/TodoScreen.test.tsx
import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {TodoScreen} from './TodoScreen';
import * as api from '../services/api';

jest.mock('../services/api');

describe('TodoScreen Integration', () => {
  it('should load and display todos', async () => {
    const mockTodos = [
      {id: 1, title: 'Buy milk', completed: false},
      {id: 2, title: 'Write tests', completed: true},
    ];

    (api.fetchTodos as jest.Mock).mockResolvedValue(mockTodos);

    const {getByText} = render(<TodoScreen />);

    await waitFor(() => {
      expect(getByText('Buy milk')).toBeTruthy();
      expect(getByText('Write tests')).toBeTruthy();
    });
  });

  it('should add a new todo', async () => {
    const mockTodos = [];
    const newTodo = {id: 1, title: 'New task', completed: false};

    (api.fetchTodos as jest.Mock).mockResolvedValue(mockTodos);
    (api.createTodo as jest.Mock).mockResolvedValue(newTodo);

    const {getByPlaceholderText, getByText} = render(<TodoScreen />);

    fireEvent.changeText(getByPlaceholderText('Add todo...'), 'New task');
    fireEvent.press(getByText('Add'));

    await waitFor(() => {
      expect(api.createTodo).toHaveBeenCalledWith('New task');
    });
  });
});
```

---

## 📊 Test Coverage

Run coverage report:

```bash
npm run test:coverage
```

**Coverage Report:**
```
-----------------|---------|----------|---------|---------|
File             | % Stmts | % Branch | % Funcs | % Lines |
-----------------|---------|----------|---------|---------|
All files        |   85.71 |    78.57 |   90.91 |   85.29 |
 components/     |   90.00 |    85.71 |   95.00 |   89.47 |
  Button.tsx     |   100   |    100   |   100   |   100   |
  LoginForm.tsx  |   85.71 |    78.57 |   90.00 |   84.21 |
 services/       |   80.00 |    66.67 |   85.71 |   81.25 |
  api.ts         |   80.00 |    66.67 |   85.71 |   81.25 |
-----------------|---------|----------|---------|---------|
```

**Aim for:**
- 80%+ overall coverage
- 100% for critical business logic
- Don't obsess over 100%

---

## ✅ Testing Best Practices

### 1. Follow AAA Pattern

```typescript
it('should increment counter', () => {
  // Arrange
  const {result} = renderHook(() => useCounter(0));

  // Act
  act(() => {
    result.current.increment();
  });

  // Assert
  expect(result.current.count).toBe(1);
});
```

### 2. Test Behavior, Not Implementation

```typescript
// ❌ Bad - Testing implementation details
it('should call setState', () => {
  const component = render(<Counter />);
  component.instance().setState = jest.fn();
  // ...
});

// ✅ Good - Testing behavior
it('should display incremented count', () => {
  const {getByText, getByTestId} = render(<Counter />);
  fireEvent.press(getByText('Increment'));
  expect(getByTestId('count')).toHaveTextContent('1');
});
```

### 3. Use Descriptive Test Names

```typescript
// ❌ Bad
it('works', () => {});
it('test1', () => {});

// ✅ Good
it('should display error when email is invalid', () => {});
it('should call onSubmit with form data when valid', () => {});
```

### 4. Keep Tests Independent

```typescript
// ❌ Bad - Tests depend on each other
let user;

it('should create user', () => {
  user = createUser();
});

it('should update user', () => {
  updateUser(user); // Depends on previous test
});

// ✅ Good - Each test is independent
it('should create user', () => {
  const user = createUser();
  expect(user).toBeDefined();
});

it('should update user', () => {
  const user = createUser();
  const updated = updateUser(user);
  expect(updated.name).toBe('New Name');
});
```

---

## 🎓 Key Takeaways

1. **Unit tests** are fast and test functions/components
2. **Integration tests** test multiple components together
3. **Mock API calls** for predictable tests
4. **Test behavior**, not implementation
5. **Use testID** for reliable element selection
6. **Coverage** is a guide, not a goal
7. **Write tests first** (TDD) when possible

---

## ✅ Checkpoint

You should now be able to:
- ✅ Set up Jest and Testing Library
- ✅ Write unit tests for functions
- ✅ Test React components
- ✅ Test forms and user interactions
- ✅ Mock API calls
- ✅ Test custom hooks
- ✅ Run integration tests
- ✅ Generate coverage reports

---

## 🎯 Practice Challenge

**Write Tests for a Todo App:**

Create and test:
- TodoList component
- TodoItem component
- useLocalStorage hook
- API service
- Integration test for entire flow
- Aim for 80%+ coverage

---

## 🔜 What's Next?

In **Chapter 17**, we'll cover **Performance & Production** - the final chapter!

**Almost done! One more to go! 🚀**
