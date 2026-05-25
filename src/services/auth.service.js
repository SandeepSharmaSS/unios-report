import axios from "axios";
import { environment } from "../utils/environment";

// dynamic headers (fix)
const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "x-key": "rajesh",
    "x-auth-token": token ? JSON.stringify(token) : null, 
  };
};

// Base URLs
const apiUrl = environment.apiUrl;
const apiUrl2 = environment.apiUrl3;

// login
export const login = async (post) => {
  const res = await axios.post(
    `${apiUrl2}/erp-wt/admin-login`,
    post,
    { headers: getHeaders() }
  );
  return res.data;
};

// dellogin
export const dellogin = async (post) => {
  const res = await axios.post(
    `${apiUrl2}/erp-wt/csa-login`,
    post,
    { headers: getHeaders() }
  );
  return res.data;
};

// ulogin
export const ulogin = async (post) => {
  const res = await axios.post(
    `${apiUrl}/user/login`,
    post,
    { headers: getHeaders() }
  );
  return res.data;
};


// get user org
export const getUserOrg = async () => {
  const res = await axios.get(
    `${apiUrl2}/erp/get-user-org`,
     {
      headers: getHeaders(),
    }
  );

  return res.data;
};


// REFRESH TOKEN
export const refreshToken = async (csaId) => {

  const res = await axios.post(

    `${apiUrl2}/erp/refresh-token`,

    {
      CSA_Id: Number(csaId),
    },

    {
      headers: getHeaders(),
    }
  );

  if (res.data?.token) {

    localStorage.setItem(
      "token",
      String(res.data.token)
    );
  }

  return res.data;
};


// csa profile 
export const getCsaProfile = async (csaId) => {
  const res = await axios.post(
    `${apiUrl2}/erp/csa-profile`,
    {
      CSA_Id: csaId,
    },
    {
      headers: getHeaders(),
    }
  );

  return res.data;
};


