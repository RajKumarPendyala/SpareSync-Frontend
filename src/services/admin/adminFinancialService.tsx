import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';

interface FinancialSummary {
  totalSales: string;
  totalOrders: number;
  netProfit: string;
}

type ReportType = 'complete' | 'monthly' | 'yearly';

interface FetchReportParams {
  type: ReportType;
  year?: string;
  month?: string;
}

export const fetchFinancialReport = async ({
  type,
  year,
  month,
}: FetchReportParams): Promise<FinancialSummary> => {
  if (type === 'monthly' && (!year)) {
    throw new Error('Please select year.');
  }if (type === 'monthly' && (month === '0' || !month)) {
    throw new Error('Please select month.');
  }
  if (type === 'yearly' && !year) {
    throw new Error('Please select year.');
  }

  const token = await AsyncStorage.getItem('token');
  let endpoint = '/api/users/financial-reports';
  let params: any = {};

  if (type === 'monthly') {
    endpoint += '/monthly';
    params = { year, month };
  } else if (type === 'yearly') {
    endpoint += '/yearly';
    params = { year };
  }

  const res = await axios.get(`http://${IP_ADDRESS}:3000${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

  return res.data.data;
};
