import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function WalletScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState(0);
  const [pendingEarnings, setPendingEarnings] = useState(0);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const transactions = [
    { id: 1, type: 'sale', amount: 45.50, item: 'Traditional Beaded Earrings', date: '2024-01-15', status: 'completed' },
    { id: 2, type: 'royalty', amount: 5.20, item: 'Digital Art Print Resale', date: '2024-01-14', status: 'completed' },
    { id: 3, type: 'sale', amount: 120.00, item: 'Handwoven Basket', date: '2024-01-12', status: 'pending' },
  ];

  const renderTransaction = (transaction: any) => (
    <View key={transaction.id} style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <MaterialIcons 
          name={transaction.type === 'sale' ? 'shopping-bag' : 'repeat'} 
          size={24} 
          color="#8B4513" 
        />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{transaction.item}</Text>
        <Text style={styles.transactionDate}>{transaction.date}</Text>
        <Text style={[
          styles.transactionStatus,
          transaction.status === 'pending' && styles.statusPending
        ]}>
          {transaction.status === 'completed' ? 'Completed' : 'Pending'}
        </Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={styles.amountText}>+{transaction.amount} XRP</Text>
        <Text style={styles.amountType}>
          {transaction.type === 'sale' ? 'Sale' : 'Royalty'}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wallet</Text>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>{balance.toFixed(2)} XRP</Text>
        <Text style={styles.balanceUSD}>~${(balance * 0.50).toFixed(2)} USD</Text>
        
        {pendingEarnings > 0 && (
          <View style={styles.pendingContainer}>
            <MaterialIcons name="schedule" size={16} color="#FF9800" />
            <Text style={styles.pendingText}>
              {pendingEarnings.toFixed(2)} XRP pending
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.withdrawButton}>
          <MaterialIcons name="account-balance" size={20} color="#FFF" />
          <Text style={styles.withdrawText}>Withdraw</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Sales This Month</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>Royalties</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>170.70</Text>
          <Text style={styles.statLabel}>Total Earned</Text>
        </View>
      </View>

      {/* Payout Methods */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payout Methods</Text>
        
        <TouchableOpacity style={styles.payoutMethod}>
          <View style={styles.payoutIcon}>
            <MaterialIcons name="account-balance-wallet" size={24} color="#8B4513" />
          </View>
          <View style={styles.payoutDetails}>
            <Text style={styles.payoutName}>Xumm Wallet</Text>
            <Text style={styles.payoutStatus}>Connected</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.addMethod}>
          <MaterialIcons name="add" size={24} color="#8B4513" />
          <Text style={styles.addMethodText}>Add Mobile Money or Bank</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.map(renderTransaction)}
      </View>

      {/* Earnings Info */}
      <View style={styles.infoCard}>
        <MaterialIcons name="info" size={24} color="#8B4513" />
        <View style={styles.infoText}>
          <Text style={styles.infoTitle}>How You Earn</Text>
          <Text style={styles.infoDescription}>
            You receive 92% of every sale. Plus 10% royalties on all resales of your work.
          </Text>
        </View>
      </View>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  balanceCard: {
    backgroundColor: BRAND_RED,
    margin: 16,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
  },
  balanceUSD: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  pendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
  },
  pendingText: {
    color: '#FFF',
    marginLeft: 6,
    fontSize: 14,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
  },
  withdrawText: {
    color: BRAND_RED,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BRAND_RED,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BRAND_RED_DARK,
    marginBottom: 12,
  },
  payoutMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  payoutIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#F5F5DC',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payoutDetails: {
    flex: 1,
    marginLeft: 16,
  },
  payoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3E2723',
  },
  payoutStatus: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 2,
  },
  addMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BRAND_RED,
    borderStyle: 'dashed',
  },
  addMethodText: {
    fontSize: 16,
    color: BRAND_RED,
    marginLeft: 12,
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#F5F5DC',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 16,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3E2723',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  transactionStatus: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
  statusPending: {
    color: '#FF9800',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  amountType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FEE2E2',  // Light brand red
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BRAND_RED_DARK,
  },
  infoDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
