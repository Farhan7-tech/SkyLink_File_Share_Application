import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar.jsx";
import SideMenu from "../components/SideMenu.jsx";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useUser();
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Navbar component goes here*/}
      <Navbar activeMenu={activeMenu} />
      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            {/* Sidemenu goes here */}
            <SideMenu activeMenu={activeMenu} />
          </div>
          <div className="grow mx-5 dark:text-white">{children}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
