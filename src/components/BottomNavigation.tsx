import { Home, Map, Plus, MessageSquare, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Map, label: "Explore", path: "/explore" },
    { icon: Plus, label: "Post", path: "/post-property" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="mobile-nav">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200",
                "min-w-[60px] text-xs font-medium",
                isActive
                  ? "text-accent bg-accent/10"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    "h-5 w-5 mb-1 transition-all duration-200",
                    isActive ? "scale-110" : ""
                  )}
                />
                <span className="text-[10px]">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;