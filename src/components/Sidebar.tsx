import React from "react";
import {
  LayoutDashboard,
  Award,
  CreditCard,
  Settings,
  LogOut,
  Gift,
  Code,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import "../styles/Sidebar.css";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const { logout } = useAuth();

  const menuItems = [
    { id: "dashboard", label: "Панель управления", icon: LayoutDashboard },
    { id: "payments", label: "Платежи", icon: CreditCard },
    { id: "certificates", label: "Сертификаты", icon: Gift },
    { id: "widget-test", label: "Виджет", icon: Code },
    { id: "settings", label: "Настройки", icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    // Close mobile menu when tab is clicked
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Админ панель</h2>
          <p className="sidebar-subtitle">Система управления клиникой</p>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`sidebar-button ${
                  activeTab === item.id ? "active" : ""
                }`}
              >
                <Icon className="sidebar-icon" />
                <span className="sidebar-button-text">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button onClick={logout} className="logout-button">
            <LogOut className="logout-icon" />
            <span className="logout-text">Выйти</span>
          </button>
        </div>
      </div>
    </>
  );
};
