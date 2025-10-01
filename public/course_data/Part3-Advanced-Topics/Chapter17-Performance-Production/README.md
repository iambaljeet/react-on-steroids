# Chapter 17: Performance & Production Ready

**Duration:** 120-150 minutes  
**Difficulty:** Advanced  

---

## 🎯 Learning Objectives

By the end of this chapter, you'll understand:
- Performance optimization techniques
- React.memo and useMemo
- FlatList optimization
- Image optimization
- Bundle size reduction
- Profiling and debugging
- Production builds
- App store deployment
- Crash reporting and analytics

---

## ⚡ Performance Optimization

### Why Performance Matters

**User Expectations:**
- App should feel instant
- Smooth 60 FPS animations
- Fast startup time
- Low memory usage

**Business Impact:**
- 1-second delay = 7% fewer conversions
- 53% users abandon slow apps
- Poor performance = bad reviews

---

## 🧠 React.memo - Prevent Unnecessary Re-renders

### The Problem

```typescript
function ParentComponent() {
  const [count, setCount] = useState(0);

  return (
    <View>
      <Text>{count}</Text>
      <Button onPress={() => setCount(count + 1)}>Increment</Button>
      <ExpensiveComponent /> {/* Re-renders even though props didn't change */}
    </View>
  );
}

function ExpensiveComponent() {
  console.log('ExpensiveComponent rendered');
  // Heavy computation
  return <View>{/* ... */}</View>;
}
```

### The Solution: React.memo

```typescript
import React, {memo} from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent() {
  console.log('ExpensiveComponent rendered');
  return <View>{/* ... */}</View>;
});

// Now only re-renders when props change
```

---

## 🎣 useMemo and useCallback

### useMemo - Memoize Expensive Calculations

```typescript
import React, {useState, useMemo} from 'react';

function ProductList({products}) {
  const [filter, setFilter] = useState('');

  // ❌ Bad: Filters on every render
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  // ✅ Good: Only filters when products or filter change
  const filteredProducts = useMemo(() => {
    console.log('Filtering products...');
    return products.filter(p =>
      p.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [products, filter]);

  return (
    <View>
      <TextInput value={filter} onChangeText={setFilter} />
      <FlatList data={filteredProducts} {...} />
    </View>
  );
}
```

### useCallback - Memoize Functions

```typescript
import React, {useState, useCallback} from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);

  // ❌ Bad: New function on every render
  const addTodo = (text) => {
    setTodos([...todos, {id: Date.now(), text}]);
  };

  // ✅ Good: Same function reference
  const addTodo = useCallback((text) => {
    setTodos(prevTodos => [...prevTodos, {id: Date.now(), text}]);
  }, []);

  return (
    <View>
      <TodoInput onAdd={addTodo} />
      <TodoList todos={todos} />
    </View>
  );
}

// TodoInput won't re-render unnecessarily
const TodoInput = memo(({onAdd}) => {
  const [text, setText] = useState('');

  return (
    <View>
      <TextInput value={text} onChangeText={setText} />
      <Button onPress={() => onAdd(text)}>Add</Button>
    </View>
  );
});
```

---

## 📋 FlatList Optimization

### Essential Performance Props

```typescript
function OptimizedList({data}) {
  const renderItem = useCallback(({item}) => (
    <ProductCard product={item} />
  ), []);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const getItemLayout = useCallback(
    (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={10}
      
      // Only if items are fixed height
      getItemLayout={getItemLayout}
    />
  );
}

const ITEM_HEIGHT = 100;
```

### Optimize List Items

```typescript
import React, {memo} from 'react';

// ❌ Bad: Always re-renders
function ProductCard({product}) {
  return (
    <View>
      <Image source={{uri: product.image}} />
      <Text>{product.name}</Text>
    </View>
  );
}

// ✅ Good: Only re-renders when product changes
const ProductCard = memo(
  function ProductCard({product}) {
    return (
      <View>
        <Image source={{uri: product.image}} />
        <Text>{product.name}</Text>
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison: only re-render if id changed
    return prevProps.product.id === nextProps.product.id;
  }
);
```

---

## 🖼️ Image Optimization

### Best Practices

```typescript
import {Image} from 'react-native';
import FastImage from 'react-native-fast-image';

// ❌ Bad: No optimization
<Image source={{uri: imageUrl}} style={{width: 300, height: 300}} />

// ✅ Good: Optimized with FastImage
<FastImage
  source={{
    uri: imageUrl,
    priority: FastImage.priority.normal,
  }}
  resizeMode={FastImage.resizeMode.cover}
  style={{width: 300, height: 300}}
/>

// ✅ Best: With caching
<FastImage
  source={{
    uri: imageUrl,
    priority: FastImage.priority.high,
    cache: FastImage.cacheControl.immutable,
  }}
  resizeMode={FastImage.resizeMode.cover}
  style={{width: 300, height: 300}}
/>
```

