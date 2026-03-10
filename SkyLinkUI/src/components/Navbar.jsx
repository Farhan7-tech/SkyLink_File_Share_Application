import { useContext, useEffect, useState } from "react";
import { Menu, Share2, Wallet, X, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import SideMenu from "./SideMenu.jsx";
import CreditsDisplay from "./CreditsDisplay.jsx";
import { UserCreditsContext } from "../context/UserCreditsContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const { credits, fetchUserCredits } = useContext(UserCreditsContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    fetchUserCredits();
  }, [fetchUserCredits]);

  const handleToggle = () => {
    console.log("Toggling theme from:", theme);
    toggleTheme();
  };

  return (
    <div className="flex items-center justify-between gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-4 sm:px-7 sticky top-0 z-30 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
      {/* Left side - menu button and title*/}
      <div className="flex items-center gap-5">
        <button
          onClick={() => setOpenSideMenu(!openSideMenu)}
          className="block lg:hidden text-black hover:bg-gray-100 p-1 rounded transition-colors dark:text-white dark:hover:bg-gray-700"
        >
          {openSideMenu ? (
            <X className="text-2xl" />
          ) : (
            <Menu className="text-2xl" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <Share2 className="text-blue-600" />
          <span className="text-lg font-medium text-black truncate dark:text-white">
            SkyLink
          </span>
        </div>
      </div>

      {/* Right side - credits and user button*/}
      <SignedIn>
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggle}
            className="text-black hover:bg-gray-100 p-2 rounded-full transition-colors dark:text-white dark:hover:bg-gray-700"
          >
            {theme === "light" ? <Moon /> : <Sun />}
          </button>
          <Link to="/subscriptions">
            <CreditsDisplay credits={credits} />
          </Link>
          <div className="relative">
            <UserButton />
          </div>
        </div>
      </SignedIn>

      {/* Mobile side menu */}
      {openSideMenu && (
        <div className="fixed top-[73px] left-0 right-0 bg-white border-b border-gray-200 lg:hidden z-20 dark:bg-gray-800 dark:border-gray-700">
          {/* Side menu bar */}
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
