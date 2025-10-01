# Chapter 15: Native Modules & Platform APIs

**Duration:** 90-120 minutes  
**Difficulty:** Advanced  

---

## 🎯 Learning Objectives

By the end of this chapter, you'll understand:
- When to use native modules vs JavaScript
- Platform-specific code with Platform API
- Using built-in native modules
- Accessing device features
- Camera, location, permissions
- Native UI components
- Linking to other apps
- Push notifications basics

---

## 🤔 JavaScript vs Native

### What Can JavaScript Do?

✅ **JavaScript handles:**
- UI rendering
- Business logic
- State management
- Network requests
- Most app functionality

### When You Need Native

❌ **Native required for:**
- Camera and microphone
- Location services
- Biometric authentication
- File system access
- Background tasks
- Push notifications
- Bluetooth/NFC
- Native animations

---

## 📱 Platform-Specific Code

### Platform API

Detect which platform you're on:

```typescript
import {Platform, StyleSheet} from 'react-native';

// Check platform
if (Platform.OS === 'ios') {
  // iOS-specific code
} else if (Platform.OS === 'android') {
  // Android-specific code
}

// Platform-specific styles
const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  text: {
    ...Platform.select({
      ios: {
        fontSize: 16,
        fontFamily: 'System',
      },
      android: {
        fontSize: 14,
        fontFamily: 'Roboto',
      },
    }),
  },
});

// Platform-specific values
const HEADER_HEIGHT = Platform.select({
  ios: 44,
  android: 56,
  default: 50,
});
```

---

### Platform-Specific Files

Create separate files for each platform:

```
components/
├── Button.tsx          # Shared code
├── Button.ios.tsx      # iOS-specific
└── Button.android.tsx  # Android-specific
```

React Native automatically picks the right file:

```typescript
// This works on both platforms
import Button from './components/Button';

// React Native loads:
// - Button.ios.tsx on iOS
// - Button.android.tsx on Android
// - Button.tsx if platform file doesn't exist
```

---

## 📷 Camera - Expo Camera

### Installation

```bash
npx expo install expo-camera
```

### Basic Camera

```typescript
import React, {useState, useRef} from 'react';
import {View, Text, Pressable, Image, StyleSheet} from 'react-native';
import {CameraView, useCameraPermissions} from 'expo-camera';

function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [facing, setFacing] = useState('back');
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to use the camera
        </Text>
        <Pressable onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo.uri);
    }
  };

  const toggleCamera = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{uri: photo}} style={styles.preview} />
        <View style={styles.controls}>
          <Pressable
            onPress={() => setPhoto(null)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Retake</Text>
          </Pressable>
          <Pressable
            onPress={() => {/* Save photo */}}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.controls}>
          <Pressable onPress={toggleCamera} style={styles.flipButton}>
            <Text style={styles.buttonText}>Flip</Text>
          </Pressable>
          <Pressable onPress={takePicture} style={styles.captureButton}>
            <View style={styles.captureButtonInner} />
          </Pressable>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
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
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 10,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
  },
  preview: {
    flex: 1,
  },
});

export default CameraScreen;
```

---

## 📍 Location Services

### Installation

```bash
npx expo install expo-location
```

### Get Current Location

```typescript
import React, {useState, useEffect} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import * as Location from 'expo-location';

function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = async () => {
    try {
      // Request permission
      const {status} = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      // Get location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setLocation(location);
    } catch (err) {
      setError(err.message);
    }
  };

  const watchLocation = async () => {
    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 10,
      },
      (newLocation) => {
        setLocation(newLocation);
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Location</Text>
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      {location && (
        <View style={styles.info}>
          <Text style={styles.label}>Latitude:</Text>
          <Text style={styles.value}>
            {location.coords.latitude.toFixed(6)}
          </Text>
          
          <Text style={styles.label}>Longitude:</Text>
          <Text style={styles.value}>
            {location.coords.longitude.toFixed(6)}
          </Text>
          
          <Text style={styles.label}>Accuracy:</Text>
          <Text style={styles.value}>
            {location.coords.accuracy.toFixed(2)}m
          </Text>
        </View>
      )}
      
      <Pressable onPress={requestLocation} style={styles.button}>
        <Text style={styles.buttonText}>Refresh Location</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#ff3b30',
    fontSize: 16,
    marginBottom: 20,
  },
});

export default LocationScreen;
```

---

## 🔐 Biometric Authentication

### Installation

```bash
npx expo install expo-local-authentication
```

### Fingerprint/Face ID

