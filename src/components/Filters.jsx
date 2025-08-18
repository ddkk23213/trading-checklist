import React from 'react';
import { Search } from 'lucide-react';
import { BUSINESS_TYPES, IMPACT_DIRECTIONS } from '../constants/options';

export default function Filters({ filter, setFilter, onClear }) {
  return (
    <div className="shadow-sm rounded-2xl border bg-white p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-end gap-3">
        <div className="grow">
          <label className="text-sm">搜索</label>
          <div className="mt-1 flex items-center gap-2">
            <Search size={16} className="text-neutral-500" />
            <input
              placeholder="按公司/标题/备注筛选"
              value={filter.text}
              onChange={e => setFilter({ ...filter, text: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>
        </div>
        <div className="w-full md:w-40">
          <label className="text-sm">按业务</label>
          <select
            value={filter.biz}
            onChange={e => setFilter({ ...filter, biz: e.target.value })}
            className="w-full mt-1 px-3 py-2 border rounded-xl"
          >
            <option value="all">全部</option>
            {BUSINESS_TYPES.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-40">
          <label className="text-sm">按方向</label>
          <select
            value={filter.dir}
            onChange={e => setFilter({ ...filter, dir: e.target.value })}
            className="w-full mt-1 px-3 py-2 border rounded-xl"
          >
            <option value="all">全部</option>
            {IMPACT_DIRECTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 md:ml-auto">
          <button
            onClick={onClear}
            className="px-3 py-2 rounded-xl bg-red-600 text-white text-sm flex items-center gap-1"
          >
            清空记录
          </button>
        </div>
      </div>
    </div>
  );
}
