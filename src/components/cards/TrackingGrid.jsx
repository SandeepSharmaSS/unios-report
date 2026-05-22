import { useMemo, useState } from "react";

import {
  Search,
  Package,
  ChevronRight,
  Clock3,
  CheckCircle2,
  Layers3,
  ArrowLeft,
  X,
  Eye,
} from "lucide-react";

export default function TrackingGrid({
  tracking,
  details,
  fetchItemDetail,
  itemDetail,
  itemLoading,
  fetchCategoryDetails,
  detailsLoading,
}) {

  const [selectedCard, setSelectedCard] = useState(null);

  const [activeTab, setActiveTab] =
    useState("pending");

  const [search, setSearch] =
    useState("");

  const [viewMode, setViewMode] =
    useState("list");

  // 🔥 CURRENT DETAILS
  const currentDetails = useMemo(() => {

    return (
      details?.[selectedCard] || {}
    );

  }, [
    details,
    selectedCard,
  ]);

  // 🔥 FILTERED LIST
  const list = useMemo(() => {

    const raw =
      currentDetails?.[activeTab] || [];

    if (!search) return raw;

    const q =
      search.toLowerCase();

    return raw.filter((i) =>
      (
        i.SalOrd_No ||
        i.Invoice_No ||
        i.DocNo ||
        ""
      )
        .toLowerCase()
        .includes(q) ||

      (
        i.LedgerName || ""
      )
        .toLowerCase()
        .includes(q)
    );

  }, [
    currentDetails,
    activeTab,
    search,
  ]);

  // 🔥 CARDS
  const cards = useMemo(() => ([

    {
      key: "saleOrder",
      title: "Sale Order",
      data: tracking?.saleOrder,
      color: "from-blue-500 to-cyan-400",
      icon: <Package size={18} />,
    },

    {
      key: "pickslip",
      title: "Pick Slip",
      data: tracking?.pickslip,
      color: "from-green-500 to-emerald-400",
      icon: <Layers3 size={18} />,
    },

    {
      key: "picking",
      title: "Picking",
      data: tracking?.picking,
      color: "from-purple-500 to-pink-400",
      icon: <Clock3 size={18} />,
    },

    {
      key: "qc",
      title: "QC",
      data: tracking?.qc,
      color: "from-orange-500 to-yellow-400",
      icon: <CheckCircle2 size={18} />,
    },

    {
      key: "pack",
      title: "Pack",
      data: tracking?.pack,
      color: "from-green-700 to-green-400",
      icon: <Layers3 size={18} />,
    },

    {
      key: "invoice",
      title: "Invoice",
      data: tracking?.invoice,
      color: "from-red-500 to-pink-400",
      icon: <Package size={18} />,
    },

    {
      key: "stn",
      title: "STN",
      data: tracking?.stn,
      color: "from-black to-gray-700",
      icon: <Layers3 size={18} />,
    },

    {
      key: "label",
      title: "Label",
      data: tracking?.label,
      color: "from-yellow-400 to-yellow-200",
      icon: <Package size={18} />,
    },

    {
      key: "dispatch",
      title: "Dispatch",
      data: tracking?.dispatch,
      color: "from-gray-500 to-gray-300",
      icon: <ChevronRight size={18} />,
    },

  ]), [tracking]);

  // 🔥 BADGE COLOR
  const badgeStyle = (tab) => {

    if (tab === "pending") {
      return `
        bg-yellow-100
        text-yellow-700
        dark:bg-yellow-500/20
        dark:text-yellow-300
      `;
    }

    if (tab === "partial") {
      return `
        bg-blue-100
        text-blue-700
        dark:bg-blue-500/20
        dark:text-blue-300
      `;
    }

    return `
      bg-green-100
      text-green-700
      dark:bg-green-500/20
      dark:text-green-300
    `;
  };

  if (!tracking) return null;

  return (
    <div className="mt-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">

        <div>

          <h2
            className="
              text-base
              sm:text-lg

              font-bold

              text-gray-800
              dark:text-white
            "
          >
            Sales Dashboard
          </h2>

          <p
            className="
              text-xs

              text-gray-500
              dark:text-slate-400
            "
          >
            Track all workflow stages
          </p>

        </div>

      </div>

      {/* GRID */}
{/* GRID */}
<div
  className="
    grid
    grid-cols-2
    sm:grid-cols-3
    xl:grid-cols-4

    gap-2
    sm:gap-3
  "
>

  {cards.map((item, i) => {

    const d = item.data || {};

    const total =
      (d.pending || 0) +
      (d.partial || 0) +
      (d.complete || 0) +
      (d.direct || 0) +
      (d.Indirect || 0);

    return (
      <div
        key={i}
        onClick={() => {

          setSelectedCard(
            item.key
          );

          setActiveTab(
            "pending"
          );

          setSearch("");

          setViewMode(
            "list"
          );

          fetchCategoryDetails(
            item.key
          );
        }}
        className={`
          relative

          overflow-hidden

          rounded-2xl
          sm:rounded-3xl

          p-2.5
          sm:p-4

          text-white

          shadow-lg
          sm:shadow-xl

          bg-gradient-to-br
          ${item.color}

          cursor-pointer

          active:scale-95
          hover:scale-[1.015]

          transition-all
          duration-300

          min-h-[108px]
          sm:min-h-[150px]
        `}
      >

        {/* GLOW */}
        <div
          className="
            absolute
            -right-5
            -top-5

            w-16
            h-16
            sm:w-24
            sm:h-24

            bg-white/10

            rounded-full
          "
        />

        {/* TOP */}
        <div className="relative flex items-start justify-between gap-2">

          <div className="min-w-0">

            <p
              className="
                text-[10px]
                sm:text-xs

                font-medium

                text-white/80

                truncate
              "
            >
              {item.title}
            </p>

            <p
              className="
                text-lg
                sm:text-2xl

                font-black

                mt-1
                sm:mt-2

                leading-none
              "
            >
              {total}
            </p>

          </div>

          <div
            className="
              w-8 h-8
              sm:w-10 sm:h-10

              rounded-xl
              sm:rounded-2xl

              bg-white/15

              flex items-center justify-center

              backdrop-blur-sm

              shrink-0
            "
          >
            <div className="scale-90 sm:scale-100">
              {item.icon}
            </div>
          </div>

        </div>

        {/* STATS */}
        <div
          className="
            flex
            gap-1.5
            sm:gap-2

            mt-3
            sm:mt-4

            flex-wrap
          "
        >

          {d.pending !== undefined && (
            <div
              className="
                bg-white/15

                px-1.5 py-1
                sm:px-2 sm:py-1

                rounded-lg
                sm:rounded-xl

                text-[9px]
                sm:text-[10px]

                font-semibold

                backdrop-blur-sm

                leading-none
              "
            >
              Pending {d.pending}
            </div>
          )}

          {d.partial !== undefined && (
            <div
              className="
                bg-white/15

                px-1.5 py-1
                sm:px-2 sm:py-1

                rounded-lg
                sm:rounded-xl

                text-[9px]
                sm:text-[10px]

                font-semibold

                backdrop-blur-sm

                leading-none
              "
            >
              Partial {d.partial}
            </div>
          )}

          {d.complete !== undefined && (
            <div
              className="
                bg-white/15

                px-1.5 py-1
                sm:px-2 sm:py-1

                rounded-lg
                sm:rounded-xl

                text-[9px]
                sm:text-[10px]

                font-semibold

                backdrop-blur-sm

                leading-none
              "
            >
              Complete {d.complete}
            </div>
          )}

        </div>

      </div>
    );
  })}

</div>

      {/* POPUP */}
      {selectedCard && (
        <div
          className="
            fixed inset-0

            bg-black/50
            backdrop-blur-sm

            flex
            items-end
            sm:items-center

            justify-center

            z-50

            animate-fadeIn
          "
        >

          <div
            className="
              bg-white
              dark:bg-slate-950

              w-full
              sm:w-[460px]

              h-[82vh]
              sm:h-[620px]

              rounded-t-3xl
              sm:rounded-3xl

              flex flex-col

              shadow-2xl

              border
              border-gray-200
              dark:border-slate-800

              animate-slideUp

              overflow-hidden
            "
          >

            {/* HEADER */}
            <div
              className="
                flex
                justify-between
                items-center

                p-4

                border-b

                border-gray-200
                dark:border-slate-800

                bg-white
                dark:bg-slate-950
              "
            >

              <div>

                <h3
                  className="
                    font-bold
                    text-sm
                    uppercase

                    tracking-wide

                    text-gray-800
                    dark:text-white
                  "
                >
                  {viewMode === "list"
                    ? `${selectedCard} Details`
                    : "Items"}
                </h3>

                <p
                  className="
                    text-[10px]

                    text-gray-400
                    dark:text-slate-500
                  "
                >
                  Workflow Information
                </p>

              </div>

              <button
                onClick={() => {

                  setSelectedCard(null);

                  setViewMode("list");

                  fetchItemDetail(null);

                }}
                className="
                  w-9 h-9

                  rounded-xl

                  bg-red-50
                  dark:bg-red-500/10

                  text-red-500

                  flex items-center justify-center
                "
              >
                <X size={16} />
              </button>

            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto">

              {/* ================= LIST VIEW ================= */}
              {viewMode === "list" && (
                <>

                  {detailsLoading ? (

                    <div
                      className="
                        flex flex-col
                        items-center justify-center

                        h-full

                        py-20
                      "
                    >

                      <div
                        className="
                          animate-spin

                          rounded-full

                          h-10 w-10

                          border-b-2
                          border-blue-600
                        "
                      />

                      <p
                        className="
                          text-xs

                          text-gray-500
                          dark:text-slate-400

                          mt-3
                        "
                      >
                        Loading {selectedCard} list...
                      </p>

                    </div>

                  ) : (

                    <>
                      {/* SEARCH */}
                      <div
                        className="
                          p-4

                          border-b

                          border-gray-200
                          dark:border-slate-800
                        "
                      >

                        <div className="relative">

                          <Search
                            size={14}
                            className="
                              absolute
                              left-3
                              top-1/2
                              -translate-y-1/2

                              text-gray-400
                              dark:text-slate-500
                            "
                          />

                          <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) =>
                              setSearch(e.target.value)
                            }
                            className="
                              w-full

                              text-xs

                              pl-9 pr-3 py-3

                              border

                              border-gray-200
                              dark:border-slate-700

                              rounded-2xl

                              bg-gray-50
                              dark:bg-slate-900

                              text-slate-700
                              dark:text-white

                              focus:outline-none
                              focus:ring-2
                              focus:ring-blue-500
                            "
                          />

                        </div>

                      </div>

                      {/* TABS */}
                      <div
                        className="
                          flex
                          gap-2

                          px-4 py-3

                          border-b

                          border-gray-200
                          dark:border-slate-800

                          bg-gray-50
                          dark:bg-slate-900

                          overflow-x-auto
                        "
                      >

                        {[
                          "pending",
                          "partial",
                          "complete",
                        ].map((tab) => (

                          <button
                            key={tab}
                            onClick={() => {

                              setActiveTab(tab);

                              if (typeof setSelectedItem === "function") {
                                setSelectedItem(null);
                              }

                            }}
                            className={`
                              px-4 py-2

                              text-xs
                              font-semibold

                              rounded-2xl

                              whitespace-nowrap

                              transition-all

                              ${
                                activeTab === tab
                                  ? `
                                    bg-blue-600
                                    text-white

                                    shadow-lg
                                  `
                                  : `
                                    bg-gray-200
                                    dark:bg-slate-800

                                    text-gray-600
                                    dark:text-slate-300
                                  `
                              }
                            `}
                          >
                            {tab.toUpperCase()} (
                            {currentDetails?.[tab]?.length || 0}
                            )
                          </button>

                        ))}

                      </div>

                      {/* LIST */}
                      <div className="p-3 space-y-3">

                        {list.length > 0 ? (

                          list.map((item, index) => (

                            <div
                              key={index}
                              className="
                                bg-white
                                dark:bg-slate-900

                                border

                                border-gray-200
                                dark:border-slate-800

                                rounded-2xl

                                p-4

                                shadow-sm

                                hover:border-blue-200
                                dark:hover:border-slate-700

                                transition-colors
                              "
                            >

                              <div className="flex justify-between gap-3">

                                <div className="min-w-0 flex-1">

                                  <p
                                    className="
                                      text-xs

                                      font-bold

                                      text-slate-800
                                      dark:text-white

                                      truncate
                                    "
                                  >
                                    {item.SalOrd_No ||
                                      item.Invoice_No ||
                                      item.DocNo}
                                  </p>

                                  <p
                                    className="
                                      text-[11px]

                                      text-gray-500
                                      dark:text-slate-400

                                      mt-1

                                      break-words
                                    "
                                  >
                                    {item.LedgerName}
                                  </p>

                                </div>

                                <button
                                  onClick={(e) => {

                                    e.stopPropagation();

                                    const docNo =
                                      ["picking", "qc", "pack"].includes(selectedCard)
                                        ? item.DocNo
                                        : (
                                            item.SalOrd_No ||
                                            item.Invoice_No
                                          );

                                    let type;

                                    if (selectedCard === "invoice") {

                                      type = "invoice";

                                    } else if (
                                      ["picking", "qc", "pack"].includes(selectedCard)
                                    ) {

                                      type = "picking";

                                    } else {

                                      type = "sale";
                                    }

                                    fetchItemDetail(
                                      docNo?.trim(),
                                      type
                                    );

                                    setViewMode("items");

                                  }}
                                  className="
                                    shrink-0

                                    flex items-center gap-1

                                    text-[10px]

                                    bg-blue-500
                                    hover:bg-blue-600

                                    text-white

                                    px-3 py-2

                                    rounded-xl

                                    shadow-sm

                                    transition-colors
                                  "
                                >

                                  <Eye size={12} />

                                  Items

                                </button>

                              </div>

                              <div
                                className="
                                  mt-3

                                  flex items-center justify-between
                                "
                              >

                                <span
                                  className={`
                                    text-[10px]

                                    px-2 py-1

                                    rounded-xl

                                    font-semibold

                                    ${badgeStyle(activeTab)}
                                  `}
                                >
                                  {activeTab}
                                </span>

                                {item.DocDate && (
                                  <span
                                    className="
                                      text-[10px]

                                      text-gray-400
                                      dark:text-slate-500
                                    "
                                  >
                                    {item.DocDate}
                                  </span>
                                )}

                              </div>

                            </div>

                          ))

                        ) : (

                          <div
                            className="
                              text-center

                              py-14

                              text-gray-400
                              dark:text-slate-500

                              text-xs
                              italic
                            "
                          >
                            No data found in {activeTab}
                          </div>

                        )}

                      </div>

                    </>
                  )}

                </>
              )}

              {/* ================= ITEMS VIEW ================= */}
              {viewMode === "items" && (

                <div className="flex flex-col h-full">

                  {/* TOP */}
                  <div
                    className="
                      p-4

                      border-b

                      border-gray-200
                      dark:border-slate-800

                      bg-gray-50
                      dark:bg-slate-900

                      flex justify-between items-center gap-3
                    "
                  >

                    <div className="min-w-0">

                      <p
                        className="
                          text-xs
                          font-bold

                          text-slate-800
                          dark:text-white

                          truncate
                        "
                      >
                        {itemDetail?.DelDocNo ||
                          itemDetail?.DocNo}
                      </p>

                      <p
                        className="
                          text-[10px]

                          text-gray-500
                          dark:text-slate-400

                          truncate
                        "
                      >
                        {itemDetail?.buyer_name}
                      </p>

                    </div>

                    <button
                      onClick={() => {

                        setViewMode("list");

                        fetchItemDetail(null);

                      }}
                      className="
                        flex items-center gap-1

                        text-[11px]
                        font-semibold

                        text-blue-600
                      "
                    >

                      <ArrowLeft size={14} />

                      Back

                    </button>

                  </div>

                  {/* SUMMARY */}
                  <div
                    className="
                      grid
                      grid-cols-2

                      gap-3

                      p-4

                      border-b

                      border-gray-200
                      dark:border-slate-800
                    "
                  >

                    <div
                      className="
                        rounded-2xl

                        p-3

                        bg-blue-50
                        dark:bg-blue-500/10
                      "
                    >

                      <p
                        className="
                          text-[11px]

                          text-gray-400
                          dark:text-slate-500
                        "
                      >
                        Total
                      </p>

                      <p
                        className="
                          mt-1

                          text-sm

                          font-bold

                          text-blue-600
                        "
                      >
                        ₹ {itemDetail?.TotalAmt || 0}
                      </p>

                    </div>

                    <div
                      className="
                        rounded-2xl

                        p-3

                        bg-purple-50
                        dark:bg-purple-500/10
                      "
                    >

                      <p
                        className="
                          text-[11px]

                          text-gray-400
                          dark:text-slate-500
                        "
                      >
                        RoundOff
                      </p>

                      <p
                        className="
                          mt-1

                          text-sm

                          font-bold

                          text-purple-600
                        "
                      >
                        ₹ {itemDetail?.RoundOff || 0}
                      </p>

                    </div>

                  </div>

                  {/* ITEMS */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">

                    {itemLoading ? (

                      <div
                        className="
                          flex items-center justify-center

                          py-20
                        "
                      >

                        <div
                          className="
                            animate-spin

                            rounded-full

                            h-10 w-10

                            border-b-2
                            border-blue-600
                          "
                        />

                      </div>

                    ) : ["saleOrder", "pickslip", "invoice"].includes(selectedCard) ? (

                      itemDetail?.saleDetails?.map((it, i) => (

                        <div
                          key={i}
                          className="
                            bg-white
                            dark:bg-slate-900

                            border

                            border-gray-200
                            dark:border-slate-800

                            rounded-2xl

                            p-4

                            shadow-sm
                          "
                        >

                          <p
                            className="
                              text-xs

                              font-bold

                              text-slate-800
                              dark:text-white
                            "
                          >
                            {it.ProductName}
                          </p>

                          <div
                            className="
                              flex justify-between

                              mt-3

                              text-[11px]
                            "
                          >

                            <span
                              className="
                                text-gray-500
                                dark:text-slate-400
                              "
                            >
                              Rate ₹
                              {it.SalRate ||
                                it.Rate ||
                                0}
                            </span>

                            <span
                              className="
                                text-blue-600

                                font-semibold
                              "
                            >
                              Qty {it.TotalQt ||
                                it.TotalQty ||
                                0}
                            </span>

                          </div>

                          <div
                            className="
                              flex justify-between

                              mt-2

                              text-[11px]
                            "
                          >

                            <span
                              className="
                                text-gray-400
                                dark:text-slate-500
                              "
                            >
                              MRP ₹{it.MRP}
                            </span>

                            <span
                              className="
                                text-green-600

                                font-bold
                              "
                            >
                              ₹ {it.Amt}
                            </span>

                          </div>

                          {it.Batch_No && (
                            <p
                              className="
                                text-[10px]

                                text-gray-400
                                dark:text-slate-500

                                mt-2
                              "
                            >
                              Batch:
                              {" "}
                              {it.Batch_No}
                              {" "}
                              |
                              {" "}
                              Exp:
                              {" "}
                              {it.Exp_Date}
                            </p>
                          )}

                        </div>

                      ))

                    ) : ["picking", "qc", "pack"].includes(selectedCard) ? (

                      itemDetail?.saleDetails?.map((it, i) => (

                        <div
                          key={i}
                          className="
                            bg-white
                            dark:bg-slate-900

                            border

                            border-gray-200
                            dark:border-slate-800

                            rounded-2xl

                            p-4

                            shadow-sm
                          "
                        >

                          <p
                            className="
                              text-xs

                              font-bold

                              text-slate-800
                              dark:text-white
                            "
                          >
                            {it.ProductName}
                          </p>

                          <p
                            className="
                              text-[10px]

                              text-gray-500
                              dark:text-slate-400

                              mt-2
                            "
                          >
                            {it.LocationName}
                            {" | "}
                            {it.Bin}
                          </p>

                          <div
                            className="
                              flex justify-between

                              mt-3

                              text-[11px]
                            "
                          >

                            <span
                              className="
                                text-blue-600

                                font-semibold
                              "
                            >
                              Pick {it.PicQty}
                            </span>

                            <span
                              className="
                                text-yellow-600

                                font-semibold
                              "
                            >
                              QC {it.QcQty}
                            </span>

                            <span
                              className="
                                text-green-600

                                font-semibold
                              "
                            >
                              Pack {it.PacQty}
                            </span>

                          </div>

                          <div
                            className="
                              flex gap-2

                              mt-3

                              text-[10px]

                              flex-wrap
                            "
                          >

                            <span
                              className={`
                                px-2 py-1

                                rounded-xl

                                ${
                                  it.Pic_Sts === "Y"
                                    ? `
                                      bg-blue-100
                                      text-blue-700

                                      dark:bg-blue-500/20
                                      dark:text-blue-300
                                    `
                                    : `
                                      bg-red-100
                                      text-red-600

                                      dark:bg-red-500/20
                                      dark:text-red-300
                                    `
                                }
                              `}
                            >
                              Pic {it.Pic_Sts === "Y" ? "✔" : "✖"}
                            </span>

                            <span
                              className={`
                                px-2 py-1

                                rounded-xl

                                ${
                                  it.Qc_Sts === "Y"
                                    ? `
                                      bg-yellow-100
                                      text-yellow-700

                                      dark:bg-yellow-500/20
                                      dark:text-yellow-300
                                    `
                                    : `
                                      bg-red-100
                                      text-red-600

                                      dark:bg-red-500/20
                                      dark:text-red-300
                                    `
                                }
                              `}
                            >
                              QC {it.Qc_Sts === "Y" ? "✔" : "✖"}
                            </span>

                            <span
                              className={`
                                px-2 py-1

                                rounded-xl

                                ${
                                  it.Pac_Sts === "Y"
                                    ? `
                                      bg-green-100
                                      text-green-700

                                      dark:bg-green-500/20
                                      dark:text-green-300
                                    `
                                    : `
                                      bg-red-100
                                      text-red-600

                                      dark:bg-red-500/20
                                      dark:text-red-300
                                    `
                                }
                              `}
                            >
                              Pack {it.Pac_Sts === "Y" ? "✔" : "✖"}
                            </span>

                          </div>

                          <div
                            className="
                              mt-3

                              text-[10px]

                              text-gray-400
                              dark:text-slate-500

                              flex justify-between
                            "
                          >

                            <span>
                              Batch:
                              {" "}
                              {it.Batch_No}
                            </span>

                            <span>
                              Exp:
                              {" "}
                              {it.Exp_Date}
                            </span>

                          </div>

                        </div>

                      ))

                    ) : (

                      itemDetail?.saleDetails?.map((it, i) => (

                        <div
                          key={i}
                          className="
                            bg-white
                            dark:bg-slate-900

                            border

                            border-gray-200
                            dark:border-slate-800

                            rounded-2xl

                            p-4

                            shadow-sm
                          "
                        >

                          <p
                            className="
                              text-xs

                              font-bold

                              text-slate-800
                              dark:text-white
                            "
                          >
                            {it.ProductName || "No Data"}
                          </p>

                        </div>

                      ))

                    )}

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>
      )}

      <style>
        {`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease;
        }

        .animate-slideUp {
          animation: slideUp 0.25s ease;
        }

        @keyframes fadeIn {
          from { opacity:0 }
          to { opacity:1 }
        }

        @keyframes slideUp {
          from {
            transform:translateY(40px)
          }

          to {
            transform:translateY(0)
          }
        }
        `}
      </style>

    </div>
  );
}