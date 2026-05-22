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
  X,
  Moon,
  Sun,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import { useTheme } from "../../context/ThemeContext";

export default function Sidebar({ open, setOpen }) {

  const { logout } = useAuth(); 

  const {
    theme,
    toggleTheme,
  } = useTheme();

  return (
    <>
      {/* OVERLAY */}
      {open && (
        <div
          className="
            fixed inset-0 z-40
            bg-black/30 backdrop-blur-sm
            md:hidden
          "
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static
          top-0 left-0 z-50
          h-full
          w-[78%]
          max-w-[270px]

          bg-white
          dark:bg-slate-950

          text-gray-800
          dark:text-white

          shadow-2xl

          border-r
          border-gray-200
          dark:border-slate-800

          transform
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0

          transition-all duration-300 ease-out

          flex flex-col
          overflow-hidden
        `}
      >

        {/* HEADER */}
        <div
          className="
            px-5 pt-6 pb-5

            border-b
            border-gray-100
            dark:border-slate-800

            bg-white
            dark:bg-slate-950
          "
        >

          <div className="flex items-start justify-between">

            <div>

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
                  "
                >
                  <LayoutDashboard size={22} />
                </div>

                <div>

                  <h2
                    className="
                      text-lg
                      font-black
                      tracking-wide

                      text-slate-800
                      dark:text-white
                    "
                  >
                    UniOS
                  </h2>

                  <p
                    className="
                      text-[11px]
                      mt-0.5

                      text-slate-400
                      dark:text-slate-500
                    "
                  >
                    Analytics Panel
                  </p>

                </div>

              </div>

            </div>

            {/* MOBILE CLOSE */}
            <button
              onClick={() => setOpen(false)}
              className="
                md:hidden

                w-8 h-8
                rounded-xl

                bg-gray-100
                dark:bg-slate-800

                flex items-center justify-center

                text-gray-500
                dark:text-slate-300

                hover:bg-gray-200
                dark:hover:bg-slate-700

                transition
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
            space-y-1.5

            bg-white
            dark:bg-slate-950
          "
        >

          <NavItem
            to="/home"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            setOpen={setOpen}
          />

          <SectionTitle title="Inventory" />

          <NavItem
            to="/reports/stock"
            icon={<Boxes size={18} />}
            label="Stock Analysis"
            setOpen={setOpen}
          />

          <NavItem
            to="/reports/ageing"
            icon={<Hourglass size={18} />}
            label="Stock Ageing"
            setOpen={setOpen}
          />

          <NavItem
            to="/reports/ledger"
            icon={<BookOpen size={18} />}
            label="Product Ledger"
            setOpen={setOpen}
          />

          <NavItem
            to="/reports/NonMoving"
            icon={<PackageSearch size={18} />}
            label="Non Moving Stock"
            setOpen={setOpen}
          />

          <SectionTitle title="Reports" />

          <NavItem
            to="/reports/SaleReport"
            icon={<ReceiptText size={18} />}
            label="Sale Report"
            setOpen={setOpen}
          />

          <NavItem
            to="/reports/STNReport"
            icon={<Truck size={18} />}
            label="STN Report"
            setOpen={setOpen}
          />

          <NavItem
            to="/reports/SaleReturnReport"
            icon={<RotateCcw size={18} />}
            label="Sale Return"
            setOpen={setOpen}
          />

          <NavItem
            to="/reports/PurchaseReport"
            icon={<ShoppingCart size={18} />}
            label="Purchase Report"
            setOpen={setOpen}
          />

          <NavItem
            to="/reports/PurchaseReturnReport"
            icon={<Undo2 size={18} />}
            label="Purchase Return"
            setOpen={setOpen}
          />

          <NavItem
            to="/reports/gross"
            icon={<TrendingUp size={18} />}
            label="Gross Profit"
            setOpen={setOpen}
          />

        </nav>

        {/* FOOTER */}
        <div
          className="
            p-4

            border-t
            border-gray-100
            dark:border-slate-800

            bg-white
            dark:bg-slate-950

            space-y-3
          "
        >

          {/* THEME BUTTON 
          <button
            onClick={toggleTheme}
            className="
              w-full

              flex items-center justify-center gap-2

              py-3
              rounded-2xl

              text-sm
              font-bold

              border

              border-gray-200
              dark:border-slate-700

              bg-gray-50
              dark:bg-slate-900

              text-slate-700
              dark:text-yellow-300

              hover:bg-gray-100
              dark:hover:bg-slate-800

              transition-all
            "
          >

            {theme === "dark"
              ? <Sun size={18} />
              : <Moon size={18} />
            }

            <span>
              {theme === "dark"
                ? "Light Mode"
                : "Dark Mode"}
            </span>

          </button> */}

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

              hover:scale-[1.01]
              active:scale-[0.98]

              transition-all
            "
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>

        </div>

      </aside>
    </>
  );
}

/* SECTION TITLE */
function SectionTitle({ title }) {

  return (
    <div className="px-3 pt-3 pb-1">

      <p
        className="
          text-[10px]
          uppercase
          tracking-[0.18em]

          text-slate-400
          dark:text-slate-500

          font-black
        "
      >
        {title}
      </p>

    </div>
  );
}

/* NAV ITEM */
function NavItem({
  to,
  icon,
  label,
  setOpen,
}) {

  return (
    <NavLink
      to={to}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        `
          group

          flex items-center justify-between

          px-3 py-3

          rounded-2xl

          text-sm
          font-semibold

          transition-all duration-200

          ${
            isActive
              ? `
                bg-gradient-to-r
                from-blue-500
                to-indigo-600

                text-white

                shadow-lg
                shadow-blue-500/20
              `
              : `
                text-slate-600
                dark:text-slate-300

                hover:bg-slate-100
                dark:hover:bg-slate-800

                hover:text-slate-900
                dark:hover:text-white
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
          transition-all
        "
      />

    </NavLink>
  );
}