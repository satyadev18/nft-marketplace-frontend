import React from "react";
interface ComponentProps {
  account: string |null;
}
const ProtectedRoutes: React.FC<ComponentProps> = ({account}) => {
  const isAuth = true;
  console.log(account)
  return (
    <div>
      <h2>protected routes</h2>
    </div>
  );
};

export default ProtectedRoutes;
