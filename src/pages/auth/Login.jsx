import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { dellogin } from "../../services/auth.service";

export default function Login() {

  const navigate = useNavigate();

  const {
    login,
    setSelectedOrg,
  } = useAuth();

  const [mobile, setMobile] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);

  // 🔥 LOGIN
  const handleLogin = async () => {

    if (!mobile || !password) {

      alert("Email & Password required");

      return;
    }

    try {

      setLoading(true);

      const res = await dellogin({
        mobile,
        password,
      });

      // 🔥 SUCCESS
      if (
        res?.status === "ok" &&
        res?.token
      ) {

        // save token globally
        login(res.token);

        // optional default CSA
        if (res?.csa_id) {

          localStorage.setItem(
            "selected_org",
            String(res.csa_id)
          );

          setSelectedOrg(
            String(res.csa_id)
          );
        }

        // redirect
        navigate("/home");

      } else {

        alert(
          res?.msg ||
          "Invalid credentials"
        );
      }

    } catch (error) {

      console.error(
        "Login Error:",
        error
      );

      alert("Server error");

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
      bg-[#020617]
      text-white
      flex
      items-center
      justify-center
      px-4
      py-6
    "
  >

    {/* 🔥 BACKGROUND GLOW */}
    <div className="
      absolute
      top-[-120px]
      left-[-80px]
      w-[220px]
      h-[220px]
      rounded-full
      bg-cyan-500/20
      blur-3xl
    " />

    <div className="
      absolute
      bottom-[-120px]
      right-[-80px]
      w-[220px]
      h-[220px]
      rounded-full
      bg-indigo-500/20
      blur-3xl
    " />

    {/* GRID */}
    <div className="
      absolute
      inset-0
      opacity-[0.04]
      bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
      bg-[size:40px_40px]
    " />

    {/* MAIN CARD */}
    <div
      className="
        relative
        z-10
        w-full
        max-w-[330px]
      "
    >

      {/* BRAND */}
      <div className="text-center mb-6">

        <h1
          className="
            text-[28px]
            font-black
            tracking-tight
          "
        >

          <span
            className="
              bg-gradient-to-r
              from-cyan-400
              via-blue-400
              to-indigo-400
              bg-clip-text
              text-transparent
            "
          >
            PDPL
          </span>

          {" "}Reports

        </h1>

        <p
          className="
            text-[11px]
            text-slate-400
            mt-1.5
          "
        >
          Sales • Purchase • Analytics • Profit
        </p>

      </div>

      {/* LOGIN CARD */}
      <div
        className="
          relative
          overflow-hidden
          bg-white/10
          backdrop-blur-2xl
          border
          border-white/10
          rounded-[28px]
          p-5
          shadow-[0_20px_80px_rgba(0,0,0,0.45)]
        "
      >

        {/* CARD GLOW */}
        <div
          className="
            absolute
            top-0
            right-0
            w-32
            h-32
            bg-cyan-500/10
            blur-3xl
          "
        />

        <div className="relative z-10">

          <div className="mb-5 text-center">

            <h2 className="text-lg font-black">
              Welcome Back
            </h2>

            <p className="text-[11px] text-slate-400 mt-1">
              Login to access reports dashboard
            </p>

          </div>

          {/* EMAIL */}
          <div className="mb-3.5">

            <label
              className="
                text-[10px]
                font-semibold
                text-slate-300
                mb-1.5
                block
              "
            >
              Email Address
            </label>

            <div className="relative">

              <input
                type="email"
                placeholder="Enter your email"
                value={mobile}
                onChange={(e)=>
                  setMobile(e.target.value)
                }
                className="
                  w-full
                  h-11
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  px-3.5
                  text-[13px]
                  text-white
                  placeholder-slate-500
                  outline-none
                  focus:ring-2
                  focus:ring-cyan-500
                  focus:border-cyan-500
                  transition-all
                "
              />

            </div>

          </div>

          {/* PASSWORD */}
          <div className="mb-5">

            <label
              className="
                text-[10px]
                font-semibold
                text-slate-300
                mb-1.5
                block
              "
            >
              Password
            </label>

            <div className="relative">

              <input
                type={show ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e)=>
                  setPassword(e.target.value)
                }
                className="
                  w-full
                  h-11
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  px-3.5
                  pr-11
                  text-[13px]
                  text-white
                  placeholder-slate-500
                  outline-none
                  focus:ring-2
                  focus:ring-cyan-500
                  focus:border-cyan-500
                  transition-all
                "
              />


            </div>

          </div>

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="
              w-full
              h-11
              rounded-xl
              bg-gradient-to-r
              from-cyan-500
              via-blue-600
              to-indigo-600
              hover:from-cyan-400
              hover:to-indigo-500
              text-white
              font-black
              text-[13px]
              tracking-wide
              shadow-xl
              shadow-cyan-500/20
              active:scale-[0.98]
              transition-all
              disabled:opacity-60
              flex
              items-center
              justify-center
            "
          >

            {loading
              ? "Signing In..."
              : "Sign In"}

          </button>

          {/* FOOTER */}
          <div className="mt-5 text-center">

            <p className="text-[10px] text-slate-500">
              Secure Reporting Platform
            </p>

            <p className="text-[9px] text-slate-600 mt-1.5">
              Powered by{" "}

              <span
                className="
                  text-cyan-400
                  font-bold
                  tracking-wide
                "
              >
                UNIOS ERP
              </span>
            </p>

          </div>

        </div>

      </div>

    </div>

  </div>
);
}