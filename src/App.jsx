import React, { useState } from 'react';
import { Download, Printer } from 'lucide-react';
import RecordForm from './components/RecordForm';
import RecordList from './components/RecordList';
import Filters from './components/Filters';
import useRecords from './hooks/useRecords';

export default function App() {
  const { records, addRecord, removeRecord, updateRecord, clearAll } = useRecords();
  const [filter, setFilter] = useState({ text: '', biz: 'all', dir: 'all' });

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `checklist_records_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const headers = [
      'date','company','newsTitle','businessA','businessB','businessChosen','revenueShare',
      'impactDirection','impactStrength','confidence','buyPlan','sellPlan','watchPlan','notes'
    ];
    const rows = records.map(r => headers.map(h => (r[h] ?? '').toString().replaceAll('"', '""')));
    const csv = [headers.join(','), ...rows.map(row => row.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `checklist_records_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = records.filter((r) => {
    const t = filter.text.trim().toLowerCase();
    const bizOk = filter.biz === 'all' || r.businessChosen === filter.biz;
    const dirOk = filter.dir === 'all' || r.impactDirection === filter.dir;
    const textOk = !t || `${r.company} ${r.newsTitle} ${r.notes}`.toLowerCase().includes(t);
    return bizOk && dirOk && textOk;
  });

  const markReviewed = (id) =>
    updateRecord(id, x => ({
      ...x,
      notes: (x.notes || '') + (x.notes?.includes('✅') ? '' : ' ✅ 已复盘'),
    }));

  return (
    <div className="min-h-screen text-neutral-900 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">通用交易新闻速查卡</h1>
            <p className="text-sm text-neutral-600">遇到新闻，按卡片步骤勾选和打分，强制输出预案与信心指数，并保留复盘记录。</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="px-3 py-2 rounded-xl border bg-white hover:bg-neutral-50 text-sm flex items-center gap-1">
              <Printer size={16}/> 打印
            </button>
            <button onClick={exportCSV} className="px-3 py-2 rounded-xl border bg-white hover:bg-neutral-50 text-sm flex items-center gap-1">
              <Download size={16}/> CSV
            </button>
            <button onClick={exportJSON} className="px-3 py-2 rounded-xl border bg-white hover:bg-neutral-50 text-sm flex items-center gap-1">
              <Download size={16}/> JSON
            </button>
          </div>
        </header>

        <RecordForm onAdd={addRecord} />
        <Filters filter={filter} setFilter={setFilter} onClear={clearAll} />
        <RecordList records={filtered} onRemove={removeRecord} onReview={markReviewed} />

        <footer className="py-6 text-center text-xs text-neutral-500 print:hidden">
          <p>提示：信心≤5默认小仓或观望；仅当“核心业务 + 利好/利空强 + 信心≥7”时，才考虑主动操作与加仓/减仓。</p>
        </footer>
      </div>
    </div>
  );
}
