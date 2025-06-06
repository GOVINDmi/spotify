import React from "react";
import { FaBookmark, FaPlay } from "react-icons/fa";
import { useUserData } from "../context/UserContext";
import { useSongData } from "../context/SongContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SongCardProps {
  image: string;
  name: string;
  desc: string;
  id: string;
}

const SongCard: React.FC<SongCardProps> = ({ image, name, desc, id }) => {
  const {isAuth, playlists,addSongToPlaylist} = useUserData();
  const navigate = useNavigate();

  const {setSelectedSong, setIsPlaying,isPlaying,selectedSong} = useSongData()
  const [showMenu, setShowMenu] = useState(false);
    

  
  return (
    <div className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]">
      <div className="relative group">
        <img
          src={image ? image : "/download.jpeg"}
          className="mr-1 w-[160px] rounded"
          alt={name}
        />
        <div className="flex gap-2">
          {(
          <button className="absolute bottom-2 right-14 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer" onClick={() => {
            if(!isAuth)
            {
              navigate("/login")
            }
            if (id === selectedSong) {
              setIsPlaying(!isPlaying); // Toggle play/pause
            } else {
              setSelectedSong(id); // Switch to new song
              setIsPlaying(true);   // Start playing new song
            }
          }}>
            <FaPlay />
          </button>)}
          {(
            <button
              className="absolute bottom-2 right-2 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={() =>{ 
                if(!isAuth)
                {
                  navigate("/login")
                }
                setShowMenu(!showMenu)
              }}
            >
              <FaBookmark />
            </button>
             
          )}
       {showMenu && (
        <div className="absolute right-2 top-full mt-2 bg-black p-2 rounded z-10">
          {playlists.map((pl) => (
            <div
              key={pl._id}
              className="p-1 hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                addSongToPlaylist(pl._id, id);
                setShowMenu(false);
              }}
            >
              {pl.name}
            </div>
          ))}
        </div>
        )}

        </div>
      </div>
      <p className="font-bold mt-2 mb-1">{name}</p>
      <p className="text-slate-200 text-sm">{desc.slice(0, 20)}...</p>
    </div>
  );
};

export default SongCard;
