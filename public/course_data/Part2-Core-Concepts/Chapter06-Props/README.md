# Chapter 6: Props - Passing Data Between Components

**Duration:** 45-60 minutes  
**Difficulty:** Beginner  

---

## 🎯 Learning Objectives

By the end of this chapter, you'll understand:
- What props are and why they're essential
- How to pass data from parent to child components
- Props destructuring patterns
- Default props and prop validation
- The `children` prop for composition
- Common patterns and best practices

---

## 🎁 What Are Props?

### The Simple Answer

**Props (short for "properties") are how you pass data from a parent component to a child component.**

Think of props like **function arguments** - they allow you to customize how a component behaves and what it displays.

---

### Real-World Analogy

Imagine you're ordering a custom pizza:

```typescript
// You (parent) order from the pizza shop (child)
<Pizza 
  size="large"
  toppings={["pepperoni", "mushrooms"]}
  extraCheese={true}
/>

// The pizza shop receives these "props" and makes your custom pizza
```

The pizza shop (component) can make many different pizzas based on the props (orders) it receives!

---

## 📤 Passing Props - The Basics

### Example: Greeting Component

**Without Props (Not Reusable):**

```typescript
function Greeting() {
  return <Text>Hello, John!</Text>;
}

// Problem: Always says "John" - not flexible!
```

**With Props (Reusable):**

```typescript
import React from 'react';
import {Text} from 'react-native';

function Greeting(props) {
  return <Text>Hello, {props.name}!</Text>;
}

// Usage
function App() {
  return (
    <View>
      <Greeting name="John" />
      <Greeting name="Sarah" />
      <Greeting name="Mike" />
    </View>
  );
}
```

**What's happening:**
1. `name="John"` passes the prop to the component
2. `props.name` accesses the value inside the component
3. Same component, different data = reusable!

---

## 🎯 Props Destructuring (Modern Pattern)

Instead of using `props.name`, `props.age`, etc., we can **destructure**:

### Before (Verbose):

```typescript
function UserCard(props) {
  return (
    <View>
      <Text>{props.name}</Text>
      <Text>{props.email}</Text>
      <Text>{props.age}</Text>
    </View>
  );
}
```

### After (Clean):

```typescript
function UserCard({name, email, age}) {
  return (
    <View>
      <Text>{name}</Text>
      <Text>{email}</Text>
      <Text>{age}</Text>
    </View>
  );
}
```

**This is the recommended modern approach!**

---

## 🔢 Different Types of Props

### 1. String Props

```typescript
<ProfileCard name="Sarah" />

// Inside component
function ProfileCard({name}) {
  return <Text>{name}</Text>;
}
```

### 2. Number Props

```typescript
<Counter initialValue={10} />

// Inside component
function Counter({initialValue}) {
  return <Text>Count: {initialValue}</Text>;
}
```

### 3. Boolean Props

```typescript
<Button disabled={true} />
<Button disabled />  {/* Shorthand for true */}

// Inside component
function Button({disabled}) {
  return (
    <Pressable disabled={disabled}>
      <Text>Click Me</Text>
    </Pressable>
  );
}
```

### 4. Array Props

```typescript
<TagList tags={["React", "Native", "Mobile"]} />

// Inside component
function TagList({tags}) {
  return (
    <View>
      {tags.map((tag) => (
        <Text key={tag}>{tag}</Text>
      ))}
    </View>
  );
}
```

### 5. Object Props

```typescript
<UserProfile user={{name: "John", age: 30, email: "john@example.com"}} />

// Inside component
function UserProfile({user}) {
  return (
    <View>
      <Text>{user.name}</Text>
      <Text>{user.email}</Text>
      <Text>Age: {user.age}</Text>
    </View>
  );
}
```

### 6. Function Props (Callbacks)

```typescript
<Button onPress={() => alert('Clicked!')} />

// Inside component
function Button({onPress}) {
  return (
    <Pressable onPress={onPress}>
      <Text>Click Me</Text>
    </Pressable>
  );
}
```

---

## 🎨 Practical Example: Customizable Button

Let's build a reusable button component with multiple props:

```typescript
import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';

function CustomButton({
  title,
  onPress,
  backgroundColor = '#007AFF',
  textColor = 'white',
  disabled = false,
  icon,
}) {
  return (
    <Pressable
      style={[
        styles.button,
        {backgroundColor: disabled ? '#ccc' : backgroundColor},
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.text, {color: textColor}]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    marginRight: 8,
    fontSize: 18,
  },
});

export default CustomButton;
```

**Usage:**

