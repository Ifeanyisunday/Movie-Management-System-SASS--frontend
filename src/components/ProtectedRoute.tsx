// import { Navigate } from "react-router-dom";
// import { useAppSelector } from "../store/hooks";

// interface Props {
//   children: React.ReactNode;
//   adminOnly?: boolean;
// }



// const ProtectedRoute = ({ children, adminOnly }: Props) => {
//   const { isAuthenticated, user } = useAppSelector((s) => s.auth);

//   if (!isAuthenticated) return <Navigate to="/login" replace />;
//   if (adminOnly && user?.role !== "admin") return <Navigate to="/" replace />;


//   return <>{children}</>;
// };

// export default ProtectedRoute;

import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import type { UserRole } from "../lib/types";

interface Props {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
