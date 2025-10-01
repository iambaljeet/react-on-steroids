# Chapter 2: Environment Setup & Your First App

**Duration:** 45-60 minutes  
**Difficulty:** Beginner  

---

## 🎯 Learning Objectives

By the end of this chapter, you'll be able to:
- Set up a complete React Native development environment
- Create a new React Native project
- Run the app on iOS Simulator (macOS only) and/or Android Emulator
- Understand the project structure
- Make your first code change and see it live

---

## 📋 Prerequisites Check

Before we begin, you need:
- **Basic JavaScript knowledge** (variables, functions, arrays)
- **A computer** (macOS for iOS development, macOS/Windows/Linux for Android)
- **Patience** - First-time setup can take 30-60 minutes
- **Stable internet connection** - We'll download several tools

---

## 🛠️ Installation Guide

### Step 1: Install Node.js & npm

Node.js is the JavaScript runtime. React Native uses it to run the bundler and development server.

#### Check if you already have Node.js:

```bash
node --version
npm --version
```

If you see version numbers (Node 18+ recommended), you're good! Otherwise, install:

**macOS:**
```bash
# Using Homebrew (recommended)
brew install node

# Or download from: https://nodejs.org/
```

**Windows:**
```bash
# Download installer from: https://nodejs.org/
# Choose LTS version
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify installation:**
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

---

### Step 2: Install Watchman (macOS/Linux)

Watchman watches for file changes and triggers reloads. It's optional but highly recommended.

**macOS:**
```bash
brew install watchman
```

**Linux:**
```bash
# Follow instructions at: https://facebook.github.io/watchman/docs/install.html
```

**Windows:** Not needed on Windows.

---

### Step 3: iOS Setup (macOS Only)

#### 3.1 Install Xcode

1. Open **App Store**
2. Search for **Xcode**
3. Install (it's large, ~15GB, this will take time)
4. Open Xcode and accept the license agreement

#### 3.2 Install Xcode Command Line Tools

```bash
xcode-select --install
```

#### 3.3 Install CocoaPods

CocoaPods manages iOS dependencies.

```bash
sudo gem install cocoapods
```

**Verify:**
```bash
pod --version  # Should show 1.12.x or higher
```

#### 3.4 Install iOS Simulator

Xcode comes with iOS Simulators. To verify:

1. Open **Xcode**
2. Go to **Xcode → Settings → Platforms**
3. Ensure iOS Simulators are installed

---

### Step 4: Android Setup (All Platforms)

#### 4.1 Install Android Studio

1. Download from: https://developer.android.com/studio
2. Run the installer
3. During setup, ensure these are checked:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device
   - Performance (Intel HAXM or AMD equivalent)

#### 4.2 Install Android SDK

Open **Android Studio**:

1. Open **Settings/Preferences**
2. Go to **Appearance & Behavior → System Settings → Android SDK**
3. In **SDK Platforms** tab, check:
   - ✅ Android 13.0 (Tiramisu) - API Level 33
   - ✅ Show Package Details (bottom right)
   - ✅ Android SDK Platform 33
   - ✅ Intel x86 Atom_64 System Image (or Google APIs)

4. In **SDK Tools** tab, check:
   - ✅ Android SDK Build-Tools
   - ✅ Android Emulator
   - ✅ Android SDK Platform-Tools
   - ✅ Android SDK Command-line Tools (latest)

5. Click **Apply** and wait for downloads

#### 4.3 Configure Environment Variables

**macOS/Linux** (add to `~/.zshrc` or `~/.bash_profile`):

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Apply changes:
```bash
source ~/.zshrc  # or ~/.bash_profile
```

**Windows** (Environment Variables):

1. Open **System Properties** → **Advanced** → **Environment Variables**
2. Add new **User Variable**:
   - Variable name: `ANDROID_HOME`
   - Variable value: `C:\Users\YourUsername\AppData\Local\Android\Sdk`
3. Edit **Path** variable, add:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\emulator`

**Verify:**
```bash
adb --version  # Should show Android Debug Bridge version
```

#### 4.4 Create Android Virtual Device (AVD)

1. Open **Android Studio**
2. Click **More Actions** → **Virtual Device Manager**
3. Click **Create Device**
4. Choose **Phone** → **Pixel 5** (or any device)
5. Choose **System Image** → **Tiramisu (API 33)**
6. Click **Next** → **Finish**

---

### Step 5: Install React Native CLI

**DON'T install the global CLI!** We'll use `npx` which comes with npm.

**Why?** The `npx` approach always uses the latest version and avoids version conflicts.

---

## 🚀 Creating Your First App

### Step 1: Create a New Project

