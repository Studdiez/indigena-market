import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Indigena</Text>
        <Text style={styles.tagline}>Creator Hub</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Create</Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('CreateNFT')}
        >
          <MaterialIcons name="add-photo-alternate" size={32} color="#8B4513" />
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>New Artwork</Text>
            <Text style={styles.actionSubtitle}>Photo + Voice Story</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('MyArtworks')}
        >
          <MaterialIcons name="collections" size={32} color="#8B4513" />
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>My Artworks</Text>
            <Text style={styles.actionSubtitle}>View and manage listings</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Wallet')}
        >
          <MaterialIcons name="account-balance-wallet" size={32} color="#8B4513" />
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>My Wallet</Text>
            <Text style={styles.actionSubtitle}>Balance and withdrawals</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Your Impact</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Artworks</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Sales</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>XRP Earned</Text>
          </View>
        </View>
      </View>

      {/* Offline Notice */}
      <View style={styles.offlineNotice}>
        <MaterialIcons name="wifi-off" size={20} color="#666" />
        <Text style={styles.offlineText}>
          Offline mode active. Your uploads will sync when you connect.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  header: {
    backgroundColor: '#8B4513',
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  tagline: {
    fontSize: 16,
    color: '#F5F5DC',
    marginTop: 4,
  },
  actionsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3E2723',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3E2723',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statsContainer: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
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
    color: '#8B4513',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  offlineNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8D5C4',
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  offlineText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
});
