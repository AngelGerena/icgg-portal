import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Icon } from './Icon';

/* ---------------- Toast ---------------- */
interface Toast { id: number; msg: string; kind: 'default' | 'ok' | 'err'; }
interface ToastCtx { push: (msg: string, kind?: Toast['kind']) => void; }
const ToastContext = createContext<ToastCtx>({ push: () => {} });
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((msg: string, kind: Toast['kind'] = 'default') => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2800);
  }, []);
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.kind}`}>
            <Icon name={t.kind === 'err' ? 'x' : t.kind === 'ok' ? 'check' : 'sparkle'} size={16} stroke={2} />
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ---------------- Modal ---------------- */
export function Modal({ title, eyebrow, wide, onClose, children, footer }: {
  title: string; eyebrow?: string; wide?: boolean; onClose: () => void;
  children: ReactNode; footer?: ReactNode;
}) {
  return (
    <div className="modal-back" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`modal ${wide ? 'wide' : ''}`}>
        <div className="modal-head">
          <div>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h3 style={{ marginTop: eyebrow ? '.3rem' : 0 }}>{title}</h3>
          </div>
          <button className="x" onClick={onClose} aria-label="Close"><Icon name="x" size={17} stroke={2} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

/* ---------------- Toggle switch ---------------- */
export function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button className={`tsw ${on ? 'on' : ''}`} onClick={onClick} aria-label="toggle" role="switch" aria-checked={on}>
      <span className="tsw-knob" />
    </button>
  );
}

/* ---------------- Empty state ---------------- */
export function Empty({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="card">
      <div className="empty">
        <Icon name={icon} size={52} stroke={1.3} className="ei" />
        <h4>{title}</h4>
        <p>{sub}</p>
      </div>
    </div>
  );
}
