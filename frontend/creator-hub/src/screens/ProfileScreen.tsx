import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const user = {
    name: 'Maria Santos',
    tribe: 'Maya',
    country: 'Guatemala',
    artworks: 12,
    sales: 45,
    rating: 4.9
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <MaterialIcons name="person" size={64} color="#8B4513" />
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.tribe}>{user.tribe} • {user.country}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{user.artworks}</Text>
          <Text style={styles.statLabel}>Artworks</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{user.sales}</Text>
          <Text style={styles.statLabel}>Sales</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{user.rating}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <MaterialIcons name="edit" size={24} color="#8B4513" />
          <Text style={styles.menuText}>Edit Profile</Text>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <MaterialIcons name="settings" size={24} color="#8B4513" />
          <Text style={styles.menuText}>Settings</Text>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <MaterialIcons name="help" size={24} color="#8B4513" />
          <Text style={styles.menuText}>Help & Support</Text>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <MaterialIcons name="language" size={24} color="#8B4513" />
          <Text style={styles.menuText}>Language</Text>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Elder Mode Toggle */}
      <View style={styles.elderModeContainer}>
        <View style={styles.elderModeInfo}>
          <MaterialIcons name="accessibility" size={24} color="#8B4513" />
          <View style={styles.elderModeText}>
            <Text style={styles.elderModeTitle}>Elder Mode</Text>
            <Text style={styles.elderModeDescription}>
              Larger text and simplified interface
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.toggle}>
          <View style={styles.toggleOff} />
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton}>
        <MaterialIcons name="logout" size={24} color="#D32F2F" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Brand colors
const BRAND_RED = '#B91C1C';
const BRAND_RED_DARK = '#7F1D1D';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF2F2',  // Light brand red
  },
  header: {
    backgroundColor: BRAND_RED,
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    backgroundColor: '#FFF',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  tribe: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    marginTop: -20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BRAND_RED,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: '#FFF',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#3E2723',
    marginLeft: 16,
  },
  elderModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  elderModeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  elderModeText: {
    marginLeft: 16,
  },
  elderModeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3E2723',
  },
  elderModeDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  toggle: {
    width: 50,
    height: 28,
    backgroundColor: '#E0E0E0',
    borderRadius: 14,
    padding: 2,
  },
  toggleOff: {
    width: 24,
    height: 24,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
    marginLeft: 8,
  },
});