```typescript
import React, {useState, useEffect} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

function BiometricScreen() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [biometricType, setBiometricType] = useState('');

  useEffect(() => {
    checkBiometric();
  }, []);

  const checkBiometric = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsAvailable(compatible);

    if (compatible) {
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('Face ID');
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType('Fingerprint');
      }
    }
  };

  const authenticate = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
      });

      if (result.success) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  if (!isAvailable) {
    return (
      <View style={styles.container}>
        <Text>Biometric authentication not available</Text>
      </View>
    );
  }

  if (isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.success}>✓ Authenticated!</Text>
        <Text style={styles.message}>Welcome back!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Secure Login</Text>
      <Text style={styles.subtitle}>
        Use {biometricType} to authenticate
      </Text>
      <Pressable onPress={authenticate} style={styles.button}>
        <Text style={styles.buttonText}>
          Authenticate with {biometricType}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  success: {
    fontSize: 48,
    color: '#34C759',
    marginBottom: 20,
  },
  message: {
    fontSize: 20,
    color: '#666',
  },
});

export default BiometricScreen;
```

---

## 🔔 Push Notifications

### Installation

```bash
npx expo install expo-notifications
```

### Setup Notifications

```typescript
import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Pressable, Platform, StyleSheet} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configure how notifications are handled
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function NotificationsScreen() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotifications();

    // Listen for notifications
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log('Notification received:', notification);
      });

    // Listen for user interaction
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Notification tapped:', response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const registerForPushNotifications = async () => {
    if (!Device.isDevice) {
      alert('Must use physical device for Push Notifications');
      return;
    }

    const {status: existingStatus} =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const {status} = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    setExpoPushToken(token);

    // Android channel setup
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };

  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: 'Here is the notification body',
        data: {data: 'goes here'},
      },
      trigger: {seconds: 2},
    });
  };

  const scheduleRepeatingNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Daily Reminder',
        body: 'Time to check your tasks!',
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Push Notifications</Text>
      
      {expoPushToken && (
        <Text style={styles.token}>Token: {expoPushToken}</Text>
      )}
      
      <Pressable onPress={scheduleNotification} style={styles.button}>
        <Text style={styles.buttonText}>
          Schedule Notification (2 seconds)
        </Text>
      </Pressable>
      
      <Pressable
        onPress={scheduleRepeatingNotification}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          Schedule Daily Notification (9 AM)
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  token: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotificationsScreen;
```

---

## 🔗 Linking - Open URLs and Apps

```typescript
import React from 'react';
import {View, Text, Pressable, Linking, StyleSheet, Alert} from 'react-native';

function LinkingScreen() {
  const openURL = async (url: string) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Can't open URL: ${url}`);
    }
  };

  const makeCall = () => {
    openURL('tel:+1234567890');
  };

  const sendEmail = () => {
    openURL('mailto:support@example.com?subject=Help&body=I need help with...');
  };

  const sendSMS = () => {
    openURL('sms:+1234567890?body=Hello!');
  };

  const openMaps = () => {
    const latitude = 37.78825;
    const longitude = -122.4324;
    const label = 'San Francisco';
    
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${label})`,
    });
    
    openURL(url);
  };

  const openWebsite = () => {
    openURL('https://reactnative.dev');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>External Links</Text>
      
      <Pressable onPress={makeCall} style={styles.button}>
        <Text style={styles.buttonText}>📞 Make Phone Call</Text>
      </Pressable>
      
      <Pressable onPress={sendEmail} style={styles.button}>
        <Text style={styles.buttonText}>📧 Send Email</Text>
      </Pressable>
      
      <Pressable onPress={sendSMS} style={styles.button}>
        <Text style={styles.buttonText}>💬 Send SMS</Text>
      </Pressable>
      
      <Pressable onPress={openMaps} style={styles.button}>
        <Text style={styles.buttonText}>🗺️ Open Maps</Text>
      </Pressable>
      
      <Pressable onPress={openWebsite} style={styles.button}>
        <Text style={styles.buttonText}>🌐 Open Website</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LinkingScreen;
```

---

## 🎓 Key Takeaways

1. **Platform API** for platform-specific code
2. **Native modules** access device features
3. **Permissions** must be requested
4. **Expo modules** simplify native functionality
5. **Camera** for photos and videos
6. **Location** for GPS tracking
7. **Biometrics** for secure authentication
8. **Push notifications** for user engagement
9. **Linking** to open other apps

---

## ✅ Checkpoint

You should now be able to:
- ✅ Write platform-specific code
- ✅ Use camera functionality
- ✅ Access device location
- ✅ Implement biometric auth
- ✅ Send push notifications
- ✅ Link to external apps
- ✅ Request and handle permissions

---

## 🎯 Practice Challenge

**Build a Complete Profile App:**

Requirements:
- Take profile photo with camera
- Get current location
- Biometric login
- Send notifications for reminders
- Open maps to show user location
- Platform-specific styling
- Proper permission handling

---

## 🔜 What's Next?

In **Chapter 16**, we'll master **Testing Your App**!

**Ready to write bulletproof code? Let's test! 🚀**
