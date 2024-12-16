import React, { useContext, useEffect } from "react";
import HeaderSection from "@/components/common/HeaderSection";
import SidePanelSection from "@/components/common/SidePanelSection";
import { Outlet } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthProvider";

const AuthenticatedLayout = () => {
  const { userRefresh } = useContext(AuthContext);

  // useEffect for userRefresh on component mount
  // useEffect(() => {
  //   userRefresh();
  //   // The empty dependency array ensures this effect runs only once on mount
  // }, []);

  return (
    // React.Fragment can be simplified to <>
    <>
      {/* Header Section */}
      <HeaderSection />

      {/* Side Panel Section */}
      <SidePanelSection />

      {/* Render nested routes */}
      <Outlet />
    </>
  );
};

export default AuthenticatedLayout;
