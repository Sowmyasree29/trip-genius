import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

function Header() {
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log("User data loaded:", user);
    }
  }, [user]);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  const GetUserProfile = async (tokenInfo) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo.access_token}`,
            Accept: "application/json",
          },
        }
      );
      console.log("Google User Info:", response.data);
  
     
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data); 
  
   
      setOpenDialog(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/"); 
  };

  return (
    <div className="fixed top-0 left-0 w-full z-10 p-4 flex flex-col sm:flex-row justify-between items-center bg-cover bg-center bg-[url('/images/pixabyh5.webp')] shadow-md">
      <img src="/images/logo1.png" alt="logo" className="h-10 rounded-full mb-2 sm:mb-0" />
      <div className="flex justify-end">
      <div className="flex items-center  mb-2 sm:mb-0">
        <Link to={"/"}>
          <button className="px-4 py-2 text-sm md:text-lg text-black rounded-md hover:text-blue-600 hover:underline hover:scale-105 transition-transform duration-300">
            Home
          </button>
        </Link>

        <Link to={"/createTrip"}>
          <button className="px-4 py-2 text-sm md:text-lg text-black rounded-md hover:text-blue-600 hover:underline hover:scale-105 transition-transform duration-300">
            Create Trip
          </button>
        </Link>
      </div>

      {user ? (
        <div className="flex items-center space-x-4">
          <Link to={"/mytrip"}>
            <button className="px-4 py-2 text-sm md:text-lg text-black rounded-md hover:text-blue-600 hover:underline hover:scale-105 transition-transform duration-300">
              My Trip
            </button>
          </Link>

          <Popover>
            <PopoverTrigger>
              <img
                src={user?.picture}
                alt="User Avatar"
                className="h-10 w-10 rounded-full border-2 border-gray-200 cursor-pointer"
                onError={(e) => { e.target.src = "/images/default-avatar.png"; }} // Fallback in case the picture is unavailable
              />
            </PopoverTrigger>
            <PopoverContent>
              <h2
                className="cursor-pointer text-gray-600 font-bold hover:text-red-600 transition duration-200 p-2"
                onClick={handleLogout}
              >
                Logout
              </h2>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <button
          onClick={() => setOpenDialog(true)}
          className="bg-blue-500 px-4 py-2 text-sm md:text-lg text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
          Sign In
        </button>
      )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-bold text-lg">Login to Continue</DialogTitle>
            <DialogDescription>
              You need to log in to access this feature.
            </DialogDescription>
          </DialogHeader>
          <button
            onClick={() => login()}
            className="flex items-center justify-center w-full px-4 py-2 mt-4 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200"
          >
            <FcGoogle className="mr-2" />
            Login with Google
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}


export default Header;
