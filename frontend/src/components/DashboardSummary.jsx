import './DashboardSummary.css';
import { useEffect, useRef, useState } from 'react';

const DashboardSummary = ({ devices }) => {
  const total = devices.length;
  const active = devices.filter(d => d.status === 'active').length;
  const inactive = devices.filter(d => d.status === 'inactive').length;
  const failed = devices.filter(d => d.status === 'failed').length;

  // Animation state for each card
  const [animate, setAnimate] = useState({ total: false, active: false, inactive: false, failed: false });
  const prev = useRef({ total, active, inactive, failed });

  useEffect(() => {
    const changed = {};
    if (prev.current.total !== total) changed.total = true;
    if (prev.current.active !== active) changed.active = true;
    if (prev.current.inactive !== inactive) changed.inactive = true;
    if (prev.current.failed !== failed) changed.failed = true;
    if (Object.keys(changed).length > 0) {
      setAnimate(a => ({ ...a, ...changed }));
      setTimeout(() => {
        setAnimate(a => ({ ...a, ...Object.fromEntries(Object.keys(changed).map(k => [k, false])) }));
      }, 500);
    }
    prev.current = { total, active, inactive, failed };
  }, [total, active, inactive, failed]);

  return (
    <div className="dashboard-summary">
      <div className={`summary-card total${animate.total ? ' animate' : ''}`}> 
        <div className="summary-title">Total Devices</div>
        <div className="summary-value">{total}</div>
      </div>
      <div className={`summary-card active${animate.active ? ' animate' : ''}`}> 
        <div className="summary-title">Active</div>
        <div className="summary-value">{active}</div>
      </div>
      <div className={`summary-card inactive${animate.inactive ? ' animate' : ''}`}> 
        <div className="summary-title">Inactive</div>
        <div className="summary-value">{inactive}</div>
      </div>
      <div className={`summary-card failed${animate.failed ? ' animate' : ''}`}> 
        <div className="summary-title">Failed</div>
        <div className="summary-value">{failed}</div>
      </div>
    </div>
  );
};

export default DashboardSummary; 