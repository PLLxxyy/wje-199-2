import React from 'react';

interface TabBarProps {
  active: string;
  onChange: (tab: string) => void;
}

interface TabDef {
  id: string;
  icon: string;
  label: string;
}

const TABS: TabDef[] = [
  { id: 'home', icon: '🏠', label: '首页' },
  { id: 'stats', icon: '📊', label: '统计' },
  { id: 'yearly', icon: '📈', label: '年度' },
  { id: 'settings', icon: '⚙️', label: '设置' },
];

export const TabBar: React.FC<TabBarProps> = ({ active, onChange }) => {
  return (
    <div className="tab-bar">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`tab-item ${active === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};
