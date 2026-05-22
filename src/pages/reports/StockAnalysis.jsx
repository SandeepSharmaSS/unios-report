import { useEffect, useMemo, useState } from "react";

import { useOutletContext } from "react-router-dom";

import {
  Search,
  Package,
  Boxes,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Layers3,
} from "lucide-react";

import { getStockAnalysisERP } from "../../services/auth.service";

export default function StockAnalysis({
  fromDate,
  toDate,
}) {

  // 🔥 CONTEXT
  const {
    selectedOrg,
  } = useOutletContext();

  const [data, setData] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // 🔥 FILTER STATES
  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState(30);

  const [startDate, setStartDate] =
    useState(
      fromDate || ""
    );

  const [endDate, setEndDate] =
    useState(
      toDate || ""
    );

  // 📱 MOBILE DETECT
  const [isMobile, setIsMobile] =
    useState(
      window.innerWidth < 640
    );

  useEffect(() => {

    const handleResize = () =>
      setIsMobile(
        window.innerWidth < 640
      );

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );

  }, []);

  // 🔥 SAFE NUMBER
  const safeNum = (v) =>
    Number(v || 0).toFixed(2);

  // 🔥 LOAD DATA
  useEffect(() => {

    const load = async () => {

      console.log(
        "StockAnalysis context value:",
        selectedOrg
      );

      if (!selectedOrg) {

        setData([]);

        return;
      }

      try {

        setLoading(true);

        const csaId =
          typeof selectedOrg === "object"
            ? selectedOrg.id
            : selectedOrg;

        const res =
          await getStockAnalysisERP(
            startDate,
            endDate,
            csaId
          );

        if (res?.success) {

          setData(
            res.data || []
          );

        } else {

          setData([]);
        }

      } catch (e) {

        console.error(
          "Stock Analysis API Error (CSA Wise):",
          e
        );

        setData([]);

      } finally {

        setLoading(false);
      }
    };

    load();

  }, [
    startDate,
    endDate,
    selectedOrg,
  ]);

  // 🔥 SEARCH FILTER
  const filtered = useMemo(() => {

    if (!search) {
      return data;
    }

    const q =
      search.toLowerCase();

    return data.filter(
      (i) =>
        i.ProductName
          ?.toLowerCase()
          .includes(q) ||

        i.Batch_No
          ?.toLowerCase()
          .includes(q)
    );

  }, [
    data,
    search,
  ]);

  // 🔥 PAGINATION
  const totalPages =
    Math.ceil(
      filtered.length / limit
    ) || 1;

  const paginatedData =
    useMemo(() => {

      const start =
        (page - 1) * limit;

      return filtered.slice(
        start,
        start + limit
      );

    }, [
      filtered,
      page,
      limit,
    ]);

  return (
    <div className="mt-5 space-y-5 overflow-x-hidden">

      {/* HERO */}
      <div
        className="
          relative

          overflow-hidden

          rounded-[28px]

          bg-white
          dark:bg-gradient-to-br
          dark:from-slate-900
          dark:via-blue-950
          dark:to-indigo-950

          border
          border-gray-200
          dark:border-slate-800

          shadow-xl

          p-4
          sm:p-5
          lg:p-6

          transition-colors
          duration-300
        "
      >

        {/* GLOW */}
        <div
          className="
            hidden dark:block

            absolute
            -top-20
            -right-20

            w-60
            h-60

            rounded-full

            bg-cyan-400/20

            blur-3xl
          "
        />

        {/* HEADER */}
        <div
          className="
            relative

            flex
            flex-col
            lg:flex-row

            lg:items-center
            lg:justify-between

            gap-4
          "
        >

          {/* LEFT */}
          <div className="min-w-0">

            <div className="flex items-center gap-3">

              <div
                className="
                  w-12 h-12

                  rounded-3xl

                  bg-blue-500
                  dark:bg-white/10

                  flex
                  items-center
                  justify-center

                  shadow-lg
                "
              >

                <Layers3
                  size={22}
                  className="
                    text-white
                    dark:text-cyan-300
                  "
                />

              </div>

              <div className="min-w-0">

                <h2
                  className="
                    text-lg
                    sm:text-2xl

                    font-black

                    text-slate-800
                    dark:text-white

                    truncate
                  "
                >
                  Stock Analysis
                </h2>

                <p
                  className="
                    text-xs
                    sm:text-sm

                    text-slate-500
                    dark:text-slate-300

                    mt-1
                  "
                >
                  CSA Wise Inventory Analytics
                </p>

              </div>

            </div>

            {!selectedOrg && (
              <p
                className="
                  mt-3

                  text-[11px]

                  text-red-500
                  dark:text-red-300

                  font-bold

                  animate-pulse
                "
              >
                ⚠ Please select a CSA in Topbar to load stock data
              </p>
            )}

          </div>

          {/* FILTERS */}
{/* FILTERS */}
<div
  className="
    flex
    items-center

    gap-10
    sm:gap-4

    w-full

    overflow-hidden
  "
>

  {/* FROM DATE */}
  <div
    className="
      relative

      flex-1
      min-w-0

      max-w-[132px]
      sm:max-w-[165px]
    "
  >

    <CalendarDays
      size={11}
      className="
        absolute
        left-2
        top-1/2
        -translate-y-1/2

        text-slate-400

        pointer-events-none
      "
    />

    <input
      type="date"
      value={startDate}
      onChange={(e) => {

        setStartDate(
          e.target.value
        );

        setPage(1);

      }}
      className="
        w-full
        min-w-0

        text-[9px]
        sm:text-[11px]

        pl-6 pr-1 py-1.5
        sm:pl-8 sm:pr-2 sm:py-2

        rounded-lg
        sm:rounded-xl

        border

        border-gray-200
        dark:border-slate-700

        bg-white
        dark:bg-slate-900

        text-slate-700
        dark:text-white

        outline-none

        focus:ring-2
        focus:ring-blue-500

        transition-colors
      "
    />

  </div>

  {/* TO DATE */}
  <div
    className="
      relative

      flex-1
      min-w-0

      max-w-[132px]
      sm:max-w-[165px]
    "
  >

    <CalendarDays
      size={11}
      className="
        absolute
        left-2
        top-1/2
        -translate-y-1/2

        text-slate-400

        pointer-events-none
      "
    />

    <input
      type="date"
      value={endDate}
      onChange={(e) => {

        setEndDate(
          e.target.value
        );

        setPage(1);

      }}
      className="
        w-full
        min-w-0

        text-[9px]
        sm:text-[11px]

        pl-6 pr-1 py-1.5
        sm:pl-8 sm:pr-2 sm:py-2

        rounded-lg
        sm:rounded-xl

        border

        border-gray-200
        dark:border-slate-700

        bg-white
        dark:bg-slate-900

        text-slate-700
        dark:text-white

        outline-none

        focus:ring-2
        focus:ring-blue-500

        transition-colors
      "
    />

  </div>

</div>
</div>
        {/* SEARCH */}
        <div
          className="
            relative

            mt-5
          "
        >

          <Search
            size={15}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2

              text-slate-400
            "
          />

          <input
            type="text"
            placeholder="Search product / batch..."
            value={search}
            onChange={(e) => {

              setSearch(
                e.target.value
              );

              setPage(1);

            }}
            className="
              w-full

              pl-11 pr-24 py-3.5

              rounded-2xl

              border

              border-gray-200
              dark:border-slate-700

              bg-white
              dark:bg-slate-900

              text-sm

              text-slate-700
              dark:text-white

              outline-none

              focus:ring-2
              focus:ring-blue-500

              transition-colors
            "
          />

          <select
            value={limit}
            onChange={(e) => {

              setLimit(
                Number(
                  e.target.value
                )
              );

              setPage(1);

            }}
            className="
              absolute
              right-2
              top-1/2
              -translate-y-1/2

              text-xs

              px-3 py-2

              rounded-xl

              border

              border-gray-200
              dark:border-slate-700

              bg-gray-50
              dark:bg-slate-800

              text-slate-700
              dark:text-white

              outline-none
            "
          >

            <option value={30}>
              30
            </option>

            <option value={50}>
              50
            </option>

            <option value={100}>
              100
            </option>

          </select>

        </div>

      </div>

      {/* LOADING */}
      {loading ? (

        <div
          className="
            rounded-[28px]

            bg-white
            dark:bg-slate-900

            border
            border-gray-200
            dark:border-slate-800

            py-24

            shadow-lg

            text-center
          "
        >

          <div
            className="
              w-8 h-8

              border-[3px]
              border-blue-600
              border-t-transparent

              rounded-full

              animate-spin

              mx-auto
            "
          />

          <p
            className="
              mt-4

              text-xs

              font-bold

              tracking-[0.2em]

              uppercase

              text-slate-400
            "
          >
            Fetching CSA Stock...
          </p>

        </div>

      ) : isMobile ? (

        /* 📱 MOBILE */
        <div
          className="
            space-y-3
          "
        >

          {paginatedData.map((item, i) => (

            <div
              key={i}
              className="
                rounded-3xl

                bg-white
                dark:bg-slate-900

                border
                border-gray-200
                dark:border-slate-800

                p-3

                shadow-lg

                transition-all
                duration-300

                active:scale-[0.99]
              "
            >

              {/* TOP */}
              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0 flex-1">

                  <p
                    className="
                      text-xs

                      font-bold

                      text-slate-800
                      dark:text-white

                      leading-relaxed
                    "
                  >
                    {item.ProductName}
                  </p>

                </div>

                <div
                  className="
                    w-9 h-9

                    rounded-2xl

                    bg-blue-50
                    dark:bg-blue-500/10

                    flex
                    items-center
                    justify-center

                    shrink-0
                  "
                >

                  <Package
                    size={16}
                    className="
                      text-blue-600
                      dark:text-cyan-300
                    "
                  />

                </div>

              </div>

              {/* BATCH */}
              <div
                className="
                  flex
                  flex-wrap

                  gap-2

                  mt-3
                "
              >

                <div
                  className="
                    px-2.5 py-1.5

                    rounded-xl

                    bg-blue-50
                    dark:bg-blue-500/10

                    text-[10px]

                    font-bold

                    text-blue-600
                    dark:text-blue-300
                  "
                >
                  Batch {item.Batch_No}
                </div>

                <div
                  className="
                    px-2.5 py-1.5

                    rounded-xl

                    bg-yellow-50
                    dark:bg-yellow-500/10

                    text-[10px]

                    font-bold

                    text-yellow-700
                    dark:text-yellow-300
                  "
                >
                  Exp {item.Exp_Date}
                </div>

              </div>

              {/* STATS */}
              <div
                className="
                  grid
                  grid-cols-2

                  gap-2

                  mt-4
                "
              >

                {/* PURCHASE */}
                <div
                  className="
                    rounded-2xl

                    p-3

                    bg-slate-50
                    dark:bg-slate-800/70

                    border
                    border-gray-100
                    dark:border-slate-700
                  "
                >

                  <div className="flex items-center gap-1.5">

                    <TrendingDown
                      size={13}
                      className="
                        text-blue-500
                      "
                    />

                    <p
                      className="
                        text-[9px]

                        font-bold

                        uppercase

                        tracking-wider

                        text-slate-400
                      "
                    >
                      Purchase
                    </p>

                  </div>

                  <p
                    className="
                      mt-2

                      text-[11px]

                      font-bold

                      text-blue-600
                      dark:text-blue-300
                    "
                  >
                    {item.PurQty}
                    {" "}
                    |
                    {" "}
                    ₹
                    {safeNum(
                      item.PurAmount
                    )}
                  </p>

                </div>

                {/* SALE */}
                <div
                  className="
                    rounded-2xl

                    p-3

                    bg-slate-50
                    dark:bg-slate-800/70

                    border
                    border-gray-100
                    dark:border-slate-700
                  "
                >

                  <div className="flex items-center gap-1.5">

                    <TrendingUp
                      size={13}
                      className="
                        text-green-500
                      "
                    />

                    <p
                      className="
                        text-[9px]

                        font-bold

                        uppercase

                        tracking-wider

                        text-slate-400
                      "
                    >
                      Sale
                    </p>

                  </div>

                  <p
                    className="
                      mt-2

                      text-[11px]

                      font-bold

                      text-green-600
                      dark:text-green-300
                    "
                  >
                    {item.SalQty}
                    {" "}
                    |
                    {" "}
                    ₹
                    {safeNum(
                      item.SaleAmount
                    )}
                  </p>

                </div>

              </div>

              {/* FOOTER */}
              <div
                className="
                  flex
                  items-center
                  justify-between

                  mt-4

                  pt-3

                  border-t
                  border-dashed
                  border-gray-200
                  dark:border-slate-700
                "
              >

                <p
                  className="
                    text-[10px]

                    font-bold

                    uppercase

                    text-slate-400
                  "
                >
                  Closing Stock
                </p>

                <div
                  className={`
                    text-sm

                    font-black

                    ${
                      item.ClosingQty < 10
                        ? `
                          text-red-500
                          dark:text-red-300
                        `
                        : `
                          text-emerald-600
                          dark:text-emerald-300
                        `
                    }
                  `}
                >
                  {item.ClosingQty}
                </div>

              </div>

            </div>

          ))}

          {!loading &&
            paginatedData.length === 0 && (
              <div
                className="
                  rounded-3xl

                  bg-white
                  dark:bg-slate-900

                  border
                  border-gray-200
                  dark:border-slate-800

                  py-16

                  text-center

                  shadow-lg
                "
              >

                <Boxes
                  size={28}
                  className="
                    mx-auto

                    text-slate-300
                    dark:text-slate-600
                  "
                />

                <p
                  className="
                    mt-4

                    text-xs

                    text-slate-400
                    dark:text-slate-500
                  "
                >
                  No stock data found for this CSA
                </p>

              </div>
            )}

        </div>

      ) : (

        /* 💻 DESKTOP TABLE */
        <div
          className="
            overflow-hidden

            rounded-[28px]

            bg-white
            dark:bg-slate-900

            border
            border-gray-200
            dark:border-slate-800

            shadow-xl
          "
        >

          <div className="overflow-auto max-h-[520px]">

            <table className="w-full text-xs">

              <thead
                className="
                  sticky top-0 z-10

                  bg-slate-50
                  dark:bg-slate-950
                "
              >

                <tr
                  className="
                    text-slate-500
                    dark:text-slate-400

                    uppercase

                    text-[10px]

                    tracking-[0.15em]

                    font-bold
                  "
                >

                  <th className="p-4 text-left border-b border-gray-100 dark:border-slate-800">
                    Product
                  </th>

                  <th className="p-4 text-left border-b border-gray-100 dark:border-slate-800">
                    Batch / Exp
                  </th>

                  <th className="p-4 text-right border-b border-gray-100 dark:border-slate-800">
                    Purchase
                  </th>

                  <th className="p-4 text-right border-b border-gray-100 dark:border-slate-800">
                    Sale
                  </th>

                  <th className="p-4 text-right border-b border-gray-100 dark:border-slate-800">
                    Closing
                  </th>

                </tr>

              </thead>

              <tbody
                className="
                  divide-y

                  divide-gray-100
                  dark:divide-slate-800
                "
              >

                {paginatedData.map((item, i) => (

                  <tr
                    key={i}
                    className="
                      hover:bg-blue-50/40
                      dark:hover:bg-slate-800/60

                      transition-colors
                    "
                  >

                    <td
                      className="
                        p-4

                        font-semibold

                        text-slate-800
                        dark:text-white
                      "
                    >
                      {item.ProductName}
                    </td>

                    <td className="p-4">

                      <p
                        className="
                          font-bold

                          text-slate-700
                          dark:text-slate-200
                        "
                      >
                        {item.Batch_No}
                      </p>

                      <p
                        className="
                          text-[10px]

                          text-slate-400
                        "
                      >
                        {item.Exp_Date}
                      </p>

                    </td>

                    <td
                      className="
                        p-4
                        text-right

                        font-bold

                        text-blue-600
                        dark:text-blue-300
                      "
                    >
                      {item.PurQty}
                      {" "}
                      |
                      {" "}
                      ₹
                      {safeNum(
                        item.PurAmount
                      )}
                    </td>

                    <td
                      className="
                        p-4
                        text-right

                        font-bold

                        text-green-600
                        dark:text-green-300
                      "
                    >
                      {item.SalQty}
                      {" "}
                      |
                      {" "}
                      ₹
                      {safeNum(
                        item.SaleAmount
                      )}
                    </td>

                    <td
                      className={`
                        p-4
                        text-right

                        font-black

                        ${
                          item.ClosingQty < 10
                            ? `
                              text-red-500
                              dark:text-red-300
                            `
                            : `
                              text-emerald-600
                              dark:text-emerald-300
                            `
                        }
                      `}
                    >
                      {item.ClosingQty}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>
      )}

      {/* PAGINATION */}
      <div
        className="
          flex
          items-center
          justify-between

          gap-3

          rounded-3xl

          bg-white
          dark:bg-slate-900

          border
          border-gray-200
          dark:border-slate-800

          p-4

          shadow-lg

          transition-colors
          duration-300
        "
      >

        <p
          className="
            text-[10px]

            font-bold

            tracking-[0.15em]

            uppercase

            text-slate-400
          "
        >
          Page {page} / {totalPages}
        </p>

        <div className="flex gap-2">

          <button
            disabled={page === 1}
            onClick={() => {

              setPage((p) => p - 1);

            }}
            className="
              px-4 py-2

              text-xs
              font-bold

              rounded-2xl

              border

              border-gray-200
              dark:border-slate-700

              bg-white
              dark:bg-slate-800

              text-slate-700
              dark:text-white

              disabled:opacity-30

              active:scale-95

              transition-all
            "
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => {

              setPage((p) => p + 1);

            }}
            className="
              px-4 py-2

              text-xs
              font-bold

              rounded-2xl

              border

              border-gray-200
              dark:border-slate-700

              bg-blue-600

              text-white

              disabled:opacity-30

              active:scale-95

              transition-all
            "
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
}