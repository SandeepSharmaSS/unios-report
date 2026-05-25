import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/auth/Login";
import Home from "../pages/home/Home";
import GrossProfitReport from "../pages/reports/GrossReport";
import StockAnalysis from "../pages/reports/StockAnalysis";
import ProductLedger from "../pages/reports/ProductLedger";
import StockAgeing from "../pages/reports/StockAgeing";
import NonMovingStock from "../pages/reports/NonMovingStock";
import SaleReport from "../pages/reports/SaleReport";
import STNReport from "../pages/reports/STNReport";
import SalereturnReport from "../pages/reports/SaleReturnReport";
import PurchaseReport from "../pages/reports/PurchaseReport";
import PurchaseReturnReport from "../pages/reports/PurchaseReturnReport";
import UnloadingBills from "../pages/reopens/UnloadingBills";
import SaleInvoiceBills from "../pages/reopens/SaleInvoiceBills";
import SaleOrderBills from "../pages/reopens/SaleOrderBills";
import SaleReturnBills from "../pages/reopens/SaleReturnBills";
import StnInvoiceBills from "../pages/reopens/StnInvoiceBills";

import MainLayout from "../layouts/MainLayout";
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <MainLayout />;
};

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <Login /> : <Navigate to="/home" replace />;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* ===== LOGIN ===== */}
      <Route path="/" element={<PublicRoute />} />

      {/* ===== PROTECTED ROUTES ===== */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/reports/gross" element={<GrossProfitReport />} />
        <Route path="/reports/stock" element={<StockAnalysis />} />
        <Route path="/reports/ledger" element={<ProductLedger />} />
        <Route path="/reports/ageing" element={<StockAgeing />} />
        <Route path="/reports/SaleReport" element={<SaleReport/>}/>
        <Route path="/reports/STNReport" element={<STNReport/>}/>
        <Route path="/reports/SaleReturnReport" element={<SalereturnReport/>}/>
        <Route path="/reports/PurchaseReport" element={<PurchaseReport/>}/>
        <Route path="/reports/PurchaseReturnReport" element={<PurchaseReturnReport/>}/>
        <Route path="/reports/NonMoving" element={<NonMovingStock/>}/>
        <Route path="/reopens/UnloadingBills" element={<UnloadingBills/>}/>
        <Route path="/reopens/SaleInvoiceBills" element={<SaleInvoiceBills/>}/>
        <Route path="/reopens/SaleOrderBills" element={<SaleOrderBills/>}/>
        <Route path="/reopens/SaleReturnBills" element={<SaleReturnBills/>}/>
        <Route path="/reopens/StnInvoiceBills" element={<StnInvoiceBills/>}/>
      </Route>

      {/* ===== FALLBACK ===== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}