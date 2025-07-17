import React from "react";
import { Bell, Search, User, Menu, X } from "lucide-react";
import "../styles/Header.css";

interface HeaderProps {
  user: any;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Mobile menu button */}
        <button
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="menu-icon" />
          ) : (
            <Menu className="menu-icon" />
          )}
        </button>

        <div className="header-search-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Поиск..."
              className="search-input"
            />
          </div>
        </div>

        <div className="header-actions">
          <button className="notification-button">
            <Bell className="notification-icon" />
            <span className="notification-badge">3</span>
          </button>

          <div className="user-profile">
            <div className="user-info">
              <p className="user-name">{user?.name}</p>
              <p className="user-role">
                {user?.role === "admin" ? "Администратор" : "Менеджер"}
              </p>
            </div>
            <div className="user-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="avatar-image" />
              ) : (
                <User className="avatar-icon" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
