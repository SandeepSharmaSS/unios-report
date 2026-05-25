import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Boxes,
  Hourglass,
  BookOpen,
  PackageSearch,
  ReceiptText,
  Truck,
  RotateCcw,
  ShoppingCart,
  Undo2,
  TrendingUp,
  LogOut,
  ChevronRight,
  ChevronDown,
  X,
  FolderOpen,
  RotateCwIcon,
} from "lucide-react";

import {
  useState,
  memo,
  useMemo,
  useCallback,
} from "react";

import { useAuth } from "../../context/AuthContext";

import { useTheme } from "../../context/ThemeContext";

export default function Sidebar({
  open,
  setOpen,
}) {

  const { logout } = useAuth();

  const { theme } = useTheme();

  // 🔥 smoother dropdown state
  const [
    openSections,
    setOpenSections,
  ] = useState({
    inventory: true,
    reports: true,
    reopens: true,
  });

  // 🔥 optimized toggle
  const toggleSection =
    useCallback((key) => {

      setOpenSections(
        (prev) => ({
          ...prev,
          [key]:
            !prev[key],
        })
      );
    }, []);

  // 🔥 sidebar classes
  const sidebarClass =
    useMemo(() => `
      fixed md:static
      top-0 left-0 z-50

      h-dvh
      w-[78%]
      max-w-[280px]

      bg-white
      dark:bg-[#020617]

      text-gray-800
      dark:text-white

      border-r
      border-gray-200
      dark:border-slate-800

      shadow-2xl

      transform-gpu
      will-change-transform

      ${open
        ? "translate-x-0"
        : "-translate-x-full"
      }

      md:translate-x-0

      transition-transform
      duration-200
      ease-out

      flex flex-col
      overflow-hidden
    `,
      [open]
    );

  return (
    <>
      {/* OVERLAY */}
      {open && (
        <div
          className="
            fixed inset-0 z-40
            bg-black/30
            backdrop-blur-[2px]

            md:hidden
          "
          onClick={() =>
            setOpen(false)
          }
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={
          sidebarClass
        }
      >

        {/* HEADER */}
        <div
          className="
            px-5 pt-5 pb-4

            border-b
            border-gray-100
            dark:border-slate-800

            shrink-0
          "
        >

          <div className="flex items-start justify-between">

            <div className="flex items-center gap-3">

              <div
                className="
                  w-11 h-11
                  rounded-2xl

                  bg-gradient-to-br
                  from-blue-500
                  to-indigo-600

                  flex items-center justify-center

                  text-white

                  shadow-lg
                  shadow-blue-500/20

                  shrink-0
                "
              >
                <LayoutDashboard
                  size={21}
                />
              </div>

              <div>

                <h2
                  className="
                    text-lg
                    font-black
                    tracking-wide
                  "
                >
                  UniOS
                </h2>

                <p
                  className="
                    text-[11px]
                    text-slate-400
                  "
                >
                  Analytics Panel
                </p>
              </div>
            </div>

            {/* CLOSE */}
            <button
              onClick={() =>
                setOpen(false)
              }
              className="
                md:hidden

                w-8 h-8
                rounded-xl

                bg-gray-100
                dark:bg-slate-800

                flex items-center justify-center

                hover:bg-gray-200
                dark:hover:bg-slate-700

                transition-colors
              "
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav
          className="
            flex-1
            overflow-y-auto

            px-3 py-4

            space-y-2

            scrollbar-thin
          "
        >

          {/* DASHBOARD */}
          <MemoNavItem
            to="/home"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            setOpen={setOpen}
          />

          {/* INVENTORY */}
          <MemoDropdown
            title="Inventory"
            icon={<Boxes size={16} />}
            open={
              openSections.inventory
            }
            onToggle={() =>
              toggleSection(
                "inventory"
              )
            }
          >

            <MemoNavItem
              to="/reports/stock"
              icon={<Boxes size={17} />}
              label="Stock Analysis"
              setOpen={setOpen}
            />

            <MemoNavItem
              to="/reports/ageing"
              icon={<Hourglass size={17} />}
              label="Stock Ageing"
              setOpen={setOpen}
            />

            <MemoNavItem
              to="/reports/ledger"
              icon={<BookOpen size={17} />}
              label="Product Ledger"
              setOpen={setOpen}
            />

            <MemoNavItem
              to="/reports/NonMoving"
              icon={<PackageSearch size={17} />}
              label="Non Moving Stock"
              setOpen={setOpen}
            />
          </MemoDropdown>

          {/* REPORTS */}
          <MemoDropdown
            title="Reports"
            icon={<ReceiptText size={16} />}
            open={
              openSections.reports
            }
            onToggle={() =>
              toggleSection(
                "reports"
              )
            }
          >

            <MemoNavItem
              to="/reports/SaleReport"
              icon={<ReceiptText size={17} />}
              label="Sale Report"
              setOpen={setOpen}
            />

            <MemoNavItem
              to="/reports/STNReport"
              icon={<Truck size={17} />}
              label="STN Report"
              setOpen={setOpen}
            />

            <MemoNavItem
              to="/reports/SaleReturnReport"
              icon={<RotateCcw size={17} />}
              label="Sale Return"
              setOpen={setOpen}
            />

            <MemoNavItem
              to="/reports/PurchaseReport"
              icon={<ShoppingCart size={17} />}
              label="Purchase Report"
              setOpen={setOpen}
            />

            <MemoNavItem
              to="/reports/PurchaseReturnReport"
              icon={<Undo2 size={17} />}
              label="Purchase Return"
              setOpen={setOpen}
            />

            <MemoNavItem
              to="/reports/gross"
              icon={<TrendingUp size={17} />}
              label="Gross Profit"
              setOpen={setOpen}
            />
          </MemoDropdown>

          {/* REOPENS */}
          <MemoDropdown
            title="Reopens"
            icon={<FolderOpen size={16} />}
            open={
              openSections.reopens
            }
            onToggle={() =>
              toggleSection(
                "reopens"
              )
            }
          >

            <MemoNavItem
              to="/reopens/UnloadingBills"
              icon={<RotateCcw size={17} />}
              label="Unloading Bills"
              setOpen={setOpen}
            />

            <MemoNavItem 
            to="/reopens/SaleInvoiceBills"
            icon={<RotateCwIcon size={17}/>}
            label="Sale Invoice Bills"
            setOpen={setOpen}
            />

          </MemoDropdown>

        </nav>

        {/* FOOTER */}
        <div
          className="
            p-4

            border-t
            border-gray-100
            dark:border-slate-800

            shrink-0
          "
        >

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="
              w-full

              flex items-center justify-center gap-2

              bg-gradient-to-r
              from-red-500
              to-rose-500

              text-white

              py-3
              rounded-2xl

              text-sm
              font-bold

              shadow-lg
              shadow-red-500/20

              hover:opacity-95
              active:scale-[0.99]

              transition-all
            "
          >
            <LogOut size={16} />

            <span>
              Logout
            </span>
          </button>
        </div>

      </aside>
    </>
  );
}

/* =========================
   DROPDOWN
========================= */

const DropdownSection = ({
  title,
  icon,
  children,
  open,
  onToggle,
}) => {

  return (

    <div className="space-y-1">

      {/* HEADER */}
      <button
        onClick={onToggle}
        className="
          w-full

          flex items-center justify-between

          px-3 py-3

          rounded-2xl

          bg-gray-50
          dark:bg-slate-900

          border
          border-gray-200
          dark:border-slate-800

          hover:bg-gray-100
          dark:hover:bg-slate-800

          transition-colors
        "
      >

        <div className="flex items-center gap-2">

          <div className="text-indigo-500">
            {icon}
          </div>

          <span
            className="
              text-[12px]
              uppercase
              tracking-[0.14em]
              font-black

              text-slate-700
              dark:text-slate-200
            "
          >
            {title}
          </span>
        </div>

        <ChevronDown
          size={16}
          className={`
            transition-transform
            duration-200

            ${open
              ? "rotate-180"
              : ""
            }
          `}
        />
      </button>

      {/* BODY */}
      <div
        className={`
          overflow-hidden

          transition-all
          duration-200

          ${open
            ? `
              max-h-[500px]
              opacity-100
            `
            : `
              max-h-0
              opacity-0
            `
          }
        `}
      >

        <div className="space-y-1 pt-1 pl-2">

          {children}

        </div>
      </div>
    </div>
  );
};

const MemoDropdown =
  memo(
    DropdownSection
  );

/* =========================
   NAV ITEM
========================= */

const NavItem = ({
  to,
  icon,
  label,
  setOpen,
}) => {

  return (
    <NavLink
      to={to}
      onClick={() =>
        setOpen(false)
      }
      className={({
        isActive,
      }) =>
        `
          group

          flex items-center justify-between

          px-3 py-3

          rounded-2xl

          text-sm
          font-semibold

          transition-colors

          ${isActive
            ? `
              bg-gradient-to-r
              from-blue-500
              to-indigo-600

              text-white

              shadow-md
              shadow-blue-500/20
            `
            : `
              text-slate-600
              dark:text-slate-300

              hover:bg-slate-100
              dark:hover:bg-slate-800
            `
          }
        `
      }
    >

      <div className="flex items-center gap-3 min-w-0">

        <div className="shrink-0 opacity-90">
          {icon}
        </div>

        <span className="truncate">
          {label}
        </span>
      </div>

      <ChevronRight
        size={15}
        className="
          opacity-40
          group-hover:translate-x-0.5

          transition-transform
        "
      />
    </NavLink>
  );
};

const MemoNavItem =
  memo(NavItem);