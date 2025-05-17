
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Home, BookPlus, LayoutDashboard } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="font-bold text-2xl bg-gradient-to-r from-coursegen-blue to-coursegen-purple bg-clip-text text-transparent">
            CourseGen
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {!user ? (
            <>
              <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                <span>Login</span>
              </Link>
              <Link to="/register" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                <span>Register</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link to="/course-generator" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                <BookPlus className="h-4 w-4" />
                <span>Create Course</span>
              </Link>
            </>
          )}
        </nav>

        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Hi, {user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
            </span>
            <Button variant="outline" onClick={logout} size="sm" className="flex items-center gap-1">
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
