import {
  useState,
  useEffect,
  useMemo,
} from "react";

import {
  useOutletContext,
} from "react-router-dom";

import {
  getSaleReport,
  productSearch,
} from "../../services/auth.service";

import { debounce } from "lodash";

export default function SaleReport() {

  const {
    selectedOrg,
  } = useOutletContext();

  const csaId =
    typeof selectedOrg ===
    "object"
      ? selectedOrg.id
      : selectedOrg;

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    data,
    setData,
  ] = useState([]);

  const [
    reportType,
    setReportType,
  ] = useState(
    "Detailed Register"
  );

  // 🔥 STATES
  const [
    hasGenerated,
    setHasGenerated,
  ] = useState(false);

  const [
    fetchTrigger,
    setFetchTrigger,
  ] = useState(0);

  const [
    dates,
    setDates,
  ] = useState({
    start: new Date()
      .toISOString()
      .split("T")[0],

    end: new Date()
      .toISOString()
      .split("T")[0],
  });

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    itemsPerPage,
  ] = useState(30);

  const [
    prodSearch,
    setProdSearch,
  ] = useState("");

  const [
    prodResults,
    setProdResults,
  ] = useState([]);

  const [
    selectedProducts,
    setSelectedProducts,
  ] = useState([]);

  const [
    showDropdown,
    setShowDropdown,
  ] = useState(false);

  // 🔥 FORMAT
  const formatCurrency = (
    val
  ) => {

    const num =
      Number(val);

    return isNaN(num)
      ? "0"
      : num.toLocaleString(
          "en-IN"
        );
  };

  // 🔥 PRODUCT SEARCH
  const debouncedFetch =
    useMemo(
      () =>
        debounce(
          async (
            query,
            id
          ) => {

            try {

              const res =
                await productSearch(
                  query,
                  id
                );

              if (
                res?.status ===
                "ok"
              ) {

                setProdResults(
                  res.data ||
                    []
                );
              }

            } catch (err) {

              console.error(
                "Product Search Error:",
                err
              );
            }

          },
          500
        ),
      []
    );

  useEffect(() => {

    if (
      prodSearch &&
      prodSearch.length >= 3
    ) {

      debouncedFetch(
        prodSearch,
        csaId
      );

    } else {

      debouncedFetch.cancel();
    }

    return () =>
      debouncedFetch.cancel();

  }, [
    prodSearch,
    csaId,
    debouncedFetch,
  ]);

  // 🔥 GENERATE
  const handleGenerate =
    () => {

      setHasGenerated(
        true
      );

      setFetchTrigger(
        (prev) =>
          prev + 1
      );
    };

  // 🔥 FETCH REPORT
  useEffect(() => {

    if (!hasGenerated) {
      return;
    }

    const fetchData =
      async () => {

        setLoading(true);

        setCurrentPage(1);

        try {

          const payload =
            {
              startDate:
                dates.start,

              endDate:
                dates.end,

              ProductIds:
                selectedProducts.map(
                  (p) =>
                    p.Id
                ),

              AccountIds:
                [],

              report_type:
                reportType,
            };

          const res =
            await getSaleReport(
              payload
            );

          if (
            res?.success ===
              "ok" ||
            res?.status ===
              "ok"
          ) {

            setData(
              res.data ||
                []
            );

          } else {

            setData([]);
          }

        } catch (error) {

          console.error(
            error
          );

          setData([]);

        } finally {

          setLoading(false);
        }
      };

    fetchData();

  }, [
    fetchTrigger,
    reportType,
  ]);

  // 🔥 PAGINATION
  const totalPages =
    Math.max(
      1,
      Math.ceil(
        data.length /
          itemsPerPage
      )
    );

  const safeCurrentPage =
    currentPage >
    totalPages
      ? totalPages
      : currentPage;

  const currentItems =
    useMemo(() => {

      const start =
        (safeCurrentPage -
          1) *
        itemsPerPage;

      return data.slice(
        start,
        start +
          itemsPerPage
      );

    }, [
      data,
      safeCurrentPage,
      itemsPerPage,
    ]);

  return (

    <div
      className="
        min-h-screen

        bg-slate-100
        dark:bg-slate-950

        text-slate-800
        dark:text-white

        pb-10

        transition-colors
        duration-300

        font-sans
      "
    >

      {/* HEADER */}
      <div
        className="
          bg-white/80
          dark:bg-slate-900/80

          backdrop-blur-2xl

          border-b

          border-slate-200
          dark:border-slate-800

          px-4 py-4

          shadow-sm
        "
      >

        <div
          className="
            max-w-[1400px]
            mx-auto

            flex
            flex-wrap

            items-center
            justify-between

            gap-3
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
                from-blue-600
                to-indigo-600

                text-white

                shadow-lg
                shadow-blue-500/20
              "
            >
              📊
            </div>

            <div>

              <h1
                className="
                  text-sm
                  sm:text-lg

                  font-black

                  uppercase

                  tracking-tight
                "
              >
                Sale Report
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
                Sales Analytics
              </p>

            </div>

          </div>

          <button
            className="
              bg-rose-500
              hover:bg-rose-600

              text-white

              px-5 py-2.5

              rounded-xl

              text-[10px]

              font-black

              uppercase

              shadow-lg
              shadow-rose-500/20

              active:scale-95

              transition-all
            "
          >
            Export Excel
          </button>

        </div>

      </div>

      <div
        className="
          max-w-[1400px]
          mx-auto

          p-4

          space-y-4
        "
      >

        {/* FILTER PANEL */}
        <div
          className="
            relative

            overflow-visible

            bg-white/80
            dark:bg-slate-900/70

            backdrop-blur-2xl

            rounded-3xl

            p-5

            shadow-xl
            shadow-slate-200/30
            dark:shadow-black/20

            border

            border-slate-200
            dark:border-slate-800

            grid
            grid-cols-1
            md:grid-cols-12

            gap-4

            transition-colors
            duration-300
          "
        >

          {/* GLOW */}
          <div
            className="
              absolute
              top-0
              right-0

              w-44
              h-44

              rounded-full

              bg-blue-500/10

              blur-3xl

              pointer-events-none
            "
          />

{/* DATE */}
<div
  className="
    md:col-span-2

    relative
    z-10
  "
>

  <label
    className="
      text-[10px]

      font-black

      uppercase

      tracking-widest

      text-slate-400

      ml-1
    "
  >
    Date Range
  </label>

  <div
    className="
      flex
      items-center

      gap-10
      sm:gap-3

      w-full

      overflow-hidden

      mt-1
    "
  >

    {/* FROM */}
    <div
      className="
        relative

        flex-1
        min-w-0

        max-w-[118px]
        sm:max-w-[145px]
      "
    >

      <input
        type="date"
        value={
          dates.start
        }
        onChange={(
          e
        ) =>
          setDates({
            ...dates,
            start:
              e
                .target
                .value,
          })
        }
        className="
          w-full
          min-w-0

          text-[8px]
          sm:text-[10px]

          px-1.5 py-1.5
          sm:px-2.5 sm:py-2

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
          focus:ring-blue-500

          transition-colors
        "
      />

    </div>

    {/* TO */}
    <div
      className="
        relative

        flex-1
        min-w-0

        max-w-[118px]
        sm:max-w-[145px]
      "
    >

      <input
        type="date"
        value={
          dates.end
        }
        onChange={(
          e
        ) =>
          setDates({
            ...dates,
            end:
              e
                .target
                .value,
          })
        }
        className="
          w-full
          min-w-0

          text-[8px]
          sm:text-[10px]

          px-1.5 py-1.5
          sm:px-2.5 sm:py-2

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
          focus:ring-blue-500

          transition-colors
        "
      />

    </div>

  </div>

</div>

          {/* PRODUCT SEARCH */}
          <div
            className="
              md:col-span-5

              relative
              z-20
            "
          >

            <label
              className="
                text-[10px]

                font-black

                uppercase

                tracking-widest

                text-slate-400

                ml-1
              "
            >
              Search Products
            </label>

            <div
              className="
                flex
                flex-wrap

                gap-2

                p-2

                min-h-[45px]

                bg-white
                dark:bg-slate-950

                rounded-2xl

                mt-1

                border

                border-slate-200
                dark:border-slate-700

                focus-within:ring-2
                focus-within:ring-blue-500

                transition-all
              "
            >

              {selectedProducts.map(
                (
                  p,
                  idx
                ) => (

                  <span
                    key={`sel-${p.Id || idx}`}
                    className="
                      bg-blue-600

                      text-white

                      text-[10px]

                      font-black

                      px-2 py-1

                      rounded-md

                      flex
                      items-center

                      gap-1

                      shadow-sm
                    "
                  >

                    {
                      p.ProductName
                    }

                    <button
                      onClick={() =>
                        setSelectedProducts(
                          (
                            prev
                          ) =>
                            prev.filter(
                              (
                                x
                              ) =>
                                x.Id !==
                                p.Id
                            )
                        )
                      }
                      className="
                        ml-1

                        hover:text-rose-200
                      "
                    >
                      ×
                    </button>

                  </span>
                )
              )}

              <input
                placeholder={
                  selectedProducts.length >
                  0
                    ? ""
                    : "Search 3+ letters..."
                }
                value={
                  prodSearch
                }
                onChange={(
                  e
                ) => {

                  setProdSearch(
                    e.target.value
                  );

                  setShowDropdown(
                    true
                  );

                }}
                className="
                  bg-transparent

                  border-none

                  outline-none

                  text-xs

                  text-slate-700
                  dark:text-white

                  flex-1

                  min-w-[120px]
                "
              />

            </div>

            {/* DROPDOWN */}
            {showDropdown &&
              prodResults.length >
                0 && (

              <div
                className="
                  absolute

                  w-full

                  bg-white
                  dark:bg-slate-900

                  mt-2

                  rounded-2xl

                  shadow-2xl

                  border

                  border-slate-200
                  dark:border-slate-700

                  z-[999]

                  max-h-60

                  overflow-y-auto
                "
              >

                {prodResults.map(
                  (
                    p,
                    index
                  ) => (

                    <div
                      key={`search-res-${p.Id || index}`}
                      onClick={() => {

                        if (
                          !selectedProducts.find(
                            (
                              x
                            ) =>
                              x.Id ===
                              p.Id
                          )
                        ) {

                          setSelectedProducts([
                            ...selectedProducts,
                            p,
                          ]);
                        }

                        setProdSearch(
                          ""
                        );

                        setShowDropdown(
                          false
                        );

                      }}
                      className="
                        p-3

                        hover:bg-blue-50
                        dark:hover:bg-slate-800

                        cursor-pointer

                        border-b

                        border-slate-100
                        dark:border-slate-800

                        last:border-0
                      "
                    >

                      <p
                        className="
                          text-xs

                          font-bold

                          text-slate-700
                          dark:text-white
                        "
                      >
                        {
                          p.ProductName
                        }
                      </p>

                      <p
                        className="
                          text-[9px]

                          text-slate-400

                          uppercase

                          font-bold
                        "
                      >
                        {
                          p.Company_Name
                        }
                      </p>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

          {/* REPORT TYPE */}
          <div
            className="
              md:col-span-2

              relative
              z-10
            "
          >

            <label
              className="
                text-[10px]

                font-black

                uppercase

                tracking-widest

                text-slate-400

                ml-1
              "
            >
              Report Type
            </label>

            <select
              value={
                reportType
              }
              onChange={(
                e
              ) =>
                setReportType(
                  e.target.value
                )
              }
              className="
                w-full

                bg-white
                dark:bg-slate-950

                border

                border-slate-200
                dark:border-slate-700

                rounded-2xl

                p-3

                text-xs

                font-bold

                text-slate-700
                dark:text-white

                mt-1

                outline-none

                focus:ring-2
                focus:ring-blue-500
              "
            >

              <option>
                Detailed Register
              </option>

              <option>
                Bill Wise
              </option>

              <option>
                Product Wise
              </option>

            </select>

          </div>

          {/* BUTTON */}
          <div
            className="
              md:col-span-2

              flex
              items-end

              relative
              z-10
            "
          >

            <button
              onClick={
                handleGenerate
              }
              disabled={
                loading
              }
              className="
                w-full

                bg-gradient-to-r
                from-blue-600
                to-indigo-600

                hover:from-blue-700
                hover:to-indigo-700

                text-white

                py-3.5

                rounded-2xl

                font-black

                text-xs

                shadow-lg
                shadow-blue-500/20

                active:scale-95

                disabled:opacity-50

                transition-all
              "
            >

              {loading
                ? "SEARCHING..."
                : "GENERATE"}

            </button>

          </div>

        </div>

        {/* DATA */}
        <div
          className="
            space-y-3
          "
        >

          {/* MOBILE */}
          <div
            className="
              md:hidden

              space-y-4
            "
          >

            {currentItems.length >
            0 ? (

              currentItems.map(
                (
                  item,
                  idx
                ) => (

                  <div
                    key={`mob-${idx}`}
                    className="
                      relative

                      overflow-hidden

                      bg-white/80
                      dark:bg-slate-900/70

                      backdrop-blur-xl

                      p-4

                      rounded-3xl

                      shadow-xl
                      shadow-slate-200/20
                      dark:shadow-black/20

                      border

                      border-slate-200
                      dark:border-slate-800

                      transition-all
                      duration-300
                    "
                  >

                    {/* HEADER */}
                    <div
                      className="
                        flex
                        justify-between
                        items-start

                        mb-2
                      "
                    >

                      <span
                        className="
                          text-[10px]

                          font-black

                          text-blue-600
                          dark:text-blue-300

                          bg-blue-50
                          dark:bg-blue-500/10

                          px-2 py-1

                          rounded-lg
                        "
                      >
                        {reportType ===
                        "Product Wise"
                          ? item.ProductName
                          : (
                              item.InvoiceNo ||
                              "N/A"
                            )}
                      </span>

                      <span
                        className="
                          text-[10px]

                          font-bold

                          text-slate-400
                        "
                      >
                        {
                          item.InvoiceDate
                        }
                      </span>

                    </div>

                    {/* PRODUCT WISE */}
                    {reportType ===
                    "Product Wise" ? (

                      <>
                        <div
                          className="
                            grid
                            grid-cols-2

                            gap-2

                            text-[10px]

                            text-slate-600
                            dark:text-slate-300

                            mb-3
                          "
                        >

                          <p>
                            <b>
                              Qty:
                            </b>
                            {" "}
                            {
                              item.TotalQty
                            }
                          </p>

                          <p>
                            <b>
                              Rate:
                            </b>
                            {" "}
                            ₹
                            {formatCurrency(
                              item.Rate
                            )}
                          </p>

                          <p>
                            <b>
                              MRP:
                            </b>
                            {" "}
                            ₹
                            {formatCurrency(
                              item.Mrp
                            )}
                          </p>

                          <p>
                            <b>
                              GST:
                            </b>
                            {" "}
                            {
                              item.Gst_per
                            }
                            %
                          </p>

                          <p>
                            <b>
                              Taxable:
                            </b>
                            {" "}
                            ₹
                            {formatCurrency(
                              item.TaxableAmount
                            )}
                          </p>

                          <p>
                            <b>
                              CGST:
                            </b>
                            {" "}
                            ₹
                            {formatCurrency(
                              item.CGSt_Amt
                            )}
                          </p>

                          <p>
                            <b>
                              SGST:
                            </b>
                            {" "}
                            ₹
                            {formatCurrency(
                              item.SGSt_Amt
                            )}
                          </p>

                        </div>

                        <div
                          className="
                            flex
                            justify-between

                            mt-3

                            border-t

                            border-slate-200
                            dark:border-slate-700

                            pt-2
                          "
                        >

                          <p
                            className="
                              text-[11px]

                              font-black

                              text-slate-700
                              dark:text-white
                            "
                          >
                            Total:
                          </p>

                          <p
                            className="
                              text-[12px]

                              font-black

                              text-emerald-600
                              dark:text-emerald-300
                            "
                          >
                            ₹
                            {formatCurrency(
                              item.InvoiceAmount
                            )}
                          </p>

                        </div>

                      </>

                    ) : reportType ===
                      "Bill Wise" ? (

                      <>
                        <h3
                          className="
                            text-xs

                            font-black

                            text-slate-800
                            dark:text-white

                            uppercase

                            mb-1
                          "
                        >
                          {
                            item.CustomerName
                          }
                        </h3>

                        <div
                          className="
                            grid
                            grid-cols-2

                            gap-2

                            text-[10px]

                            text-slate-600
                            dark:text-slate-300

                            mb-3
                          "
                        >

                          <p>
                            <b>
                              Taxable:
                            </b>
                            {" "}
                            ₹
                            {formatCurrency(
                              item.TaxableAmount
                            )}
                          </p>

                          <p>
                            <b>
                              CGST:
                            </b>
                            {" "}
                            ₹
                            {formatCurrency(
                              item.CGST_Amt
                            )}
                          </p>

                          <p>
                            <b>
                              SGST:
                            </b>
                            {" "}
                            ₹
                            {formatCurrency(
                              item.SGST_Amt
                            )}
                          </p>

                          <p>
                            <b>
                              IGST:
                            </b>
                            {" "}
                            ₹
                            {formatCurrency(
                              item.IGST_Amt
                            )}
                          </p>

                        </div>

                        <div
                          className="
                            flex
                            justify-between

                            mt-3

                            border-t

                            border-slate-200
                            dark:border-slate-700

                            pt-2
                          "
                        >

                          <p
                            className="
                              text-[11px]

                              font-black

                              text-slate-700
                              dark:text-white
                            "
                          >
                            Net:
                          </p>

                          <p
                            className="
                              text-[12px]

                              font-black

                              text-emerald-600
                              dark:text-emerald-300
                            "
                          >
                            ₹
                            {formatCurrency(
                              item.NetAmount
                            )}
                          </p>

                        </div>

                      </>

                    ) : (

                      <>
                        <h3
                          className="
                            text-xs

                            font-black

                            text-slate-800
                            dark:text-white

                            uppercase

                            mb-1
                          "
                        >
                          {
                            item.CustomerName
                          }
                        </h3>

                        <p
                          className="
                            text-[10px]

                            font-bold

                            text-slate-500
                            dark:text-slate-400

                            mb-2
                          "
                        >
                          {
                            item.ProductName
                          }
                        </p>

                        <div
                          className="
                            grid
                            grid-cols-2

                            gap-2

                            text-[10px]

                            text-slate-600
                            dark:text-slate-300

                            mb-3
                          "
                        >

                          <p>
                            <b>
                              Company:
                            </b>
                            {" "}
                            {
                              item.ProductCompanyName
                            }
                          </p>

                          <p>
                            <b>
                              Salt:
                            </b>
                            {" "}
                            {
                              item.ProductGenericName
                            }
                          </p>

                          <p>
                            <b>
                              Batch:
                            </b>
                            {" "}
                            {
                              item.Batch_No
                            }
                          </p>

                          <p>
                            <b>
                              Exp:
                            </b>
                            {" "}
                            {
                              item.Exp_Date
                            }
                          </p>

                          <p>
                            <b>
                              Qty:
                            </b>
                            {" "}
                            {
                              item.TotalQty
                            }
                          </p>

                          <p>
                            <b>
                              Free:
                            </b>
                            {" "}
                            {
                              item.FreeQty
                            }
                          </p>

                          <p>
                            <b>
                              Rate:
                            </b>
                            {" "}
                            ₹
                            {formatCurrency(
                              item.Rate
                            )}
                          </p>

                          <p>
                            <b>
                              MRP:
                            </b>
                            {" "}
                            ₹
                            {formatCurrency(
                              item.MRP
                            )}
                          </p>

                        </div>

                        <div
                          className="
                            border-t

                            border-slate-200
                            dark:border-slate-700

                            pt-2

                            text-[10px]

                            text-slate-600
                            dark:text-slate-300

                            space-y-1
                          "
                        >

                          <p>
                            <b>
                              Disc:
                            </b>
                            {" "}
                            {
                              item.Disc_Per
                            }
                            %
                            (
                            ₹
                            {formatCurrency(
                              item.Disc_Amount
                            )}
                            )
                          </p>

                          <p>
                            <b>
                              GST:
                            </b>
                            {" "}
                            {
                              item.Gst_Per
                            }
                            %
                          </p>

                          <p>
                            <b>
                              Taxable:
                            </b>
                            {" "}
                            ₹
                            {formatCurrency(
                              item.Taxable_Amount
                            )}
                          </p>

                        </div>

                        <div
                          className="
                            flex
                            justify-between

                            mt-3

                            border-t

                            border-slate-200
                            dark:border-slate-700

                            pt-2
                          "
                        >

                          <p
                            className="
                              text-[11px]

                              font-black

                              text-slate-700
                              dark:text-white
                            "
                          >
                            Net:
                          </p>

                          <p
                            className="
                              text-[12px]

                              font-black

                              text-emerald-600
                              dark:text-emerald-300
                            "
                          >
                            ₹
                            {formatCurrency(
                              item.NetAmount
                            )}
                          </p>

                        </div>

                      </>
                    )}

                  </div>
                )
              )

            ) : (

              !loading && (

                <p
                  className="
                    text-center

                    text-slate-400

                    text-xs

                    py-10

                    font-bold
                  "
                >
                  No Data Found
                </p>
              )
            )}

          </div>

          {/* DESKTOP TABLE */}
          <div
            className="
              hidden
              md:block

              bg-white/80
              dark:bg-slate-900/70

              backdrop-blur-2xl

              rounded-3xl

              shadow-xl
              shadow-slate-200/20
              dark:shadow-black/20

              border

              border-slate-200
              dark:border-slate-800

              overflow-hidden
            "
          >

            <table
              className="
                w-full

                border-collapse
              "
            >

              <thead
                className="
                  bg-slate-800
                  dark:bg-slate-950

                  text-white
                "
              >

                <tr>

                  <th className="px-3 py-3 text-[10px]">
                    Date
                  </th>

                  <th className="px-3 py-3 text-[10px]">
                    Invoice
                  </th>

                  <th className="px-3 py-3 text-[10px]">
                    SO
                  </th>

                  <th className="px-3 py-3 text-[10px]">
                    PP
                  </th>

                  <th className="px-3 py-3 text-[10px]">
                    Customer
                  </th>

                  <th className="px-3 py-3 text-[10px]">
                    Product
                  </th>

                  <th className="px-3 py-3 text-[10px]">
                    Company
                  </th>

                  <th className="px-3 py-3 text-[10px]">
                    Batch
                  </th>

                  <th className="px-3 py-3 text-[10px]">
                    Exp
                  </th>

                  <th className="px-3 py-3 text-[10px] text-center">
                    Qty
                  </th>

                  <th className="px-3 py-3 text-[10px] text-right">
                    Rate
                  </th>

                  <th className="px-3 py-3 text-[10px] text-right">
                    Amount
                  </th>

                </tr>

              </thead>

              <tbody
                className="
                  divide-y

                  divide-slate-200
                  dark:divide-slate-800
                "
              >

                {currentItems.map(
                  (
                    item,
                    idx
                  ) => (

                    <tr
                      key={idx}
                      className="
                        hover:bg-slate-50
                        dark:hover:bg-slate-800/40

                        transition-colors
                      "
                    >

                      <td className="px-3 py-2 text-xs">
                        {
                          item.InvoiceDate
                        }
                      </td>

                      <td className="px-3 py-2 text-xs font-bold">
                        {
                          item.InvoiceNo
                        }
                      </td>

                      <td className="px-3 py-2 text-xs">
                        {
                          item.SONo
                        }
                      </td>

                      <td className="px-3 py-2 text-xs">
                        {
                          item.PPNo
                        }
                      </td>

                      <td className="px-3 py-2 text-xs">
                        {
                          item.CustomerName
                        }
                      </td>

                      <td className="px-3 py-2 text-xs font-semibold">
                        {
                          item.ProductName
                        }
                      </td>

                      <td className="px-3 py-2 text-xs">
                        {
                          item.Company_Name
                        }
                      </td>

                      <td className="px-3 py-2 text-xs">
                        {
                          item.Batch_No
                        }
                      </td>

                      <td className="px-3 py-2 text-xs">
                        {
                          item.Exp_Date
                        }
                      </td>

                      <td className="px-3 py-2 text-xs text-center">
                        {item.TotalQty ||
                          0}
                      </td>

                      <td className="px-3 py-2 text-xs text-right">
                        ₹
                        {formatCurrency(
                          item.Rate
                        )}
                      </td>

                      <td
                        className="
                          px-3 py-2

                          text-xs

                          text-right

                          text-green-600
                          dark:text-emerald-300

                          font-bold
                        "
                      >
                        ₹
                        {formatCurrency(
                          item.NetAmount
                        )}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}