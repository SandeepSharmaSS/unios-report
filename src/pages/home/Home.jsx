import { useState } from "react";

import { useOutletContext } from "react-router-dom";

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  CalendarDays,
  Activity,
  CircleDollarSign,
  ShoppingBag,
  BadgeIndianRupee,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { formatNumber } from "../../utils/format";

import TrackingGrid from "../../components/cards/TrackingGrid";

import useDashboard from "../../hooks/useDashboard";

export default function Home() {

  const {
    profile,
    selectedOrg,
  } = useOutletContext();

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const [fromDate, setFromDate] = useState(today);

  const [toDate, setToDate] = useState(today);

  // ✅ DASHBOARD DATA
  const {
    report,
    retailReport,
    tracking,
    details,
    loading,
    detailsLoading,
    fetchCategoryDetails,
    fetchItemDetail,
    itemDetail,
    itemLoading,
  } = useDashboard(
    selectedOrg,
    fromDate,
    toDate
  );

  const sale = report?.SaleAmount || 0;

  const purchase = report?.PurAmount || 0;

  const retail = retailReport?.RetailAmount || 0;

  const total = sale + purchase;

  const percent =
    total > 0
      ? Math.round((sale / total) * 100)
      : 0;

  const isProfit = sale >= purchase;

  const data = [
    {
      name: "Sale",
      value: sale,
    },
    {
      name: "Purchase",
      value: purchase,
    },
  ];

  const COLORS = [
    "#3b82f6",
    "#ef4444",
  ];

  return (
    <div className="space-y-5 overflow-x-hidden">

      {/* NO ORG */}
      {!profile && (
        <div
          className="
            bg-white
            dark:bg-slate-900

            border
            border-gray-200
            dark:border-slate-800

            rounded-3xl

            p-6

            shadow-sm

            text-center

            text-gray-500
            dark:text-slate-400

            transition-colors
            duration-300
          "
        >
          Select organization
        </div>
      )}

      {/* MAIN */}
      {profile && (
        <>
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
              dark:to-indigo-900

              border
              border-gray-200
              dark:border-slate-800

              p-4
              sm:p-5
              lg:p-6

              shadow-xl

              transition-colors
              duration-300
            "
          >

            {/* DARK GLOW */}
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

            <div
              className="
                hidden dark:block

                absolute
                bottom-0
                left-0

                w-40
                h-40

                rounded-full

                bg-blue-500/20

                blur-3xl
              "
            />

            {/* CONTENT */}
            <div
              className="
                relative

                flex
                flex-col
                xl:flex-row

                gap-5

                xl:items-start
                xl:justify-between
              "
            >

              {/* LEFT */}
              <div className="flex-1 min-w-0">

                {/* TITLE */}
                <div className="flex items-center gap-3">

                  <div
                    className="
                      w-12 h-12
                      sm:w-14 sm:h-14

                      rounded-3xl

                      bg-blue-500
                      dark:bg-white/10

                      backdrop-blur-md

                      flex items-center justify-center

                      shadow-lg
                    "
                  >

                    <Wallet
                      size={22}
                      className="
                        text-white
                        dark:text-cyan-300
                      "
                    />

                  </div>

                  <div className="min-w-0">

                    <h1
                      className="
                        text-xl
                        sm:text-3xl

                        font-black

                        text-slate-800
                        dark:text-white

                        truncate
                      "
                    >
                      Dashboard
                    </h1>

                    <p
                      className="
                        text-xs
                        sm:text-sm

                        text-slate-500
                        dark:text-slate-300

                        mt-1
                      "
                    >
                      Financial analytics & workflow tracking
                    </p>

                  </div>

                </div>

                {/* STATS */}
                <div
                  className="
                    grid
                    grid-cols-2
                    lg:grid-cols-4

                    gap-3

                    mt-5
                  "
                >

                  {/* SALE */}
                  <div
                    className="
                      rounded-3xl

                      p-3
                      sm:p-4

                      bg-blue-50
                      dark:bg-white/10

                      border
                      border-blue-100
                      dark:border-white/10

                      backdrop-blur-xl

                      transition-colors
                      duration-300
                    "
                  >

                    <div className="flex items-center justify-between">

                      <p
                        className="
                          text-[11px]

                          text-slate-500
                          dark:text-slate-300
                        "
                      >
                        Sale
                      </p>

                      <TrendingUp
                        size={16}
                        className="text-emerald-500"
                      />

                    </div>

                    <p
                      className="
                        mt-3

                        text-sm
                        sm:text-lg

                        font-black

                        break-words

                        text-slate-800
                        dark:text-white
                      "
                    >
                      ₹ {formatNumber(sale)}
                    </p>

                  </div>

                  {/* PURCHASE */}
                  <div
                    className="
                      rounded-3xl

                      p-3
                      sm:p-4

                      bg-red-50
                      dark:bg-white/10

                      border
                      border-red-100
                      dark:border-white/10

                      backdrop-blur-xl

                      transition-colors
                      duration-300
                    "
                  >

                    <div className="flex items-center justify-between">

                      <p
                        className="
                          text-[11px]

                          text-slate-500
                          dark:text-slate-300
                        "
                      >
                        Purchase
                      </p>

                      <ShoppingBag
                        size={16}
                        className="text-red-500"
                      />

                    </div>

                    <p
                      className="
                        mt-3

                        text-sm
                        sm:text-lg

                        font-black

                        break-words

                        text-slate-800
                        dark:text-white
                      "
                    >
                      ₹ {formatNumber(purchase)}
                    </p>

                  </div>

                  {/* RETAIL */}
                  <div
                    className="
                      rounded-3xl

                      p-3
                      sm:p-4

                      bg-yellow-50
                      dark:bg-white/10

                      border
                      border-yellow-100
                      dark:border-white/10

                      backdrop-blur-xl

                      transition-colors
                      duration-300
                    "
                  >

                    <div className="flex items-center justify-between">

                      <p
                        className="
                          text-[11px]

                          text-slate-500
                          dark:text-slate-300
                        "
                      >
                        Retail
                      </p>

                      <BadgeIndianRupee
                        size={16}
                        className="text-yellow-500"
                      />

                    </div>

                    <p
                      className="
                        mt-3

                        text-sm
                        sm:text-lg

                        font-black

                        break-words

                        text-slate-800
                        dark:text-white
                      "
                    >
                      ₹ {formatNumber(retail)}
                    </p>

                  </div>

                  {/* STATUS */}
                  <div
                    className="
                      rounded-3xl

                      p-3
                      sm:p-4

                      bg-emerald-50
                      dark:bg-white/10

                      border
                      border-emerald-100
                      dark:border-white/10

                      backdrop-blur-xl

                      transition-colors
                      duration-300
                    "
                  >

                    <div className="flex items-center justify-between">

                      <p
                        className="
                          text-[11px]

                          text-slate-500
                          dark:text-slate-300
                        "
                      >
                        Status
                      </p>

                      <Activity
                        size={16}
                        className={
                          isProfit
                            ? "text-emerald-500"
                            : "text-orange-500"
                        }
                      />

                    </div>

                    <p
                      className={`
                        mt-3

                        text-sm
                        sm:text-lg

                        font-black

                        ${
                          isProfit
                            ? `
                              text-emerald-600
                              dark:text-emerald-300
                            `
                            : `
                              text-orange-500
                              dark:text-orange-300
                            `
                        }
                      `}
                    >
                      {isProfit
                        ? "Profit"
                        : "Loss"}
                    </p>

                  </div>

                </div>

              </div>

              {/* RIGHT */}
              <div
                className="
                  w-full
                  xl:w-[320px]

                  shrink-0

                  max-w-full
                "
              >

                {/* DATE FILTER */}
               {/* <div
                  className="
                    rounded-3xl

                    bg-gray-50
                    dark:bg-white/10

                    backdrop-blur-xl

                    border
                    border-gray-200
                    dark:border-white/10

                    p-4

                    transition-colors
                    duration-300
                  "
                >

                  <div className="flex items-center gap-2">

                    <CalendarDays
                      size={16}
                      className="
                        text-blue-500
                        dark:text-cyan-300
                      "
                    />

                    <p
                      className="
                        text-sm

                        font-semibold

                        text-slate-800
                        dark:text-white
                      "
                    >
                      Date Filter
                    </p>

                  </div>

                  <div className="mt-4 space-y-3">

                    <div>

                      <p
                        className="
                          text-[11px]

                          text-slate-500
                          dark:text-slate-300

                          mb-1
                        "
                      >
                        From Date
                      </p>

                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) =>
                          setFromDate(e.target.value)
                        }
                        className="
                          w-full

                          px-3 py-2.5

                          rounded-2xl

                          bg-white
                          dark:bg-white/10

                          border
                          border-gray-200
                          dark:border-white/10

                          text-sm

                          text-slate-700
                          dark:text-white

                          outline-none

                          focus:ring-2
                          focus:ring-blue-500
                        "
                      />

                    </div>

                    <div>

                      <p
                        className="
                          text-[11px]

                          text-slate-500
                          dark:text-slate-300

                          mb-1
                        "
                      >
                        To Date
                      </p>

                      <input
                        type="date"
                        value={toDate}
                        onChange={(e) =>
                          setToDate(e.target.value)
                        }
                        className="
                          w-full

                          px-3 py-2.5

                          rounded-2xl

                          bg-white
                          dark:bg-white/10

                          border
                          border-gray-200
                          dark:border-white/10

                          text-sm

                          text-slate-700
                          dark:text-white

                          outline-none

                          focus:ring-2
                          focus:ring-blue-500
                        "
                      />

                    </div>

                  </div>

                </div> */}

                {/* PIE CHART */}
                <div
                  className="
                    mt-4

                    rounded-3xl

                    bg-gray-50
                    dark:bg-white/10

                    backdrop-blur-xl

                    border
                    border-gray-200
                    dark:border-white/10

                    p-4

                    transition-colors
                    duration-300
                  "
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <p
                        className="
                          text-sm

                          font-semibold

                          text-slate-800
                          dark:text-white
                        "
                      >
                        Revenue Ratio
                      </p>

                      <p
                        className="
                          text-[11px]

                          text-slate-500
                          dark:text-slate-300
                        "
                      >
                        Sales vs Purchase
                      </p>

                    </div>

                    <CircleDollarSign
                      size={18}
                      className="
                        text-blue-500
                        dark:text-cyan-300
                      "
                    />

                  </div>

                  {/* CHART */}
                  <div
                    className="
                      relative

                      w-full

                      h-[240px]
                      sm:h-[260px]

                      mt-3
                    "
                  >

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <PieChart>

                        <Pie
                          data={data}
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >

                          {data.map((_, i) => (
                            <Cell
                              key={i}
                              fill={COLORS[i]}
                            />
                          ))}

                        </Pie>

                        <Tooltip
                          formatter={(v) =>
                            `₹ ${formatNumber(v)}`
                          }
                        />

                      </PieChart>

                    </ResponsiveContainer>

                    {/* CENTER */}
                    <div
                      className="
                        absolute
                        inset-0

                        flex
                        flex-col
                        items-center
                        justify-center

                        pointer-events-none

                        px-6

                        text-center
                      "
                    >

                      <p
                        className="
                          text-[11px]

                          text-slate-500
                          dark:text-slate-300
                        "
                      >
                        Total Business
                      </p>

                      <p
                        className="
                          mt-1

                          text-base
                          sm:text-xl

                          font-black

                          break-words

                          max-w-[180px]

                          leading-tight

                          text-slate-800
                          dark:text-white
                        "
                      >
                        ₹ {formatNumber(total)}
                      </p>

                      <p
                        className="
                          mt-1

                          text-xs

                          text-blue-500
                          dark:text-cyan-300
                        "
                      >
                        {percent}% Sales Share
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* MINI KPI */}
          {!loading && (
            <div
              className="
                grid
                grid-cols-2
                lg:grid-cols-4

                gap-3
              "
            >

              {/* NET */}
              <div
                className={`
                  rounded-3xl

                  p-4

                  shadow-sm

                  border

                  transition-colors
                  duration-300

                  ${
                    isProfit
                      ? `
                        bg-emerald-50
                        dark:bg-emerald-500/10

                        border-emerald-100
                        dark:border-emerald-500/20
                      `
                      : `
                        bg-red-50
                        dark:bg-red-500/10

                        border-red-100
                        dark:border-red-500/20
                      `
                  }
                `}
              >

                <p
                  className="
                    text-[11px]

                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Net Amount
                </p>

                <p
                  className={`
                    mt-2

                    text-sm
                    sm:text-lg

                    font-black

                    break-words

                    ${
                      isProfit
                        ? `
                          text-emerald-600
                          dark:text-emerald-300
                        `
                        : `
                          text-red-500
                          dark:text-red-300
                        `
                    }
                  `}
                >
                  ₹ {formatNumber(sale - purchase)}
                </p>

              </div>

              {/* SALE */}
              <div
                className="
                  rounded-3xl

                  p-4

                  shadow-sm

                  bg-blue-50
                  dark:bg-blue-500/10

                  border
                  border-blue-100
                  dark:border-blue-500/20

                  transition-colors
                  duration-300
                "
              >

                <p
                  className="
                    text-[11px]

                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Sale Amount
                </p>

                <p
                  className="
                    mt-2

                    text-sm
                    sm:text-lg

                    font-black

                    break-words

                    text-blue-600
                    dark:text-blue-300
                  "
                >
                  ₹ {formatNumber(sale)}
                </p>

              </div>

              {/* PURCHASE */}
              <div
                className="
                  rounded-3xl

                  p-4

                  shadow-sm

                  bg-orange-50
                  dark:bg-orange-500/10

                  border
                  border-orange-100
                  dark:border-orange-500/20

                  transition-colors
                  duration-300
                "
              >

                <p
                  className="
                    text-[11px]

                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Purchase Amount
                </p>

                <p
                  className="
                    mt-2

                    text-sm
                    sm:text-lg

                    font-black

                    break-words

                    text-orange-500
                    dark:text-orange-300
                  "
                >
                  ₹ {formatNumber(purchase)}
                </p>

              </div>

              {/* RETAIL */}
              <div
                className="
                  rounded-3xl

                  p-4

                  shadow-sm

                  bg-purple-50
                  dark:bg-purple-500/10

                  border
                  border-purple-100
                  dark:border-purple-500/20

                  transition-colors
                  duration-300
                "
              >

                <p
                  className="
                    text-[11px]

                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Retail Amount
                </p>

                <p
                  className="
                    mt-2

                    text-sm
                    sm:text-lg

                    font-black

                    break-words

                    text-purple-600
                    dark:text-purple-300
                  "
                >
                  ₹ {formatNumber(retail)}
                </p>

              </div>

            </div>
          )}

          {/* TRACKING */}
          {!loading && (
            <TrackingGrid
              tracking={tracking}
              details={details}
              detailsLoading={detailsLoading}
              fetchCategoryDetails={fetchCategoryDetails}
              fetchItemDetail={fetchItemDetail}
              itemDetail={itemDetail}
              itemLoading={itemLoading}
            />
          )}

        </>
      )}

    </div>
  );
}