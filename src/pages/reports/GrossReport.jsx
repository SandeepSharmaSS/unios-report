import { useState, useMemo } from "react";
import  useGrossReport  from "../../hooks/useGrossReport";

export default function GrossProfitReport() {

  const {
    startDate, endDate,
    productQuery, ledgerQuery,
    products, ledgers,
    selectedProduct, selectedLedger,
    reportData, loading,

    setStartDate, setEndDate,
    setSelectedProduct, setSelectedLedger,

    searchProduct, searchLedger, generateReport,

    totalQty, totalSale, totalCost, totalProfit
  } = useGrossReport();

  const [showTable, setShowTable] = useState(false);

  // 🔥 NEW STATES
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);

  const isMobile = window.innerWidth < 640;

  // 🔍 FILTER
  const filtered = useMemo(() => {
    if (!search) return reportData;

    const q = search.toLowerCase();

    return reportData.filter((r) =>
      r.ProductName?.toLowerCase().includes(q) ||
      r.CustomerName?.toLowerCase().includes(q) ||
      r.DocNo?.toLowerCase().includes(q)
    );
  }, [reportData, search]);

  // 📄 PAGINATION
  const totalPages = Math.ceil(filtered.length / limit);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, page, limit]);

return (
  <div className="w-full min-h-screen px-3 py-4 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-white space-y-5 transition-colors duration-300">

    {/* HEADER */}
    <div>
      <h1 className="text-lg font-black text-slate-800 dark:text-white">
        Gross Profit
      </h1>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Analytics
      </p>
    </div>

    {/* FILTER */}
    <div
      className="
        bg-white/80
        dark:bg-[#071028]
        backdrop-blur-2xl
        rounded-3xl
        p-4
        shadow-xl
        shadow-slate-200/20
        dark:shadow-black/20
        border
        border-slate-200
        dark:border-cyan-900/40
        space-y-3
      "
    >

      <div className="grid grid-cols-1 gap-3">

        {/* DATE */}
        <input
          type="date"
          value={startDate}
          onChange={(e)=>setStartDate(e.target.value)}
          className="
            border
            border-slate-200
            dark:border-slate-700
            rounded-2xl
            px-3
            py-2.5
            text-sm
            bg-white
            dark:bg-slate-950
            text-slate-700
            dark:text-white
            outline-none
            focus:ring-2
            focus:ring-cyan-500
          "
        />

        <input
          type="date"
          value={endDate}
          onChange={(e)=>setEndDate(e.target.value)}
          className="
            border
            border-slate-200
            dark:border-slate-700
            rounded-2xl
            px-3
            py-2.5
            text-sm
            bg-white
            dark:bg-slate-950
            text-slate-700
            dark:text-white
            outline-none
            focus:ring-2
            focus:ring-cyan-500
          "
        />

        {/* PRODUCT */}
        <div className="relative">
          <input
            value={selectedProduct ? selectedProduct.ProductName : productQuery}
            onChange={(e)=>searchProduct(e.target.value)}
            placeholder="Search Product..."
            className="
              w-full
              border
              border-slate-200
              dark:border-slate-700
              rounded-2xl
              px-3
              py-2.5
              text-sm
              bg-white
              dark:bg-slate-950
              text-slate-700
              dark:text-white
              outline-none
              focus:ring-2
              focus:ring-cyan-500
            "
          />

          {products.length > 0 && (
            <div
              className="
                absolute
                z-50
                w-full
                bg-white
                dark:bg-slate-900
                border
                border-slate-200
                dark:border-slate-700
                rounded-2xl
                shadow-2xl
                max-h-48
                overflow-auto
                mt-2
              "
            >
              {products.map(p=>(
                <div
                  key={p.ProductId}
                  onClick={()=>{
                    setSelectedProduct(p);
                    searchProduct("");
                  }}
                  className="
                    p-3
                    text-sm
                    text-slate-700
                    dark:text-slate-200
                    hover:bg-blue-50
                    dark:hover:bg-slate-800
                    cursor-pointer
                  "
                >
                  {p.ProductName}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LEDGER */}
        <div className="relative">
          <input
            value={selectedLedger ? selectedLedger.LedgerName : ledgerQuery}
            onChange={(e)=>searchLedger(e.target.value)}
            placeholder="Search Customer..."
            className="
              w-full
              border
              border-slate-200
              dark:border-slate-700
              rounded-2xl
              px-3
              py-2.5
              text-sm
              bg-white
              dark:bg-slate-950
              text-slate-700
              dark:text-white
              outline-none
              focus:ring-2
              focus:ring-cyan-500
            "
          />

          {ledgers.length > 0 && (
            <div
              className="
                absolute
                z-50
                w-full
                bg-white
                dark:bg-slate-900
                border
                border-slate-200
                dark:border-slate-700
                rounded-2xl
                shadow-2xl
                max-h-48
                overflow-auto
                mt-2
              "
            >
              {ledgers.map(l=>(
                <div
                  key={l.LedgerId}
                  onClick={()=>{
                    setSelectedLedger(l);
                    searchLedger("");
                  }}
                  className="
                    p-3
                    text-sm
                    text-slate-700
                    dark:text-slate-200
                    hover:bg-purple-50
                    dark:hover:bg-slate-800
                    cursor-pointer
                  "
                >
                  {l.LedgerName}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BUTTON */}
        <button
          onClick={()=>{
            generateReport();
            setShowTable(false);
          }}
          className="
            bg-gradient-to-r
            from-cyan-500
            to-blue-600
            hover:from-cyan-600
            hover:to-blue-700
            text-white
            py-3
            rounded-2xl
            font-black
            text-sm
            shadow-lg
            shadow-cyan-500/20
            active:scale-95
            transition-all
          "
        >
          Generate Report
        </button>

      </div>
    </div>

    {/* KPI */}
    <div className="grid grid-cols-2 gap-3">
      <Kpi title="Qty" value={totalQty} />
      <Kpi title="Sale" value={totalSale} type="green" />
      <Kpi title="Cost" value={totalCost} type="red" />
      <Kpi title="Profit" value={totalProfit} type="highlight" />
    </div>

    {/* TOGGLE */}
    {reportData.length > 0 && (
      <button
        onClick={()=>setShowTable(!showTable)}
        className="
          w-full
          bg-slate-900
          dark:bg-slate-800
          text-white
          py-3
          rounded-2xl
          text-sm
          font-bold
        "
      >
        {showTable ? "Hide Details" : "View Details"}
      </button>
    )}

    {/* SEARCH */}
    {showTable && (
      <div className="flex flex-col sm:flex-row gap-2 justify-between">

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e)=>{
            setSearch(e.target.value);
            setPage(1);
          }}
          className="
            border
            border-slate-200
            dark:border-slate-700
            bg-white
            dark:bg-slate-950
            text-slate-700
            dark:text-white
            px-3
            py-2.5
            rounded-2xl
            text-sm
            outline-none
          "
        />

        <select
          value={limit}
          onChange={(e)=>{
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="
            border
            border-slate-200
            dark:border-slate-700
            bg-white
            dark:bg-slate-950
            text-slate-700
            dark:text-white
            px-3
            py-2.5
            rounded-2xl
            text-sm
          "
        >
          <option value={30}>30</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

      </div>
    )}

    {/* DATA */}
    {showTable && (
      <div
        className="
          bg-white/80
          dark:bg-[#071028]
          backdrop-blur-2xl
          rounded-3xl
          shadow-xl
          shadow-slate-200/20
          dark:shadow-black/20
          border
          border-slate-200
          dark:border-cyan-900/40
          overflow-hidden
        "
      >

        {loading ? (
          <p className="p-4 text-sm text-slate-500 dark:text-slate-300">
            Loading...
          </p>
        ) : isMobile ? (

          /* 📱 MOBILE */
          <div className="p-3 space-y-4 max-h-[500px] overflow-auto">

            {paginatedData.map((r,i)=>(
              <div
                key={i}
                className="
                  border
                  border-slate-200
                  dark:border-slate-700
                  rounded-3xl
                  p-4
                  shadow-sm
                  bg-white/80
                  dark:bg-slate-900/60
                "
              >

                <p className="text-xs font-black text-slate-800 dark:text-white mb-1">
                  {r.ProductName}
                </p>

                <p className="text-[11px] text-slate-500 dark:text-slate-300 mb-2">
                  {r.CustomerName}
                </p>

                <div className="flex justify-between text-[10px] mb-3">
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-700 dark:text-slate-200">
                    {r.DocNo}
                  </span>

                  <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded text-yellow-700 dark:text-yellow-300">
                    {r.Exp_Date}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">

                  <div className="text-blue-600 dark:text-cyan-300">
                    Qty: {r.Qty}
                  </div>

                  <div className="text-green-600 dark:text-emerald-400">
                    Sale: ₹ {r.Sale}
                  </div>

                  <div className="text-red-500 dark:text-rose-400">
                    Cost: ₹ {r.Cost}
                  </div>

                  <div className={`font-semibold ${
                    r.NetProfit >= 0
                      ? "text-green-600 dark:text-emerald-400"
                      : "text-red-500 dark:text-rose-400"
                  }`}>
                    Profit: ₹ {r.NetProfit}
                  </div>

                </div>

              </div>
            ))}

          </div>

        ) : (

          /* 💻 DESKTOP */
          <div className="overflow-auto max-h-[500px]">

            <table className="min-w-[2000px] text-[13px]">

              <thead className="bg-slate-800 text-white sticky top-0">
                <tr>
                  <th className="px-3 py-3">Doc</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Customer</th>
                  <th className="px-3 py-3">Product</th>
                  <th className="px-3 py-3">Company</th>
                  <th className="px-3 py-3">Batch</th>
                  <th className="px-3 py-3">Exp</th>
                  <th className="px-3 py-3 text-right">Qty</th>
                  <th className="px-3 py-3 text-right">Sale</th>
                  <th className="px-3 py-3 text-right">Cost</th>
                  <th className="px-3 py-3 text-right">Profit</th>
                  <th className="px-3 py-3 text-right">%</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">

                {paginatedData.map((r,i)=>(
                  <tr
                    key={i}
                    className="
                      hover:bg-slate-50
                      dark:hover:bg-slate-800/40
                      transition-colors
                    "
                  >
                    <td className="px-3 py-3">{r.DocNo}</td>
                    <td className="px-3 py-3">{r.DocDate}</td>
                    <td className="px-3 py-3">{r.CustomerName}</td>
                    <td className="px-3 py-3 font-semibold">{r.ProductName}</td>
                    <td className="px-3 py-3">{r.ProductCompanyName}</td>
                    <td className="px-3 py-3">{r.Batch_No}</td>
                    <td className="px-3 py-3">{r.Exp_Date}</td>

                    <td className="px-3 py-3 text-right">
                      {r.Qty}
                    </td>

                    <td className="px-3 py-3 text-right text-green-600 dark:text-emerald-400">
                      ₹ {r.Sale}
                    </td>

                    <td className="px-3 py-3 text-right text-red-500 dark:text-rose-400">
                      ₹ {r.Cost}
                    </td>

                    <td className={`px-3 py-3 text-right ${
                      r.NetProfit >= 0
                        ? "text-green-600 dark:text-emerald-400"
                        : "text-red-500 dark:text-rose-400"
                    }`}>
                      ₹ {r.NetProfit}
                    </td>

                    <td className="px-3 py-3 text-right">
                      {r.NetProfitPer}%
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-between items-center p-3 text-xs border-t border-slate-200 dark:border-slate-800">

          <p className="text-slate-500 dark:text-slate-300">
            Page {page} / {totalPages || 1}
          </p>

          <div className="flex gap-2">

            <button
              disabled={page===1}
              onClick={()=>setPage(p=>p-1)}
              className="
                px-3
                py-1.5
                border
                border-slate-200
                dark:border-slate-700
                rounded-xl
                disabled:opacity-40
              "
            >
              Prev
            </button>

            <button
              disabled={page===totalPages}
              onClick={()=>setPage(p=>p+1)}
              className="
                px-3
                py-1.5
                border
                border-slate-200
                dark:border-slate-700
                rounded-xl
                disabled:opacity-40
              "
            >
              Next
            </button>

          </div>
        </div>

      </div>
    )}

  </div>
);

function Kpi({ title, value, type }) {

  const styles = {
    green: `
      bg-emerald-100
      dark:bg-emerald-900/30
      text-emerald-700
      dark:text-emerald-300
    `,

    red: `
      bg-rose-100
      dark:bg-rose-900/30
      text-rose-700
      dark:text-rose-300
    `,

    highlight: `
      bg-gradient-to-r
      from-cyan-500
      to-blue-600
      text-white
    `,

    default: `
      bg-white/80
      dark:bg-[#071028]
      text-slate-800
      dark:text-white
      border
      border-slate-200
      dark:border-cyan-900/40
    `
  };

  return (
    <div
      className={`
        rounded-3xl
        p-4
        shadow-xl
        shadow-slate-200/20
        dark:shadow-black/20
        ${styles[type] || styles.default}
      `}
    >

      <p className="text-xs opacity-70 font-semibold">
        {title}
      </p>

      <p className="text-lg font-black mt-1">
        ₹ {Number(value || 0).toLocaleString()}
      </p>

    </div>
  );
}
}