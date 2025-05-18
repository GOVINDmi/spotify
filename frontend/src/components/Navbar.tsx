import { useNavigate } from "react-router-dom";
import { useUserData } from "../context/UserContext";
import { useState } from "react";

interface NavbarProps {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const { isAuth, logoutUser } = useUserData();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const logoutUserHanlder = () => {
    logoutUser();
    navigate('/');
  };

  // Close dropdown when clicking outside
  // const handleClickOutside = (event: any) => {
  //   if (!event.target.closest('.dropdown')) {
  //     setIsDropdownOpen(false);
  //   }
  // };

  return (
    <>
      <div className="w-full flex justify-between items-center font-semibold relative">
        <div className="flex items-center gap-2">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsSidebarOpen(prev => !prev)}
            className="md:hidden p-2"
          >
            <img src="/icons8-hamburger-menu-32.png" className="w-6" alt="Menu" />
          </button>
          {/* Existing arrow buttons */}
          <img
            src="/left_arrow.png"
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
            onClick={() => navigate(-1)}
            alt=""
          />
          <img
            src="/right_arrow.png"
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
            onClick={() => navigate(+1)}
            alt=""
          />
        </div>

        {/* Desktop view */}
        <div className="flex items-center gap-4 justify-end">
          <p className="px-4 py-1 cursor-pointer bg-white text-black text-[15px] rounded-full hidden md:block">
            Explore Premium
          </p>
          <p className="px-4 py-1 cursor-pointer bg-white text-black text-[15px] rounded-full hidden md:block">
            Install App
          </p>
          {isAuth ? (
            <p
              onClick={logoutUserHanlder}
              className="px-4 py-1 cursor-pointer bg-white text-black text-[15px] rounded-full hidden md:block"
            >
              Logout
            </p>
          ) : (
            <p
              onClick={() => navigate("/login")}
              className="px-4 py-1 cursor-pointer bg-white text-black text-[15px] rounded-full hidden md:block"
            >
              Login
            </p>
          )}
        </div>

        {/* Mobile view dropdown */}
        <div className="md:hidden">
          <div className="dropdown relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-1 py-1 cursor-pointer bg-white text-black text-[15px] rounded-full"
            >
              <img src="/dot.png" className="w-5" alt="Menu" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 top-12 bg-black rounded-lg shadow-lg p-2 flex flex-col gap-2">
                <p className="px-4 py-1 cursor-pointer text-white text-[15px] rounded-full hover:bg-gray-800" onClick={() => {
                  setIsDropdownOpen(false);
                  navigate(0);
                }}>
                  Explore Premium
                </p>
                <p className="px-4 py-1 cursor-pointer text-white text-[15px] rounded-full hover:bg-gray-800" onClick={() => {
                  setIsDropdownOpen(false);
                  // Handle install app logic
                }}>
                  Install App
                </p>
                {isAuth ? (
                  <p
                    onClick={() => {
                      logoutUserHanlder();
                      setIsDropdownOpen(false);
                    }}
                    className="px-4 py-1 cursor-pointer text-white text-[15px] rounded-full hover:bg-gray-800"
                  >
                    Logout
                  </p>
                ) : (
                  <p
                    onClick={() => {
                      navigate("/login");
                      setIsDropdownOpen(false);
                    }}
                    className="px-4 py-1 cursor-pointer text-white text-[15px] rounded-full hover:bg-gray-800"
                  >
                    Login
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

     <div className="flex items-center gap-2 mt-4 flex-wrap">
        <p className="bg-white text-black px-2 py-1 sm:px-4 rounded-2xl cursor-pointer text-sm sm:text-[15px]">
          All
      </p>
        <p className="bg-white text-black px-2 py-1 sm:px-4 rounded-2xl cursor-pointer text-sm sm:text-[15px] hidden md:block">
          Music
        </p>
        <p className="bg-white text-black px-2 py-1 sm:px-4 rounded-2xl cursor-pointer text-sm sm:text-[15px] hidden md:block">
          Podcasts
        </p>
      
      </div>

    </>
  );
};

export default Navbar;
