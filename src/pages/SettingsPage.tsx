import React, { useState } from 'react';

interface SettingsPageProps {
  roommates: number;
  onSetRoommates: (n: number) => void;
  onClearAll: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  roommates, onSetRoommates, onClearAll,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="page">
      <div className="page-inner">
        <div className="section-title">合租设置</div>
        <div className="settings-card">
          <div className="settings-item">
            <div>
              <div className="settings-label">合租人数</div>
              <div className="settings-desc">用于计算每人分摊金额</div>
            </div>
            <div className="stepper">
              <button
                className="stepper-btn"
                onClick={() => onSetRoommates(Math.max(1, roommates - 1))}
                disabled={roommates <= 1}
              >-</button>
              <span className="stepper-value">{roommates}</span>
              <button
                className="stepper-btn"
                onClick={() => onSetRoommates(Math.min(20, roommates + 1))}
                disabled={roommates >= 20}
              >+</button>
            </div>
          </div>
        </div>

        <div className="section-title" style={{ marginTop: 24 }}>数据管理</div>
        <div className="settings-card">
          <div className="settings-item">
            <div>
              <div className="settings-label">存储方式</div>
              <div className="settings-desc">数据保存在浏览器 localStorage</div>
            </div>
            <span style={{ color: 'var(--success)', fontSize: 13, fontWeight: 500 }}>本地存储</span>
          </div>
          <div className="settings-item" style={{ borderBottom: 'none' }}>
            <button
              className="btn-danger"
              style={{ textAlign: 'left', padding: 0 }}
              onClick={() => setShowConfirm(true)}
            >
              清除所有数据
            </button>
          </div>
        </div>

        <div className="section-title" style={{ marginTop: 24 }}>关于</div>
        <div className="settings-card">
          <div className="settings-item">
            <div>
              <div className="settings-label">租房记账本</div>
              <div className="settings-desc">版本 1.0.0 · 纯前端 · 无需登录</div>
            </div>
          </div>
        </div>

        {showConfirm && (
          <div className="confirm-overlay" onClick={() => setShowConfirm(false)}>
            <div className="confirm-box" onClick={e => e.stopPropagation()}>
              <div className="confirm-msg">
                确定要清除所有记账数据吗？<br />此操作不可撤销。
              </div>
              <div className="confirm-actions">
                <button
                  className="confirm-btn confirm-btn-cancel"
                  onClick={() => setShowConfirm(false)}
                >取消</button>
                <button
                  className="confirm-btn confirm-btn-ok"
                  onClick={() => { onClearAll(); setShowConfirm(false); }}
                >确认清除</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
