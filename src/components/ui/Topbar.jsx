import { useEffect, useMemo, useState } from "react";

import {
  Menu,
  ChevronDown,
  Search,
  Moon,
  Sun,
} from "lucide-react";

import { getUserOrg } from "../../services/auth.service";

import { useAuth } from "../../context/AuthContext";

import { useTheme } from "../../context/ThemeContext";

export default function Topbar({ setOpen }) {

  const {
    selectedOrg,
    changeCSA,
    loading,
  } = useAuth();

  const {
    theme,
    toggleTheme,
  } = useTheme();

  const [orgs, setOrgs] = useState([]);

  const [showTooltip, setShowTooltip] = useState(false);

  const [search, setSearch] = useState("");

  const [openDropdown, setOpenDropdown] = useState(false);

  // 🔥 Load CSA List
  useEffect(() => {

    const loadOrgs = async () => {

      try {

        const res = await getUserOrg();

        if (res?.status === "ok") {

          setOrgs(res.data || []);
        }

      } catch (error) {

        console.error("Org Load Error:", error);

      }
    };

    loadOrgs();

  }, []);

  // 🔥 Selected CSA Name
  const selectedOrgData = useMemo(() => {

    return orgs.find(
      (o) => String(o.CSA_Id) === String(selectedOrg)
    );

  }, [selectedOrg, orgs]);

  // 🔥 Search Filter
  const filteredOrgs = useMemo(() => {

    if (!search) return orgs;

    const q = search.toLowerCase();

    return orgs.filter((org) =>
      String(org.CSA_Id).toLowerCase().includes(q) ||
      (org.name || "").toLowerCase().includes(q)
    );

  }, [search, orgs]);

  // 🔥 Change CSA
  const handleSelect = async (id) => {

    await changeCSA(id);

    setOpenDropdown(false);

    setShowTooltip(true);

    setTimeout(() => {

      setShowTooltip(false);

    }, 2500);
  };

  return (
    <div
      className="
        h-14

        bg-white
        dark:bg-slate-950

        border-b
        border-gray-200
        dark:border-slate-800

        shadow-sm

        flex items-center justify-between

        px-2 sm:px-3

        relative

        transition-colors
        duration-300
      "
    >

      {/* LEFT */}
      <div className="flex items-center gap-2 shrink-0">

        {/* MOBILE MENU */}
        <button
          onClick={() => setOpen(true)}
          className="
            md:hidden

            w-9 h-9

            rounded-xl

            flex items-center justify-center

            bg-gray-100
            dark:bg-slate-800

            text-slate-700
            dark:text-slate-200

            transition-all
          "
        >
          <Menu size={18} />
        </button>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">

        {/* THEME BUTTON */}
        <button
          onClick={toggleTheme}
          className="
            shrink-0

            w-10 h-10

            rounded-xl

            border

            border-gray-200
            dark:border-slate-700

            bg-white
            dark:bg-slate-900

            flex items-center justify-center

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

        </button>

        {/* CSA SELECT */}
        <div className="relative min-w-0">

          {/* SELECT BUTTON */}
          <button
            onClick={() =>
              setOpenDropdown(!openDropdown)
            }
            disabled={loading}
            className="
              w-full

              min-w-[170px]
              max-w-[230px]

              sm:min-w-[250px]
              sm:max-w-[340px]

              px-2 sm:px-3
              py-2

              border

              border-gray-200
              dark:border-slate-700

              rounded-2xl

              bg-gray-50
              dark:bg-slate-900

              hover:bg-gray-100
              dark:hover:bg-slate-800

              transition-all

              text-left

              shadow-sm

              overflow-hidden
            "
          >

            <div className="flex items-center justify-between gap-2">

              <div className="min-w-0 flex-1">

                <p
                  className="
                    text-[10px]

                    text-gray-400
                    dark:text-slate-500

                    truncate
                  "
                >
                  CSA_ID : {selectedOrgData?.CSA_Id || "Select"}
                </p>

                <p
                  className="
                    text-[11px]
                    sm:text-sm

                    font-medium

                    text-gray-700
                    dark:text-slate-100

                    truncate
                    leading-tight
                  "
                >
                  {selectedOrgData?.name || "Select Organization"}
                </p>

              </div>

              <ChevronDown
                size={14}
                className="
                  shrink-0

                  text-gray-400
                  dark:text-slate-500
                "
              />

            </div>

          </button>

          {/* DROPDOWN */}
          {openDropdown && (
            <div
              className="
                absolute
                right-0
                top-full

                mt-2

                w-[92vw]
                sm:w-[340px]

                max-w-[340px]

                bg-white
                dark:bg-slate-950

                border

                border-gray-200
                dark:border-slate-800

                rounded-2xl

                shadow-2xl

                z-50

                overflow-hidden

                animate-fadeIn
              "
            >

              {/* SEARCH */}
              <div
                className="
                  p-3

                  border-b

                  border-gray-100
                  dark:border-slate-800

                  bg-gray-50
                  dark:bg-slate-900
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
                    placeholder="Search CSA ID or name..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    className="
                      w-full

                      pl-9 pr-3 py-2

                      border

                      border-gray-200
                      dark:border-slate-700

                      rounded-xl

                      text-sm

                      bg-white
                      dark:bg-slate-950

                      text-slate-700
                      dark:text-white

                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                </div>

              </div>

              {/* LIST */}
              <div className="max-h-[320px] overflow-y-auto">

                {filteredOrgs.length > 0 ? (

                  filteredOrgs.map((org) => (

                    <button
                      key={org.CSA_Id}
                      onClick={() =>
                        handleSelect(org.CSA_Id)
                      }
                      className={`
                        w-full

                        text-left

                        px-4 py-3

                        border-b

                        border-gray-100
                        dark:border-slate-800

                        transition-all

                        hover:bg-blue-50
                        dark:hover:bg-slate-900

                        ${
                          String(selectedOrg) === String(org.CSA_Id)
                            ? `
                              bg-blue-100
                              dark:bg-slate-800
                            `
                            : ""
                        }
                      `}
                    >

                      <p
                        className="
                          text-[11px]

                          text-gray-400
                          dark:text-slate-500
                        "
                      >
                        CSA_ID : {org.CSA_Id}
                      </p>

                      <p
                        className="
                          text-sm

                          font-medium

                          text-gray-700
                          dark:text-slate-100

                          break-words
                        "
                      >
                        {org.name}
                      </p>

                    </button>

                  ))

                ) : (

                  <div
                    className="
                      p-4

                      text-center
                      text-sm

                      text-gray-400
                      dark:text-slate-500
                    "
                  >
                    No organization found
                  </div>

                )}

              </div>

            </div>
          )}

        </div>

      </div>

      {/* TOOLTIP */}
      {showTooltip && selectedOrg && (
        <div
          className="
            absolute

            left-1/2
            -translate-x-1/2

            top-14

            mt-2

            z-50

            bg-white
            dark:bg-slate-950

            border

            border-gray-200
            dark:border-slate-800

            shadow-xl

            rounded-xl

            px-4 py-2

            text-xs

            text-gray-700
            dark:text-slate-100

            max-w-[280px]
            sm:max-w-[360px]

            break-words

            animate-fadeIn
          "
        >
          Switched to: {selectedOrgData?.name}
        </div>
      )}

    </div>
  );
}