//sale purchase (CSA based)
export const getSalePurchase = async (signal, csaId) => {
  const res = await axios.post(
    `${apiUrl2}/erp/sale-purchase`,
    {csaId}, // empty body
     {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};


// RetailsalePurchase api with date filter
export const getRetailSalePurchase = async (startDate, endDate, signal) => {
  const res = await axios.post(
    `${apiUrl2}/retail/sale-purchase`,
    {
      startDate,
      endDate,
    },
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};

// Yaha se tracking ke liye api call kar raha hu 
// QC Status API (Tracking)
export const getQcStatus = async (signal) => {
  const res = await axios.post(
    `${apiUrl2}/dashboard/qc-status`,
    {},
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};

// Invoice Status API (Tracking)
export const getInvoiceStatus = async (signal) => {
  const res = await axios.post(
    `${apiUrl2}/dashboard/invoice-status`,
    {},
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};

// Pack Status API (Tracking)
export const getPackStatus = async (signal) => {
  const res = await axios.post(
    `${apiUrl2}/dashboard/pack-status`,
    {},
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};

// Dispatch Status API (Tracking)
export const getDispatchStatus = async (signal) => {
  const res = await axios.post(
    `${apiUrl2}/dashboard/dispatch-status`,
    {},
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};

// STN Invoice Status API (Tracking)
export const getStnInvoiceStatus = async (signal) => {
  const res = await axios.post(
    `${apiUrl2}/dashboard/stn-invoice-status`,
    {},
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};

// Sale Order Status API (Tracking)
export const getSaleOrderStatus = async (signal) => {
  const res = await axios.post(
    `${apiUrl2}/dashboard/salorder-status`,
    {},
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};

// Picking Status API (Tracking)
export const getPickingStatus = async (signal) => {
  const res = await axios.post(
    `${apiUrl2}/dashboard/picking-status`,
    {},
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};

// Label Status API (Tracking)
export const getLabelStatus = async (signal) => {
  const res = await axios.post(
    `${apiUrl2}/dashboard/label-status`,
    {},
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};

// Pickslip Status API (Tracking)
export const getPickslipStatus = async (signal) => {
  const res = await axios.post(
    `${apiUrl2}/dashboard/pickslip-status`,
    {},
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};

// Sale Order Detail API (Tracking Detail)
export const getSaleOrderDetail = async (signal) => {
  const res = await axios.post(
    `${apiUrl2}/dashboard/salorder-detail`,
    {},
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};

// Pickslip Detail API (Tracking Detail)
export const getPickslipDetail = async (signal) => {
  const res = await axios.post(
    `${apiUrl2}/dashboard/pickslip-detail`,
    {},
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};

// Picking Detail API (Tracking Detail)
export const getPickingDetail = async (signal) => {
  const res = await axios.post(
    `${apiUrl2}/dashboard/picking-detail`,
    {},
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};

// QC Detail API (Tracking Detail)
export const getQcDetail = async (signal) => {
  const res = await axios.post(
    `${apiUrl2}/dashboard/qc-detail`,
    {},
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};

// Pack Detail API (Tracking Detail)
export const getPackDetail = async (signal) => {
  const res = await axios.post(
    `${apiUrl2}/dashboard/pack-detail`,
    {},
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};

// Invoice Detail API (Tracking Detail)
export const getInvoiceDetail = async (signal) => {
  const res = await axios.post(
    `${apiUrl2}/dashboard/invoice-detail`,
    {}, // empty payload
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};

// STN Invoice Detail API (Tracking Detail)
export const getStnInvoiceDetail = async (signal) => {
  const res = await axios.post(
    `${apiUrl2}/dashboard/stn-invoice-detail`,
    {},
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};

// Fetch Sale Order Full Detail (Items + Summary)
export const getSaleOrderFullDetail = async (docNo, signal) => {
  const res = await axios.post(
    `${apiUrl2}/warehouse/fetch-salorder`,
    {
      DocNo: docNo,
    },
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};

// Fetch Picking Full Detail (Items + Summary)
export const getPickingFullDetail = async (docNo, signal) => {
  const res = await axios.post(
    `${apiUrl2}/warehouse/fetch-pick`,
    {
      DocNo: docNo,
    },
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};

// sale invoice details
export const getSaleInvoiceFullDetail = async (docNo, signal) => {
  const res = await axios.post(
    `${apiUrl2}/erp-aditya/fecth_invoice_fill_details`,
    { docNo: docNo },
    {
      headers: getHeaders(),
      signal,
    }
  );
  return res.data;
};




// Stock Ageing Report (CSA based)
export const getStockAgeingReport = async (fromDate, toDate, csa_id) => {
  const res = await axios.post(
    `${apiUrl2}/retail/stock-ageing-report`,
    {
      fromDate,
      toDate, csa_id
    },
    {
      headers: getHeaders(),
    }
  );

  return res.data;
};

// Gross Profit Report (Stock Ageing ke pattern par)
export const getGrossProfitReport = async (
  startDate,
  endDate,
  productIds = [],
  accountIds = [],
  csa_id
) => {
  const res = await axios.post(
    `${apiUrl2}/warehouse/gross-profit-report`,
    {
      startDate,
      endDate,
      ProductIds: productIds,
      AccountIds: accountIds,
      csa_id,
    },
    {
      headers: getHeaders(),
    }
  );

  return res.data;
};


// Product List API (GLEE)
export const getProductList = async () => {
  const token = JSON.stringify(localStorage.getItem("token"));

  const res = await axios.get(
    `${apiUrl}/glee-web/product-list`,
    {
      headers: {
        "x-auth-token": token,
      },
    }
  );

  return res.data;
};

//  Stock Analysis API (ERP)
export const getStockAnalysisERP = async (startDate = "", endDate = "", csa_id) => {
  const res = await axios.post(
    `${apiUrl2}/erp/stock-anal`,
    {
      startDate,
      endDate,
      csa_id,
    },
    {
      headers: getHeaders(),
    }
  );

  return res.data;
};


// Product Search - CSA ID ke base par filter hoga
export const productSearch = async (productName = "", csaId, signal) => {
  const res = await axios.post(
    `${apiUrl2}/erp/product-search`,
    {
      ProductName: productName,
      searchType: "Product Name",
      csa_id: csaId,
    },
    {
      headers: getHeaders(),
      signal,
    }
  );
  return res.data;
};

// Product Ledger API
export const getProductLedger = async (startDate, endDate, productId, csaId) => {
  const res = await axios.post(
    `${apiUrl2}/warehouse/product-ledger`,
    {
      startDate,
      endDate,
      ProductIds: [productId],
      AccountIds: [],
      reportType: "Product Wise",
      csa_id: csaId,
    },
    { headers: getHeaders() }
  );
  return res.data;
};

// Non-Moving Stock Report API
export const getNonMovingStock = async (fromDate, toDate, csaId) => {
  const res = await axios.post(
    `${apiUrl2}/retail/non-moving-stock-report`,
    {
      fromDate,
      toDate,
      csaId: csaId,
    },
    { headers: getHeaders() }
  );
  return res.data;
};

// Sale Report API
export const getSaleReport = async (payload) => {
  const res = await axios.post(`${apiUrl2}/erp/glee-sale-report`, payload, {
    headers: getHeaders(),
  });
  return res.data;
};


// STN Report API
export const getSTNReport = async (payload) => {
  const res = await axios.post(`${apiUrl2}/erp/stn-report`, payload, {
    headers: getHeaders(),
  });
  return res.data;
};

// Sale Return Report
export const getSaleReturnReport = async (payload) =>{
  const res = await axios.post(`${apiUrl2}/erp/glee-sale-return-report`, payload, {
    headers : getHeaders(),
  });
  return res.data;
};

// Purchase Report
export const getPurchaseReport = async (payload) =>{
  const res = await axios.post(`${apiUrl2}/erp/glee-purchase-report`, payload,{
    headers : getHeaders(),
  })
  return res.data;
}

// Purchase Return Report
export const getPurchaseReturnReport = async (payload) =>{
  const res = await axios.post(`${apiUrl2}/erp/glee-purchase-return-report`, payload, {
    headers : getHeaders(),
  });
  return res.data;
};


// Ledger Search (CSA based)
export const ledgerSearch = async (ledgerName = "") => {
  const token = JSON.stringify(localStorage.getItem("token"));

  const res = await axios.post(
    `${apiUrl2}/erp/ledger-select-so`,
    {
      LedgerName: ledgerName,
    },
    {
      headers: {
        "x-auth-token": token,
      },
    }
  );

  return res.data;
};


// AB yaha se Reopen bills ke liye service

// Unloading Search API (CSA wise)
export const getUnloadingSearch = async (
  searchString = "",
  csaId,
  signal) => {
  const res = await axios.post(
    `${apiUrl2}/warehouse/unloading-search`,
    {
      SearchString: searchString,
      csa_id: csaId,
    },
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};

// Unloading reopen bill function
export const reopenBills = async (
  docNo,
  type = "Unloading"
) => {

  const res = await axios.post(
    `${apiUrl2}/support/reopen-bills`,
    {
      DocNo: docNo,
      type: type,
    },
    {
      headers: getHeaders(),
    }
  );

  return res.data;
};


// Sale Invoice Search API
export const getSaleInvoiceSearch = async (
  searchString = "",
  csaId,
  signal
) => {

  const res = await axios.post(
    `${apiUrl2}/erp-aditya/sale_invoice_serach`,
    {
      SearchString: searchString,
      csa_id: csaId,
    },
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};


//Reopen Sales Bill API
export const reopenSalesBill = async (
  docNo,
  type = "SalesBill"
) => {

  const res = await axios.post(
    `${apiUrl2}/support/reopen-bills`,
    {
      DocNo: docNo,
      type,
    },
    {
      headers: getHeaders(),
    }
  );

  return res.data;
};


// Sale Order Search API
export const getSaleOrderSearch = async (
  searchString = "",
  csaId,
  signal
) => {

  const res = await axios.post(
    `${apiUrl2}/warehouse/salord-search`,
    {
      SearchString: searchString,
      csa_id: csaId,
    },
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};


//Reopen Sale Order API
export const reopenSaleOrder = async (
  docNo,
  type = "SalOrder"
) => {

  const res = await axios.post(
    `${apiUrl2}/support/reopen-bills`,
    {
      DocNo: docNo,
      type,
    },
    {
      headers: getHeaders(),
    }
  );

  return res.data;
};


// Sale Return search API
export const getSaleReturnSearch = async (
  searchString = "",
  csaId,
  signal
) => {

  const res = await axios.post(
    `${apiUrl2}/erp-aditya/sale-return-search`,
    {
      SearchString: searchString,
      csa_id: csaId,
    },
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};


//Reopen Sale Return API
export const reopenSaleReturn = async (
  docNo,
  type = "Sale_Return"
) => {

  const res = await axios.post(
    `${apiUrl2}/support/reopen-bills`,
    {
      DocNo: docNo,
      type,
    },
    {
      headers: getHeaders(),
    }
  );

  return res.data;
};


//STN Search API
export const getSTNSearch = async (
  searchString = "",
  csaId,
  signal
) => {

  const res = await axios.post(
    `${apiUrl2}/warehouse/search-stn`,
    {
      SearchString: searchString,
      csa_id: csaId,
    },
    {
      headers: getHeaders(),
      signal,
    }
  );

  return res.data;
};


//Reopen STN API
export const reopenSTN = async (
  docNo,
  type = "STN"
) => {

  const res = await axios.post(
    `${apiUrl2}/support/reopen-bills`,
    {
      DocNo: docNo,
      type,
    },
    {
      headers: getHeaders(),
    }
  );

  return res.data;
};