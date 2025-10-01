# Chapter 9: useEffect - Side Effects & Lifecycle

**Duration:** 75-90 minutes  
**Difficulty:** Intermediate  

---

## 🎯 Learning Objectives

By the end of this chapter, you'll understand:
- What side effects are in React
- How to use the useEffect hook
- The dependency array and its importance
- Cleanup functions to prevent memory leaks
- Common patterns: API calls, subscriptions, timers
- Component lifecycle in functional components

---

## 🤔 What Are Side Effects?

### The Simple Answer

**Side effects are operations that reach outside your component** - like fetching data, setting timers, or subscribing to events.

Think of your component as a pure function that takes props and state and returns UI. **Side effects are everything else.**

---

### Examples of Side Effects

✅ **Side Effects (need useEffect):**
- Fetching data from an API
- Setting up timers or intervals
- Subscribing to events
- Directly manipulating the DOM
- Logging to console
- Setting up WebSocket connections
- Accessing local storage

❌ **NOT Side Effects (don't need useEffect):**
- Calculating derived values from state/props
- Rendering JSX
- Event handlers (onClick, onChange)
- Updating state based on user interaction

---

## 🪝 The useEffect Hook

### Basic Syntax

```typescript
import React, {useEffect} from 'react';

function MyComponent() {
  useEffect(() => {
    // This code runs after render
    console.log('Component rendered!');
  });

  return <Text>Hello</Text>;
}
```

**When does it run?**
- After every render (by default)
- After the initial render
- After every update

---

## 📋 The Dependency Array

The second argument controls when the effect runs:

### 1. No Dependency Array - Runs Every Render

```typescript
useEffect(() => {
  console.log('Runs after EVERY render');
});
```

⚠️ **Rarely what you want!**

---

### 2. Empty Array - Runs Once (On Mount)

```typescript
useEffect(() => {
  console.log('Runs ONCE after initial render');
}, []); // ← Empty dependency array
```

✅ **Use for:** Initial setup, fetching data on load

---

### 3. With Dependencies - Runs When Dependencies Change

```typescript
useEffect(() => {
  console.log('Runs when count changes');
}, [count]); // ← Runs when count changes
```

✅ **Use for:** Reacting to specific changes

---

## 🎯 Practical Example: Fetching Data

Let's fetch data from an API:

```typescript
import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator, FlatList, StyleSheet} from 'react-native';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This runs once when component mounts
    fetchUsers();
  }, []); // Empty array = run once

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({item}) => (
        <View style={styles.userCard}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  userCard: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
});

export default UserList;
```

---

## 🧹 Cleanup Functions

Some effects need cleanup to prevent memory leaks:

```typescript
useEffect(() => {
  // Setup
  const subscription = subscribeToSomething();

  // Cleanup (runs before next effect and on unmount)
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

---

### Example: Timer with Cleanup

```typescript
import React, {useState, useEffect} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';

function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      // Set up interval
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }

    // Cleanup function
    return () => {
      if (interval) {
        clearInterval(interval); // ← Important!
      }
    };
  }, [isRunning]); // Re-run when isRunning changes

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timer</Text>
      <Text style={styles.time}>{formatTime(seconds)}</Text>
      <View style={styles.buttons}>
        <Pressable
          style={[styles.button, isRunning && styles.buttonStop]}
          onPress={handleStartStop}
        >
          <Text style={styles.buttonText}>
            {isRunning ? 'Stop' : 'Start'}
          </Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleReset}>
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  time: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 40,
  },
  buttons: {
    flexDirection: 'row',
    gap: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonStop: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Timer;
```

**Why cleanup matters:**
- Without `clearInterval`, timer keeps running even after component unmounts
- Causes memory leaks
- Can crash the app

---

## 🔄 Common useEffect Patterns

### Pattern 1: Fetch on Mount

```typescript
useEffect(() => {
  fetchData();
}, []);
```

### Pattern 2: Fetch When ID Changes

```typescript
useEffect(() => {
  fetchUserData(userId);
}, [userId]);
```

### Pattern 3: Subscribe and Unsubscribe

```typescript
useEffect(() => {
  const unsubscribe = subscribeTo DataSource();
  return unsubscribe;
}, []);
```

### Pattern 4: Update Document Title

```typescript
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);
```

### Pattern 5: Debounced Search

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    searchAPI(searchQuery);
  }, 500); // Wait 500ms after user stops typing

  return () => clearTimeout(timer);
}, [searchQuery]);
```

---

## 🎯 Practical Example: Real-Time Clock

```typescript
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update every second
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup
    return () => clearInterval(interval);
  }, []); // Empty array - set up once

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatTime(time)}</Text>
      <Text style={styles.date}>{formatDate(time)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  time: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 20,
  },
  date: {
    fontSize: 18,
    color: '#999',
  },
});

export default Clock;
```

