# Chapter 10: Navigation - Moving Between Screens

**Duration:** 90-120 minutes  
**Difficulty:** Intermediate  

---

## 🎯 Learning Objectives

By the end of this chapter, you'll understand:
- Why React Navigation is the standard
- Stack Navigator for screen stacking
- Tab Navigator for bottom tabs
- Drawer Navigator for side menus
- Passing parameters between screens
- Navigation options and headers
- Nested navigators

---

## 🗺️ What is Navigation?

### The Problem

In web development, you have URLs and links. In mobile apps, you have **screens** and **navigation**.

```
Web:
/home → /profile → /settings

Mobile:
HomeScreen → ProfileScreen → SettingsScreen
```

React Native doesn't have built-in navigation. We use **React Navigation** - the industry standard.

---

## 📦 Installation

### Step 1: Install React Navigation

```bash
npm install @react-navigation/native
```

### Step 2: Install Dependencies

```bash
npm install react-native-screens react-native-safe-area-context
```

### Step 3: iOS Additional Step (macOS only)

```bash
cd ios && pod install && cd ..
```

### Step 4: Wrap Your App

In `App.tsx`:

```typescript
import {NavigationContainer} from '@react-navigation/native';

function App() {
  return (
    <NavigationContainer>
      {/* Your app screens */}
    </NavigationContainer>
  );
}
```

---

## 🥞 Stack Navigator - The Foundation

Stack navigation works like a deck of cards - you push screens on top and pop them off.

### Installation

```bash
npm install @react-navigation/native-stack
```

### Basic Setup

```typescript
import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Create the navigator
const Stack = createNativeStackNavigator();

// Home Screen
function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

// Details Screen
function DetailsScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details Screen</Text>
      <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

// App with Navigation
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {backgroundColor: '#007AFF'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{title: 'My Home'}}
        />
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default App;
```

---

## 🧭 Navigation Methods

### navigate()

Navigate to a screen:

```typescript
navigation.navigate('ScreenName');
```

### push()

Always pushes a new screen (even if it's the same):

```typescript
navigation.push('Details');
```

### goBack()

Go back one screen:

```typescript
navigation.goBack();
```

### popToTop()

Go back to first screen in stack:

```typescript
navigation.popToTop();
```

### replace()

Replace current screen (no back button):

```typescript
navigation.replace('Home');
```

---

## 📦 Passing Parameters

Send data between screens:

```typescript
// Sending parameters
navigation.navigate('Profile', {
  userId: 123,
  name: 'John Doe',
});

// Receiving parameters
function ProfileScreen({route, navigation}) {
  const {userId, name} = route.params;

  return (
    <View>
      <Text>User ID: {userId}</Text>
      <Text>Name: {name}</Text>
    </View>
  );
}
```

---

### Complete Example: User Profile Navigation

```typescript
import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// Sample user data
const users = [
  {id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', age: 28},
  {id: 2, name: 'Michael Chen', email: 'michael@example.com', age: 32},
  {id: 3, name: 'Emma Wilson', email: 'emma@example.com', age: 26},
];

// Users List Screen
function UsersListScreen({navigation}) {
  const renderUser = ({item}) => (
    <Pressable
      style={styles.userCard}
      onPress={() => navigation.navigate('UserProfile', {user: item})}
    >
      <Image
        source={{uri: `https://i.pravatar.cc/100?img=${item.id}`}}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}

// User Profile Screen
function UserProfileScreen({route, navigation}) {
  const {user} = route.params;

  return (
    <View style={styles.profileContainer}>
      <Image
        source={{uri: `https://i.pravatar.cc/200?img=${user.id}`}}
        style={styles.profileAvatar}
      />
      <Text style={styles.profileName}>{user.name}</Text>
      <View style={styles.infoCard}>
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="Age" value={user.age.toString()} />
        <InfoRow label="User ID" value={user.id.toString()} />
      </View>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('EditProfile', {user})}
      >
        <Text style={styles.buttonText}>Edit Profile</Text>
      </Pressable>
    </View>
  );
}

// Edit Profile Screen
function EditProfileScreen({route, navigation}) {
  const {user} = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editing {user.name}</Text>
      <Text style={styles.subtitle}>Edit form would go here</Text>
      <Pressable
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Save Changes</Text>
      </Pressable>
    </View>
  );
}

// Helper component
function InfoRow({label, value}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

// Main App
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {backgroundColor: '#007AFF'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}
      >
        <Stack.Screen
          name="UsersList"
          component={UsersListScreen}
          options={{title: 'Users'}}
        />
        <Stack.Screen
          name="UserProfile"
          component={UserProfileScreen}
          options={({route}) => ({title: route.params.user.name})}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{title: 'Edit Profile'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  arrow: {
    fontSize: 24,
    color: '#ccc',
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  profileAvatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 20,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default App;
```

---

## 📑 Tab Navigator

Bottom tabs for main sections of your app.

### Installation

```bash
npm install @react-navigation/bottom-tabs
```

### Basic Tab Navigation

```typescript
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Text style={{fontSize: size}}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Text style={{fontSize: size}}>🔍</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Text style={{fontSize: size}}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
```

---

## 🍔 Drawer Navigator

Side menu navigation.

### Installation

```bash
npm install @react-navigation/drawer react-native-gesture-handler react-native-reanimated
```

### Basic Drawer

```typescript
import {createDrawerNavigator} from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
    </Drawer.Navigator>
  );
}
```

---

## 🎯 Nested Navigators

Combine different navigator types:

```typescript
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

// Profile Stack
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack}
        options={{headerShown: false}}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStack}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}

// App
function App() {
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}
```

---

## 🎓 Key Takeaways

1. **React Navigation is the standard** for React Native apps
2. **Stack Navigator** for screen stacking (most common)
3. **Tab Navigator** for bottom navigation
4. **Drawer Navigator** for side menus
5. **Pass params** with navigation.navigate('Screen', {data})
6. **Nested navigators** combine different types
7. **screenOptions** for global navigation styling

---

## ✅ Checkpoint

You should now be able to:
- ✅ Set up React Navigation in your app
- ✅ Use Stack Navigator for screen navigation
- ✅ Pass parameters between screens
- ✅ Create tab navigation
- ✅ Implement drawer navigation
- ✅ Nest different navigator types
- ✅ Customize navigation headers and options

---

## 🎯 Practice Challenges

### Challenge 1: E-Commerce Navigation
Create an app with:
- Tab navigation (Home, Cart, Profile)
- Stack navigation within each tab
- Product details screen
- Checkout flow

### Challenge 2: Social Media App
Build navigation for:
- Bottom tabs (Feed, Search, Notifications, Profile)
- Each tab has its own stack
- Post details screen
- Comments screen

### Challenge 3: Settings Menu
Create:
- Drawer navigation for main menu
- Nested settings screens
- Account settings
- Privacy settings
- About screen

---

## 🔜 What's Next?

In **Chapter 11**, we'll learn about the **Context API** - managing global state without prop drilling!

**Congratulations! You've completed Part 2: Core Concepts! 🎉**

You now have all the fundamental skills to build complex, multi-screen React Native applications!

**Ready for global state management? Let's finish strong! 🚀**
