# Chapter 8: Lists & Keys - Displaying Dynamic Data

**Duration:** 60-75 minutes  
**Difficulty:** Beginner to Intermediate  

---

## 🎯 Learning Objectives

By the end of this chapter, you'll understand:
- Why FlatList is essential for performance
- How to render lists efficiently
- The importance of keys
- FlatList vs ScrollView
- SectionList for grouped data
- Pull-to-refresh and infinite scrolling
- List optimization techniques

---

## 📜 The Problem with ScrollView

### Why Not Just Use ScrollView?

```typescript
// ❌ BAD for large lists - Renders ALL items at once
<ScrollView>
  {users.map(user => (
    <UserCard key={user.id} user={user} />
  ))}
</ScrollView>
```

**Problems:**
- Renders ALL items immediately (even off-screen ones)
- With 1000 items = 1000 components rendered
- Slow initial render
- High memory usage
- Scrolling feels sluggish

**When to use ScrollView:**
- Small, known number of items (< 20)
- Mixed content that's not uniform
- When you need full ScrollView features

---

## 🚀 FlatList - The Solution

### What Makes FlatList Special?

**FlatList only renders visible items** (plus a small buffer).

```
Screen showing items 5-10

Items 1-4:   Not rendered (recycled)
Items 5-10:  ✅ Rendered (visible)
Items 11-15: ✅ Rendered (buffer)
Items 16+:   Not rendered yet
```

**Benefits:**
- ✅ Fast initial render
- ✅ Low memory usage
- ✅ Smooth scrolling
- ✅ Built-in optimizations
- ✅ Pull-to-refresh support
- ✅ Infinite scroll support

---

## 📝 FlatList Basics

### Minimal Example

```typescript
import React from 'react';
import {FlatList, Text, View, StyleSheet} from 'react-native';

function SimpleList() {
  const data = [
    {id: '1', name: 'Item 1'},
    {id: '2', name: 'Item 2'},
    {id: '3', name: 'Item 3'},
  ];

  return (
    <FlatList
      data={data}                           // Array of items
      keyExtractor={(item) => item.id}      // Unique key for each item
      renderItem={({item}) => (             // How to render each item
        <View style={styles.item}>
          <Text>{item.name}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default SimpleList;
```

**Required props:**
1. `data` - Array of items to display
2. `renderItem` - Function that renders each item
3. `keyExtractor` - Function that returns unique key (or use `key` in data)

---

## 🔑 Understanding Keys

### Why Keys Matter

Keys help React identify which items have changed, been added, or removed.

```typescript
// ❌ BAD - Using index as key
keyExtractor={(item, index) => index.toString()}

// ✅ GOOD - Using unique identifier
keyExtractor={(item) => item.id}
```

**Why index is bad:**
- If you reorder items, keys stay the same
- React thinks nothing changed
- Can cause bugs with state

