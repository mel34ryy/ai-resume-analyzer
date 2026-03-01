import { useNavigate } from "react-router";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
  const { auth } = usePuterStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate("/auth?next=/");
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <p className="text-xl sm:text-2xl font-bold text-gradient">RESUMIND</p>
      </Link>

      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          to="/upload"
          className="primary-button w-fit text-sm sm:text-base"
        >
          Upload Resume
        </Link>

        {auth.isAuthenticated && (
          <button
            onClick={handleLogout}
            className="primary-button w-fit text-sm sm:text-base"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
