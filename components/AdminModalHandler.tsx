"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PassKeyModal from "./PassKeyModal";

const AdminModalHandler = () => {
  const searchParams = useSearchParams();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminFlag = searchParams.get("admin") === "true";
    setIsAdmin(adminFlag);
  }, [searchParams.toString()]); // this is key

  return isAdmin ? <PassKeyModal /> : null;
};

export default AdminModalHandler;
