import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Animated
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Brand colors from logo - Deep Red (#B91C1C)
const BRAND_RED = '#B91C1C';
const BRAND_RED_LIGHT = '#FEE2E2';
const BRAND_RED_DARK = '#7F1D1D';

// Grandmother-friendly large icons with labels
const MAIN_ACTIONS = [
  {
    id: 'create',
    icon: 'add-a-photo',
    label: 'Share My Art',
    description: 'Take a photo and tell its story',
    color: BRAND_RED,
    bgColor: BRAND_RED_LIGHT
  },
  {
    id: 'voice',
    icon: 'mic',
    label: 'Record Story',
    description: 'Speak about your artwork',
    color: BRAND_RED_DARK,
    bgColor: '#FFF5F5'
  },
  {
    id: 'wallet',
    icon: 'account-balance-wallet',
    label: 'My Earnings',
    description: 'See what you have earned',
    color: '#228B22',
    bgColor: '#F0FFF0'
  },
  {
    id: 'help',
    icon: 'help-outline',
    label: 'Get Help',
    description: 'Talk to a helper',
    color: '#DC2626',
    bgColor: '#FEF2F2'
  }
];

export default function SimpleHomeScreen({ navigation }: any) {
  const [greeting, setGreeting] = useState('');
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Pulse animation for the main action
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case 'create':
        navigation.navigate('Create');
        break;
      case 'voice':
        navigation.navigate('Create', { startWithVoice: true });
        break;
      case 'wallet':
        navigation.navigate('Wallet');
        break;
      case 'help':
        // Open help/chat
        break;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header with large greeting */}
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.subGreeting}>What would you like to do today?</Text>
      </View>

      {/* Main Action - Big and Prominent */}
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          style={styles.mainAction}
          onPress={() => handleAction('create')}
          activeOpacity={0.8}
        >
          <View style={styles.mainActionIcon}>
            <MaterialIcons name="add-a-photo" size={64} color="#FFF" />
          </View>
          <Text style={styles.mainActionText}>Share My Art</Text>
          <Text style={styles.mainActionSubtext}>
            Take a photo and tell its story with your voice
          </Text>
          <View style={styles.mainActionArrow}>
            <MaterialIcons name="arrow-forward" size={32} color="#FFF" />
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Quick Actions Grid */}
      <View style={styles.quickActionsGrid}>
        {MAIN_ACTIONS.slice(1).map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.quickAction, { backgroundColor: action.bgColor }]}
            onPress={() => handleAction(action.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
              <MaterialIcons name={action.icon as any} size={32} color="#FFF" />
            </View>
            <Text style={[styles.quickActionLabel, { color: action.color }]}>
              {action.label}
            </Text>
            <Text style={styles.quickActionDesc}>
              {action.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Activity - Simple List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Artworks</Text>
        
        {/* Empty State */}
        <View style={styles.emptyState}>
          <MaterialIcons name="photo-library" size={64} color="#D2B48C" />
          <Text style={styles.emptyStateText}>
            You haven't shared any art yet
          </Text>
          <Text style={styles.emptyStateSubtext}>
            Tap "Share My Art" above to get started
          </Text>
        </View>
      </View>

      {/* Help Banner */}
      <TouchableOpacity style={styles.helpBanner}>
        <MaterialIcons name="support-agent" size={32} color="#8B4513" />
        <View style={styles.helpBannerText}>
          <Text style={styles.helpBannerTitle}>Need help?</Text>
          <Text style={styles.helpBannerDesc}>
            A Digital Champion is ready to assist you
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#8B4513" />
      </TouchableOpacity>

      {/* Offline Status */}
      <View style={styles.offlineBanner}>
        <MaterialIcons name="wifi-off" size={20} color="#666" />
        <Text style={styles.offlineText}>
          Working offline. Your art will upload when you have internet.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF2F2',  // Light brand red background
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 30,
  },
  greeting: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3E2723',
    marginBottom: 8,
  },
  subGreeting: {
    fontSize: 20,
    color: '#666',
  },
  mainAction: {
    backgroundColor: BRAND_RED,
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  mainActionIcon: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  mainActionText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  mainActionSubtext: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  mainActionArrow: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },
  quickAction: {
    width: (width - 52) / 2,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3E2723',
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  helpBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#D2B48C',
    borderStyle: 'dashed',
  },
  helpBannerText: {
    flex: 1,
    marginLeft: 16,
  },
  helpBannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E2723',
  },
  helpBannerDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  offlineText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
});