---

## 🎓 Component Lifecycle (Functional Components)

In class components, we had lifecycle methods. With hooks:

### Mount (Component appears)
```typescript
useEffect(() => {
  console.log('Component mounted');
}, []);
```

### Update (State/props change)
```typescript
useEffect(() => {
  console.log('Count updated');
}, [count]);
```

### Unmount (Component removed)
```typescript
useEffect(() => {
  return () => {
    console.log('Component will unmount');
  };
}, []);
```

### Combined
```typescript
useEffect(() => {
  console.log('Component mounted or updated');
  
  return () => {
    console.log('Cleanup before next effect or unmount');
  };
}, [dependency]);
```

---

## ⚠️ Common Mistakes

### Mistake 1: Missing Dependencies

```typescript
// ❌ BAD - count not in dependencies
useEffect(() => {
  console.log(count);
}, []);

// ✅ GOOD
useEffect(() => {
  console.log(count);
}, [count]);
```

### Mistake 2: Infinite Loop

```typescript
// ❌ BAD - Updates state, triggers re-render, runs effect again
useEffect(() => {
  setCount(count + 1);
});

// ✅ GOOD - Runs once
useEffect(() => {
  setCount(5);
}, []);
```

### Mistake 3: Forgetting Cleanup

```typescript
// ❌ BAD - Memory leak!
useEffect(() => {
  setInterval(() => {
    console.log('Running forever!');
  }, 1000);
}, []);

// ✅ GOOD - Cleanup
useEffect(() => {
  const interval = setInterval(() => {
    console.log('Will be cleaned up');
  }, 1000);
  
  return () => clearInterval(interval);
}, []);
```

---

## 🎯 Practical Exercise: Weather App

```typescript
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

function WeatherApp() {
  const [city, setCity] = useState('London');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch weather when city changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (city.trim()) {
        fetchWeather(city);
      }
    }, 1000); // Wait 1s after user stops typing

    return () => clearTimeout(timer);
  }, [city]);

  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      setError(null);

      // Using OpenWeather API (you'll need an API key)
      const API_KEY = 'your_api_key_here';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error('City not found');
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather App</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter city name"
        value={city}
        onChangeText={setCity}
      />

      {loading && <ActivityIndicator size="large" color="#007AFF" />}

      {error && <Text style={styles.error}>Error: {error}</Text>}

      {weather && !loading && (
        <View style={styles.weatherCard}>
          <Text style={styles.cityName}>{weather.name}</Text>
          <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
          <Text style={styles.description}>
            {weather.weather[0].description}
          </Text>
          <View style={styles.details}>
            <Text style={styles.detail}>
              Humidity: {weather.main.humidity}%
            </Text>
            <Text style={styles.detail}>
              Wind: {weather.wind.speed} m/s
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  weatherCard: {
    backgroundColor: '#007AFF',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  cityName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  temp: {
    fontSize: 72,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  description: {
    fontSize: 20,
    color: 'white',
    textTransform: 'capitalize',
    marginBottom: 20,
  },
  details: {
    flexDirection: 'row',
    gap: 30,
  },
  detail: {
    fontSize: 16,
    color: 'white',
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default WeatherApp;
```

---

## 🎓 Key Takeaways

1. **useEffect handles side effects** like API calls, timers, subscriptions
2. **Dependency array controls when effect runs**
   - No array: every render
   - Empty array: once on mount
   - With deps: when deps change
3. **Return cleanup function** to prevent memory leaks
4. **Common patterns:** fetch on mount, subscribe/unsubscribe, timers
5. **Be careful with dependencies** - missing ones cause bugs

---

## ✅ Checkpoint

You should now be able to:
- ✅ Use useEffect for side effects
- ✅ Control when effects run with dependency array
- ✅ Write cleanup functions
- ✅ Fetch data from APIs
- ✅ Set up and clean up timers
- ✅ Understand component lifecycle

---

## 🎯 Practice Challenges

### Challenge 1: Countdown Timer
Create a countdown timer that:
- Counts down from a specified time
- Shows hours, minutes, seconds
- Can be paused and resumed
- Alerts when time is up

### Challenge 2: Auto-Save
Build a note-taking app that:
- Auto-saves after 2 seconds of no typing
- Shows "Saving..." indicator
- Shows "Saved" when complete

### Challenge 3: Online Status
Create a component that:
- Detects online/offline status
- Shows indicator
- Updates in real-time

---

## 🔜 What's Next?

In **Chapter 10**, we'll learn about **Navigation** - moving between multiple screens in your app using React Navigation!

**Ready to build multi-screen apps? Let's go! 🚀**