**Good key properties:**
- Unique across all items
- Stable (doesn't change between renders)
- Not the array index (usually)

---

## 👥 Practical Example: Contact List

```typescript
import React, {useState} from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Pressable,
} from 'react-native';

function ContactList() {
  const [contacts] = useState([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 234-567-8901',
      avatar: 'https://i.pravatar.cc/100?img=1',
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@example.com',
      phone: '+1 234-567-8902',
      avatar: 'https://i.pravatar.cc/100?img=2',
    },
    {
      id: '3',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      phone: '+1 234-567-8903',
      avatar: 'https://i.pravatar.cc/100?img=3',
    },
    {
      id: '4',
      name: 'James Brown',
      email: 'james@example.com',
      phone: '+1 234-567-8904',
      avatar: 'https://i.pravatar.cc/100?img=4',
    },
    {
      id: '5',
      name: 'Olivia Davis',
      email: 'olivia@example.com',
      phone: '+1 234-567-8905',
      avatar: 'https://i.pravatar.cc/100?img=5',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContact = ({item}) => (
    <Pressable
      style={styles.contactCard}
      onPress={() => alert(`Calling ${item.name}...`)}
    >
      <Image source={{uri: item.avatar}} style={styles.avatar} />
      <View style={styles.contactInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.phone}>{item.phone}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Contact List */}
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No contacts found</Text>
        )}
        ListHeaderComponent={() => (
          <Text style={styles.headerText}>
            {filteredContacts.length} contacts
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  contactCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  phone: {
    fontSize: 14,
    color: '#007AFF',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 40,
  },
  headerText: {
    padding: 16,
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f9f9f9',
  },
});

export default ContactList;
```

---

## 🎨 FlatList Props & Features

### Essential Props

```typescript
<FlatList
  // Required
  data={items}
  renderItem={({item, index}) => <ItemComponent item={item} />}
  keyExtractor={(item) => item.id}
  
  // Optional but useful
  horizontal={false}                // Horizontal scrolling
  numColumns={1}                    // Grid layout
  inverted={false}                  // Reverse order (for chats)
  initialNumToRender={10}           // Items to render initially
  maxToRenderPerBatch={10}          // Items per render batch
  windowSize={21}                   // Render window size
  
  // Separators & Empty States
  ItemSeparatorComponent={Separator}
  ListHeaderComponent={Header}
  ListFooterComponent={Footer}
  ListEmptyComponent={EmptyState}
  
  // Performance
  removeClippedSubviews={true}      // Unmount off-screen views
  getItemLayout={getItemLayout}     // Skip measurement (if uniform)
  
  // Styling
  contentContainerStyle={styles.content}
  columnWrapperStyle={styles.row}   // For numColumns > 1
/>
```

---

### Pull to Refresh

```typescript
import React, {useState} from 'react';
import {FlatList, RefreshControl} from 'react-native';

function RefreshableList() {
  const [data, setData] = useState([/* initial data */]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update data
    setData([/* new data */]);
    
    setRefreshing(false);
  };

  return (
    <FlatList
      data={data}
      renderItem={({item}) => <Item item={item} />}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#007AFF"
        />
      }
    />
  );
}
```

---

### Infinite Scrolling

```typescript
function InfiniteList() {
  const [data, setData] = useState([/* initial 20 items */]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading) return;
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add more data
    const newData = [/* next 20 items */];
    setData(prev => [...prev, ...newData]);
    setPage(prev => prev + 1);
    
    setLoading(false);
  };

  return (
    <FlatList
      data={data}
      renderItem={({item}) => <Item item={item} />}
      keyExtractor={(item) => item.id}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}  // Trigger when 50% from bottom
      ListFooterComponent={
        loading ? <ActivityIndicator size="large" /> : null
      }
    />
  );
}
```

---

## 📱 Grid Layouts

### Two Column Grid

```typescript
function GridList() {
  const products = [/* array of products */];

  return (
    <FlatList
      data={products}
      numColumns={2}                      // 2 columns
      keyExtractor={(item) => item.id}
      renderItem={({item}) => (
        <View style={styles.gridItem}>
          <Image source={{uri: item.image}} style={styles.productImage} />
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>${item.price}</Text>
        </View>
      )}
      columnWrapperStyle={styles.row}     // Style for each row
    />
  );
}

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  gridItem: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
    marginTop: 4,
  },
});
```

---

## 📚 SectionList - Grouped Data

For data with sections (like contacts grouped by letter):

```typescript
import React from 'react';
import {SectionList, Text, View, StyleSheet} from 'react-native';

function GroupedContacts() {
  const sections = [
    {
      title: 'A',
      data: [
        {id: '1', name: 'Alice Anderson'},
        {id: '2', name: 'Andrew Adams'},
      ],
    },
    {
      title: 'B',
      data: [
        {id: '3', name: 'Bob Brown'},
        {id: '4', name: 'Betty Baker'},
      ],
    },
    {
      title: 'C',
      data: [
        {id: '5', name: 'Charlie Clark'},
      ],
    },
  ];

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => (
        <View style={styles.item}>
          <Text style={styles.itemText}>{item.name}</Text>
        </View>
      )}
      renderSectionHeader={({section}) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
      )}
      stickySectionHeadersEnabled={true}  // Headers stick to top
    />
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  item: {
    padding: 15,
    paddingLeft: 30,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default GroupedContacts;
```

---

## ⚡ Performance Optimization

### 1. Use getItemLayout (For Uniform Items)

If all items have the same height:

```typescript
const ITEM_HEIGHT = 80;

<FlatList
  data={data}
  renderItem={renderItem}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

**Benefits:**
- Skips measurement
- Enables instant scrolling to any item
- Improves performance significantly

---

### 2. Optimize renderItem

```typescript
// ❌ Creating new function every render
<FlatList
  renderItem={({item}) => <Item data={item} onPress={() => handlePress(item)} />}
/>

// ✅ Use useCallback (Chapter 9) or separate component
const renderItem = useCallback(({item}) => (
  <Item data={item} onPress={handlePress} />
), [handlePress]);

<FlatList renderItem={renderItem} />
```

---

### 3. Use React.memo for Items

```typescript
import React, {memo} from 'react';

const ContactItem = memo(({contact, onPress}) => {
  return (
    <Pressable onPress={() => onPress(contact)}>
      <Text>{contact.name}</Text>
    </Pressable>
  );
});

// Only re-renders if props change
```

---

## 🎯 Practical Exercise: News Feed

```typescript
import React, {useState} from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  RefreshControl,
} from 'react-native';