### Install FastImage

```bash
npm install react-native-fast-image
cd ios && pod install
```

### Image Sizes

```typescript
// ❌ Bad: Loading huge image
<Image
  source={{uri: 'https://example.com/huge-image-4000x3000.jpg'}}
  style={{width: 100, height: 100}}
/>

// ✅ Good: Request appropriate size
<Image
  source={{uri: 'https://example.com/thumbnail-200x200.jpg'}}
  style={{width: 100, height: 100}}
/>
```

---

## 📦 Bundle Size Optimization

### 1. Enable Hermes (Android)

In `android/app/build.gradle`:

```gradle
project.ext.react = [
  enableHermes: true  // Set to true
]
```

### 2. Remove Console Logs in Production

```javascript
// babel.config.js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'transform-remove-console',
      {exclude: ['error', 'warn']},
    ],
  ],
};
```

### 3. Import Only What You Need

```typescript
// ❌ Bad: Imports entire library
import _ from 'lodash';
const result = _.debounce(fn, 300);

// ✅ Good: Import specific function
import debounce from 'lodash/debounce';
const result = debounce(fn, 300);
```

### 4. Analyze Bundle

```bash
npm install --save-dev react-native-bundle-visualizer
npx react-native-bundle-visualizer
```

---

## 🔍 Profiling Performance

### React DevTools Profiler

```typescript
import {Profiler} from 'react';

function onRenderCallback(
  id, // Component name
  phase, // "mount" or "update"
  actualDuration, // Time spent rendering
  baseDuration, // Estimated time without memoization
  startTime, // When render started
  commitTime, // When render committed
  interactions // Set of interactions
) {
  console.log(`${id} took ${actualDuration}ms`);
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <NavigationContainer>
        {/* Your app */}
      </NavigationContainer>
    </Profiler>
  );
}
```

### Flipper Debugging

1. Install Flipper: https://fbflipper.com
2. Run your app in dev mode
3. Open Flipper
4. View:
   - React DevTools
   - Network calls
   - Layout inspector
   - Performance metrics

---

## 🏗️ Production Build

### iOS Production Build

```bash
# Clean
cd ios
xcodebuild clean

# Build
xcodebuild -workspace YourApp.xcworkspace \
  -scheme YourApp \
  -configuration Release \
  -archivePath build/YourApp.xcarchive \
  archive

# Export IPA
xcodebuild -exportArchive \
  -archivePath build/YourApp.xcarchive \
  -exportPath build \
  -exportOptionsPlist ExportOptions.plist
```

### Android Production Build

```bash
# Generate release key (first time only)
keytool -genkeypair -v -storetype PKCS12 \
  -keystore my-upload-key.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Build AAB
cd android
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab

# Build APK (if needed)
./gradlew assembleRelease

# Output: android/app/build/outputs/apk/release/app-release.apk
```

---

## 📱 App Store Deployment

### iOS App Store

1. **Create App in App Store Connect**
   - Go to appstoreconnect.apple.com
   - Create new app
   - Fill in metadata

2. **Upload Build**
   - Use Xcode or Transporter app
   - Upload .ipa file
   - Wait for processing

3. **Submit for Review**
   - Add screenshots
   - Add description
   - Set pricing
   - Submit for review

4. **Review Process**
   - Usually 24-48 hours
   - Follow Apple guidelines strictly

### Android Play Store

1. **Create App in Play Console**
   - Go to play.google.com/console
   - Create new app
   - Fill in store listing

2. **Upload Build**
   - Upload .aab file (recommended)
   - Or .apk file
   - Create release

3. **Content Rating**
   - Complete questionnaire
   - Get rating certificate

4. **Submit for Review**
   - Usually faster than iOS
   - Can take a few hours to days

---

## 📊 Analytics and Crash Reporting

### Firebase Setup

```bash
npm install @react-native-firebase/app @react-native-firebase/analytics @react-native-firebase/crashlytics
```

### Track Events

```typescript
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

// Track screen view
await analytics().logScreenView({
  screen_name: 'ProductList',
  screen_class: 'ProductListScreen',
});

// Track custom event
await analytics().logEvent('product_purchase', {
  product_id: '123',
  price: 99.99,
  currency: 'USD',
});

// Log errors
try {
  // Your code
} catch (error) {
  crashlytics().recordError(error);
}

// Set user properties
await analytics().setUserId('user123');
await crashlytics().setUserId('user123');

// Custom attributes
await crashlytics().setAttribute('role', 'premium');
```

