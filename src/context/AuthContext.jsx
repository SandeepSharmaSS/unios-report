import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCsaProfile,
  refreshToken,
} from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({
  children,
}) {

  // 🔥 TOKEN
  const [token, setToken] =
    useState(
      localStorage.getItem(
        "token"
      ) || ""
    );

  // 🔥 GLOBAL CSA
  const [
    selectedOrg,
    setSelectedOrg,
  ] = useState(
    localStorage.getItem(
      "selected_org"
    ) || ""
  );

  // 🔥 GLOBAL PROFILE
  const [profile, setProfile] =
    useState(null);

  // 🔥 GLOBAL LOADING
  const [loading, setLoading] =
    useState(false);

  // 🔥 AUTH STATUS
  const isAuthenticated =
    !!token;

  // 🔥 INITIAL PROFILE LOAD
  useEffect(() => {

    const loadProfile =
      async () => {

        if (
          !selectedOrg ||
          !token
        ) {
          return;
        }

        try {

          const res =
            await getCsaProfile(
              selectedOrg
            );

          if (
            res?.status === "ok"
          ) {

            setProfile(
              res.data?.[0] ||
              null
            );

          } else {

            setProfile(null);
          }

        } catch (error) {

          console.error(
            "Initial Profile Load Error:",
            error
          );

          setProfile(null);
        }
      };

    loadProfile();

  }, [
    selectedOrg,
    token,
  ]);

  // 🔥 LOGIN
  const login = (
    newToken
  ) => {

    if (!newToken) {
      return;
    }

    localStorage.setItem(
      "token",
      String(newToken)
    );

    setToken(
      String(newToken)
    );
  };

  // 🔥 GLOBAL CSA CHANGE
  const changeCSA =
    async (csaId) => {

      const nextCSA =
        String(csaId);

      if (!nextCSA) {
        return;
      }

      try {

        setLoading(true);

        // 🔥 instant update
        setSelectedOrg(
          nextCSA
        );

        localStorage.setItem(
          "selected_org",
          nextCSA
        );

        // 🔥 refresh token
        let res = null;

        try {

          res =
            await refreshToken(
              nextCSA
            );

        } catch (e) {

          console.error(
            "Refresh Token Error:",
            e
          );
        }

        // 🔥 update token
        if (res?.token) {

          localStorage.setItem(
            "token",
            String(
              res.token
            )
          );

          setToken(
            String(
              res.token
            )
          );
        }

        // 🔥 fetch profile
        try {

          const profileRes =
            await getCsaProfile(
              nextCSA
            );

          if (
            profileRes?.status ===
            "ok"
          ) {

            setProfile(
              profileRes.data?.[0] ||
              null
            );

          } else {

            setProfile(null);
          }

        } catch (e) {

          console.error(
            "Profile Error:",
            e
          );

          setProfile(null);
        }

        // 🔥 notify app
        window.dispatchEvent(
          new Event(
            "csa-changed"
          )
        );

      } catch (error) {

        console.error(
          "CSA Switch Error:",
          error
        );

      } finally {

        setLoading(false);
      }
    };

  // 🔥 LOGOUT
  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "selected_org"
    );

    setToken("");

    setSelectedOrg("");

    setProfile(null);

    // 🔥 redirect
    window.location.href =
      "/";
  };

  // 🔥 CONTEXT VALUE
  const value = useMemo(() => ({

    token,

    isAuthenticated,

    selectedOrg,

    setSelectedOrg,

    profile,

    setProfile,

    loading,

    login,

    logout,

    changeCSA,

  }), [
    token,
    isAuthenticated,
    selectedOrg,
    profile,
    loading,
  ]);

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 🔥 CUSTOM HOOK
export function useAuth() {

  const context =
    useContext(
      AuthContext
    );

  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}