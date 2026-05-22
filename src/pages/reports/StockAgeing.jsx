import { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import useStockAgeing from "../../hooks/useStockAgeing";

export default function StockAgeing() {

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const {
    selectedOrg,
  } = useOutletContext();

  const [
    fromDate,
    setFromDate,
  ] = useState(today);

  const [
    toDate,
    setToDate,
  ] = useState(today);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    limit,
    setLimit,
  ] = useState(30);

  const [
    trigger,
    setTrigger,
  ] = useState(0);

  const {
    data,
    loading,
  } = useStockAgeing(
    fromDate,
    toDate,
    trigger,
    selectedOrg
  );

  const [
    isMobile,
    setIsMobile,
  ] = useState(
    window.innerWidth < 768
  );

  useEffect(() => {

    const handleResize =
      () =>
        setIsMobile(
          window.innerWidth < 768
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

  const filtered = useMemo(() => {

    if (!data) return [];

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

  const totalPages =
    Math.ceil(
      filtered.length / limit
    ) || 1;

  const paginatedData =
    filtered.slice(
      (page - 1) * limit,
      page * limit
    );

  const totals = useMemo(() => {

    return filtered.reduce(
      (acc, curr) => ({
        stock:
          acc.stock +
          (Number(
            curr.Stock
          ) || 0),

        value:
          acc.value +
          (Number(
            curr.StockValue
          ) || 0),

        dead:
          acc.dead +
          (curr.StockHealth ===
          "Dead Stock"
            ? 1
            : 0),

        slow:
          acc.slow +
          (curr.MovementCategory ===
          "Slow Moving"
            ? 1
            : 0),
      }),
      {
        stock: 0,
        value: 0,
        dead: 0,
        slow: 0,
      }
    );

  }, [filtered]);

  return (
    <div
      className="
        relative

        min-h-screen

        overflow-hidden

        p-3
        sm:p-4

        space-y-4
        sm:space-y-5

        bg-gradient-to-br
        from-slate-100
        via-gray-50
        to-blue-50

        dark:from-[#020617]
        dark:via-[#071226]
        dark:to-[#0f172a]

        transition-colors
        duration-300
      "
    >

      {/* BG GLOW */}
      <div
        className="
          absolute
          top-0
          right-0

          w-[260px]
          h-[260px]

          rounded-full

          bg-cyan-400/10

          blur-3xl

          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-0
          left-0

          w-[240px]
          h-[240px]

          rounded-full

          bg-blue-500/10

          blur-3xl

          pointer-events-none
        "
      />

      {/* CSA WARNING */}
      {!selectedOrg && (
        <div
          className="
            relative

            overflow-hidden

            bg-orange-50
            dark:bg-orange-500/10

            border
            border-orange-200
            dark:border-orange-500/20

            rounded-2xl

            p-4

            shadow-lg

            backdrop-blur-xl
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                w-10
                h-10

                rounded-xl

                bg-orange-500

                flex
                items-center
                justify-center

                text-white

                shadow-lg
              "
            >
              ⚠️
            </div>

            <div>

              <p
                className="
                  text-sm

                  font-black

                  text-orange-700
                  dark:text-orange-300
                "
              >
                CSA Not Selected
              </p>

              <p
                className="
                  text-[11px]

                  text-orange-600
                  dark:text-orange-200/80
                "
              >
                Bhai pehle CSA select karo.
              </p>

            </div>

          </div>

        </div>
      )}

      {/* HEADER */}
      <div
        className="
          relative

          flex
          flex-col
          md:flex-row

          md:items-center
          md:justify-between

          gap-3
        "
      >

        <div>

          <h2
            className="
              text-xl
              sm:text-3xl

              font-black

              tracking-tight

              text-slate-800
              dark:text-white
            "
          >
            ⏳ Stock Ageing
          </h2>

          <p
            className="
              mt-1

              text-[11px]
              sm:text-sm

              text-slate-500
              dark:text-slate-400

              font-medium
            "
          >
            Inventory Health & Movement Analysis
          </p>

        </div>

        <button
          className="
            bg-yellow-400
            hover:bg-yellow-500

            dark:bg-yellow-500
            dark:hover:bg-yellow-400

            text-black

            px-4 py-2.5

            rounded-2xl

            text-xs
            sm:text-sm

            font-black

            shadow-xl
            shadow-yellow-500/20

            transition-all
            duration-300

            active:scale-95
          "
        >
          ⬇ Export CSV
        </button>

      </div>

      {/* FILTER BAR */}
      <div
        className="
          relative

          overflow-hidden

          bg-white/80
          dark:bg-slate-900/80

          backdrop-blur-2xl

          border

          border-white/50
          dark:border-slate-800

          rounded-3xl

          p-3
          sm:p-4

          shadow-xl
          shadow-slate-200/40
          dark:shadow-black/20

          transition-colors
          duration-300
        "
      >

        <div
          className="
            flex
            flex-col
            md:flex-row

            gap-3

            md:items-center
            md:justify-between
          "
        >

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

            {/* FROM */}
            <div
              className="
                relative

                flex-1
                min-w-0

                max-w-[132px]
                sm:max-w-[165px]
              "
            >

              <input
                type="date"
                value={fromDate}
                onChange={(e) =>
                  setFromDate(
                    e.target.value
                  )
                }
                className="
                  w-full
                  min-w-0

                  text-[9px]
                  sm:text-[11px]

                  px-2 py-1.5
                  sm:px-3 sm:py-2

                  rounded-lg
                  sm:rounded-xl

                  border

                  border-slate-200
                  dark:border-slate-700

                  bg-white/70
                  dark:bg-slate-950/70

                  text-slate-700
                  dark:text-white

                  shadow-sm

                  outline-none

                  focus:ring-2
                  focus:ring-cyan-500

                  transition-all
                "
              />

            </div>

            {/* TO */}
            <div
              className="
                relative

                flex-1
                min-w-0

                max-w-[132px]
                sm:max-w-[165px]
              "
            >

              <input
                type="date"
                value={toDate}
                onChange={(e) =>
                  setToDate(
                    e.target.value
                  )
                }
                className="
                  w-full
                  min-w-0

                  text-[9px]
                  sm:text-[11px]

                  px-2 py-1.5
                  sm:px-3 sm:py-2

                  rounded-lg
                  sm:rounded-xl

                  border

                  border-slate-200
                  dark:border-slate-700

                  bg-white/70
                  dark:bg-slate-950/70

                  text-slate-700
                  dark:text-white

                  shadow-sm

                  outline-none

                  focus:ring-2
                  focus:ring-cyan-500

                  transition-all
                "
              />

            </div>

          </div>

          {/* BUTTON */}
          <button
            onClick={() => {

              setTrigger(
                (prev) => prev + 1
              );

              setPage(1);

            }}
            disabled={
              !selectedOrg ||
              loading
            }
            className={`
              px-5 py-2.5

              rounded-2xl

              text-[11px]
              sm:text-sm

              font-black

              whitespace-nowrap

              transition-all
              duration-300

              active:scale-95

              shadow-xl

              ${
                !selectedOrg
                  ? `
                    bg-slate-300
                    dark:bg-slate-700

                    text-slate-500
                    dark:text-slate-400

                    cursor-not-allowed
                  `
                  : `
                    bg-gradient-to-r
                    from-cyan-500
                    to-blue-600

                    text-white

                    shadow-cyan-500/20
                  `
              }
            `}
          >
            {loading
              ? "Loading..."
              : "🔍 Generate Report"}
          </button>

        </div>

      </div>

      {/* SEARCH */}
      <div
        className="
          flex
          items-center
          justify-between

          gap-3
        "
      >

        <div
          className="
            relative

            flex-1

            max-w-sm
          "
        >

          <input
            type="text"
            placeholder="Search by product or batch..."
            value={search}
            onChange={(e) => {

              setSearch(
                e.target.value
              );

              setPage(1);

            }}
            className="
              w-full

              text-xs
              sm:text-sm

              rounded-2xl

              border

              border-white/50
              dark:border-slate-700

              bg-white/80
              dark:bg-slate-900/80

              backdrop-blur-xl

              text-slate-700
              dark:text-white

              px-4 py-3

              shadow-sm

              outline-none

              focus:ring-2
              focus:ring-cyan-500

              transition-all
            "
          />

        </div>

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
            text-[11px]
            sm:text-xs

            rounded-2xl

            border

            border-white/50
            dark:border-slate-700

            bg-white/80
            dark:bg-slate-900/80

            text-slate-700
            dark:text-white

            px-3 py-3

            shadow-sm

            outline-none
          "
        >

          {[30, 50, 100].map(
            (v) => (
              <option
                key={v}
                value={v}
              >
                {v} Rows
              </option>
            )
          )}

        </select>

      </div>

      {/* SUMMARY */}
      <div
        className="
          grid
          grid-cols-2
          lg:grid-cols-4

          gap-3
        "
      >

        <SummaryCard
          title="Total Qty"
          value={totals.stock.toLocaleString()}
          color="blue"
        />

        <SummaryCard
          title="Stock Value"
          value={`₹${totals.value.toLocaleString()}`}
          color="green"
        />

        <SummaryCard
          title="Slow Items"
          value={totals.slow}
          color="orange"
        />

        <SummaryCard
          title="Dead Stock"
          value={totals.dead}
          color="red"
        />

      </div>

    {/* DATA AREA */}
    <div
      className="
        bg-white
        dark:bg-slate-900

        rounded-2xl
        sm:rounded-3xl

        shadow-sm
        dark:shadow-none

        border
        border-gray-200
        dark:border-slate-800

        overflow-hidden

        mb-10

        transition-colors
        duration-300
      "
    >

      {loading ? (

        <div className="p-20 text-center">

          <div
            className="
              animate-spin

              h-8 w-8

              border-4
              border-blue-600
              border-t-transparent

              rounded-full

              mx-auto
              mb-4
            "
          />

          <p
            className="
              text-sm

              text-slate-500
              dark:text-slate-400

              font-medium
            "
          >
            Fetching Data for CSA: {selectedOrg}...
          </p>

        </div>

      ) : filtered.length === 0 ? (

        <p
          className="
            p-10

            text-center

            text-sm

            text-slate-400
            dark:text-slate-500

            font-medium
          "
        >
          {trigger === 0
            ? "Select date and click Generate."
            : "No records found"}
        </p>

      ) : isMobile ? (

        /* 📱 MOBILE */
        <div
          className="
            grid
            grid-cols-1

            gap-3

            p-3

            bg-gray-50
            dark:bg-slate-950
          "
        >

          {paginatedData.map(
            (item, idx) => (

              <div
                key={idx}
                className="
                  bg-white
                  dark:bg-slate-900

                  border
                  border-gray-100
                  dark:border-slate-800

                  rounded-2xl

                  p-4

                  shadow-sm

                  active:scale-[0.98]

                  transition-transform
                  duration-300
                "
              >

                <div className="flex justify-between items-start mb-2">

                  <h3
                    className="
                      text-sm

                      font-bold

                      text-slate-800
                      dark:text-white

                      flex-1

                      pr-2

                      leading-tight
                    "
                  >
                    {item.ProductName}
                  </h3>

                  <Badge
                    type="health"
                    value={item.StockHealth}
                  />

                </div>

                <div
                  className="
                    grid
                    grid-cols-2

                    gap-y-2

                    mt-3
                    pt-3

                    border-t
                    border-dashed

                    border-gray-100
                    dark:border-slate-700
                  "
                >

                  <DetailItem
                    label="Batch"
                    value={item.Batch_No}
                  />

                  <DetailItem
                    label="Expiry"
                    value={item.Exp_Date}
                  />

                  <DetailItem
                    label="Stock"
                    value={item.Stock}
                    bold
                  />

                  <DetailItem
                    label="Value"
                    value={`₹${item.StockValue}`}
                    color="text-blue-600 dark:text-blue-300"
                    bold
                  />

                  <DetailItem
                    label="Move Days"
                    value={`${item.MovementDays} Days`}
                  />

                  <DetailItem
                    label="Movement"
                    value={
                      <Badge
                        type="movement"
                        value={item.MovementCategory}
                      />
                    }
                  />

                </div>

              </div>
            )
          )}

        </div>

      ) : (

        /* 🖥 TABLE */
        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead
              className="
                bg-gray-50
                dark:bg-slate-950

                border-b

                border-gray-100
                dark:border-slate-800
              "
            >

              <tr>

                <th
                  className="
                    p-4

                    text-xs

                    font-bold

                    text-slate-500
                    dark:text-slate-400

                    uppercase

                    tracking-wider
                  "
                >
                  Product & Batch
                </th>

                <th
                  className="
                    p-4

                    text-xs

                    font-bold

                    text-slate-500
                    dark:text-slate-400

                    uppercase

                    tracking-wider

                    text-center
                  "
                >
                  Stock
                </th>

                <th
                  className="
                    p-4

                    text-xs

                    font-bold

                    text-slate-500
                    dark:text-slate-400

                    uppercase

                    tracking-wider

                    text-center
                  "
                >
                  Value
                </th>

                <th
                  className="
                    p-4

                    text-xs

                    font-bold

                    text-slate-500
                    dark:text-slate-400

                    uppercase

                    tracking-wider

                    text-center
                  "
                >
                  Movement
                </th>

                <th
                  className="
                    p-4

                    text-xs

                    font-bold

                    text-slate-500
                    dark:text-slate-400

                    uppercase

                    tracking-wider

                    text-center
                  "
                >
                  Health
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

              {paginatedData.map(
                (item, idx) => (

                  <tr
                    key={idx}
                    className="
                      hover:bg-blue-50
                      dark:hover:bg-slate-800/60

                      transition-colors
                    "
                  >

                    <td className="p-4">

                      <p
                        className="
                          font-bold

                          text-slate-800
                          dark:text-white

                          text-sm
                        "
                      >
                        {item.ProductName}
                      </p>

                      <p
                        className="
                          text-[10px]

                          text-slate-400

                          font-medium
                        "
                      >
                        Batch: {item.Batch_No} | Exp: {item.Exp_Date}
                      </p>

                    </td>

                    <td
                      className="
                        p-4

                        text-center

                        font-semibold

                        text-slate-700
                        dark:text-slate-300
                      "
                    >
                      {item.Stock}
                    </td>

                    <td
                      className="
                        p-4

                        text-center

                        font-bold

                        text-blue-600
                        dark:text-blue-300
                      "
                    >
                      ₹{item.StockValue}
                    </td>

                    <td className="p-4 text-center">

                      <Badge
                        type="movement"
                        value={item.MovementCategory}
                      />

                    </td>

                    <td className="p-4 text-center">

                      <Badge
                        type="health"
                        value={item.StockHealth}
                      />

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>
      )}

      {/* PAGINATION */}
      <div
        className="
          flex
          justify-between
          items-center

          p-4

          border-t

          bg-gray-50
          dark:bg-slate-950

          border-gray-100
          dark:border-slate-800

          transition-colors
        "
      >

        <p
          className="
            text-[11px]

            text-slate-500
            dark:text-slate-400

            font-bold

            uppercase
          "
        >
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">

          <button
            disabled={page === 1}
            onClick={() => {

              setPage(
                (p) => p - 1
              );

              window.scrollTo(0, 0);

            }}
            className="
              px-4 py-1.5

              text-xs

              font-black

              border

              border-gray-200
              dark:border-slate-700

              rounded-xl

              disabled:opacity-30

              bg-white
              dark:bg-slate-900

              text-slate-700
              dark:text-white

              shadow-sm

              active:bg-gray-100
              dark:active:bg-slate-800

              transition-colors
            "
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => {

              setPage(
                (p) => p + 1
              );

              window.scrollTo(0, 0);

            }}
            className="
              px-4 py-1.5

              text-xs

              font-black

              border

              border-gray-200
              dark:border-slate-700

              rounded-xl

              disabled:opacity-30

              bg-white
              dark:bg-slate-900

              text-slate-700
              dark:text-white

              shadow-sm

              active:bg-gray-100
              dark:active:bg-slate-800

              transition-colors
            "
          >
            Next
          </button>

        </div>

      </div>

    </div>

  </div>
);
}

// Sub-Components
function SummaryCard({ title, value, color }) {

  const colors = {
    blue: `
      border-blue-500

      text-blue-600
      dark:text-blue-300

      bg-blue-50/60
      dark:bg-blue-500/10
    `,

    green: `
      border-emerald-500

      text-emerald-600
      dark:text-emerald-300

      bg-emerald-50/60
      dark:bg-emerald-500/10
    `,

    orange: `
      border-orange-500

      text-orange-600
      dark:text-orange-300

      bg-orange-50/60
      dark:bg-orange-500/10
    `,

    red: `
      border-red-500

      text-red-600
      dark:text-red-300

      bg-red-50/60
      dark:bg-red-500/10
    `,
  };

  return (

    <div
      className={`
        relative

        overflow-hidden

        rounded-2xl
        sm:rounded-3xl

        border-l-[5px]

        px-3 py-3
        sm:px-4 sm:py-4

        shadow-sm
        dark:shadow-none

        backdrop-blur-xl

        transition-all
        duration-300

        active:scale-[0.98]

        border
        border-white/60
        dark:border-slate-800

        bg-white
        dark:bg-slate-900

        ${colors[color]}
      `}
    >

      {/* Glow */}
      <div
        className="
          absolute

          -top-10
          -right-10

          w-24
          h-24

          rounded-full

          bg-white/40
          dark:bg-white/5

          blur-2xl
        "
      />

      <p
        className="
          relative

          text-[9px]
          sm:text-[10px]

          uppercase

          font-black

          tracking-[1px]

          text-slate-400
          dark:text-slate-500

          mb-1
        "
      >
        {title}
      </p>

      <h3
        className="
          relative

          text-[20px]
          sm:text-lg
          lg:text-2xl

          font-black

          leading-tight

          text-slate-800
          dark:text-white

          break-words
        "
      >
        {value}
      </h3>

    </div>
  );
}

function DetailItem({
  label,
  value,
  color = `
    text-slate-800
    dark:text-slate-200
  `,
  bold = false,
}) {

  return (

    <div className="flex flex-col min-w-0">

      <span
        className="
          text-[9px]

          text-slate-400
          dark:text-slate-500

          uppercase

          font-black

          tracking-[1px]

          mb-0.5
        "
      >
        {label}
      </span>

      <span
        className={`
          text-[11px]
          sm:text-xs

          ${
            bold
              ? "font-bold"
              : "font-medium"
          }

          ${color}

          truncate
        `}
      >
        {value}
      </span>

    </div>
  );
}

function Badge({ type, value }) {

  let style = `
    bg-gray-100
    dark:bg-slate-800

    text-gray-600
    dark:text-slate-300

    border
    border-gray-200
    dark:border-slate-700
  `;

  if (type === "movement") {

    if (value?.includes("Non")) {

      style = `
        bg-red-50
        dark:bg-red-500/10

        text-red-600
        dark:text-red-300

        border
        border-red-100
        dark:border-red-500/20
      `;

    } else if (value?.includes("Slow")) {

      style = `
        bg-orange-50
        dark:bg-orange-500/10

        text-orange-600
        dark:text-orange-300

        border
        border-orange-100
        dark:border-orange-500/20
      `;

    } else {

      style = `
        bg-emerald-50
        dark:bg-emerald-500/10

        text-emerald-600
        dark:text-emerald-300

        border
        border-emerald-100
        dark:border-emerald-500/20
      `;
    }

  } else {

    if (value?.includes("Dead")) {

      style = `
        bg-red-600
        dark:bg-red-500

        text-white

        shadow-md
        shadow-red-500/20
      `;

    } else {

      style = `
        bg-emerald-600
        dark:bg-emerald-500

        text-white

        shadow-md
        shadow-emerald-500/20
      `;
    }
  }

  return (

    <span
      className={`
        px-2.5 py-1

        rounded-xl

        text-[9px]
        sm:text-[10px]

        font-black

        uppercase

        whitespace-nowrap

        tracking-[1px]

        transition-all
        duration-300

        ${style}
      `}
    >
      {value || "Unknown"}
    </span>
  );
}