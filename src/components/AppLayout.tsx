
import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Utensils, 
  Calendar, 
  FileText, 
  LogOut, 
  Menu as MenuIcon, 
  X,
  Package,
  Users,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { signOutUser } from "@/services/firebase";
import { useAuth } from "@/contexts/AuthContext";

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast.success("Déconnexion réussie");
      navigate("/login");
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigationItems = [
    {
      name: "Tableau de Bord",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Commandes",
      path: "/orders",
      icon: <ShoppingCart size={20} />,
    },
    {
      name: "Menu",
      path: "/menu",
      icon: <Utensils size={20} />,
    },
    {
      name: "Stock",
      path: "/stock",
      icon: <Package size={20} />,
    },
    {
      name: "Réservations",
      path: "/reservations",
      icon: <Calendar size={20} />,
    },
    {
      name: "Employés",
      path: "/employees",
      icon: <Users size={20} />,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: <Bell size={20} />,
    },
    {
      name: "Rapports",
      path: "/reports",
      icon: <FileText size={20} />,
    },
  ];

  return (
    <div className="flex h-screen bg-restaurant-background">
      <div 
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity",
          isSidebarOpen && !isMobile ? "opacity-0 pointer-events-none" : "",
          isSidebarOpen && isMobile ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside
        className={cn(
          "fixed lg:static h-full z-30 bg-sidebar w-64 shadow-xl transition-transform duration-300 ease-in-out transform lg:transform-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-2">
              <Utensils className="h-6 w-6 text-restaurant-accent" />
              <span className="text-white font-semibold text-lg">RestauManager</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-sidebar-accent"
              onClick={toggleSidebar}
            >
              <X size={24} />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                  isActive
                    ? "bg-restaurant-accent text-white"
                    : "text-white hover:bg-sidebar-accent"
                )}
                onClick={() => isMobile && setIsSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 text-white w-full px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors"
            >
              <LogOut size={20} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 py-4 flex justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleSidebar}
            >
              <MenuIcon size={24} />
            </Button>
            <h1 className="text-xl font-semibold text-restaurant-primary hidden sm:block">
              {navigationItems.find(item => item.path === location.pathname)?.name || "RestauManager"}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-restaurant-primary hidden sm:block">
                Bonjour, {currentUser?.displayName || currentUser?.email || "Manager"}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
