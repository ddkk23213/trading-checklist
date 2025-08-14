import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle, Trash2, Download, Printer, PlusCircle, RefreshCcw, Search } from "lucide-react";

const KEY = "trade_checklist_records_v1";

const emptyForm = {
  date: new Date().toISOString().slice(0, 16),
  company: "",
  newsTitle: "",
  businessA: "",
  businessB: "",
  businessChosen: "A",
  revenueShare: ">50%",
  impactDirection: "neutral",
  impactStrength: "medium",
  confidence: 5,
  buyPlan: "",
  sellPlan: "",
  watchPlan: "",
  notes: "",
};

export default function App() {
  const [form, setForm] = useState(emptyForm);
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState({ text: "", biz: "all", dir: "all" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setRecords(JSON.parse(raw));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(records));
    } catch (e) {}
  }, [records]);

  const confidenceHint = useMemo(() => {
    const c = Number(form.confidence || 0);
    if (c >= 9) return "依据：公告/财报、公司确认、合同落地等硬证据";
    if (c >= 6) return "依据：多家权威媒体、渠道互相印证，细节清晰";
    if (c >= 4) return "依据：市场传闻/单一来源，需谨慎，严格控制仓位";
    return "依据：极度不确定，默认观望或小样本跟踪";
  }, [form.confidence]);

  const impactLabel = (dir) => dir === "bull" ? "利好" : dir === "bear" ? "利空" : "中性";

  const addRecord = () => {
    if (!form.company.trim()) return alert("请填写公司名称");
    if (!form.newsTitle.trim()) return alert("请填写新闻标题或摘要");
    const rec = { id: crypto.randomUUID(), ...form };
    setRecords([rec, ...records]);
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 16) });
  };

  const removeRecord = (id) => setRecords(records.filter(r => r.id !== id));
  const clearAll = () => {
    if (confirm("确定要清空所有记录吗？此操作不可撤销。")) setRecords([]);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `checklist_records_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const headers = [
      "date","company","newsTitle","businessA","businessB","businessChosen","revenueShare",
      "impactDirection","impactStrength","confidence","buyPlan","sellPlan","watchPlan","notes"
    ];
    const rows = records.map((r) => headers.map(h => (r[h] ?? "").toString().replaceAll('"', '""')));
    const csv = [headers.join(","), ...rows.map(row => row.map(v => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `checklist_records_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = records.filter((r) => {
    const t = filter.text.trim().toLowerCase();
    const bizOk = filter.biz === "all" || r.businessChosen === filter.biz;
    const dirOk = filter.dir === "all" || r.impactDirection === filter.dir;
    const textOk = !t || `${r.company} ${r.newsTitle} ${r.notes}`.toLowerCase().includes(t);
    return bizOk && dirOk && textOk;
  });

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

        <div className="shadow-sm rounded-2xl border bg-white p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">时间</label>
              <input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                     className="w-full mt-1 px-3 py-2 border rounded-xl"/>
            </div>
            <div>
              <label className="text-sm">公司</label>
              <input placeholder="如：比亚迪 / 特斯拉 / 贵州茅台" value={form.company}
                     onChange={e => setForm({ ...form, company: e.target.value })}
                     className="w-full mt-1 px-3 py-2 border rounded-xl"/>
            </div>
          </div>

          <div>
            <label className="text-sm">新闻标题/摘要</label>
            <input placeholder="简述新闻，如：苹果或更换摄像头模组供应商" value={form.newsTitle}
                   onChange={e => setForm({ ...form, newsTitle: e.target.value })}
                   className="w-full mt-1 px-3 py-2 border rounded-xl"/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm">业务A</label>
              <input placeholder="如：汽车业务" value={form.businessA}
                     onChange={e => setForm({ ...form, businessA: e.target.value })}
                     className="w-full mt-1 px-3 py-2 border rounded-xl"/>
            </div>
            <div>
              <label className="text-sm">业务B</label>
              <input placeholder="如：手机/零部件业务" value={form.businessB}
                     onChange={e => setForm({ ...form, businessB: e.target.value })}
                     className="w-full mt-1 px-3 py-2 border rounded-xl"/>
            </div>
            <div>
              <label className="text-sm">归类</label>
              <select value={form.businessChosen} onChange={e => setForm({ ...form, businessChosen: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border rounded-xl">
                <option value="A">业务A</option>
                <option value="B">业务B</option>
                <option value="other">其他</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm">收入占比</label>
              <select value={form.revenueShare} onChange={e => setForm({ ...form, revenueShare: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border rounded-xl">
                <option value=">50%">大于50%（核心）</option>
                <option value="20-50%">20%–50%（重要）</option>
                <option value="<20%">小于20%（次要）</option>
              </select>
            </div>
            <div>
              <label className="text-sm">影响方向</label>
              <select value={form.impactDirection} onChange={e => setForm({ ...form, impactDirection: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border rounded-xl">
                <option value="bull">利好</option>
                <option value="bear">利空</option>
                <option value="neutral">中性</option>
              </select>
            </div>
            <div>
              <label className="text-sm">影响强度</label>
              <select value={form.impactStrength} onChange={e => setForm({ ...form, impactStrength: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border rounded-xl">
                <option value="large">大</option>
                <option value="medium">中</option>
                <option value="small">小</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div>
              <label className="text-sm">信心指数：{form.confidence}</label>
              <input type="range" min={1} max={10} value={form.confidence}
                     onChange={e => setForm({ ...form, confidence: Number(e.target.value) })}
                     className="w-full mt-1"/>
              <p className="text-xs text-neutral-600 mt-1">{confidenceHint}</p>
            </div>
            <div>
              <label className="text-sm">买入区间</label>
              <input placeholder="例如：跌破X，或Y以下分批买入" value={form.buyPlan}
                     onChange={e => setForm({ ...form, buyPlan: e.target.value })}
                     className="w-full mt-1 px-3 py-2 border rounded-xl"/>
            </div>
            <div>
              <label className="text-sm">卖出区间</label>
              <input placeholder="例如：上涨到Z，或触发止损止盈条件" value={form.sellPlan}
                     onChange={e => setForm({ ...form, sellPlan: e.target.value })}
                     className="w-full mt-1 px-3 py-2 border rounded-xl"/>
            </div>
          </div>

          <div>
            <label className="text-sm">观望条件 / 备注</label>
            <textarea rows="3" placeholder="例如：等待二次确认、看公司说明会、看量价配合" value={form.watchPlan}
                      onChange={e => setForm({ ...form, watchPlan: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border rounded-xl"></textarea>
          </div>

          <div>
            <label className="text-sm">补充说明（可选）</label>
            <textarea rows="3" placeholder="记录你的逻辑假设与关键证据，便于事后复盘" value={form.notes}
                      onChange={e => setForm({ ...form, notes: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border rounded-xl"></textarea>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={addRecord} className="px-3 py-2 rounded-xl bg-black text-white text-sm flex items-center gap-1">
              <PlusCircle size={16}/> 保存记录
            </button>
            <button onClick={() => setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 16) })}
                    className="px-3 py-2 rounded-xl border bg-white hover:bg-neutral-50 text-sm flex items-center gap-1">
              <RefreshCcw size={16}/> 重置表单
            </button>
          </div>
        </div>

        <div className="shadow-sm rounded-2xl border bg-white p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end gap-3">
            <div className="grow">
              <label className="text-sm">搜索</label>
              <div className="mt-1 flex items-center gap-2">
                <Search size={16} className="text-neutral-500"/>
                <input placeholder="按公司/标题/备注筛选" value={filter.text}
                       onChange={e => setFilter({ ...filter, text: e.target.value })}
                       className="w-full px-3 py-2 border rounded-xl"/>
              </div>
            </div>
            <div className="w-full md:w-40">
              <label className="text-sm">按业务</label>
              <select value={filter.biz} onChange={e => setFilter({ ...filter, biz: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border rounded-xl">
                <option value="all">全部</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div className="w-full md:w-40">
              <label className="text-sm">按方向</label>
              <select value={filter.dir} onChange={e => setFilter({ ...filter, dir: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border rounded-xl">
                <option value="all">全部</option>
                <option value="bull">利好</option>
                <option value="bear">利空</option>
                <option value="neutral">中性</option>
              </select>
            </div>
            <div className="flex gap-2 md:ml-auto">
              <button onClick={clearAll} className="px-3 py-2 rounded-xl bg-red-600 text-white text-sm flex items-center gap-1">
                <Trash2 size={16}/> 清空记录
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filtered.length === 0 && (
              <p className="text-sm text-neutral-500">暂无记录。保存一条后，这里会显示你的历史判断与预案。</p>
            )}

            {filtered.map((r) => (
              <div key={r.id} className="rounded-2xl border p-4 bg-white flex flex-col md:flex-row md:items-start gap-4">
                <div className="md:w-1/2 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{r.company}</h3>
                    <span className="px-2 py-1 rounded-full bg-neutral-100 text-xs">
                      {r.businessChosen === 'A' ? r.businessA || '业务A' : r.businessChosen === 'B' ? r.businessB || '业务B' : '其他'}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-neutral-100 text-xs">{r.revenueShare}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      r.impactDirection === 'bull' ? 'bg-green-100 text-green-700' :
                      r.impactDirection === 'bear' ? 'bg-red-100 text-red-700' : 'bg-neutral-100'
                    }`}>
                      {impactLabel(r.impactDirection)}
                    </span>
                    <span className="px-2 py-1 rounded-full border text-xs">强度：{r.impactStrength === 'large' ? '大' : r.impactStrength === 'small' ? '小' : '中'}</span>
                    <span className="px-2 py-1 rounded-full border text-xs">信心：{r.confidence}</span>
                  </div>
                  <div className="text-sm text-neutral-700">{r.newsTitle}</div>
                  <div className="text-xs text-neutral-500">{new Date(r.date).toLocaleString()}</div>
                </div>
                <div className="md:flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="p-3 bg-neutral-50 rounded-xl border">
                    <div className="font-medium mb-1">买入</div>
                    <div className="whitespace-pre-wrap">{r.buyPlan || '—'}</div>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border">
                    <div className="font-medium mb-1">卖出</div>
                    <div className="whitespace-pre-wrap">{r.sellPlan || '—'}</div>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border">
                    <div className="font-medium mb-1">观望/备注</div>
                    <div className="whitespace-pre-wrap">{r.watchPlan || '—'}</div>
                  </div>
                </div>
                <div className="md:w-32 flex md:flex-col gap-2 md:items-stretch">
                  <button onClick={() => {
                    const updated = records.map((x) => x.id === r.id ? { ...x, notes: (x.notes || "") + (x.notes?.includes('✅') ? '' : ' ✅ 已复盘') } : x);
                    setRecords(updated);
                  }} className="px-3 py-2 rounded-xl border bg-white hover:bg-neutral-50 text-sm flex items-center gap-1">
                    <CheckCircle size={16}/> 复盘
                  </button>
                  <button onClick={() => removeRecord(r.id)} className="px-3 py-2 rounded-xl bg-red-600 text-white text-sm flex items-center gap-1">
                    <Trash2 size={16}/> 删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="py-6 text-center text-xs text-neutral-500 print:hidden">
          <p>提示：信心≤5默认小仓或观望；仅当“核心业务 + 利好/利空强 + 信心≥7”时，才考虑主动操作与加仓/减仓。</p>
        </footer>
      </div>
    </div>
  );
}