Open your terminal and navigate to where you want to create your project:

```bash
# Navigate to your workspace
cd ~/Tutorials/ReactNative

# Create a new React Native app
npx react-native@latest init FirstApp

# This will take a few minutes...
```

**What's happening?**
- `npx` runs the React Native CLI without installing it globally
- `init FirstApp` creates a new project called "FirstApp"
- It downloads the template and installs dependencies

**You'll see output like:**
```
✔ Downloading template
✔ Copying template
✔ Processing template
✔ Installing dependencies
✔ Do you want to install CocoaPods now? (Y/n) › Y
```

Type **Y** for CocoaPods (macOS only).

---

### Step 2: Navigate to Your Project

```bash
cd FirstApp
```

---

### Step 3: Run on iOS (macOS Only)

#### Method 1: Using CLI (Recommended)

```bash
npx react-native run-ios
```

**What happens:**
1. Metro Bundler starts (JavaScript bundler)
2. iOS Simulator opens
3. App builds and installs
4. App launches

**First build takes 5-10 minutes. Be patient!**

#### Method 2: Using Xcode

```bash
open ios/FirstApp.xcworkspace
```

Then press **⌘R** (Command + R) in Xcode.

---

### Step 4: Run on Android

#### Make sure your AVD is running:

```bash
# List available emulators
emulator -list-avds

# Start an emulator (replace with your AVD name)
emulator -avd Pixel_5_API_33
```

**Or** start it from Android Studio's Device Manager.

#### Run the app:

```bash
npx react-native run-android
```

**What happens:**
1. Metro Bundler starts
2. App builds
3. App installs on emulator
4. App launches

**First build takes 5-10 minutes.**

---

## 📂 Understanding the Project Structure

Let's explore what was created:

```
FirstApp/
├── android/              # Android native code
├── ios/                  # iOS native code
├── node_modules/         # JavaScript dependencies
├── App.tsx               # Main app component ⭐
├── app.json              # App configuration
├── babel.config.js       # JavaScript transpiler config
├── metro.config.js       # React Native bundler config
├── package.json          # Dependencies and scripts ⭐
├── tsconfig.json         # TypeScript configuration
└── index.js              # Entry point ⭐
```

### Key Files Explained:

#### `index.js` - The Entry Point

```javascript
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

**What this does:**
- Imports the main `App` component
- Registers it with React Native
- This is the bridge between JavaScript and native code

**You rarely need to modify this file.**

---

#### `App.tsx` - The Main Component

This is where your app's code lives. Open it and you'll see:

```typescript
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View>
        <Text>Welcome to React Native!</Text>
      </View>
    </SafeAreaView>
  );
}

export default App;
```

**Let's break this down:**

1. **Imports:**
   ```typescript
   import React from 'react';
   import {View, Text} from 'react-native';
   ```
   - React: The core React library
   - `View`, `Text`: Native components (like `<div>`, `<span>` in web)

2. **Function Component:**
   ```typescript
   function App(): React.JSX.Element {
     // Component code
     return (...);
   }
   ```
   - This is a functional component (modern React approach)
   - Returns JSX (looks like HTML, but it's JavaScript)

3. **Return Statement:**
   ```typescript
   return (
     <View>
       <Text>Welcome to React Native!</Text>
     </View>
   );
   ```
   - `<View>`: Container component (like `<div>` in web)
   - `<Text>`: Text component (MUST wrap all text in React Native)

---

#### `package.json` - Dependencies

```json
{
  "name": "FirstApp",
  "version": "0.0.1",
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.74.0"
  }
}
```

**What this defines:**
- Project name and version
- Scripts you can run (`npm run android`)
- Dependencies (libraries your app uses)

---

## ✏️ Making Your First Change

Let's modify the app to see hot reload in action!

### Step 1: Ensure Metro is Running

If it's not running, start it:

```bash
npx react-native start
```

Keep this terminal open.

### Step 2: Open `App.tsx` in Your Editor

Find this section:

```typescript
<Text>Welcome to React Native!</Text>
```

Change it to:

```typescript
<Text>Hello! I'm learning React Native 🚀</Text>
```

### Step 3: Save the File

**Watch your app automatically reload!** ⚡

This is called **Hot Reload** - one of React Native's killer features.

---

## 🎨 Let's Make It More Interesting

Replace the entire `App.tsx` with this:

```typescript
import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Hello React Native! 👋</Text>
        <Text style={styles.subtitle}>My First App</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            This app is running on {Platform.OS}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  infoBox: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
  },
});

