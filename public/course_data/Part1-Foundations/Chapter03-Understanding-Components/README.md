# Chapter 3: Understanding Components - The Building Blocks

**Duration:** 60-75 minutes  
**Difficulty:** Beginner  

---

## 🎯 Learning Objectives

By the end of this chapter, you'll understand:
- What components are and why they're fundamental
- Core React Native components (`View`, `Text`, `Image`, `ScrollView`)
- How to create custom components
- Component composition and reusability
- Import/Export patterns

---

## 🧩 What Are Components?

### The Simple Answer

**Components are reusable pieces of UI.**

Think of them like LEGO blocks - you can combine small, simple pieces to build complex structures.

---

### Why Components Matter

Imagine building a social media app without components:

```typescript
// ❌ Without components - Hard to maintain
function App() {
  return (
    <View>
      <View style={{padding: 10, borderWidth: 1}}>
        <Image source={{uri: 'user1.jpg'}} style={{width: 50, height: 50}} />
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>John Doe</Text>
        <Text style={{fontSize: 14, color: 'gray'}}>Software Engineer</Text>
      </View>
      <View style={{padding: 10, borderWidth: 1}}>
        <Image source={{uri: 'user2.jpg'}} style={{width: 50, height: 50}} />
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>Jane Smith</Text>
        <Text style={{fontSize: 14, color: 'gray'}}>Designer</Text>
      </View>
      {/* Imagine 100 more of these... 😱 */}
    </View>
  );
}
```

**With components:**

```typescript
// ✅ With components - Clean and reusable
function App() {
  return (
    <View>
      <ProfileCard name="John Doe" title="Software Engineer" image="user1.jpg" />
      <ProfileCard name="Jane Smith" title="Designer" image="user2.jpg" />
      {/* Easy to repeat and maintain! 😊 */}
    </View>
  );
}
```

---

## 📦 Core React Native Components

React Native provides built-in components that map to native UI elements.

### 1. View - The Container

`<View>` is like `<div>` in HTML. It's a container for other components.

**Basic Example:**

```typescript
import React from 'react';
import {View, StyleSheet} from 'react-native';

function App() {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        {/* Content here */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: 'blue',
  },
});

export default App;
```

**What `View` does:**
- ✅ Provides layout structure (Flexbox)
- ✅ Can have background colors, borders, padding
- ✅ Supports touch events
- ✅ Can be nested infinitely

**Native equivalent:**
- iOS: `UIView`
- Android: `android.view.View`

---

### 2. Text - Displaying Text

**IMPORTANT:** In React Native, ALL text MUST be wrapped in `<Text>` component.

```typescript
import {Text, StyleSheet} from 'react-native';

function Greeting() {
  return (
    <Text style={styles.greeting}>Hello, React Native!</Text>
  );
}

const styles = StyleSheet.create({
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});
```

**Common `Text` properties:**

```typescript
<Text
  style={styles.text}
  numberOfLines={2}           // Limit to 2 lines
  ellipsizeMode="tail"        // Add "..." at end
  onPress={() => alert('Hi')} // Text can be touchable!
>
  This is a very long text that will be truncated...
</Text>
```

**Nested Text:**

```typescript
<Text style={styles.paragraph}>
  This is normal text.{' '}
  <Text style={styles.bold}>This is bold.</Text>{' '}
  <Text style={styles.italic}>This is italic.</Text>
</Text>
```

**Native equivalent:**
- iOS: `UILabel` or `UITextView`
- Android: `TextView`

---

### 3. Image - Displaying Images

`<Image>` displays images from various sources.

#### Loading from URL:

```typescript
import {Image, StyleSheet} from 'react-native';

function Avatar() {
  return (
    <Image
      source={{uri: 'https://example.com/avatar.jpg'}}
      style={styles.avatar}
    />
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50, // Makes it circular
  },
});
```

#### Loading from Local Files:

```typescript
// Place image in your project (e.g., /assets/logo.png)
import {Image} from 'react-native';

function Logo() {
  return (
    <Image
      source={require('./assets/logo.png')}
      style={{width: 200, height: 100}}
    />
  );
}
```

**Common `Image` properties:**

