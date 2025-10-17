import { useContext } from "react";
import { AuthContext } from "./CreateContext";
// Adjust the path as needed

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
