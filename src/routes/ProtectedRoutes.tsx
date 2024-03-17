import React from "react";
import { Navigate, Outlet } from "react-router-dom";
interface ComponentProps {
  account: string |null;
}
const ProtectedRoutes: React.FC<ComponentProps> = ({account}) => {
  return(
      account ? <Outlet/> : <Navigate to="/addnetwork"/>
  )
};

export default ProtectedRoutes;
