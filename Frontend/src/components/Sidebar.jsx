import React, { useState } from "react";

function Sidebar({ activeView = 'dashboard', onNavigate = () => {} }) {
  const [openGroups, setOpenGroups] = useState({ services: true, invoices: true });

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const isActive = (view) => activeView === view;
  const isGroupActive = (prefix) => activeView.startsWith(prefix);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <div className="logo-mark"></div>
          </div>
          <div className="logo-text">
            <div className="logo-title">Vault</div>
            <div className="logo-subtitle">Aditya Mishra</div>
          </div>
        </div>
        <button className="header-toggle" aria-label="menu">▾</button>
      </div>

      <nav className="sidebar-nav">
        {/* Dashboard */}
        <button 
          className={`nav-item ${isActive('dashboard') ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          <span className="nav-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="6" height="6" rx="1.5" fill="currentColor"/>
              <rect x="10" y="2" width="6" height="6" rx="1.5" fill="currentColor"/>
              <rect x="2" y="10" width="6" height="6" rx="1.5" fill="currentColor"/>
              <rect x="10" y="10" width="6" height="6" rx="1.5" fill="currentColor"/>
            </svg>
          </span>
          <span className="nav-label">Dashboard</span>
        </button>

        {/* Nexus */}
        <button 
          className={`nav-item ${isActive('nexus') ? 'active' : ''}`}
          onClick={() => onNavigate('nexus')}
        >
          <span className="nav-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="13" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="5" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="13" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="7" y1="5" x2="11" y2="5" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="7" y1="13" x2="11" y2="13" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="5" y1="7" x2="5" y2="11" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="13" y1="7" x2="13" y2="11" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </span>
          <span className="nav-label">Nexus</span>
        </button>

        {/* Intake */}
        <button 
          className={`nav-item ${isActive('intake') ? 'active' : ''}`}
          onClick={() => onNavigate('intake')}
        >
          <span className="nav-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 3V15M9 15L13 11M9 15L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="3" y="13" width="12" height="2" rx="1" fill="currentColor"/>
            </svg>
          </span>
          <span className="nav-label">Intake</span>
        </button>

        {/* Services Group */}
        <div className={`nav-group ${openGroups.services ? 'open' : ''}`}>
          <button 
            className={`nav-item expandable ${isGroupActive('services') ? 'active' : ''}`}
            onClick={() => toggleGroup('services')}
          >
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="14" height="3" rx="1" fill="currentColor"/>
                <rect x="2" y="7.5" width="14" height="3" rx="1" fill="currentColor"/>
                <rect x="2" y="13" width="14" height="3" rx="1" fill="currentColor"/>
              </svg>
            </span>
            <span className="nav-label">Services</span>
            <span className="nav-arrow">▾</span>
          </button>

          {openGroups.services && (
            <div className="nav-submenu">
              <div className="nav-subitems">
                <button 
                  className={`nav-subitem ${isActive('services.preactive') ? 'active' : ''}`}
                  onClick={() => onNavigate('services.preactive')}
                >
                  <span className="nav-icon">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M7 4V7L9.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <span className="nav-label">Pre-active</span>
                </button>

                <button 
                  className={`nav-subitem ${isActive('services.active') ? 'active' : ''}`}
                  onClick={() => onNavigate('services.active')}
                >
                  <span className="nav-icon">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <rect x="4" y="4" width="6" height="6" rx="1" fill="currentColor"/>
                    </svg>
                  </span>
                  <span className="nav-label">Active</span>
                </button>

                <button 
                  className={`nav-subitem ${isActive('services.blocked') ? 'active' : ''}`}
                  onClick={() => onNavigate('services.blocked')}
                >
                  <span className="nav-icon">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <span className="nav-label">Blocked</span>
                </button>

                <button 
                  className={`nav-subitem ${isActive('services.closed') ? 'active' : ''}`}
                  onClick={() => onNavigate('services.closed')}
                >
                  <span className="nav-icon">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M4.5 7L6.5 9L9.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="nav-label">Closed</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Invoices Group */}
        <div className={`nav-group ${openGroups.invoices ? 'open' : ''}`}>
          <button 
            className={`nav-item expandable ${isGroupActive('invoices') ? 'active' : ''}`}
            onClick={() => toggleGroup('invoices')}
          >
            <span className="nav-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 3C4 2.44772 4.44772 2 5 2H13C13.5523 2 14 2.44772 14 3V16L9 13L4 16V3Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </span>
            <span className="nav-label">Invoices</span>
            <span className="nav-arrow">▾</span>
          </button>

          {openGroups.invoices && (
            <div className="nav-submenu">
              <div className="nav-subitems">
                <button 
                  className={`nav-subitem ${isActive('invoices.proforma') ? 'active' : ''}`}
                  onClick={() => onNavigate('invoices.proforma')}
                >
                  <span className="nav-icon">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 2C3 1.44772 3.44772 1 4 1H10C10.5523 1 11 1.44772 11 2V13L7 10.5L3 13V2Z" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="7" cy="5" r="1.5" fill="currentColor"/>
                    </svg>
                  </span>
                  <span className="nav-label">Proforma Invoices</span>
                </button>

                <button 
                  className={`nav-subitem ${isActive('invoices.final') ? 'active' : ''}`}
                  onClick={() => onNavigate('invoices.final')}
                >
                  <span className="nav-icon">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 2C3 1.44772 3.44772 1 4 1H10C10.5523 1 11 1.44772 11 2V13L7 10.5L3 13V2Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M5 5L9 5M5 7L9 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <span className="nav-label">Final Invoices</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;