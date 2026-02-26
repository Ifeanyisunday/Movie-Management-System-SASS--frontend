import { Link, useNavigate } from "react-router-dom";
import { Film, LogOut, User, Clapperboard, Store, Menu, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { logout } from "../store/slices/authSlice";
import { useState } from "react";

const Navbar = () => {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const role = user?.role;

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Film className="h-6 w-6 text-destructive" />
          <span className="bg-linear-to-r from-destructive text-amber-500">
            NaijaReels
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">Browse</Link>
              </Button>
              {(role === "customer") && (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/rentals">My Rentals</Link>
                </Button>
              )}
              {role === "vendor" && (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/vendor" className="flex items-center gap-1">
                    <Store className="h-4 w-4" /> My Movies
                  </Link>
                </Button>
              )}
              {role === "admin" && (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin" className="flex items-center gap-1">
                    <Clapperboard className="h-4 w-4" /> Admin
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile">
                  <User className="mr-1 h-4 w-4" />
                  {user?.username || "Profile"}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-1 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" className="bg-destructive hover:bg-destructive/90" asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/40 bg-background p-4 md:hidden">
          <div className="flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-accent">Browse</Link>
                {role === "customer" && (
                  <Link to="/rentals" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-accent">My Rentals</Link>
                )}
                {role === "vendor" && (
                  <Link to="/vendor" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-accent">My Movies</Link>
                )}
                {role === "admin" && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-accent">Admin</Link>
                )}
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-accent">Profile</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-accent">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-accent">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-accent">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
