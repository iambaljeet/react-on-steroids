# Chapter 4: Styling Your App

**Duration:** 60-75 minutes  
**Difficulty:** Beginner  

---

## 🎯 Learning Objectives

By the end of this chapter, you'll understand:
- How styling works in React Native (it's different from CSS!)
- StyleSheet API and inline styles
- Flexbox layout system
- Positioning, spacing, and dimensions
- Responsive design basics
- Platform-specific styling

---

## 🎨 Styling in React Native vs Web

### The Key Differences

| Web (CSS) | React Native |
|-----------|--------------|
| Uses CSS files | Uses JavaScript objects |
| `class` or `id` | `style` prop |
| Kebab-case (`background-color`) | CamelCase (`backgroundColor`) |
| Multiple units (`px`, `em`, `%`) | Mostly unitless (density-independent) |
| Many layout systems | Flexbox by default |

**Example:**

```css
/* ❌ CSS (doesn't work in React Native) */
.container {
  background-color: blue;
  padding: 20px;
}
```

```typescript
// ✅ React Native
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'blue',
    padding: 20,  // No unit needed!
  },
});
```

---

## 📝 StyleSheet API

### Method 1: StyleSheet.create (Recommended)

```typescript
import {StyleSheet, View, Text} from 'react-native';

function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});
```

**Why use StyleSheet.create?**
- ✅ Validates style properties
- ✅ Performance optimization
- ✅ Reusable styles
- ✅ Autocomplete in editors

---

### Method 2: Inline Styles

```typescript
function MyComponent() {
  return (
    <View style={{backgroundColor: 'blue', padding: 20}}>
      <Text style={{fontSize: 18, color: 'white'}}>Hello!</Text>
    </View>
  );
}
```

**When to use inline styles:**
- ⚠️ For dynamic values that change frequently
- ⚠️ One-off styling
- ❌ **Not recommended for most cases** (performance impact)

---

### Method 3: Combining Styles

```typescript
const styles = StyleSheet.create({
  base: {
    padding: 20,
    backgroundColor: 'white',
  },
  highlighted: {
    backgroundColor: 'yellow',
  },
});

// Combine multiple styles (later styles override earlier ones)
<View style={[styles.base, styles.highlighted]} />

// Conditional styling
<View style={[styles.base, isActive && styles.highlighted]} />

// Mix StyleSheet and inline
<View style={[styles.base, {marginTop: 10}]} />
```

---

## 📏 Understanding Dimensions & Units

### Unitless Values

In React Native, most numeric values are **unitless** and represent **density-independent pixels** (dp/dip).

```typescript
{
  width: 100,      // 100 density-independent pixels
  height: 100,
  padding: 20,
  margin: 10,
  fontSize: 16,
}
```

**What does this mean?**
- Looks the same size on different screen densities
- You don't write `100px` - just `100`

---

### Percentages

```typescript
{
  width: '50%',     // 50% of parent width
  height: '100%',   // 100% of parent height
  padding: '5%',    // Works for padding too
}
```

---

### Dimensions API (Screen & Window Size)

```typescript
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

console.log('Screen width:', width);
console.log('Screen height:', height);

// Use in styles
const styles = StyleSheet.create({
  fullWidth: {
    width: width,
  },
  halfWidth: {
    width: width / 2,
  },
});
```

**Window vs Screen:**
- `window` - Visible area (excluding status bar)
- `screen` - Entire device screen

---

## 📐 Flexbox Layout System

**Flexbox is the DEFAULT layout system** in React Native. Every `View` is a flex container.

### The Basics

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,  // Take up all available space
  },
});
```

**What is `flex: 1`?**
- Tells component to expand and fill available space
- Very common in React Native

---

### Main Axis vs Cross Axis

Understanding axes is crucial for Flexbox:

```typescript
// flexDirection: 'column' (DEFAULT)
// Main axis: vertical ↕
// Cross axis: horizontal ↔

