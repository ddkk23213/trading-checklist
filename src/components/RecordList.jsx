import React from 'react';
import { CheckCircle, Trash2 } from 'lucide-react';

const impactLabel = (dir) =>
  dir === 'bull' ? '利好' : dir === 'bear' ? '利空' : '中性';

export default function RecordList({ records, onRemove, onReview }) {
  if (records.length === 0) {
    return (
      <p className="text-sm text-neutral-500">
        暂无记录。保存一条后，这里会显示你的历史判断与预案。
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {records.map((r) => (
        <div
          key={r.id}
          className="rounded-2xl border p-4 bg-white flex flex-col md:flex-row md:items-start gap-4"
        >
          <div className="md:w-1/2 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold">{r.company}</h3>
              <span className="px-2 py-1 rounded-full bg-neutral-100 text-xs">
                {r.businessChosen === 'A'
                  ? r.businessA || '业务A'
                  : r.businessChosen === 'B'
                  ? r.businessB || '业务B'
                  : '其他'}
              </span>
              <span className="px-2 py-1 rounded-full bg-neutral-100 text-xs">
                {r.revenueShare}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  r.impactDirection === 'bull'
                    ? 'bg-green-100 text-green-700'
                    : r.impactDirection === 'bear'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-neutral-100'
                }`}
              >
                {impactLabel(r.impactDirection)}
              </span>
              <span className="px-2 py-1 rounded-full border text-xs">
                强度：{r.impactStrength === 'large' ? '大' : r.impactStrength === 'small' ? '小' : '中'}
              </span>
              <span className="px-2 py-1 rounded-full border text-xs">
                信心：{r.confidence}
              </span>
            </div>
            <div className="text-sm text-neutral-700">{r.newsTitle}</div>
            <div className="text-xs text-neutral-500">
              {new Date(r.date).toLocaleString()}
            </div>
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
            <button
              onClick={() => onReview(r.id)}
              className="px-3 py-2 rounded-xl border bg-white hover:bg-neutral-50 text-sm flex items-center gap-1"
            >
              <CheckCircle size={16} /> 复盘
            </button>
            <button
              onClick={() => onRemove(r.id)}
              className="px-3 py-2 rounded-xl bg-red-600 text-white text-sm flex items-center gap-1"
            >
              <Trash2 size={16} /> 删除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
