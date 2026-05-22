import { useEffect, useRef, useState } from "react";
import {
  getSalePurchase,
  getRetailSalePurchase,
  getQcStatus,
  getInvoiceStatus,
  getPackStatus,
  getDispatchStatus,
  getStnInvoiceStatus,
  getSaleOrderStatus,
  getPickingStatus,
  getLabelStatus,
  getPickslipStatus,
  getSaleOrderDetail,
  getPickslipDetail,
  getPickingDetail,
  getQcDetail,
  getPackDetail,
  getInvoiceDetail,
  getStnInvoiceDetail,
  getSaleOrderFullDetail,
  getPickingFullDetail,
  getSaleInvoiceFullDetail,
} from "../services/auth.service";

export default function useDashboard(selectedOrg, fromDate, toDate) {
  const [report, setReport] = useState(null);
  const [retailReport, setRetailReport] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [details, setDetails] = useState({});
  const [itemDetail, setItemDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemLoading, setItemLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const controllerRef = useRef(null);
  const cacheRef = useRef({});

  useEffect(() => {
    if (!selectedOrg) return;
    cacheRef.current = {};
  }, [selectedOrg]);

  useEffect(() => {
    if (!selectedOrg) return;

    const key = `${selectedOrg}-${fromDate}-${toDate}`;

    if (cacheRef.current[key]) {
      const cached = cacheRef.current[key];
      setReport(cached.report);
      setRetailReport(cached.retailReport);
      setTracking(cached.tracking);
      setDetails(cached.details || {});
      return;
    }

    const timeout = setTimeout(() => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      const controller = new AbortController();
      controllerRef.current = controller;

      const load = async (retry = 0) => {
        try {
          if (retry === 0) setLoading(true);

          // 🛠️ FIX 1: getSalePurchase mein selectedOrg (csaId) bhejna zaroori hai
          // 🛠️ FIX 2: getRetailSalePurchase mein signal last parameter hai
          const [res1, res2] = await Promise.all([
            getSalePurchase(controller.signal, selectedOrg),
            getRetailSalePurchase(fromDate, toDate, controller.signal),
          ]);

          if (res1?.success) setReport(res1.data);
          if (res2?.success) setRetailReport(res2.data);

          // Dashboard Numbers (Tracking Status)
          const results = await Promise.allSettled([
            getQcStatus(controller.signal),
            getInvoiceStatus(controller.signal),
            getPackStatus(controller.signal),
            getDispatchStatus(controller.signal),
            getStnInvoiceStatus(controller.signal),
            getSaleOrderStatus(controller.signal),
            getPickingStatus(controller.signal),
            getLabelStatus(controller.signal),
            getPickslipStatus(controller.signal),
          ]);

          const getData = (index) =>
            results[index]?.status === "fulfilled" ? results[index].value?.data : null;

          const trackingData = {
            qc: getData(0),
            invoice: getData(1),
            pack: getData(2),
            dispatch: getData(3),
            stn: getData(4),
            saleOrder: getData(5),
            picking: getData(6),
            label: getData(7),
            pickslip: getData(8),
          };

          setTracking(trackingData);

          cacheRef.current[key] = {
            report: res1?.data,
            retailReport: res2?.data,
            tracking: trackingData,
            details: {},
          };

        } catch (e) {
          if (e.name === "CanceledError" || e.name === "AbortError") return;
          if (retry < 2) await load(retry + 1);
        } finally {
          setLoading(false);
        }
      };

      load();
    }, 400);

    return () => {
      clearTimeout(timeout);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [selectedOrg, fromDate, toDate]);

  const fetchCategoryDetails = async (category) => {
    if (details[category]) return;

    setDetailsLoading(true);
    try {
      let res;
      // Note: In APIs mein body empty {} hai toh signal pass karne ki zaroorat nahi 
      // agar service file handle kar rahi hai, par convention ke liye bhej sakte hain.
      switch (category) {
        case "saleOrder": res = await getSaleOrderDetail(); break;
        case "pickslip": res = await getPickslipDetail(); break;
        case "picking": res = await getPickingDetail(); break;
        case "qc": res = await getQcDetail(); break;
        case "pack": res = await getPackDetail(); break;
        case "invoice": res = await getInvoiceDetail(); break;
        case "stn": res = await getStnInvoiceDetail(); break;
        default: return;
      }

      if (res?.status === "ok") {
        console.log("DETAIL API RESPONSE =>", res.data);
        const normalizedData = Array.isArray(res.data) 
          ? { pending: res.data, partial: [], complete: [] } 
          : res.data;

        const newData = { ...details, [category]: normalizedData };
        setDetails(newData);
        
        const key = `${selectedOrg}-${fromDate}-${toDate}`;
        if(cacheRef.current[key]) {
            cacheRef.current[key].details = newData;
        }
      }
    } catch (e) {
      console.error("Details fetch error", e);
    } finally {
      setDetailsLoading(false);
    }
  };

      // 🛠️ FIX 3: Full Detail APIs mein (docNo, signal) ka sequence match kiya gaya hai
const fetchItemDetail = async (docNo, type = "sale") => {

  try {

    if (!docNo) {
      setItemDetail(null);
      return;
    }

    setItemLoading(true);

    let res;

    // 🔥 API CALLS
    if (type === "invoice") {

      res = await getSaleInvoiceFullDetail(docNo);

    } else if (["picking", "qc", "pack"].includes(type)) {

      res = await getPickingFullDetail(docNo);

    } else {

      res = await getSaleOrderFullDetail(docNo);

    }

    console.log("FULL DETAIL RESPONSE =>", res);

    // 🔥 RESPONSE HANDLE
    if (res?.status === "ok") {

      setItemDetail(res.data || {});

    } else {

      setItemDetail({});

    }

  } catch (e) {

    console.error("Item detail error", e);
    setItemDetail({});

  } finally {

    setItemLoading(false);

  }

};

  return {
    report,
    retailReport,
    tracking,
    details,
    loading,
    detailsLoading,
    fetchCategoryDetails,
    itemDetail,
    itemLoading,
    fetchItemDetail,
  };
}