// flexDirection: 'row'
// Main axis: horizontal ↔
// Cross axis: vertical ↕
```

**Visual:**

```
flexDirection: 'column'       flexDirection: 'row'
(default)
┌──────────┐                  ┌────────────────┐
│   📦     │ ↕ Main Axis     │ 📦 📦 📦      │ ↔ Main Axis
│   📦     │                  └────────────────┘
│   📦     │
└──────────┘
↔ Cross Axis                  ↕ Cross Axis
```

---

### flexDirection

```typescript
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',  // Horizontal (→)
  },
  column: {
    flexDirection: 'column',  // Vertical (↓) - DEFAULT
  },
  rowReverse: {
    flexDirection: 'row-reverse',  // (←)
  },
  columnReverse: {
    flexDirection: 'column-reverse',  // (↑)
  },
});
```

**Example:**

```typescript
// Items side by side
<View style={{flexDirection: 'row'}}>
  <View style={{width: 50, height: 50, backgroundColor: 'red'}} />
  <View style={{width: 50, height: 50, backgroundColor: 'blue'}} />
  <View style={{width: 50, height: 50, backgroundColor: 'green'}} />
</View>
```

---

### justifyContent (Main Axis Alignment)

Controls spacing along the **main axis**.

```typescript
const styles = StyleSheet.create({
  flexStart: {
    justifyContent: 'flex-start',  // Start (DEFAULT)
  },
  center: {
    justifyContent: 'center',  // Center
  },
  flexEnd: {
    justifyContent: 'flex-end',  // End
  },
  spaceBetween: {
    justifyContent: 'space-between',  // Space between items
  },
  spaceAround: {
    justifyContent: 'space-around',  // Space around items
  },
  spaceEvenly: {
    justifyContent: 'space-evenly',  // Equal space everywhere
  },
});
```

**Visual (with flexDirection: 'row'):**

```
flex-start        center           flex-end
┌──────────┐     ┌──────────┐     ┌──────────┐
│📦📦📦    │     │  📦📦📦  │     │    📦📦📦│
└──────────┘     └──────────┘     └──────────┘

space-between    space-around     space-evenly
┌──────────┐     ┌──────────┐     ┌──────────┐
│📦  📦  📦│     │ 📦 📦 📦 │     │ 📦 📦 📦 │
└──────────┘     └──────────┘     └──────────┘
```

---

### alignItems (Cross Axis Alignment)

Controls alignment along the **cross axis**.

```typescript
const styles = StyleSheet.create({
  stretch: {
    alignItems: 'stretch',  // Stretch to fill (DEFAULT)
  },
  flexStart: {
    alignItems: 'flex-start',  // Top (if column) or Left (if row)
  },
  center: {
    alignItems: 'center',  // Center
  },
  flexEnd: {
    alignItems: 'flex-end',  // Bottom (if column) or Right (if row)
  },
});
```

**Example: Center content perfectly**

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',  // Center vertically
    alignItems: 'center',      // Center horizontally
  },
});
```

---

### Practical Example: Card Layout

```typescript
import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

function ProfileCard() {
  return (
    <View style={styles.card}>
      <Image
        source={{uri: 'https://i.pravatar.cc/100'}}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.role}>Developer</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',        // Side by side
    alignItems: 'center',        // Center vertically
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  info: {
    flex: 1,  // Take remaining space
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
});

export default ProfileCard;
```

---

## 📦 Spacing: Padding & Margin

### Padding (Inside spacing)

```typescript
{
  padding: 20,           // All sides
  paddingVertical: 10,   // Top & bottom
  paddingHorizontal: 15, // Left & right
  paddingTop: 5,
  paddingBottom: 5,
  paddingLeft: 10,
  paddingRight: 10,
}
```

### Margin (Outside spacing)

```typescript
{
  margin: 20,
  marginVertical: 10,
  marginHorizontal: 15,
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  marginRight: 10,
}
```

**Visual:**

```
┌─────────────────────────┐
│  Margin (outside)       │
│  ┌─────────────────┐    │
│  │  Padding        │    │
│  │  ┌──────────┐   │    │
│  │  │ Content  │   │    │
│  │  └──────────┘   │    │
│  └─────────────────┘    │
└─────────────────────────┘
```

---

## 🎯 Positioning

### position: 'relative' (Default)

Elements positioned relative to their normal position.

```typescript
{
  position: 'relative',
  top: 10,     // Move 10 units down
  left: 5,     // Move 5 units right
}
```

### position: 'absolute'

Elements positioned relative to parent.

```typescript
{
  position: 'absolute',
  top: 0,
  right: 0,
  // This puts element in top-right corner of parent
}
```

**Example: Badge on Avatar**

