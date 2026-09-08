import  { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Heart, User, ShoppingCart, Menu, X, LogOut } from "lucide-react";
import { Container } from "../ui/Container";
import { useAuth } from "../../features/auth/AuthContext";
import { useCart } from "../../features/cart/CartContext";
import { useWishlist } from "../../features/wishlist/WishlistContext";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Shop", path: "/shop" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="bg-brand-blue py-2 text-center text-xs font-medium text-white sm:text-sm">
        Special Back to School Offers! Shop Stationery Now
      </div>

      <Container>
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-brand-navy">
            <span className="text-3xl font-black text-brand-blue">R</span>
            <span className="hidden sm:inline-block">RAMEERDER PACE GROUP</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-semibold transition-colors hover:text-brand-blue ${
                  isActive(link.path) ? "text-brand-blue" : "text-brand-text"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 lg:gap-6">
            <button className="text-brand-text hover:text-brand-blue transition-colors">
              <Search className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>
            <Link to="/wishlist" className="relative hidden sm:block text-brand-text hover:text-brand-blue transition-colors">
              <Heart className="h-5 w-5 lg:h-6 lg:w-6" />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-red text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-4">
                <span className="text-sm font-semibold text-brand-navy">Hi, {user?.firstName}</span>
                <button onClick={handleLogout} className="text-brand-muted hover:text-brand-red transition-colors" title="Logout">
                  <LogOut className="h-5 w-5 lg:h-6 lg:w-6" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block text-brand-text hover:text-brand-blue transition-colors">
                <User className="h-5 w-5 lg:h-6 lg:w-6" />
              </Link>
            )}

            <Link to="/cart" className="relative text-brand-text hover:text-brand-blue transition-colors">
              <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-red text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <button 
              className="lg:hidden text-brand-text ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </Container>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-brand-border shadow-lg">
          <nav className="flex flex-col px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-semibold transition-colors ${
                  isActive(link.path) ? "text-brand-blue" : "text-brand-text"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-brand-border flex gap-6 flex-wrap">
              <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-brand-text">
                <Heart className="h-5 w-5" /> Wishlist ({wishlistCount})
              </Link>
              {isAuthenticated ? (
                <>
                  <button className="flex items-center gap-2 text-brand-text">
                    <User className="h-5 w-5" /> Account
                  </button>
                  <button onClick={handleLogout} className="flex items-center gap-2 text-brand-red">
                    <LogOut className="h-5 w-5" /> Logout
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-brand-text">
                  <User className="h-5 w-5" /> Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}