```typescript
<Image
  source={{uri: 'https://example.com/image.jpg'}}
  style={styles.image}
  resizeMode="cover"  // 'cover', 'contain', 'stretch', 'repeat', 'center'
  onLoad={() => console.log('Image loaded')}
  onError={() => console.log('Failed to load')}
/>
```

**ResizeMode explained:**
- `cover`: Fill the space, crop if needed (most common)
- `contain`: Fit entire image, letterbox if needed
- `stretch`: Distort to fill space
- `center`: Center without scaling

---

### 4. ScrollView - Scrollable Container

When content doesn't fit on screen, use `<ScrollView>`.

```typescript
import {ScrollView, Text, View, StyleSheet} from 'react-native';

function LongContent() {
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.content}>
        <Text style={styles.text}>Item 1</Text>
        <Text style={styles.text}>Item 2</Text>
        <Text style={styles.text}>Item 3</Text>
        {/* ... many more items ... */}
        <Text style={styles.text}>Item 100</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});
```

**ScrollView features:**

```typescript
<ScrollView
  horizontal={true}                    // Horizontal scrolling
  showsVerticalScrollIndicator={false} // Hide scrollbar
  contentContainerStyle={styles.content} // Style for content container
  onScroll={(e) => console.log(e)}     // Track scroll position
>
  {/* Content */}
</ScrollView>
```

**⚠️ Important:** Don't use `ScrollView` for long lists (100+ items). Use `FlatList` instead (Chapter 8).

---

### 5. SafeAreaView - Respect Device Boundaries

Handles notches, status bars, and home indicators.

```typescript
import {SafeAreaView, StyleSheet, Text} from 'react-native';

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>This content respects safe areas!</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
```

**Without SafeAreaView:**
- Text might be hidden behind notch
- Content might be too close to screen edges

**With SafeAreaView:**
- ✅ Content automatically padded
- ✅ Works on all devices

---

## 🏗️ Creating Custom Components

### Why Create Custom Components?

1. **Reusability** - Write once, use many times
2. **Maintainability** - Change in one place
3. **Readability** - Code is easier to understand
4. **Testing** - Test components in isolation

---

### Example: Building a ProfileCard Component

Let's build a reusable profile card step-by-step.

#### Step 1: Basic Structure

Create a new file: `ProfileCard.tsx`

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
        <Text style={styles.title}>Software Engineer</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  info: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default ProfileCard;
```

**Let's break this down:**

1. **Imports:**
   ```typescript
   import React from 'react';
   import {View, Text, Image, StyleSheet} from 'react-native';
   ```
   - We import the components we need

2. **Component Function:**
   ```typescript
   function ProfileCard() {
     return (...);
   }
   ```
   - This is a functional component
   - It returns JSX (the UI)

3. **Layout Structure:**
   ```typescript
   <View style={styles.card}>      {/* Container */}
     <Image />                     {/* Avatar */}
     <View style={styles.info}>    {/* Text container */}
       <Text />                    {/* Name */}
       <Text />                    {/* Title */}
     </View>
   </View>
   ```
   - `flexDirection: 'row'` makes avatar and text side-by-side

4. **Styles:**
   ```typescript
   const styles = StyleSheet.create({...});
   ```
   - Defined at the bottom
   - Reusable and optimized

5. **Export:**
   ```typescript
   export default ProfileCard;
   ```
   - Makes component available to other files

---

#### Step 2: Using the Component

In your `App.tsx`:

```typescript
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import ProfileCard from './ProfileCard';

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ProfileCard />
      <ProfileCard />
      <ProfileCard />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
});

export default App;
```

**Result:** Three identical profile cards! But they all show the same data... 🤔

Let's fix that in the next section.

---

## 🔄 Component Composition

### Making Components Flexible with Children

Sometimes you want to pass content into a component:

```typescript
import React from 'react';
import {View, StyleSheet} from 'react-native';

function Card({children}) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default Card;
```

**Using it:**

```typescript
import Card from './Card';
import {Text} from 'react-native';

