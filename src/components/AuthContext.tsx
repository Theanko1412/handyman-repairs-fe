import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import ApiService from "@/ApiService";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "./ui/toaster";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  type: "CUSTOMER" | "HANDYMAN";
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    userType: string,
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: async () => {},
  register: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem("isLoggedIn");
    return saved === "true";
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await ApiService.get("/auth/check", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setIsLoggedIn(true);
          localStorage.setItem("isLoggedIn", "true");
        }
      } catch (error) {
        console.error("Session check failed:", error);
        setIsLoggedIn(false);
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("user");
      }
    };

    checkSession();
  }, []);

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    userType: string,
  ) => {
    try {
      const response = await ApiService.post(
        "/auth/register/" + userType,
        {
          firstName,
          lastName,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      if (response.status >= 200 && response.status < 300) {
        await login(email, password);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Registration failed. Please try again.",
        duration: 2000,
      });
      setIsLoggedIn(false);
      localStorage.setItem("isLoggedIn", "false");
      localStorage.removeItem("user");
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await ApiService.post(
        "/auth/login",
        new URLSearchParams({
          username,
          password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          withCredentials: true,
        },
      );

      if (response.status >= 200 && response.status < 300) {
        const userData = await ApiService.get<User>("/auth/user", {
          params: {
            email: username,
          },
          withCredentials: true,
        });
        setUser(userData.data);
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(userData.data));
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid username or password",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Incorrect username or password. Please try again.",
        duration: 2000,
      });
      setIsLoggedIn(false);
      localStorage.setItem("isLoggedIn", "false");
      localStorage.removeItem("user");
    }
  };

  const logout = async () => {
    try {
      const response = await ApiService.post(
        "/auth/logout",
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "Incorrect username or password. Please try again.",
        duration: 2000,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout }}>
      {children}
      <Toaster />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