---

## 🛡️ Error Boundaries

Catch errors in production:

```typescript
import React, {Component, ReactNode} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error: Error) {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log to crash reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    // crashlytics().recordError(error);
  }

  handleReset = () => {
    this.setState({hasError: false, error: null});
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.message}>
            {this.state.error?.message}
          </Text>
          <Pressable style={styles.button} onPress={this.handleReset}>
            <Text style={styles.buttonText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorBoundary;

// Usage
function App() {
  return (
    <ErrorBoundary>
      <NavigationContainer>
        {/* Your app */}
      </NavigationContainer>
    </ErrorBoundary>
  );
}
```

---

## ✅ Production Checklist

### Before Release

- [ ] All tests passing
- [ ] No console.logs in production
- [ ] Error boundaries implemented
- [ ] Crash reporting set up
- [ ] Analytics tracking added
- [ ] App icons added (all sizes)
- [ ] Splash screen configured
- [ ] Deep linking tested
- [ ] Push notifications tested
- [ ] Performance profiled
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] API endpoints updated (production URLs)
- [ ] Sensitive data removed
- [ ] Privacy policy added
- [ ] Terms of service added
- [ ] App store screenshots prepared
- [ ] App description written
- [ ] Keywords optimized (SEO)

### iOS Specific

- [ ] App Store Connect app created
- [ ] Certificates and provisioning profiles configured
- [ ] Info.plist configured
- [ ] Launch screen configured
- [ ] App icons added (all sizes)
- [ ] App Transport Security configured
- [ ] Privacy descriptions added (camera, location, etc.)

### Android Specific

- [ ] Play Console app created
- [ ] Signing key generated and secured
- [ ] build.gradle version updated
- [ ] Proguard rules configured
- [ ] App icons added (all densities)
- [ ] Permissions declared in manifest
- [ ] Content rating completed

---

## 🎓 Key Takeaways

1. **React.memo** prevents unnecessary re-renders
2. **useMemo/useCallback** optimize expensive operations
3. **FlatList** needs specific optimization props
4. **FastImage** for better image performance
5. **Bundle size** matters for download/startup time
6. **Profiling** identifies performance bottlenecks
7. **Crash reporting** catches production errors
8. **Analytics** track user behavior
9. **Production builds** are optimized differently
10. **App store guidelines** must be followed

---

## ✅ Checkpoint

You should now be able to:
- ✅ Optimize component rendering
- ✅ Improve list performance
- ✅ Optimize images
- ✅ Reduce bundle size
- ✅ Profile performance issues
- ✅ Create production builds
- ✅ Deploy to app stores
- ✅ Set up crash reporting
- ✅ Track analytics

---

## 🎉 CONGRATULATIONS!

**You've completed the entire React Native course!**

### What You've Learned:

**Part 1: Foundations**
- ✅ React Native fundamentals
- ✅ Environment setup
- ✅ Components and styling
- ✅ User interaction

**Part 2: Core Concepts**
- ✅ Props and state
- ✅ Lists and keys
- ✅ Side effects
- ✅ Navigation
- ✅ Context API

**Part 3: Advanced Topics**
- ✅ Architecture patterns
- ✅ State management
- ✅ Data fetching
- ✅ Native modules
- ✅ Testing
- ✅ Performance and production

### You're Now Ready To:

- 🚀 Build production-ready React Native apps
- 📱 Deploy to both iOS and Android
- 🏗️ Architect scalable applications
- ⚡ Optimize for performance
- 🧪 Write comprehensive tests
- 🔧 Integrate native features
- 📊 Track analytics and crashes

---

## 🔜 What's Next?

### Keep Learning:
1. **Build Real Projects** - Portfolio apps
2. **Contribute to Open Source**
3. **Join React Native Community**
4. **Stay Updated** - React Native blog
5. **Learn TypeScript** deeper
6. **Explore Advanced Libraries**:
   - React Native Reanimated (animations)
   - React Native Gesture Handler
   - React Native MMKV (storage)
   - React Native Fast Charts

### Resources:
- 📚 React Native Docs: https://reactnative.dev
- 💬 React Native Community Discord
- 🐦 Follow @reactnative on Twitter
- 📺 YouTube channels for React Native
- 📖 Medium articles and tutorials

---

## 🙏 Thank You!

You've put in the work and completed this comprehensive journey through React Native development. You now have the skills to build amazing mobile applications that millions of users can enjoy.

**Go build something awesome! 🚀**

**The world is waiting for your app!**

---

*"The best time to plant a tree was 20 years ago. The second best time is now. The same goes for building apps."*

**Happy Coding! 💙**