```typescript
import CustomButton from './CustomButton';

function App() {
  return (
    <View style={{padding: 20}}>
      {/* Basic button */}
      <CustomButton 
        title="Click Me" 
        onPress={() => alert('Clicked!')} 
      />

      {/* Custom colors */}
      <CustomButton
        title="Danger"
        backgroundColor="#FF3B30"
        onPress={() => alert('Danger!')}
      />

      {/* With icon */}
      <CustomButton
        title="Download"
        icon="⬇️"
        backgroundColor="#34C759"
        onPress={() => alert('Downloading...')}
      />

      {/* Disabled */}
      <CustomButton
        title="Disabled"
        disabled={true}
        onPress={() => alert('This will not fire')}
      />
    </View>
  );
}
```

---

## 🎁 Default Props

Set default values for props using default parameters:

```typescript
function Greeting({name = 'Guest', greeting = 'Hello'}) {
  return <Text>{greeting}, {name}!</Text>;
}

// Usage
<Greeting />  {/* "Hello, Guest!" */}
<Greeting name="Sarah" />  {/* "Hello, Sarah!" */}
<Greeting name="Mike" greeting="Welcome" />  {/* "Welcome, Mike!" */}
```

---

## 👶 The Children Prop

`children` is a special prop that contains everything between opening and closing tags.

### Basic Example:

```typescript
function Card({children}) {
  return (
    <View style={styles.card}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

// Usage
<Card>
  <Text>This is inside the card!</Text>
  <Text>You can put anything here.</Text>
  <Button title="Click" />
</Card>
```

---

### Practical Example: Container Component

```typescript
import React from 'react';
import {View, StyleSheet} from 'react-native';

function Container({children, padding = 20, backgroundColor = 'white'}) {
  return (
    <View style={[styles.container, {padding, backgroundColor}]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginVertical: 10,
  },
});

export default Container;
```

**Usage:**

```typescript
<Container>
  <Text>Content 1</Text>
  <Text>Content 2</Text>
</Container>

<Container padding={30} backgroundColor="#f0f0f0">
  <Text>Custom padding and color!</Text>
</Container>
```

---

## 🏗️ Building a Profile Card with Props

Let's refactor our Profile Card from Chapter 3 to use props:

```typescript
import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

function ProfileCard({
  name,
  role,
  location,
  avatarUrl,
  isOnline = false,
}) {
  return (
    <View style={styles.card}>
      {/* Avatar with online indicator */}
      <View style={styles.avatarContainer}>
        <Image
          source={{uri: avatarUrl}}
          style={styles.avatar}
        />
        {isOnline && <View style={styles.onlineBadge} />}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.role}>{role}</Text>
        {location && (
          <Text style={styles.location}>📍 {location}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 18,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: '#fff',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
    color: '#999',
  },
});

export default ProfileCard;
```

**Usage:**

```typescript
import ProfileCard from './ProfileCard';

function App() {
  return (
    <View style={{padding: 20}}>
      <ProfileCard
        name="Sarah Johnson"
        role="Senior Designer"
        location="San Francisco, CA"
        avatarUrl="https://i.pravatar.cc/100?img=1"
        isOnline={true}
      />

      <ProfileCard
        name="Michael Chen"
        role="Backend Developer"
        location="New York, NY"
        avatarUrl="https://i.pravatar.cc/100?img=2"
        isOnline={false}
      />

      <ProfileCard
        name="Emma Wilson"
        role="Product Manager"
        avatarUrl="https://i.pravatar.cc/100?img=3"
        isOnline={true}
        // No location - will not display
      />
    </View>
  );
}
```

---

## 📊 Props vs State

This is a crucial concept to understand:

### Props:
- ✅ Passed from parent to child
- ✅ Read-only (immutable)
- ✅ Used for configuration
- ❌ Cannot be changed by child component

### State (Chapter 7):
- ✅ Managed within the component
- ✅ Can be changed
- ✅ Used for interactive data
- ❌ Not passed from parent

**Visual:**

```
Parent Component
    ↓ (passes props)
Child Component
    ↓ (manages state)
```

**Example:**

```typescript
// Props - passed from parent
function Button({title, color}) {  // ← Props
  return <Pressable><Text>{title}</Text></Pressable>;
}

// State - managed within (we'll learn this in Chapter 7)
function Counter() {
  const [count, setCount] = useState(0);  // ← State
  return <Text>{count}</Text>;
}
```

---

## ⚠️ Props Are Read-Only!

You **CANNOT** modify props inside a component:

```typescript
// ❌ WRONG - Don't do this!
function Greeting({name}) {
  name = name.toUpperCase();  // ❌ Modifying props
  return <Text>Hello, {name}!</Text>;
}

// ✅ CORRECT - Transform without modifying
function Greeting({name}) {
  const uppercaseName = name.toUpperCase();  // ✅ New variable
  return <Text>Hello, {uppercaseName}!</Text>;
}
```

---

## 🎯 Practical Exercise: Product Card

Let's build a reusable product card:

