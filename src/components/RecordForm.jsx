import React, { useMemo, useState } from 'react';
import { PlusCircle, RefreshCcw } from 'lucide-react';
import {
  REVENUE_SHARE_OPTIONS,
  IMPACT_DIRECTIONS,
  BUSINESS_TYPES,
  IMPACT_STRENGTH_OPTIONS
} from '../constants/options';
import { EMPTY_RECORD } from '../hooks/useRecords';

export default function RecordForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY_RECORD);

  const confidenceHint = useMemo(() => {
    const c = Number(form.confidence || 0);
    if (c >= 9) return '依据：公告/财报、公司确认、合同落地等硬证据';
    if (c >= 6) return '依据：多家权威媒体、渠道互相印证，细节清晰';
    if (c >= 4) return '依据：市场传闻/单一来源，需谨慎，严格控制仓位';
    return '依据：极度不确定，默认观望或小样本跟踪';
  }, [form.confidence]);

  const addRecord = () => {
    if (!form.company.trim()) return alert('请填写公司名称');
    if (!form.newsTitle.trim()) return alert('请填写新闻标题或摘要');
    const rec = { id: crypto.randomUUID(), ...form };
    onAdd(rec);
    setForm({ ...EMPTY_RECORD, date: new Date().toISOString().slice(0, 16) });
  };

  return (
    <div className="shadow-sm rounded-2xl border bg-white p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm">时间</label>
          <input
            type="datetime-local"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className="w-full mt-1 px-3 py-2 border rounded-xl"
          />
        </div>
        <div>
          <label className="text-sm">公司</label>
          <input
            placeholder="如：比亚迪 / 特斯拉 / 贵州茅台"
            value={form.company}
            onChange={e => setForm({ ...form, company: e.target.value })}
            className="w-full mt-1 px-3 py-2 border rounded-xl"
          />
        </div>
      </div>

      <div>
        <label className="text-sm">新闻标题/摘要</label>
        <input
          placeholder="简述新闻，如：苹果或更换摄像头模组供应商"
          value={form.newsTitle}
          onChange={e => setForm({ ...form, newsTitle: e.target.value })}
          className="w-full mt-1 px-3 py-2 border rounded-xl"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm">业务A</label>
          <input
            placeholder="如：汽车业务"
            value={form.businessA}
            onChange={e => setForm({ ...form, businessA: e.target.value })}
            className="w-full mt-1 px-3 py-2 border rounded-xl"
          />
        </div>
        <div>
          <label className="text-sm">业务B</label>
          <input
            placeholder="如：手机/零部件业务"
            value={form.businessB}
            onChange={e => setForm({ ...form, businessB: e.target.value })}
            className="w-full mt-1 px-3 py-2 border rounded-xl"
          />
        </div>
        <div>
          <label className="text-sm">归类</label>
          <select
            value={form.businessChosen}
            onChange={e => setForm({ ...form, businessChosen: e.target.value })}
            className="w-full mt-1 px-3 py-2 border rounded-xl"
          >
            {BUSINESS_TYPES.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm">收入占比</label>
          <select
            value={form.revenueShare}
            onChange={e => setForm({ ...form, revenueShare: e.target.value })}
            className="w-full mt-1 px-3 py-2 border rounded-xl"
          >
            {REVENUE_SHARE_OPTIONS.map(opt => (
              <option key={opt} value={opt}>
                {opt === '>50%' ? '大于50%（核心）' : opt === '20-50%' ? '20%–50%（重要）' : '小于20%（次要）'}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm">影响方向</label>
          <select
            value={form.impactDirection}
            onChange={e => setForm({ ...form, impactDirection: e.target.value })}
            className="w-full mt-1 px-3 py-2 border rounded-xl"
          >
            {IMPACT_DIRECTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm">影响强度</label>
          <select
            value={form.impactStrength}
            onChange={e => setForm({ ...form, impactStrength: e.target.value })}
            className="w-full mt-1 px-3 py-2 border rounded-xl"
          >
            {IMPACT_STRENGTH_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <div>
          <label className="text-sm">信心指数：{form.confidence}</label>
          <input
            type="range"
            min={1}
            max={10}
            value={form.confidence}
            onChange={e => setForm({ ...form, confidence: Number(e.target.value) })}
            className="w-full mt-1"
          />
          <p className="text-xs text-neutral-600 mt-1">{confidenceHint}</p>
        </div>
        <div>
          <label className="text-sm">买入区间</label>
          <input
            placeholder="例如：跌破X，或Y以下分批买入"
            value={form.buyPlan}
            onChange={e => setForm({ ...form, buyPlan: e.target.value })}
            className="w-full mt-1 px-3 py-2 border rounded-xl"
          />
        </div>
        <div>
          <label className="text-sm">卖出区间</label>
          <input
            placeholder="例如：上涨到Z，或触发止损止盈条件"
            value={form.sellPlan}
            onChange={e => setForm({ ...form, sellPlan: e.target.value })}
            className="w-full mt-1 px-3 py-2 border rounded-xl"
          />
        </div>
      </div>

      <div>
        <label className="text-sm">观望条件 / 备注</label>
        <textarea
          rows="3"
          placeholder="例如：等待二次确认、看公司说明会、看量价配合"
          value={form.watchPlan}
          onChange={e => setForm({ ...form, watchPlan: e.target.value })}
          className="w-full mt-1 px-3 py-2 border rounded-xl"
        ></textarea>
      </div>

      <div>
        <label className="text-sm">补充说明（可选）</label>
        <textarea
          rows="3"
          placeholder="记录你的逻辑假设与关键证据，便于事后复盘"
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
          className="w-full mt-1 px-3 py-2 border rounded-xl"
        ></textarea>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={addRecord}
          className="px-3 py-2 rounded-xl bg-black text-white text-sm flex items-center gap-1"
        >
          <PlusCircle size={16} /> 保存记录
        </button>
        <button
          onClick={() => setForm({ ...EMPTY_RECORD, date: new Date().toISOString().slice(0, 16) })}
          className="px-3 py-2 rounded-xl border bg-white hover:bg-neutral-50 text-sm flex items-center gap-1"
        >
          <RefreshCcw size={16} /> 重置表单
        </button>
      </div>
    </div>
  );
}
