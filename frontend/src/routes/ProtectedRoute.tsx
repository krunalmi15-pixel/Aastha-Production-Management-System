import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children
}: {
  children: React.ReactNode;
}) {

  const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;