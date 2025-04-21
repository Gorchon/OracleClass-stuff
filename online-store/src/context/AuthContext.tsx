// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  getUserDisplayName,
  getUserRole,
} from "../services/authenticationService";
import { auth } from "../services/firebaseConfig";

interface AuthContextType {
  user: User | null;
  role: string;
  loading: boolean;
  displayName: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: "customer",
  loading: true,
  displayName: null,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string>("customer");
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userRole = await getUserRole(user.uid);
        setRole(userRole);
        const name = await getUserDisplayName(user.uid);
        setDisplayName(name);
      } else {
        setRole("customer");
        setDisplayName(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, displayName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);