```typescript
import React from 'react';
import {View, Text, Image, Pressable, StyleSheet} from 'react-native';

function ProductCard({
  title,
  price,
  imageUrl,
  rating,
  inStock = true,
  onPress,
  onAddToCart,
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Product Image */}
      <Image source={{uri: imageUrl}} style={styles.image} />

      {/* Stock Badge */}
      {!inStock && (
        <View style={styles.outOfStockBadge}>
          <Text style={styles.outOfStockText}>Out of Stock</Text>
        </View>
      )}

      {/* Product Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {rating.toFixed(1)}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>${price.toFixed(2)}</Text>

          <Pressable
            style={[styles.cartButton, !inStock && styles.cartButtonDisabled]}
            onPress={onAddToCart}
            disabled={!inStock}
          >
            <Text style={styles.cartButtonText}>
              {inStock ? '🛒 Add' : 'Unavailable'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  outOfStockText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  info: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  ratingContainer: {
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  cartButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cartButtonDisabled: {
    backgroundColor: '#ccc',
  },
  cartButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProductCard;
```

**Usage:**

```typescript
import ProductCard from './ProductCard';

function App() {
  const products = [
    {
      id: 1,
      title: 'Wireless Headphones - Premium Sound Quality',
      price: 129.99,
      imageUrl: 'https://picsum.photos/400/300?random=1',
      rating: 4.5,
      inStock: true,
    },
    {
      id: 2,
      title: 'Smart Watch - Fitness Tracker',
      price: 199.99,
      imageUrl: 'https://picsum.photos/400/300?random=2',
      rating: 4.8,
      inStock: false,
    },
  ];

  return (
    <ScrollView style={{padding: 16}}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          title={product.title}
          price={product.price}
          imageUrl={product.imageUrl}
          rating={product.rating}
          inStock={product.inStock}
          onPress={() => alert(`Viewing: ${product.title}`)}
          onAddToCart={() => alert(`Added ${product.title} to cart!`)}
        />
      ))}
    </ScrollView>
  );
}
```

---

## ✅ Props Best Practices

### 1. Use Descriptive Names

```typescript
// ❌ Bad
<Button text="Click" func={() => {}} />

// ✅ Good
<Button title="Click Me" onPress={() => {}} />
```

### 2. Provide Default Values

```typescript
function Card({padding = 20, backgroundColor = 'white'}) {
  // ...
}
```

### 3. Destructure Props

```typescript
// ✅ Preferred
function Component({name, age}) {
  return <Text>{name} is {age}</Text>;
}
```

### 4. Use Meaningful Booleans

```typescript
// ❌ Unclear
<Button flag={true} />

// ✅ Clear
<Button disabled={true} />
<Button isLoading={true} />
```

### 5. Pass Functions for Actions

```typescript
<Button onPress={handlePress} />
<Input onChange={handleChange} />
<Card onDelete={handleDelete} />
```

---

## 🎓 Key Takeaways

1. **Props pass data** from parent to child components
2. **Props are read-only** - never modify them
3. **Destructure props** for cleaner code
4. **children** is a special prop for composition
5. **Default values** make components more flexible
6. **Props ≠ State** - props are passed in, state is managed internally
7. **Function props** enable parent-child communication

---

## 🤔 Common Questions

**Q: Can a child component change props?**  
A: No! Props are read-only. Use callbacks to communicate changes back to parent.

**Q: How many props can a component have?**  
A: No limit, but if you have 10+, consider restructuring or using an object.

**Q: What's the difference between props and state?**  
A: Props are passed from parent (immutable). State is internal (mutable). We'll learn state in Chapter 7!

**Q: Can I pass components as props?**  
A: Yes! Either as `children` or as a specific prop.

```typescript
<Card 
  header={<Text>Title</Text>}
  footer={<Button />}
/>
```

---

## ✅ Checkpoint

You should now be able to:
- ✅ Pass props to components
- ✅ Destructure props for clean code
- ✅ Use default prop values
- ✅ Utilize the children prop
- ✅ Build reusable components with props
- ✅ Understand props vs state

---

## 🎯 Practice Challenges

### Challenge 1: Comment Component
Create a `Comment` component with props:
- `author` (string)
- `text` (string)
- `timestamp` (string)
- `avatarUrl` (string)
- `likes` (number)

### Challenge 2: Notification Badge
Create a `Badge` component that displays:
- A number
- Different colors based on type ('info', 'warning', 'error')
- Optional pulse animation prop

### Challenge 3: Card Wrapper
Create a flexible `Card` component that:
- Accepts `children`
- Has optional `header` and `footer` props
- Supports different styles via props

---

## 🔜 What's Next?

In **Chapter 7**, we'll learn about **State** - how to make components dynamic and interactive!

Props let you pass data in. State lets you manage data that changes over time.

Together, props and state are the foundation of React Native applications!

**Ready to make things dynamic? Let's go! 🚀**
