import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';

interface FinancialSummary {
  totalSales: string;
  totalOrders: number;
  netProfit: string;
}

const generateYears = (startYear = 2021) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= startYear; y--) {
    years.push(y.toString());
  }
  return years;
};

const years = generateYears();
const months = [
  { label: 'January', value: '1' },
  { label: 'February', value: '2' },
  { label: 'March', value: '3' },
  { label: 'April', value: '4' },
  { label: 'May', value: '5' },
  { label: 'June', value: '6' },
  { label: 'July', value: '7' },
  { label: 'August', value: '8' },
  { label: 'September', value: '9' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];

const AdminFinancialScreen = () => {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const fetchReport = async (type: 'complete' | 'monthly' | 'yearly') => {
    if (type === 'monthly' && (!year || !month)) {
      Alert.alert('Missing Fields', 'Please select both year and month.');
      return;
    }
    if (type === 'yearly' && !year) {
      Alert.alert('Missing Fields', 'Please select year.');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      let endpoint = '/api/users/financial-reports';
      let body = {};

      if (type === 'monthly') {
        endpoint += '/monthly';
        body = { year, month };
      } else if (type === 'yearly') {
        endpoint += '/yearly';
        body = { year };
      }

      const res = await axios.get(`http://${IP_ADDRESS}:3000${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: body,
      });

      setSummary(res.data.data);
    } catch (err: any) {
      console.error('Financial fetch error:', err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReport('complete');
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Financial Summary</Text>

      <View style={styles.dropdownWrapper}>
        <Text style={styles.label}>Select Year *</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => {
            setShowYearDropdown(!showYearDropdown);
            setShowMonthDropdown(false);
          }}
        >
          <Text style={styles.dropdownText}>{year || 'Select Year'}</Text>
        </TouchableOpacity>
        {showYearDropdown && (
          <View style={{ maxHeight: 150 }}>
            <ScrollView
              style={styles.dropdownList}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
            >
              {years.map((y) => (
                <TouchableOpacity
                  key={y}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setYear(y);
                    setShowYearDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{y}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <View style={styles.dropdownWrapper}>
        <Text style={styles.label}>Select Month *</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => {
            setShowMonthDropdown(!showMonthDropdown);
            setShowYearDropdown(false);
          }}
        >
          <Text style={styles.dropdownText}>
            {months.find((m) => m.value === month)?.label || 'Select Month'}
          </Text>
        </TouchableOpacity>
        {showMonthDropdown && (
          <View style={{ maxHeight: 150 }}>
            <ScrollView
              style={styles.dropdownList}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
            >
              {months.map((m) => (
                <TouchableOpacity
                  key={m.value}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setMonth(m.value);
                    setShowMonthDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button} onPress={() => fetchReport('monthly')}>
          <Text style={styles.buttonText}>Monthly Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => fetchReport('yearly')}>
          <Text style={styles.buttonText}>Yearly Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => fetchReport('complete')}>
          <Text style={styles.secondaryBtnText}>Complete Summary</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={'#2B7A78'} style={styles.sectionSpacing} />
      ) : summary ? (
        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Total Sales</Text>
            <Text style={styles.cardValue}>₹ {parseFloat(summary.totalSales).toFixed(2)}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Total Orders</Text>
            <Text style={styles.cardValue}>{summary.totalOrders}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Net Profit</Text>
            <Text style={styles.cardValue}>₹ {parseFloat(summary.netProfit).toFixed(2)}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.noDataText}>No data available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2B7A78',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionSpacing: {
    marginTop: 30,
  },
  dropdownWrapper: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownList: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: '#f9f9f9',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#444',
  },
  buttonGroup: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#2B7A78',
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  secondaryBtn: {
    backgroundColor: '#3AAFA9',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 5,
  },
  secondaryBtnText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  cardsContainer: {
    marginTop: 25,
    gap: 20,
  },
  card: {
    backgroundColor: '#F1F1F1',
    padding: 18,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#222222',
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 2 },
  },
  cardLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2B7A78',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#555',
  },
});

export default AdminFinancialScreen;
