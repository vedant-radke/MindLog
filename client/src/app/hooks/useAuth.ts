"use client";

import { useEffect, useState } from "react";
import { getToken } from "../../lib/auth";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token); // true if token exists
  }, []);

  return isLoggedIn;
};
