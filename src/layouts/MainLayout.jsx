import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import Topbar from "../components/ui/Topbar";
import { useAuth } from "../context/AuthContext";

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const {
    profile,
    selectedOrg,
  } = useAuth();

  return (
    <div
      className="
        flex
        h-[100dvh]
        bg-gray-100
        dark:bg-slate-900
        overflow-hidden
        transition-colors
        duration-300
      "
    >

      {/* SIDEBAR */}
      <Sidebar
        open={open}
        setOpen={setOpen}
      />

      {/* MAIN */}
      <div
        className="
          flex-1
          flex
          flex-col
          min-w-0
          bg-gray-100
          dark:bg-slate-900
          transition-colors
          duration-300
        "
      >

        {/* TOPBAR */}
        <Topbar setOpen={setOpen} />

        {/* CONTENT */}
        <main
          className="
            flex-1
            overflow-y-auto
            px-3 py-3
            sm:px-4 sm:py-4
            text-slate-800
            dark:text-slate-100
            transition-colors
            duration-300
          "
        >

          <div className="max-w-7xl mx-auto">

            {/* 🔥 GLOBAL CONTEXT */}
            <Outlet
              context={{
                profile,
                selectedOrg,
              }}
            />

          </div>
        </main>
      </div>
    </div>
  );
}