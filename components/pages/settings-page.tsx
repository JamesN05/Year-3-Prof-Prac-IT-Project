import { db } from '@/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsPage() {
  const router = useRouter();
  const auth = getAuth();

  const [darkMode, setDarkMode] = useState(false);
  const [tempUnit, setTempUnit] = useState('C');

  //gets users name for panel
  const userId = auth.currentUser?.uid;
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(user => setCurrentUser(user));
  return unsubscribe;
}, []);

  useEffect(() => {
    if (userId) loadSettings();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    saveSettings();
  }, [darkMode, tempUnit]);

  const loadSettings = async () => {
    try {
      const ref = doc(db, 'settings', userId!);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const s = snap.data();
        setDarkMode(s.darkMode ?? false);
        setTempUnit(s.tempUnit ?? 'C');
      }
    } catch (e) {
      console.log('Failed to load settings:', e);
    }
  };

  const saveSettings = async () => {
    try {
      const ref = doc(db, 'settings', userId!);
      await setDoc(ref, {
        darkMode,
        tempUnit,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.log('Failed to save settings:', e);
    }
  };

  // allows for sign out, sends user back to login
  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut(auth);
          router.replace('/login');
        },
      },
    ]);
  };

   const bg = darkMode ? 'transparent' : '#9EDCC8';
   const cardBg = darkMode ? '#2a2a2a' : 'white';
   const textColor = darkMode ? 'white' : 'black';
   const mutedColor = darkMode ? '#aaaaaa' : '#555555';

  const content = (
     <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 20, color: textColor }}>
        Settings
      </Text>

      <View style={{ backgroundColor: cardBg, padding: 16, borderRadius: 16, marginBottom: 16 }}>
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
    <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: darkMode ? '#3a3a3a' : '#e0e0e0', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24 }}>👤</Text>
    </View>
    <View>
      <Text style={{ fontWeight: '700', color: textColor }}>{currentUser?.displayName ?? currentUser?.email ?? 'Unknown user'}</Text>
      <Text style={{ color: mutedColor, marginTop: 2 }}>{currentUser?.email}</Text>
    </View>
  </View>
</View>

      <View style={{ backgroundColor: cardBg, padding: 16, borderRadius: 16, marginBottom: 16 }}>
        <Text style={{ fontWeight: '700', color: textColor }}>Appearance</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={{ color: mutedColor }}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
      </View>

      <View style={{ backgroundColor: cardBg, padding: 16, borderRadius: 16, marginBottom: 16 }}>
        <Text style={{ fontWeight: '700', color: textColor }}>Weather</Text>
        <View style={{ flexDirection: 'row', marginTop: 10, gap: 10 }}>
          <TouchableOpacity
            onPress={() => setTempUnit('C')}
            style={{
              paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8,
              backgroundColor: tempUnit === 'C' ? '#4f46e5' : darkMode ? '#3a3a3a' : '#eeeeee',
            }}
          >
            <Text style={{ color: tempUnit === 'C' ? 'white' : mutedColor }}>°C</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTempUnit('F')}
            style={{
              paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8,
              backgroundColor: tempUnit === 'F' ? '#4f46e5' : darkMode ? '#3a3a3a' : '#eeeeee',
            }}
          >
            <Text style={{ color: tempUnit === 'F' ? 'white' : mutedColor }}>°F</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ backgroundColor: cardBg, padding: 16, borderRadius: 16, marginBottom: 16 }}>
        <TouchableOpacity onPress={() => router.push('/profile' as any)}>
          <Text style={{ color: textColor }}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://example.com/privacy')}>
          <Text style={{ marginTop: 12, color: textColor }}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:support@taskmaxxing.com')}>
          <Text style={{ marginTop: 12, color: textColor }}>Help & Support</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleSignOut}
        style={{ backgroundColor: darkMode ? '#3a1a1a' : '#ffdddd', padding: 16, borderRadius: 16 }}
      >
        <Text style={{ textAlign: 'center', fontWeight: '700', color: 'red' }}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return darkMode ? (
    <View style={{ flex: 1, backgroundColor: darkMode ? '#1a1a1a' : '#9EDCC8' }}>
      {content}
    </View>
  ) : (
    <LinearGradient colors={['#9EDCC8', '#6FC3B8']} style={{ flex: 1 }}>
      {content}
    </LinearGradient>
  );
}
