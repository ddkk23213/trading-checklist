import useLocalStorage from './useLocalStorage';

export const EMPTY_RECORD = {
  date: new Date().toISOString().slice(0, 16),
  company: '',
  newsTitle: '',
  businessA: '',
  businessB: '',
  businessChosen: 'A',
  revenueShare: '>50%',
  impactDirection: 'neutral',
  impactStrength: 'medium',
  confidence: 5,
  buyPlan: '',
  sellPlan: '',
  watchPlan: '',
  notes: ''
};

const KEY = 'trade_checklist_records_v1';

export default function useRecords() {
  const [records, setRecords] = useLocalStorage(KEY, []);

  const addRecord = (record) => setRecords(prev => [record, ...prev]);
  const removeRecord = (id) => setRecords(prev => prev.filter(r => r.id !== id));
  const updateRecord = (id, updater) =>
    setRecords(prev => prev.map(r => (r.id === id ? updater(r) : r)));
  const clearAll = () => setRecords([]);

  return { records, addRecord, removeRecord, updateRecord, clearAll };
}
