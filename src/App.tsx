import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminLogin from "./components/auth/AdminLogin";
import UserLogin from "./components/auth/UserLogin";
import CustomerLogin from "./components/auth/CustomerLogin";
import AdminOTP from "./components/auth/AdminOTP";
import UserOTP from "./components/auth/UserOTP";
import CustomerOTP from "./components/auth/CustomerOTP";
import CreateAdminAccount from "./components/auth/CreateAdminAccount";
import AccountCreatedSuccess from "./components/auth/AccountCreatedSuccess";
import ForgotPassword from "./components/auth/ForgotPassword";
import Dashboard from "./components/Dashboard";
import CustomerDashboard from "./components/CustomerDashboard";
import CustomerProfile from "./components/CustomerProfile";
import AddPurchase from "./components/AddPurchase";
import AddSale from "./components/AddSale";
import ViewAllPurchases from "./components/ViewAllPurchases";
import CustomerLedger from "./components/CustomerLedger";
import Transactions from "./components/Transactions";
import Reports from "./components/Reports";
import Profile from "./components/Profile";
import CreateAccounts from "./components/CreateAccounts";
import Layout from "./components/Layout";
import ChatbotButton from "./components/ChatbotButton";

type AuthStep =
  | "login"
  | "otp"
  | "authenticated"
  | "createAdmin"
  | "adminCreated"
  | "forgotPassword";
type UserRole = "admin" | "user" | "customer";

interface CreatedAdminData {
  id: string;
  password: string;
}

export default function App() {
  const [authStep, setAuthStep] = useState<AuthStep>("login");
  const [loginType, setLoginType] = useState<UserRole>("admin");
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [createdAdminData, setCreatedAdminData] =
    useState<CreatedAdminData | null>(null);

  if (authStep === "createAdmin") {
    return (
      <CreateAdminAccount
        onSuccess={(data) => {
          setCreatedAdminData(data);
          setAuthStep("adminCreated");
        }}
        onBack={() => setAuthStep("login")}
      />
    );
  }

  if (authStep === "adminCreated" && createdAdminData) {
    return (
      <AccountCreatedSuccess
        accountType="admin"
        accountId={createdAdminData.id}
        password={createdAdminData.password}
        onGoToLogin={() => {
          setAuthStep("login");
          setLoginType("admin");
          setCreatedAdminData(null);
        }}
      />
    );
  }

  if (authStep === "forgotPassword") {
    return (
      <ForgotPassword onBack={() => setAuthStep("login")} />
    );
  }

  if (authStep === "login") {
    return (
      <>
        {loginType === "admin" ? (
          <AdminLogin
            onNext={() => setAuthStep("otp")}
            onSwitchToUser={() => setLoginType("user")}
            onSwitchToCustomer={() => setLoginType("customer")}
            onCreateAccount={() => setAuthStep("createAdmin")}
            onForgotPassword={() =>
              setAuthStep("forgotPassword")
            }
          />
        ) : loginType === "user" ? (
          <UserLogin
            onNext={() => setAuthStep("otp")}
            onSwitchToAdmin={() => setLoginType("admin")}
            onSwitchToCustomer={() => setLoginType("customer")}
          />
        ) : (
          <CustomerLogin
            onNext={() => setAuthStep("otp")}
            onSwitchToAdmin={() => setLoginType("admin")}
            onSwitchToUser={() => setLoginType("user")}
          />
        )}
      </>
    );
  }

  if (authStep === "otp") {
    return (
      <>
        {loginType === "admin" ? (
          <AdminOTP
            onVerified={() => {
              setUserRole("admin");
              setAuthStep("authenticated");
            }}
            onBack={() => setAuthStep("login")}
          />
        ) : loginType === "user" ? (
          <UserOTP
            onVerified={() => {
              setUserRole("user");
              setAuthStep("authenticated");
            }}
            onBack={() => setAuthStep("login")}
          />
        ) : (
          <CustomerOTP
            onVerified={() => {
              setUserRole("customer");
              setAuthStep("authenticated");
            }}
            onBack={() => setAuthStep("login")}
          />
        )}
      </>
    );
  }

  // Customer gets their own dashboard without Layout
  if (userRole === "customer") {
    return (
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <CustomerDashboard
                onLogout={() => {
                  setAuthStep("login");
                  setLoginType("customer");
                }}
              />
            }
          />
          <Route
            path="/customer-profile"
            element={
              <CustomerProfile
                onLogout={() => {
                  setAuthStep("login");
                  setLoginType("customer");
                }}
              />
            }
          />
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
        <ChatbotButton />
      </Router>
    );
  }

  return (
    <Router>
      <Layout
        userRole={userRole}
        onRoleSwitch={(role) => {
          setUserRole(role);
          setLoginType(role);
        }}
        onLogout={() => {
          setAuthStep("login");
          setLoginType("admin");
        }}
      >
        <Routes>
          <Route
            path="/"
            element={<Dashboard userRole={userRole} />}
          />
          {userRole === "admin" && (
            <>
              <Route
                path="/add-purchase"
                element={<AddPurchase />}
              />
              <Route path="/add-sale" element={<AddSale />} />
              <Route
                path="/view-all-purchases"
                element={<ViewAllPurchases />}
              />
              <Route
                path="/transactions"
                element={<Transactions />}
              />
              <Route
                path="/create-accounts"
                element={<CreateAccounts />}
              />
            </>
          )}
          <Route
            path="/customer-ledger/:customerId?"
            element={<CustomerLedger userRole={userRole} />}
          />
          <Route
            path="/reports"
            element={<Reports userRole={userRole} />}
          />
          <Route
            path="/profile"
            element={
              <Profile
                userRole={userRole}
                onRoleSwitch={(role) => {
                  setUserRole(role);
                  setLoginType(role);
                }}
              />
            }
          />
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
        <ChatbotButton />
      </Layout>
    </Router>
  );
}