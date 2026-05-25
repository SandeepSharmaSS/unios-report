"use client";

import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import {
  Search,
  RotateCcw,
  Loader2,
  ShieldCheck,
  ShieldX,
  RefreshCcw,
  Clock3,
  PackageSearch,
  Building2,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Undo2,
  Boxes,
  AlertTriangle,
} from "lucide-react";

import {
  getPurchaseReturnSearch,
  reopenPurchaseReturn,
} from "../../services/auth.service";

import { useTheme } from "../../context/ThemeContext";

import { useAuth } from "../../context/AuthContext";

export default function PurchaseReturnBills() {

  const { theme } = useTheme();

  const {
    selectedOrg,
    profile,
  } = useAuth();

  const csaId = Number(
    selectedOrg || 0
  );

  const [loading, setLoading] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [reopenLoading, setReopenLoading] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [rows, setRows] =
    useState([]);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(30);

  // fetch purchase return bills
  const fetchBills = useCallback(
    async (
      isRefresh = false
    ) => {

      if (!csaId) {

        setRows([]);

        return;
      }

      try {

        if (isRefresh) {

          setRefreshing(true);

        } else {

          setLoading(true);
        }

        const res =
          await getPurchaseReturnSearch(
            search,
            csaId
          );

        setRows(
          res?.data || []
        );

        setCurrentPage(1);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

        setRefreshing(false);
      }
    },
    [search, csaId]
  );

  // auto fetch
  useEffect(() => {

    fetchBills();

  }, [csaId]);

  // reopen
  const handleReopen =
    async (docNo) => {

      const confirmBox =
        window.confirm(
          `Are you sure to reopen purchase return ${docNo} ?`
        );

      if (!confirmBox)
        return;

      try {

        setReopenLoading(
          docNo
        );

        const res =
          await reopenPurchaseReturn(
            docNo,
            "Purchase_Return"
          );

        // stock issue
        if (
          res?.status ===
          "notok"
        ) {

          alert(
            res?.message ||
            "No salable stock found"
          );

          return;
        }

        alert(
          res?.message ||
          "Purchase Return reopened successfully"
        );

        fetchBills(true);

      } catch (err) {

        console.error(err);

        alert(
          "Failed to reopen purchase return"
        );

      } finally {

        setReopenLoading("");
      }
    };

  // pagination
  const totalPages =
    Math.ceil(
      rows.length / pageSize
    );

  const paginatedRows =
    rows.slice(
      (currentPage - 1) *
      pageSize,
      currentPage * pageSize
    );

  // theme
  const cardClass = useMemo(() => {

    return theme === "dark"
      ? `
        bg-[#0f172a]
        border border-slate-800
        text-white
      `
      : `
        bg-white
        border border-gray-200
        text-gray-900
      `;

  }, [theme]);

  return (

    <div className="w-full min-h-screen p-3 md:p-5">

      {/* HEADER */}

      <div className="mb-5">

        <div
          className={`
            rounded-[28px]
            p-4 md:p-5
            shadow-sm
            overflow-hidden
            relative
            ${cardClass}
          `}
        >

          {/* glow */}
          <div
            className="
              absolute
              top-0
              right-0
              w-40
              h-40
              bg-violet-500/10
              blur-3xl
              rounded-full
            "
          />

          <div className="relative z-10">

            {/* TOP */}
            <div className="flex items-start justify-between gap-3">

              <div>

                <div className="flex items-center gap-3">

                  <div
                    className="
                      w-11 h-11
                      rounded-2xl

                      bg-gradient-to-br
                      from-violet-500
                      to-fuchsia-600

                      flex items-center justify-center

                      text-white

                      shadow-lg
                      shadow-violet-500/20
                    "
                  >

                    <Undo2
                      size={20}
                    />
                  </div>

                  <div>

                    <h1
                      className="
                        text-2xl
                        md:text-3xl
                        font-black
                        tracking-tight
                      "
                    >
                      Purchase Returns
                    </h1>

                    <p
                      className="
                        text-xs md:text-sm
                        opacity-70
                        mt-1
                      "
                    >
                      Manage reopen purchase returns
                    </p>
                  </div>
                </div>
              </div>

              {/* REFRESH */}
              <button
                onClick={() =>
                  fetchBills(true)
                }
                disabled={
                  refreshing ||
                  loading
                }
                className={`
                  h-11
                  w-11
                  shrink-0
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  transition

                  ${theme === "dark"
                      ? `
                        bg-slate-900
                        border border-slate-700
                        hover:bg-slate-800
                      `
                      : `
                        bg-gray-100
                        border border-gray-300
                        hover:bg-gray-200
                      `
                    }
                `}
              >

                <RefreshCcw
                  size={18}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />
              </button>
            </div>

            {/* SEARCH */}
            <div className="mt-5">

              <div className="flex gap-2">

                <div className="relative flex-1">

                  <Search
                    size={18}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      opacity-60
                    "
                  />

                  <input
                    type="text"
                    placeholder="Search purchase return..."
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    onKeyDown={(e) => {

                      if (
                        e.key ===
                        "Enter"
                      ) {

                        fetchBills();
                      }
                    }}
                    className={`
                      w-full
                      h-12
                      rounded-2xl
                      pl-11
                      pr-4
                      outline-none
                      text-sm
                      transition

                      ${theme === "dark"
                          ? `
                            bg-[#111827]
                            border border-slate-700
                            text-white
                            placeholder:text-slate-400
                          `
                          : `
                            bg-white
                            border border-gray-300
                            text-black
                          `
                        }
                    `}
                  />
                </div>

                <button
                  onClick={() =>
                    fetchBills()
                  }
                  className="
                    h-12
                    px-5
                    rounded-2xl

                    bg-violet-600
                    hover:bg-violet-700

                    text-white
                    font-semibold

                    transition
                    shadow-lg
                  "
                >
                  Search
                </button>
              </div>

              {/* FILTER BAR */}
              <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">

                <div className="flex items-center gap-2 flex-wrap">

                  {/* CSA */}
                  <div
                    className={`
                      flex items-center gap-2

                      px-3 py-2
                      rounded-2xl

                      text-xs
                      font-semibold

                      ${theme === "dark"
                          ? `
                            bg-slate-900
                            border border-slate-700
                            text-slate-200
                          `
                          : `
                            bg-gray-100
                            border border-gray-200
                            text-gray-700
                          `
                        }
                    `}
                  >

                    <Building2
                      size={14}
                    />

                    CSA :
                    {" "}
                    {csaId || "N/A"}
                  </div>

                  {/* PROFILE */}
                  {profile?.name && (

                    <div
                      className={`
                        flex items-center gap-2

                        px-3 py-2
                        rounded-2xl

                        text-xs
                        font-semibold

                        max-w-[240px]
                        truncate

                        ${theme === "dark"
                            ? `
                              bg-violet-900/30
                              border border-violet-800
                              text-violet-300
                            `
                            : `
                              bg-violet-100
                              border border-violet-200
                              text-violet-700
                            `
                          }
                      `}
                    >

                      <Sparkles
                        size={13}
                      />

                      <span className="truncate">
                        {profile.name}
                      </span>
                    </div>
                  )}

                  {/* TOTAL */}
                  <div
                    className={`
                      px-3 py-2
                      rounded-2xl

                      text-xs
                      font-semibold

                      ${theme === "dark"
                          ? `
                            bg-emerald-900/30
                            border border-emerald-800
                            text-emerald-300
                          `
                          : `
                            bg-emerald-100
                            border border-emerald-200
                            text-emerald-700
                          `
                        }
                    `}
                  >
                    Total :
                    {" "}
                    {rows.length}
                  </div>
                </div>

                {/* PAGE SIZE */}
                <div className="flex items-center gap-2">

                  <span className="text-xs opacity-70">
                    Rows
                  </span>

                  <select
                    value={pageSize}
                    onChange={(e) => {

                      setPageSize(
                        Number(
                          e.target.value
                        )
                      );

                      setCurrentPage(1);
                    }}
                    className={`
                      h-10
                      px-3
                      rounded-xl
                      text-sm
                      outline-none

                      ${theme === "dark"
                          ? `
                            bg-slate-900
                            border border-slate-700
                          `
                          : `
                            bg-white
                            border border-gray-300
                          `
                        }
                    `}
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
            </div>
          </div>
        </div>
      </div>

      {/* LOADING */}
      {loading && (

        <div className="flex justify-center py-20">

          <Loader2 className="animate-spin" />

        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        rows.length === 0 && (

          <div
            className={`
              rounded-[28px]
              p-10
              text-center
              ${cardClass}
            `}
          >

            <PackageSearch
              size={55}
              className="
                mx-auto
                opacity-60
                mb-4
              "
            />

            <h2 className="text-lg font-bold">
              No Purchase Returns Found
            </h2>

            <p className="text-sm opacity-70 mt-2">
              Try another search
            </p>
          </div>
        )}

      {/* CARDS */}
      {!loading &&
        paginatedRows.map(
          (item) => {

            const isAuthorized =
              item.MLA_Status ===
              1;

            const canReopen =
              item.T_Status ===
              "A";

            return (

              <div
                key={item.Id}
                className={`
                  mb-4
                  rounded-[28px]
                  overflow-hidden
                  shadow-sm
                  border
                  transition

                  ${theme === "dark"
                      ? `
                        bg-[#0f172a]
                        border-slate-800
                      `
                      : `
                        bg-white
                        border-gray-200
                      `
                    }
                `}
              >

                {/* TOP */}
                <div
                  className={`
                    p-4
                    border-b

                    ${theme === "dark"
                        ? `
                          border-slate-800
                        `
                        : `
                          border-gray-100
                        `
                      }
                  `}
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <h2
                        className="
                          font-black
                          text-base
                          break-all
                        "
                      >
                        {item.Invoice_No}
                      </h2>

                      <p
                        className="
                          text-xs
                          opacity-70
                          mt-1
                        "
                      >
                        {item.date}
                      </p>
                    </div>

                    {/* STATUS */}
                    <div className="flex flex-col gap-2 items-end">

                      {/* AUTH */}
                      <div
                        className={`
                          px-3 py-1
                          rounded-full

                          text-[11px]
                          font-bold

                          flex items-center gap-1

                          ${isAuthorized
                              ? `
                                bg-green-100
                                text-green-700
                              `
                              : `
                                bg-red-100
                                text-red-700
                              `
                            }
                        `}
                      >

                        {isAuthorized ? (
                          <ShieldCheck
                            size={13}
                          />
                        ) : (
                          <ShieldX
                            size={13}
                          />
                        )}

                        {isAuthorized
                          ? "Authorized"
                          : "Unauthorized"}
                      </div>

                      {/* STATUS */}
                      <div
                        className={`
                          px-3 py-1
                          rounded-full

                          text-[11px]
                          font-bold

                          flex items-center gap-1

                          ${item.T_Status ===
                              "A"
                              ? `
                                bg-blue-100
                                text-blue-700
                              `
                              : `
                                bg-yellow-100
                                text-yellow-700
                              `
                            }
                        `}
                      >

                        <Clock3
                          size={12}
                        />

                        {item.T_Status ===
                          "A"
                          ? "Approved"
                          : "Open"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* BODY */}
                <div className="p-4 space-y-3 text-sm">

                  {/* CUSTOMER */}
                  <div className="flex justify-between gap-4">

                    <span className="opacity-60">
                      Customer
                    </span>

                    <span className="font-semibold text-right">
                      {item.Customer_Name ||
                        "N/A"}
                    </span>
                  </div>

                  {/* DELIVERY */}
                  <div className="flex justify-between gap-4">

                    <span className="opacity-60">
                      Delivery
                    </span>

                    <span className="font-semibold text-right">
                      {
                        item.Delivery_Customer_Name ||
                        "N/A"
                      }
                    </span>
                  </div>

                  {/* TYPE */}
                  <div className="flex justify-between gap-4">

                    <span className="opacity-60 flex items-center gap-1">

                      <Boxes
                        size={14}
                      />

                      Return Type
                    </span>

                    <span className="font-semibold">
                      Purchase Return
                    </span>
                  </div>

                  {/* AMOUNT */}
                  <div className="flex justify-between gap-4">

                    <span className="opacity-60 flex items-center gap-1">

                      <IndianRupee
                        size={14}
                      />

                      Amount
                    </span>

                    <span className="font-black text-lg">

                      ₹
                      {Number(
                        item.Net_Amount ||
                        0
                      ).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </span>
                  </div>

                  {/* WARNING */}
                  <div
                    className={`
                      rounded-2xl
                      px-3 py-3
                      text-xs

                      flex items-start gap-2

                      ${theme === "dark"
                          ? `
                            bg-yellow-900/20
                            border border-yellow-800/50
                            text-yellow-200
                          `
                          : `
                            bg-yellow-50
                            border border-yellow-200
                            text-yellow-700
                          `
                        }
                    `}
                  >

                    <AlertTriangle
                      size={15}
                      className="shrink-0 mt-0.5"
                    />

                    <span>
                      Reopen may fail if no salable stock found.
                    </span>
                  </div>
                </div>

                {/* ACTION */}
                <div className="p-4 pt-0">

                  <button
                    onClick={() =>
                      handleReopen(
                        item.Invoice_No
                      )
                    }
                    disabled={
                      reopenLoading ===
                      item.Invoice_No ||
                      !canReopen
                    }
                    className={`
                      w-full
                      h-12
                      rounded-2xl

                      text-sm
                      font-bold

                      flex items-center justify-center gap-2

                      transition
                      shadow-lg

                      ${canReopen
                          ? `
                            bg-violet-600
                            hover:bg-violet-700
                            text-white
                          `
                          : `
                            bg-gray-300
                            text-gray-500
                            cursor-not-allowed
                          `
                        }
                    `}
                  >

                    {reopenLoading ===
                      item.Invoice_No ? (

                      <Loader2
                        size={16}
                        className="animate-spin"
                      />

                    ) : (

                      <RotateCcw
                        size={16}
                      />
                    )}

                    {canReopen
                      ? "Reopen Purchase Return"
                      : "Not Allowed"}
                  </button>
                </div>
              </div>
            );
          }
        )}

      {/* PAGINATION */}
      {!loading &&
        rows.length > 0 && (

          <div
            className={`
              sticky
              bottom-2
              mt-5

              rounded-[28px]

              border
              backdrop-blur-lg

              p-4

              ${theme === "dark"
                  ? `
                    bg-slate-900/90
                    border-slate-800
                  `
                  : `
                    bg-white/90
                    border-gray-200
                  `
                }
            `}
          >

            <div className="flex items-center justify-between gap-3">

              {/* PREV */}
              <button
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      prev - 1
                  )
                }
                className={`
                  h-11
                  px-5

                  rounded-2xl

                  text-sm
                  font-semibold

                  flex items-center gap-2

                  transition
                  disabled:opacity-40

                  ${theme === "dark"
                      ? `
                        bg-slate-800
                        border border-slate-700
                      `
                      : `
                        bg-gray-100
                        border border-gray-300
                      `
                    }
                `}
              >

                <ChevronLeft
                  size={16}
                />

                Prev
              </button>

              {/* CENTER */}
              <div className="text-center">

                <div className="text-sm font-bold">

                  {currentPage}
                  {" "}
                  /
                  {" "}
                  {totalPages}
                </div>

                <div className="text-[11px] opacity-60 mt-1">

                  Showing
                  {" "}

                  {(currentPage -
                    1) *
                    pageSize +
                    1}

                  {" "}
                  -
                  {" "}

                  {Math.min(
                    currentPage *
                    pageSize,
                    rows.length
                  )}
                </div>
              </div>

              {/* NEXT */}
              <button
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      prev + 1
                  )
                }
                className={`
                  h-11
                  px-5

                  rounded-2xl

                  text-sm
                  font-semibold

                  flex items-center gap-2

                  transition
                  disabled:opacity-40

                  ${theme === "dark"
                      ? `
                        bg-slate-800
                        border border-slate-700
                      `
                      : `
                        bg-gray-100
                        border border-gray-300
                      `
                    }
                `}
              >

                Next

                <Undo2
                  size={15}
                />
              </button>
            </div>
          </div>
        )}
    </div>
  );
}