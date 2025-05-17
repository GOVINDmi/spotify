import { useNavigate } from "react-router-dom";
import PlayListCard from "./PlayListCard";
import { useUserData } from "../context/UserContext";
import { useState } from "react";

interface SidebarProps {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const { user } = useUserData();
  const { playlists, createPlaylist,isAuth } = useUserData();
  const [newName, setNewName] = useState("");

    const handleNavigate = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const handleCreate = () => {
    if(!isAuth)
    {
      navigate("/login");
      return;

    }
    if (newName.trim()) {
      createPlaylist(newName);
      setNewName("");
    }
  };
  return (

          <div className="w-[250px] h-full p-2 flex-col gap-2 text-white bg-[#000000]">
      <div className="bg-[#121212] h-[15%] rounded flex flex-col justify-around">
        <div
          className="flex items-center gap-3 pl-8 cursor-pointer"
          onClick={() => handleNavigate("/")}
        >
          <img src="/home.png" alt="" className="w-6" />
          <p className="font-bold">Home</p>
        </div>
        <div 
          className="flex items-center gap-3 pl-8 cursor-pointer"
          onClick={() => handleNavigate("/search")}
        >
          <img src="/search.png" alt="" className="w-6" />
          <p className="font-bold">Search</p>
        </div>
      </div>

      <div className="bg-[#121212] h-[85%] rounded">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/stack.png" className="w-8" alt="" />
            <p className="font-semibold">Your Library</p>
          </div>
          <div className="pl-4 flex  items-center gap-3">
           
            <div className="flex items-center gap-3 px-4 cursor-pointer" onClick={handleCreate}>
                <img src="/plus.png" className="w-6" alt="new" />
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="New playlist"
                  className="bg-transparent focus:outline-none text-white"
                />
              </div>
          </div>
        </div>
        <div>
      {playlists.map((pl) => (
        <div
          key={pl._id}
          onClick={() => navigate(`/playlist/${pl._id}`)}
          className="cursor-pointer mb-2"
        >
          <PlayListCard playlist={pl} />
        </div>
      ))}
    </div>
        

        <div className="p-4 m-2 bg-[#121212] rounded font-semibold flex flex-col items-start gap-1 pl-4 mt-4">
          <h1>Let's findsome podcasts to follow</h1>
          <p className="font-light">we'll keep you update on new episodes</p>
          <button className="px-4 py-1.5 bg-white text-black text-[15px] rounded-full mt-4">
            Browse Padcasts
          </button>
        </div>

        {user && user.role === "admin" && (
          <button
            className="ml-6 px-4 py-1.5 bg-white text-black text-[15px] rounded-full mt-4 cursor-pointer"
            onClick={() => navigate("/admin/dashboard")}
          >
            Admin Dashboard
          </button>
        )}
      </div>
    </div>
  
    
  );
};

export default Sidebar;
