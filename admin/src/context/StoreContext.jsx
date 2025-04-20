import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [token, setToken] = useState("");
  const [admin, setAdmin] = useState(false);
  const url = "http://localhost:5000"; // Update with your backend URL

  useEffect(() => {
    if (!token) {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    }

    if (!admin) {
      const storedAdmin = localStorage.getItem("admin");
      if (storedAdmin !== null) {
        setAdmin(storedAdmin === "true");
      }
    }
  }, [token, admin]);

  const contextValue = {
    token,
    setToken,
    admin,
    setAdmin,
    url,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
