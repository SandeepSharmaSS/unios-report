import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getNonMovingStock } from "../../services/auth.service";

export default function NonMovingStock() {

  const {
    selectedOrg,
  } = useOutletContext();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    data,
    setData,
  ] = useState([]);

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    fromDate,
    setFromDate,
  ] = useState(
    new Date()
      .toISOString()
      .split("T")[0]
  );

  const [
    toDate,
    setToDate,
  ] = useState(
    new Date()
      .toISOString()
      .split("T")[0]
  );

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const itemsPerPage = 50;

  // 🔥 FETCH REPORT
  const handleFetchReport =
    async () => {

      setLoading(true);

      setCurrentPage(1);

      try {

        const csaId =
          typeof selectedOrg ===
          "object"
            ? selectedOrg.id
            : selectedOrg;

        if (!csaId) {
          return;
        }

        const res =
          await getNonMovingStock(
            fromDate,
            toDate,
            csaId
          );

        if (
          res?.status === "ok"
        ) {

          setData(
            res.data || []
          );
        }

      } catch (error) {

        console.error(
          "Non-Moving Error:",
          error
        );

      } finally {

        setLoading(false);
      }
    };

  // 🔥 FILTER
  const filteredData =
    data.filter((item) =>

      item.ProductName
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        ) ||

      item.Batch_No
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
    );

  // 🔥 PAGINATION
  const indexOfLastItem =
    currentPage *
    itemsPerPage;

  const indexOfFirstItem =
    indexOfLastItem -
    itemsPerPage;

  const currentItems =
    filteredData.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

  const totalPages =
    Math.ceil(
      filteredData.length /
      itemsPerPage
    );

  // 🔥 TOTALS
  const totalQty =
    data.reduce(
      (acc, item) =>
        acc +
        (item.Stock || 0),
      0
    );

  const totalValue =
    data.reduce(
      (acc, item) =>
        acc +
        (item.StockValue || 0),
      0
    );

  return (

    <div
      className="
        min-h-screen

        pb-24

        transition-colors
        duration-300

        text-slate-800
        dark:text-white
      "
    >

      {/* 🔥 TOP HEADER */}
      <div
        className="
          sticky
          top-0
          z-40

          backdrop-blur-2xl

          bg-white/80
          dark:bg-slate-950/80

          border-b

          border-slate-200
          dark:border-slate-800

          shadow-sm

          px-3
          sm:px-4

          py-3
        "
      >

        <div
          className="
            max-w-[1600px]
            mx-auto

            flex
            items-center
            justify-between
          "
        >

          <div
            className="
              flex
              items-center

              gap-3
            "
          >

            <div
              className="
                w-10
                h-10

                rounded-2xl

                flex
                items-center
                justify-center

                bg-gradient-to-br
                from-indigo-500
                to-violet-600

                shadow-lg
                shadow-indigo-500/20

                text-white

                text-lg
              "
            >
              📉
            </div>

            <div>

              <h1
                className="
                  text-sm
                  sm:text-xl

                  font-black

                  uppercase

                  leading-none
                "
              >
                Non-Moving
              </h1>

              <p
                className="
                  text-[9px]
                  sm:text-[10px]

                  font-black

                  uppercase

                  tracking-widest

                  text-slate-400
                  dark:text-slate-500

                  mt-1
                "
              >
                Inventory Aging
              </p>

            </div>

          </div>

          <button
            className="
              bg-amber-500
              hover:bg-amber-600

              text-white

              px-4
              py-2

              rounded-xl

              text-[10px]

              font-black

              transition-all

              active:scale-95

              shadow-lg
              shadow-amber-500/20
            "
          >
            CSV
          </button>

        </div>

      </div>

      <div
        className="
          max-w-[1600px]
          mx-auto

          p-3
          sm:p-4

          space-y-4
          sm:space-y-6
        "
      >

        {/* 🔥 FILTER CARD */}
        <div
          className="
            relative

            overflow-hidden

            rounded-3xl

            border

            border-slate-200
            dark:border-slate-800

            bg-white/80
            dark:bg-slate-900/70

            backdrop-blur-2xl

            shadow-xl
            shadow-slate-200/40
            dark:shadow-black/20

            p-4
            sm:p-5
          "
        >

          {/* BG GLOW */}
          <div
            className="
              absolute
              top-0
              right-0

              w-40
              h-40

              rounded-full

              bg-indigo-500/10

              blur-3xl

              pointer-events-none
            "
          />

          <div
            className="
              relative

              space-y-4
            "
          >

            {/* 🔥 DATE FILTER */}
            <div
              className="
                flex
                items-center

                gap-6
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

                    bg-white
                    dark:bg-slate-950

                    text-slate-700
                    dark:text-white

                    outline-none

                    focus:ring-2
                    focus:ring-indigo-500

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

                    bg-white
                    dark:bg-slate-950

                    text-slate-700
                    dark:text-white

                    outline-none

                    focus:ring-2
                    focus:ring-indigo-500

                    transition-colors
                  "
                />

              </div>

            </div>

            {/* 🔥 SEARCH */}
            <div>

              <input
                type="text"
                placeholder="Search product or batch..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
                className="
                  w-full

                  rounded-2xl

                  border

                  border-slate-200
                  dark:border-slate-700

                  bg-white
                  dark:bg-slate-950

                  text-slate-700
                  dark:text-white

                  px-4 py-3

                  text-xs
                  sm:text-sm

                  font-semibold

                  outline-none

                  focus:ring-2
                  focus:ring-indigo-500

                  transition-all
                "
              />

            </div>

            {/* 🔥 BUTTON */}
            <button
              onClick={
                handleFetchReport
              }
              disabled={loading}
              className="
                w-full

                bg-gradient-to-r
                from-indigo-600
                to-violet-600

                hover:from-indigo-700
                hover:to-violet-700

                text-white

                py-3

                rounded-2xl

                text-[11px]
                sm:text-xs

                font-black

                uppercase

                tracking-widest

                shadow-xl
                shadow-indigo-500/20

                transition-all

                active:scale-[0.98]

                disabled:opacity-50
              "
            >

              {loading
                ? "PROCESSING..."
                : "GENERATE DATA"}

            </button>

          </div>

        </div>

        {/* 🔥 SUMMARY */}
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
            value={totalQty.toLocaleString()}
            icon="📦"
            color="blue"
          />

          <SummaryCard
            title="Value"
            value={`₹${Math.round(totalValue).toLocaleString()}`}
            icon="💰"
            color="emerald"
          />

          <SummaryCard
            title=">90 Days"
            value={
              data.filter(
                (i) =>
                  i.NonMovingDays >
                  90
              ).length
            }
            icon="⏳"
            color="amber"
          />

          <SummaryCard
            title="Critical"
            value={
              data.filter(
                (i) =>
                  i.NonMovingDays >
                  180
              ).length
            }
            icon="⚠️"
            color="rose"
          />

        </div>

        {/* 🔥 MOBILE CARDS */}
        <div
          className="
            grid
            grid-cols-1

            gap-3

            md:hidden
          "
        >

          {currentItems.map(
            (item) => (

              <div
                key={item.Id}
                className="
                  relative

                  overflow-hidden

                  rounded-3xl

                  border

                  border-slate-200
                  dark:border-slate-800

                  bg-white/80
                  dark:bg-slate-900/70

                  backdrop-blur-xl

                  shadow-xl
                  shadow-slate-200/30
                  dark:shadow-black/20

                  p-4
                "
              >

                {/* GLOW */}
                <div
                  className="
                    absolute
                    top-0
                    right-0

                    w-28
                    h-28

                    rounded-full

                    bg-indigo-500/10

                    blur-3xl
                  "
                />

                <div
                  className="
                    relative
                  "
                >

                  <div
                    className="
                      flex
                      justify-between
                      items-start

                      mb-4
                    "
                  >

                    <div>

                      <h3
                        className="
                          text-xs

                          font-black

                          uppercase

                          leading-tight

                          pr-16
                        "
                      >
                        {item.ProductName}
                      </h3>

                      <p
                        className="
                          text-[9px]

                          font-bold

                          text-slate-400
                          dark:text-slate-500

                          mt-1
                        "
                      >
                        #{item.Id}
                      </p>

                    </div>

                    <span
                      className={`
                        text-[9px]
                        font-black

                        px-2 py-1

                        rounded-xl

                        ${
                          item.NonMovingDays >
                          180
                            ? "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300"
                            : "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300"
                        }
                      `}
                    >
                      {
                        item.NonMovingDays
                      } DAYS
                    </span>

                  </div>

                  <div
                    className="
                      grid
                      grid-cols-2

                      gap-4

                      border-t

                      border-slate-100
                      dark:border-slate-800

                      pt-4
                    "
                  >

                    <div>

                      <p
                        className="
                          text-[8px]

                          font-black

                          uppercase

                          text-slate-400
                        "
                      >
                        Batch / Exp
                      </p>

                      <p
                        className="
                          text-[10px]

                          font-bold

                          mt-1
                        "
                      >
                        {item.Batch_No}

                        <span
                          className="
                            text-rose-500

                            ml-1
                          "
                        >
                          /
                          {" "}
                          {
                            item.Exp_Date
                          }
                        </span>

                      </p>

                    </div>

                    <div
                      className="
                        text-right
                      "
                    >

                      <p
                        className="
                          text-[8px]

                          font-black

                          uppercase

                          text-slate-400
                        "
                      >
                        Stock Qty
                      </p>

                      <p
                        className="
                          text-[11px]

                          font-black

                          mt-1
                        "
                      >
                        {item.Stock}
                      </p>

                    </div>

                    <div>

                      <p
                        className="
                          text-[8px]

                          font-black

                          uppercase

                          text-slate-400
                        "
                      >
                        Last Movement
                      </p>

                      <p
                        className="
                          text-[9px]

                          font-bold

                          mt-1

                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        S:
                        {" "}
                        {item.LastSaleDate
                          ? new Date(
                              item.LastSaleDate
                            ).toLocaleDateString()
                          : "NEVER"}
                      </p>

                    </div>

                    <div
                      className="
                        text-right
                      "
                    >

                      <p
                        className="
                          text-[8px]

                          font-black

                          uppercase

                          text-slate-400
                        "
                      >
                        Stock Value
                      </p>

                      <p
                        className="
                          text-[11px]

                          font-black

                          text-indigo-600
                          dark:text-indigo-300

                          mt-1
                        "
                      >
                        ₹
                        {item.StockValue.toLocaleString()}
                      </p>

                    </div>

                  </div>

                </div>

              </div>
            )
          )}

        </div>

        {/* 🔥 DESKTOP TABLE */}
        <div
          className="
            hidden
            md:block

            overflow-hidden

            rounded-3xl

            border

            border-slate-200
            dark:border-slate-800

            bg-white/80
            dark:bg-slate-900/70

            backdrop-blur-2xl

            shadow-xl
            shadow-slate-200/30
            dark:shadow-black/20
          "
        >

          <table
            className="
              w-full

              text-left
            "
          >

            <thead>

              <tr
                className="
                  bg-slate-50
                  dark:bg-slate-900

                  border-b

                  border-slate-100
                  dark:border-slate-800
                "
              >

                <th
                  className="
                    px-6 py-4

                    text-[10px]

                    font-black

                    uppercase

                    tracking-widest

                    text-slate-400
                  "
                >
                  Product Details
                </th>

                <th
                  className="
                    px-6 py-4

                    text-[10px]

                    font-black

                    uppercase

                    tracking-widest

                    text-center

                    text-slate-400
                  "
                >
                  Batch / Expiry
                </th>

                <th
                  className="
                    px-6 py-4

                    text-[10px]

                    font-black

                    uppercase

                    tracking-widest

                    text-center

                    text-slate-400
                  "
                >
                  Movement
                </th>

                <th
                  className="
                    px-6 py-4

                    text-[10px]

                    font-black

                    uppercase

                    tracking-widest

                    text-right

                    text-slate-400
                  "
                >
                  Aging & Value
                </th>

              </tr>

            </thead>

            <tbody
              className="
                divide-y

                divide-slate-100
                dark:divide-slate-800
              "
            >

              {currentItems.map(
                (item) => (

                  <tr
                    key={item.Id}
                    className="
                      hover:bg-slate-50/80
                      dark:hover:bg-slate-800/30

                      transition-colors
                    "
                  >

                    <td
                      className="
                        px-6 py-4
                      "
                    >

                      <span
                        className="
                          font-black

                          uppercase
                        "
                      >
                        {
                          item.ProductName
                        }
                      </span>

                      <p
                        className="
                          text-[10px]

                          text-slate-400

                          mt-1
                        "
                      >
                        ID:
                        {" "}
                        {item.Id}
                      </p>

                    </td>

                    <td
                      className="
                        px-6 py-4

                        text-center
                      "
                    >

                      <span
                        className="
                          bg-slate-100
                          dark:bg-slate-800

                          px-2 py-1

                          rounded-lg

                          text-[11px]

                          font-bold
                        "
                      >
                        {
                          item.Batch_No
                        }
                      </span>

                      <p
                        className="
                          text-[10px]

                          font-black

                          text-rose-400

                          mt-2

                          uppercase
                        "
                      >
                        EXP:
                        {" "}
                        {
                          item.Exp_Date
                        }
                      </p>

                    </td>

                    <td
                      className="
                        px-6 py-4

                        text-center

                        text-[10px]

                        font-bold

                        text-slate-500
                        dark:text-slate-400
                      "
                    >

                      P:
                      {" "}
                      {new Date(
                        item.LastPurchaseDate
                      ).toLocaleDateString()}

                      <br />

                      S:
                      {" "}
                      {item.LastSaleDate
                        ? new Date(
                            item.LastSaleDate
                          ).toLocaleDateString()
                        : "NEVER"}

                    </td>

                    <td
                      className="
                        px-6 py-4

                        text-right
                      "
                    >

                      <span
                        className={`
                          text-[10px]
                          font-black

                          px-2 py-1

                          rounded-full

                          ${
                            item.NonMovingDays >
                            90
                              ? "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300"
                              : "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300"
                          }
                        `}
                      >
                        {
                          item.NonMovingDays
                        } DAYS
                      </span>

                      <p
                        className="
                          text-indigo-600
                          dark:text-indigo-300

                          font-black

                          mt-2
                        "
                      >
                        ₹
                        {item.StockValue.toLocaleString()}
                      </p>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

        {/* 🔥 PAGINATION */}
        {totalPages > 1 && (

          <div
            className="
              flex
              items-center
              justify-between

              rounded-2xl

              border

              border-slate-200
              dark:border-slate-800

              bg-white/80
              dark:bg-slate-900/70

              backdrop-blur-xl

              p-4

              shadow-lg
            "
          >

            <button
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (p) => p - 1
                )
              }
              className="
                text-[10px]

                font-black

                uppercase

                px-4 py-2

                rounded-xl

                border

                border-slate-200
                dark:border-slate-700

                disabled:opacity-30
              "
            >
              Prev
            </button>

            <span
              className="
                text-[10px]

                font-black

                uppercase

                tracking-widest

                text-slate-400
              "
            >
              PAGE
              {" "}
              {currentPage}
              {" "}
              /
              {" "}
              {totalPages}
            </span>

            <button
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (p) => p + 1
                )
              }
              className="
                text-[10px]

                font-black

                uppercase

                px-4 py-2

                rounded-xl

                border

                border-slate-200
                dark:border-slate-700

                disabled:opacity-30
              "
            >
              Next
            </button>

          </div>
        )}

        {/* 🔥 EMPTY */}
        {currentItems.length ===
          0 &&
          !loading && (

          <div
            className="
              rounded-3xl

              border
              border-dashed

              border-slate-200
              dark:border-slate-700

              bg-white/60
              dark:bg-slate-900/60

              p-10

              text-center
            "
          >

            <p
              className="
                text-xs

                font-black

                uppercase

                tracking-widest

                text-slate-400
              "
            >
              No matching records found
            </p>

          </div>
        )}

      </div>

    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  color,
}) {

  const colorMap = {

    blue:
      "border-blue-400 bg-blue-50/70 dark:bg-blue-500/10",

    emerald:
      "border-emerald-400 bg-emerald-50/70 dark:bg-emerald-500/10",

    amber:
      "border-amber-400 bg-amber-50/70 dark:bg-amber-500/10",

    rose:
      "border-rose-400 bg-rose-50/70 dark:bg-rose-500/10",
  };

  return (

    <div
      className={`
        border-l-4

        ${colorMap[color]}

        rounded-2xl

        p-3
        sm:p-4

        shadow-lg
        shadow-slate-200/20
        dark:shadow-black/20

        border-t
        border-r
        border-b

        border-slate-100
        dark:border-slate-800

        backdrop-blur-xl
      `}
    >

      <div
        className="
          flex
          justify-between
          items-start
        "
      >

        <p
          className="
            text-[8px]
            sm:text-[10px]

            font-black

            uppercase

            text-slate-400
          "
        >
          {title}
        </p>

        <span
          className="
            text-xs
            sm:text-sm
          "
        >
          {icon}
        </span>

      </div>

      <p
        className="
          text-xs
          sm:text-lg

          font-black

          text-slate-800
          dark:text-white

          mt-2

          truncate
        "
      >
        {value}
      </p>

    </div>
  );
}