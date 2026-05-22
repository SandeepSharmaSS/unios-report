import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  productSearch,
  ledgerSearch,
  getGrossProfitReport,
} from "../services/auth.service";

import { useAuth } from "../context/AuthContext";

export default function useGrossReport() {

  // 🔥 GLOBAL CSA
  const { selectedOrg } =
    useAuth();

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const [
    startDate,
    setStartDate,
  ] = useState(today);

  const [
    endDate,
    setEndDate,
  ] = useState(today);

  const [
    productQuery,
    setProductQuery,
  ] = useState("");

  const [
    ledgerQuery,
    setLedgerQuery,
  ] = useState("");

  const [products, setProducts] =
    useState([]);

  const [ledgers, setLedgers] =
    useState([]);

  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState(null);

  const [
    selectedLedger,
    setSelectedLedger,
  ] = useState(null);

  const [
    reportData,
    setReportData,
  ] = useState([]);

  const [loading, setLoading] =
    useState(false);

  // 🔥 RESET ON CSA CHANGE
  useEffect(() => {

    setReportData([]);

    setSelectedProduct(null);

    setSelectedLedger(null);

    setProducts([]);

    setLedgers([]);

    setProductQuery("");

    setLedgerQuery("");

  }, [selectedOrg]);

  // 🔍 PRODUCT SEARCH
  const searchProduct = async (
    val
  ) => {

    setProductQuery(val);

    if (
      val.length < 2 ||
      !selectedOrg
    ) {

      setProducts([]);

      return;
    }

    try {

      const res =
        await productSearch(
          val,
          selectedOrg
        );

      if (
        res?.status === "ok"
      ) {

        setProducts(
          res.data || []
        );
      }

    } catch (err) {

      console.error(
        "Product search error",
        err
      );
    }
  };

  // 🔍 LEDGER SEARCH
  const searchLedger = async (
    val
  ) => {

    setLedgerQuery(val);

    if (
      val.length < 2 ||
      !selectedOrg
    ) {

      setLedgers([]);

      return;
    }

    try {

      const res =
        await ledgerSearch(
          val,
          selectedOrg
        );

      if (
        res?.status === "ok"
      ) {

        setLedgers(
          res.data || []
        );
      }

    } catch (err) {

      console.error(
        "Ledger search error",
        err
      );
    }
  };

  // 📊 GENERATE REPORT
  const generateReport =
    async () => {

      if (!selectedOrg) {

        alert(
          "Please select CSA first"
        );

        return;
      }

      try {

        setLoading(true);

        const res =
          await getGrossProfitReport(

            startDate,

            endDate,

            selectedProduct
              ? [
                  selectedProduct.ProductId,
                ]
              : [],

            selectedLedger
              ? [
                  selectedLedger.LedgerId,
                ]
              : [],

            selectedOrg
          );

        if (
          res?.status === "ok"
        ) {

          setReportData(
            res.data || []
          );
        }

      } catch (err) {

        console.error(
          "Report error",
          err
        );

      } finally {

        setLoading(false);
      }
    };

  // 🔥 TOTALS
  const totalQty = useMemo(() => {

    return reportData.reduce(
      (a, b) =>
        a +
        (
          Number(b.Qty) || 0
        ),
      0
    );

  }, [reportData]);

  const totalSale =
    useMemo(() => {

      return reportData.reduce(
        (a, b) =>
          a +
          (
            Number(b.Sale) || 0
          ),
        0
      );

    }, [reportData]);

  const totalCost =
    useMemo(() => {

      return reportData.reduce(
        (a, b) =>
          a +
          (
            Number(b.Cost) || 0
          ),
        0
      );

    }, [reportData]);

  const totalProfit =
    useMemo(() => {

      return reportData.reduce(
        (a, b) =>
          a +
          (
            Number(
              b.NetProfit
            ) || 0
          ),
        0
      );

    }, [reportData]);

  return {

    // 🔥 STATES
    startDate,

    endDate,

    productQuery,

    ledgerQuery,

    products,

    ledgers,

    selectedProduct,

    selectedLedger,

    reportData,

    loading,

    // 🔥 SETTERS
    setStartDate,

    setEndDate,

    setSelectedProduct,

    setSelectedLedger,

    // 🔥 ACTIONS
    searchProduct,

    searchLedger,

    generateReport,

    // 🔥 TOTALS
    totalQty,

    totalSale,

    totalCost,

    totalProfit,
  };
}