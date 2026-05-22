import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  productSearch,
  getProductLedger,
} from "../../services/auth.service";

export default function ProductLedger() {

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
    startDate,
    setStartDate,
  ] = useState(
    new Date()
      .toISOString()
      .split("T")[0]
  );

  const [
    endDate,
    setEndDate,
  ] = useState(
    new Date()
      .toISOString()
      .split("T")[0]
  );

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    suggestions,
    setSuggestions,
  ] = useState([]);

  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState(null);

  // 🔍 PRODUCT SEARCH
  useEffect(() => {

    if (query.length < 3) {

      const t = setTimeout(
        () => setSuggestions([]),
        0
      );

      return () => clearTimeout(t);
    }

    const controller =
      new AbortController();

    const delayDebounceFn =
      setTimeout(async () => {

        try {

          const csaId =
            typeof selectedOrg ===
            "object"
              ? selectedOrg.id
              : selectedOrg;

          const res =
            await productSearch(
              query,
              csaId,
              controller.signal
            );

          if (
            res?.success ||
            res?.status === "ok"
          ) {

            const list =
              res.data ||
              res.products ||
              [];

            setSuggestions(
              Array.isArray(list)
                ? list
                : []
            );
          }

        } catch (err) {

          if (
            err.name !==
            "CanceledError"
          ) {
            console.error(err);
          }
        }

      }, 500);

    return () => {

      clearTimeout(
        delayDebounceFn
      );

      controller.abort();

    };

  }, [
    query,
    selectedOrg,
  ]);

  // 📊 GENERATE LEDGER
  const handleGenerateLedger =
    async () => {

      if (!selectedProduct) {

        alert(
          "Pehle product select karo!"
        );

        return;
      }

      setLoading(true);

      try {

        const csaId =
          typeof selectedOrg ===
          "object"
            ? selectedOrg.id
            : selectedOrg;

        const res =
          await getProductLedger(
            startDate,
            endDate,
            selectedProduct.ProductId,
            csaId
          );

        if (
          res?.status === "ok"
        ) {

          setData(
            res.data || []
          );

        } else {

          setData([]);
        }

      } catch (error) {

        console.error(
          "Ledger Error:",
          error
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div
      className="
        relative

        min-h-screen

        overflow-hidden

        space-y-4
        sm:space-y-5

        pb-10

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

          w-[220px]
          h-[220px]

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

          w-[200px]
          h-[200px]

          rounded-full

          bg-blue-500/10

          blur-3xl

          pointer-events-none
        "
      />

      {/* FILTER CARD */}
      <div
        className="
          relative

          overflow-visible

          bg-white/80
          dark:bg-slate-900/80

          backdrop-blur-2xl

          rounded-3xl

          shadow-xl
          shadow-slate-200/40
          dark:shadow-black/20

          border

          border-white/50
          dark:border-slate-800

          p-4
          sm:p-6

          mx-1
          sm:mx-0

          transition-colors
          duration-300
        "
      >

        {/* HEADER */}
        <div
          className="
            flex
            items-center
            justify-between

            mb-5
          "
        >

          <div>

            <h2
              className="
                text-sm
                sm:text-lg

                font-black

                tracking-tight

                text-slate-800
                dark:text-white
              "
            >
              📘 Product Ledger
            </h2>

            <p
              className="
                mt-1

                text-[10px]
                sm:text-xs

                text-slate-500
                dark:text-slate-400

                font-medium
              "
            >
              Product wise stock movement
            </p>

          </div>

          <div
            className="
              hidden
              sm:flex

              w-11
              h-11

              rounded-2xl

              bg-gradient-to-br
              from-cyan-500
              to-blue-600

              items-center
              justify-center

              text-white

              shadow-lg
              shadow-cyan-500/20
            "
          >
            📦
          </div>

        </div>

        <div className="space-y-5">

          {/* SEARCH */}
          <div className="relative">

            <label
              className="
                text-[10px]

                font-black

                uppercase

                tracking-[1px]

                text-slate-400
                dark:text-slate-500

                ml-1
                mb-1

                block
              "
            >
              Product Name
            </label>

            <input
              type="text"
              placeholder="Search e.g. Dolo, Metolar..."
              value={
                selectedProduct
                  ? selectedProduct.ProductName
                  : query
              }
              onChange={(e) => {

                setQuery(
                  e.target.value
                );

                setSelectedProduct(
                  null
                );

                setData([]);

              }}
              className="
                w-full

                text-[12px]
                sm:text-[13px]

                border

                border-slate-200
                dark:border-slate-700

                bg-white/70
                dark:bg-slate-950/70

                text-slate-700
                dark:text-white

                px-4 py-3.5

                rounded-2xl

                outline-none

                focus:ring-2
                focus:ring-cyan-500

                transition-all
              "
            />

            {/* DROPDOWN */}
            {suggestions.length > 0 &&
              !selectedProduct && (

              <div
                className="
                  absolute
                  z-[100]

                  w-full

                  mt-2

                  bg-white
                  dark:bg-slate-900

                  border

                  border-slate-200
                  dark:border-slate-700

                  rounded-2xl

                  shadow-2xl

                  max-h-64

                  overflow-y-auto
                "
              >

                <div
                  className="
                    flex
                    justify-between
                    items-center

                    p-3

                    border-b

                    border-slate-100
                    dark:border-slate-800

                    sticky
                    top-0

                    bg-white/90
                    dark:bg-slate-900/90

                    backdrop-blur-xl
                  "
                >

                  <span
                    className="
                      text-[9px]

                      font-black

                      uppercase

                      text-slate-400
                    "
                  >
                    Select Product
                  </span>

                  <button
                    onClick={() =>
                      setSuggestions([])
                    }
                    className="
                      text-slate-400

                      hover:text-black
                      dark:hover:text-white

                      text-lg

                      font-black
                    "
                  >
                    ×
                  </button>

                </div>

                {suggestions.map(
                  (p) => (

                    <div
                      key={p.ProductId}
                      onClick={() => {

                        setSelectedProduct(
                          p
                        );

                        setSuggestions([]);

                      }}
                      className="
                        flex
                        items-center

                        gap-3

                        p-4

                        cursor-pointer

                        border-b

                        border-slate-100
                        dark:border-slate-800

                        hover:bg-slate-50
                        dark:hover:bg-slate-800

                        transition-colors
                      "
                    >

                      <div
                        className="
                          w-5
                          h-5

                          rounded-md

                          border-2

                          border-slate-200
                          dark:border-slate-700
                        "
                      />

                      <span
                        className="
                          text-[11px]
                          sm:text-[12px]

                          font-bold

                          uppercase

                          leading-tight

                          text-slate-700
                          dark:text-white
                        "
                      >
                        {p.ProductName}
                      </span>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

          {/* DATE FILTER */}
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

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(
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
                  focus:ring-cyan-500

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
                value={endDate}
                onChange={(e) =>
                  setEndDate(
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
                  focus:ring-cyan-500

                  transition-colors
                "
              />

            </div>

          </div>

          {/* BUTTON */}
          <button
            onClick={
              handleGenerateLedger
            }
            disabled={loading}
            className="
              w-full

              bg-gradient-to-r
              from-emerald-500
              to-green-600

              hover:from-emerald-600
              hover:to-green-700

              text-white

              text-[11px]
              sm:text-[12px]

              font-black

              py-3.5
              sm:py-4

              rounded-2xl

              tracking-widest
              uppercase

              shadow-xl
              shadow-green-500/20

              active:scale-[0.98]

              transition-all
              duration-300

              disabled:bg-slate-300
              disabled:shadow-none
            "
          >

            {loading ? (

              <div
                className="
                  flex
                  items-center
                  justify-center

                  gap-2
                "
              >

                <div
                  className="
                    w-3
                    h-3

                    border-2
                    border-white
                    border-t-transparent

                    rounded-full

                    animate-spin
                  "
                />

                <span>
                  Fetching...
                </span>

              </div>

            ) : (
              "Generate Ledger"
            )}

          </button>

        </div>

      </div>

      {/* CARDS */}
      <div
        className="
          space-y-4

          px-1
          sm:px-0
        "
      >

        {data.length > 0 ? (

          data.map(
            (item, i) => (

              <div
                key={i}
                className="
                  relative

                  overflow-hidden

                  bg-white/80
                  dark:bg-slate-900/80

                  backdrop-blur-xl

                  rounded-[24px]

                  p-5

                  shadow-xl
                  shadow-slate-200/30
                  dark:shadow-black/20

                  border

                  border-white/50
                  dark:border-slate-800

                  transition-all
                  duration-300

                  hover:scale-[1.01]
                "
              >

                {/* TOP */}
                <div
                  className="
                    flex
                    justify-between
                    items-start

                    mb-4
                  "
                >

                  <div>

                    <p
                      className="
                        text-[9px]

                        font-black

                        uppercase

                        tracking-[1px]

                        text-cyan-500
                      "
                    >
                      {item.Date}
                    </p>

                    <p
                      className="
                        text-[13px]
                        sm:text-[14px]

                        font-black

                        text-slate-800
                        dark:text-white

                        mt-1
                      "
                    >
                      {item["Vch Type"]}
                    </p>

                  </div>

                  {item.DocNo && (

                    <span
                      className="
                        bg-slate-100
                        dark:bg-slate-800

                        text-slate-500
                        dark:text-slate-300

                        text-[9px]

                        px-3 py-1.5

                        rounded-full

                        font-black
                      "
                    >
                      #{item.DocNo}
                    </span>

                  )}

                </div>

                {/* PARTY */}
                {item.PartyName && (

                  <div
                    className="
                      mb-4

                      bg-slate-50/80
                      dark:bg-slate-800/40

                      border

                      border-slate-100
                      dark:border-slate-700

                      p-3

                      rounded-2xl
                    "
                  >

                    <p
                      className="
                        text-[8px]

                        font-black

                        uppercase

                        tracking-[1px]

                        text-slate-400

                        mb-1
                      "
                    >
                      Party Details
                    </p>

                    <p
                      className="
                        text-[11px]

                        font-bold

                        leading-snug

                        text-slate-700
                        dark:text-slate-200
                      "
                    >
                      {item.PartyName}
                    </p>

                  </div>

                )}

                {/* STATS */}
                <div
                  className="
                    grid
                    grid-cols-3

                    gap-3
                  "
                >

                  <StatBox
                    label="Stock In"
                    value={
                      item.InQty || 0
                    }
                    color="
                      text-emerald-600
                      dark:text-emerald-300
                    "
                  />

                  <StatBox
                    label="Stock Out"
                    value={
                      item.OutQty || 0
                    }
                    color="
                      text-red-500
                      dark:text-red-300
                    "
                  />

                  <div
                    className="
                      bg-gradient-to-br
                      from-slate-900
                      to-slate-800

                      p-2.5

                      rounded-2xl

                      text-center

                      shadow-lg
                    "
                  >

                    <p
                      className="
                        text-[8px]

                        font-black

                        uppercase

                        text-slate-400

                        mb-1
                      "
                    >
                      Balance
                    </p>

                    <p
                      className="
                        text-[13px]

                        font-black

                        text-white
                      "
                    >
                      {item.Balance || 0}
                    </p>

                  </div>

                </div>

              </div>
            )
          )

        ) : (

          !loading && (

            <div
              className="
                flex
                flex-col

                items-center
                justify-center

                py-20

                opacity-40
              "
            >

              <div
                className="
                  w-14
                  h-14

                  rounded-full

                  bg-slate-200
                  dark:bg-slate-700

                  mb-4
                "
              />

              <p
                className="
                  text-[11px]

                  font-black

                  uppercase

                  tracking-[2px]

                  text-slate-400
                "
              >
                No Data Displayed
              </p>

            </div>
          )
        )}

      </div>

    </div>
  );
}

function StatBox({
  label,
  value,
  color,
}) {

  return (

    <div
      className="
        bg-white
        dark:bg-slate-900

        border

        border-slate-100
        dark:border-slate-700

        p-2.5

        rounded-2xl

        text-center
      "
    >

      <p
        className="
          text-[8px]

          font-black

          uppercase

          text-slate-400

          mb-1
        "
      >
        {label}
      </p>

      <p
        className={`
          text-[13px]

          font-black

          ${color}
        `}
      >
        {value}
      </p>

    </div>
  );
}