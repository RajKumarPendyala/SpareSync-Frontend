import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../../styles/admin/adminFinancialScreenStyle';
import { fetchFinancialReport } from '../../services/admin/adminFinancialService';

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
  { label: 'None', value: '0' },
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
    try {
      setLoading(true);
      const data = await fetchFinancialReport({ type, year, month });
      setSummary(data);
    } catch (err: any) {
      Alert.alert('Fail', err.message || 'Failed to fetch report');
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
          <View>
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
          <View>
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

export default AdminFinancialScreen;