function App() {
  return (
    <Card>
      <Text>This is inside the card!</Text>
      <Text>You can put anything here.</Text>
    </Card>
  );
}
```

**What's `children`?**
- A special prop
- Contains everything between opening and closing tags
- Very powerful for composition

---

### Nesting Components

You can nest components infinitely:

```typescript
function App() {
  return (
    <Screen>
      <Header>
        <Logo />
        <Menu />
      </Header>
      <Content>
        <Sidebar>
          <Navigation />
        </Sidebar>
        <MainContent>
          <Article>
            <Title />
            <Body />
          </Article>
        </MainContent>
      </Content>
      <Footer />
    </Screen>
  );
}
```

---

## 📤 Import/Export Patterns

### Default Export (One per file)

```typescript
// Button.tsx
export default function Button() {
  return <Text>Click me</Text>;
}

// App.tsx
import Button from './Button';
import CustomButton from './Button'; // Can rename
```

### Named Export (Multiple per file)

```typescript
// components.tsx
export function PrimaryButton() { /*...*/ }
export function SecondaryButton() { /*...*/ }

// App.tsx
import {PrimaryButton, SecondaryButton} from './components';
```

### Both Together

```typescript
// Button.tsx
export function PrimaryButton() { /*...*/ }
export function SecondaryButton() { /*...*/ }

export default function Button() { /*...*/ }

// App.tsx
import Button, {PrimaryButton, SecondaryButton} from './Button';
```

---

## 🎨 Practical Exercise: Build a Profile Card App

Let's build a real app using what we've learned!

### Project: Profile Gallery

Create a new file `ProfileCard.tsx`:

```typescript
import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

// We'll make this accept data soon!
function ProfileCard() {
  return (
    <View style={styles.card}>
      <Image
        source={{uri: 'https://i.pravatar.cc/100?img=1'}}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.name}>Sarah Johnson</Text>
        <Text style={styles.role}>Product Designer</Text>
        <Text style={styles.location}>📍 San Francisco, CA</Text>
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
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

Update `App.tsx`:

```typescript
import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import ProfileCard from './ProfileCard';

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Team Members</Text>
        <Text style={styles.headerSubtitle}>Meet our amazing team</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <ProfileCard />
        <ProfileCard />
        <ProfileCard />
        <ProfileCard />
        <ProfileCard />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e0e0',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
});

export default App;
```

**Run the app and see your profile gallery!** 📱

---

## 🎓 Key Takeaways

1. **Components are building blocks** - Everything in React Native is a component
2. **Core components:**
   - `View` - Container (like `<div>`)
   - `Text` - All text must be in `<Text>`
   - `Image` - Display images
   - `ScrollView` - Scrollable content
   - `SafeAreaView` - Respect device boundaries

3. **Creating custom components:**
   - Makes code reusable
   - Improves maintainability
   - Enhances readability

4. **Composition over complexity** - Build complex UIs from simple components

5. **Import/Export** - How to share components between files

---

## 🤔 Common Questions

**Q: Why does all text need to be in `<Text>`?**  
A: React Native renders native components. Text needs special handling for font rendering, line breaking, etc.

**Q: Can I use HTML tags like `<div>` or `<span>`?**  
A: No. React Native doesn't use HTML. Use `<View>` and `<Text>` instead.

**Q: What's the difference between `View` and `SafeAreaView`?**  
A: `SafeAreaView` adds padding for device notches/bars. Use it as the outermost container.

**Q: Should I use class or functional components?**  
A: Functional components with hooks (modern approach). We'll use this throughout the course.

**Q: How many components should I create?**  
A: If you use something more than once, or if a component is getting too large (>200 lines), split it.

---

## ✅ Checkpoint

You should now be able to:
- ✅ Use core React Native components
- ✅ Create custom functional components
- ✅ Compose components together
- ✅ Import and export components
- ✅ Build a simple multi-component app

---

## 🎯 Practice Challenges

### Challenge 1: Info Card
Create an `InfoCard` component that displays:
- An icon (use emoji)
- A title
- A description

### Challenge 2: Header Component
Create a reusable `Header` component with:
- Title
- Background color
- Optional subtitle

### Challenge 3: Card List
Create 5 different cards showing different content using the same `Card` component.

**Hint:** Use the `children` prop!

---

## 🔜 What's Next?

In **Chapter 4**, we'll master **Styling** in React Native. You'll learn:
- StyleSheet API in depth
- Flexbox layout system
- Responsive design
- Platform-specific styling

We'll make our profile cards look even better! 🎨

**Ready to style your apps? Let's continue! 🚀**