```typescript
<View style={styles.avatarContainer}>
  <Image source={{uri: 'avatar.jpg'}} style={styles.avatar} />
  <View style={styles.badge}>
    <Text style={styles.badgeText}>5</Text>
  </View>
</View>

const styles = StyleSheet.create({
  avatarContainer: {
    position: 'relative',
    width: 60,
    height: 60,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
```

---

## 🎨 Colors & Borders

### Colors

```typescript
{
  backgroundColor: '#007AFF',    // Hex
  backgroundColor: 'blue',       // Named
  backgroundColor: 'rgb(0, 122, 255)',
  backgroundColor: 'rgba(0, 122, 255, 0.5)',  // With alpha
}
```

### Borders

```typescript
{
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 10,
  
  // Specific sides
  borderTopWidth: 2,
  borderBottomWidth: 2,
  borderLeftWidth: 1,
  borderRightWidth: 1,
  
  // Specific corners
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
  borderBottomLeftRadius: 5,
  borderBottomRightRadius: 5,
}
```

---

## 📱 Platform-Specific Styling

### Method 1: Platform API

```typescript
import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    ...Platform.select({
      ios: {
        backgroundColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        backgroundColor: '#fff',
        elevation: 4,  // Android shadow
      },
    }),
  },
});
```

### Method 2: Separate Styles

```typescript
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Platform.OS === 'ios' ? '#f0f0f0' : '#fff',
  },
});
```

### Method 3: Platform-Specific Files

Create separate files:
- `Button.ios.tsx`
- `Button.android.tsx`

React Native automatically imports the right one!

---

## 🌓 Shadows

### iOS Shadows

```typescript
{
  shadowColor: '#000',
  shadowOffset: {width: 0, height: 2},
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
}
```

### Android Shadows

```typescript
{
  elevation: 5,  // That's it! Android uses elevation
}
```

### Cross-Platform Shadow

```typescript
const styles = StyleSheet.create({
  card: {
    // Common styles
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    
    // Android shadow
    elevation: 3,
  },
});
```

---

## 📱 Responsive Design

### Using Dimensions

```typescript
import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,  // 90% of screen width
  },
  smallBox: {
    width: width < 350 ? 100 : 150,  // Conditional sizing
  },
});
```

### Listening to Dimension Changes

```typescript
import React, {useState, useEffect} from 'react';
import {Dimensions, View, Text} from 'react-native';

function ResponsiveComponent() {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  return (
    <View>
      <Text>Width: {dimensions.width}</Text>
      <Text>Height: {dimensions.height}</Text>
    </View>
  );
}
```

---

## 🎯 Practical Exercise: Styled Contact Card

Let's build a beautifully styled contact card:

```typescript
import React from 'react';
import {View, Text, Image, StyleSheet, Platform} from 'react-native';

function ContactCard() {
  return (
    <View style={styles.card}>
      <View style={styles.avatarContainer}>
        <Image
          source={{uri: 'https://i.pravatar.cc/100'}}
          style={styles.avatar}
        />
        <View style={styles.onlineBadge} />
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>Sarah Chen</Text>
        <Text style={styles.role}>Senior Product Designer</Text>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>245</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1.2k</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    // Cross-platform shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#34C759',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  content: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#f0f0f0',
  },
});

export default ContactCard;
```

---

## 🎓 Key Takeaways

1. **StyleSheet.create** is the recommended way to style
2. **Flexbox is default** - understand main/cross axis
3. **Values are unitless** - represent density-independent pixels
4. **Common patterns:**
   - `flex: 1` - Fill available space
   - `justifyContent: 'center'` + `alignItems: 'center'` - Perfect centering
   - `flexDirection: 'row'` - Horizontal layout
5. **Platform differences:**
   - iOS: shadowColor, shadowOffset, shadowOpacity, shadowRadius
   - Android: elevation
6. **Responsive design** - Use Dimensions API

---

## ✅ Checkpoint

You should now be able to:
- ✅ Create and apply styles using StyleSheet
- ✅ Use Flexbox to create layouts
- ✅ Control spacing with padding and margin
- ✅ Position elements absolutely
- ✅ Apply platform-specific styles
- ✅ Create responsive designs

---

## 🔜 What's Next?

In **Chapter 5**, we'll learn about **Handling User Interaction** - making your app interactive with touches, gestures, forms, and keyboard handling!

**Ready to make your app interactive? Let's go! 🚀**