function NewsFeed() {
  const [articles, setArticles] = useState([
    {
      id: '1',
      title: 'Breaking: React Native 0.75 Released',
      source: 'Tech News',
      timestamp: '2 hours ago',
      image: 'https://picsum.photos/400/200?random=1',
      likes: 142,
      comments: 28,
    },
    {
      id: '2',
      title: 'Top 10 Mobile Development Tips for 2025',
      source: 'Dev Weekly',
      timestamp: '5 hours ago',
      image: 'https://picsum.photos/400/200?random=2',
      likes: 89,
      comments: 15,
    },
    {
      id: '3',
      title: 'Understanding React Hooks in Depth',
      source: 'React Today',
      timestamp: '1 day ago',
      image: 'https://picsum.photos/400/200?random=3',
      likes: 256,
      comments: 42,
    },
  ]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate fetching new articles
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleLike = (id) => {
    setArticles(prev =>
      prev.map(article =>
        article.id === id
          ? {...article, likes: article.likes + 1}
          : article
      )
    );
  };

  const renderArticle = ({item}) => (
    <View style={styles.article}>
      <Image source={{uri: item.image}} style={styles.articleImage} />
      <View style={styles.articleContent}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.source}>{item.source}</Text>
          <Text style={styles.timestamp}> • {item.timestamp}</Text>
        </View>
        <View style={styles.actions}>
          <Pressable
            style={styles.actionButton}
            onPress={() => handleLike(item.id)}
          >
            <Text style={styles.actionText}>❤️ {item.likes}</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Text style={styles.actionText}>💬 {item.comments}</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Text style={styles.actionText}>🔗 Share</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>News Feed</Text>
      </View>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={renderArticle}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
          />
        }
        ListFooterComponent={() => (
          <Text style={styles.footer}>You're all caught up! 🎉</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  article: {
    backgroundColor: 'white',
  },
  articleImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  articleContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  source: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 14,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    marginRight: 20,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 8,
    backgroundColor: '#f5f5f5',
  },
  footer: {
    textAlign: 'center',
    padding: 20,
    color: '#999',
    fontSize: 14,
  },
});

export default NewsFeed;
```

---

## 🎓 Key Takeaways

1. **Use FlatList for long lists** - it's optimized for performance
2. **Keys must be unique** - use IDs, not array indices
3. **SectionList for grouped data** - like contacts alphabetically
4. **Pull-to-refresh** improves UX significantly
5. **Infinite scroll** loads data on demand
6. **Optimize renderItem** for better performance
7. **Use getItemLayout** when items are uniform

---

## ✅ FlatList vs ScrollView

| Feature | FlatList | ScrollView |
|---------|----------|------------|
| **Performance** | ✅ Lazy loading | ❌ Renders all |
| **Memory** | ✅ Low | ❌ High |
| **Best for** | Long lists | Mixed content |
| **Pull-to-refresh** | ✅ Built-in | ⚠️ Manual |
| **Grid support** | ✅ Yes | ❌ No |

---

## ✅ Checkpoint

You should now be able to:
- ✅ Use FlatList to render large lists efficiently
- ✅ Understand why keys are important
- ✅ Implement search/filter functionality
- ✅ Add pull-to-refresh and infinite scrolling
- ✅ Create grid layouts with numColumns
- ✅ Use SectionList for grouped data
- ✅ Optimize list performance

---

## 🎯 Practice Challenges

### Challenge 1: Photo Gallery
Create a photo gallery with:
- 2-column grid layout
- Pull-to-refresh
- Like button for each photo
- Photo count in header

### Challenge 2: Messages List
Build a messages list with:
- Inverted list (newest at bottom, like chat apps)
- Different styles for sent/received
- Timestamps
- Read/unread indicators

### Challenge 3: Search & Filter
Create a searchable product list with:
- Real-time search
- Category filters
- Sort options (price, name, rating)
- Empty state when no results

---

## 🔜 What's Next?

In **Chapter 9**, we'll learn about **useEffect** - handling side effects like API calls, subscriptions, and timers!

You now know how to display data efficiently. Next, we'll learn how to fetch that data!

**Ready to connect to APIs? Let's go! 🚀**
