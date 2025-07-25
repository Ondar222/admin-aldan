import React, { useState, useEffect } from "react";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { PaymentSystem } from "./components/PaymentSystem";
import { Settings } from "./components/Settings";
import { CertificateManager } from "./components/CertificateManager";
import { CertificateWidgetTest } from "./components/CertificateWidgetTest";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { useAuth } from "./hooks/useAuth";
import { useAuth as useAuthContext } from "./contexts/AuthContext";
import { AuthProvider } from "./contexts/AuthContext";
import "./styles/App.css";

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const { user: authUser } = useAuthContext();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect managers away from widget-test tab
  useEffect(() => {
    if (activeTab === "widget-test" && authUser?.role !== "admin") {
      setActiveTab("dashboard");
    }
  }, [activeTab, authUser?.role]);

  // Redirect managers away from payments tab
  useEffect(() => {
    if (activeTab === "payments" && authUser?.role !== "admin") {
      setActiveTab("dashboard");
    }
  }, [activeTab, authUser?.role]);

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "payments":
        // Показываем платежи только супер админам
        if (authUser?.role === "admin") {
          return <PaymentSystem />;
        } else {
          // Если менеджер попытается перейти к платежам, перенаправляем на dashboard
          setActiveTab("dashboard");
          return <Dashboard />;
        }
      case "certificates":
        return <CertificateManager />;
      case "widget-test":
        // Показываем виджет только супер админам
        if (authUser?.role === "admin") {
          return <CertificateWidgetTest />;
        } else {
          // Если менеджер попытается перейти к виджету, перенаправляем на dashboard
          setActiveTab("dashboard");
          return <Dashboard />;
        }
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="app-main">
        <Header
          user={user}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <main className="app-content">{renderContent()}</main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