export default App;
```

**Need to import Platform:**

Add this to your imports:

```typescript
import {SafeAreaView, StyleSheet, Text, View, Platform} from 'react-native';
```

**Save and watch it update!**

---

### What's New Here?

#### 1. **StyleSheet:**
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});
```

- Similar to CSS, but JavaScript objects
- `flex: 1` means "take up all available space"
- We'll learn more about styling in Chapter 4

#### 2. **Multiple Components:**
```typescript
<View>
  <Text style={styles.title}>Title</Text>
  <Text style={styles.subtitle}>Subtitle</Text>
</View>
```

- Nesting components inside each other
- Each with its own style

#### 3. **Platform API:**
```typescript
Platform.OS  // Returns 'ios' or 'android'
```

- Detects which platform the app is running on
- Useful for platform-specific code

---

## 🔧 Development Tools

### React Native Debugger

#### Opening the Developer Menu:

**iOS Simulator:**
- Press **⌘D** (Command + D)

**Android Emulator:**
- Press **⌘M** (Command + M) on macOS
- Press **Ctrl+M** on Windows/Linux

**You'll see options like:**
- Reload
- Debug with Chrome
- Enable Fast Refresh
- Show Inspector

#### Enable Fast Refresh (should be on by default):

Fast Refresh automatically reloads your app when you save files.

---

### Chrome DevTools

1. Open Developer Menu
2. Select **Debug**
3. Chrome opens with React Native Debugger
4. Open Console to see `console.log()` output

**Try it:**

Add this to your `App.tsx`:

```typescript
function App(): React.JSX.Element {
  console.log('App is rendering!');
  
  return (...);
}
```

Check the Chrome console!

---

## 🐛 Common Issues & Solutions

### Issue 1: Metro Bundler Won't Start

**Solution:**
```bash
# Clear cache and restart
npx react-native start --reset-cache
```

### Issue 2: Build Failed on iOS

**Solution:**
```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

### Issue 3: Android Emulator Not Found

**Solution:**
```bash
# Check if adb sees the device
adb devices

# If not, restart adb
adb kill-server
adb start-server
```

### Issue 4: Port 8081 Already in Use

**Solution:**
```bash
# Kill the process using port 8081
lsof -ti:8081 | xargs kill

# Or use a different port
npx react-native start --port 8088
```

### Issue 5: Module Not Found Error

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# For iOS
cd ios && pod install && cd ..
```

---

## 📱 Running on Physical Device

### iOS (Physical Device)

1. Connect iPhone via USB
2. Open `ios/FirstApp.xcworkspace` in Xcode
3. Select your device from the top bar
4. Click **Run** (⌘R)
5. Trust the developer certificate on your phone (Settings → General → VPN & Device Management)

### Android (Physical Device)

1. Enable **Developer Options** on your phone:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
2. Enable **USB Debugging** in Developer Options
3. Connect via USB
4. Run:
   ```bash
   adb devices  # Verify device is connected
   npx react-native run-android
   ```

---

## 🎓 Key Takeaways

1. **React Native CLI** via `npx` is the modern approach
2. **Metro Bundler** bundles your JavaScript code
3. **Hot Reload** makes development fast
4. **Three main files:**
   - `index.js`: Entry point
   - `App.tsx`: Main component
   - `package.json`: Dependencies
5. **Platform API** helps write platform-specific code
6. **StyleSheet** is how you style components

---

## ✅ Checkpoint

You should now be able to:
- ✅ Create a new React Native project
- ✅ Run it on iOS and/or Android
- ✅ Make changes and see them live
- ✅ Understand the basic project structure
- ✅ Use the developer menu

---

## 🎯 Practice Exercise

**Challenge:** Modify your app to show:
1. Your name
2. Today's date
3. A welcome message
4. Style it with different colors and fonts

**Hint:** Use the JavaScript `Date` object:
```typescript
const today = new Date().toLocaleDateString();
```

---

## 🔜 What's Next?

In **Chapter 3**, we'll dive deep into **Components** - the building blocks of React Native apps. You'll learn about core components like `View`, `Text`, `Image`, and how to create your own custom components.

**Ready to build real components? Let's continue! 🚀**

---

## 📚 Additional Resources

- [Official Setup Guide](https://reactnative.dev/docs/environment-setup)
- [Troubleshooting](https://reactnative.dev/docs/troubleshooting)
- [React Native CLI](https://github.com/react-native-community/cli)

---

## 💡 Pro Tips

1. **Keep Metro running** in a separate terminal - don't close it
2. **Use Fast Refresh** instead of full reloads when possible
3. **Clear cache** if you see weird errors: `npx react-native start --reset-cache`
4. **Read error messages carefully** - they usually tell you what's wrong
5. **Google is your friend** - React Native has a huge community
