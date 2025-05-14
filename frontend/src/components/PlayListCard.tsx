import { FaMusic } from "react-icons/fa";
import { useUserData } from "../context/UserContext";
import { Playlist } from "../context/UserContext";
interface PlayListCardProps {
  playlist: Playlist;
}

const PlayListCard: React.FC<PlayListCardProps> = () => {
  const { user, isAuth, playlists } = useUserData();

  return (
    <div className="flex flex-col p-4 rounded-lg shadow-md hover:bg-[#ffffff26]">
      {playlists.map((pl) => (
        <div
          key={pl._id}
          className="flex items-center mb-3 cursor-pointer hover:opacity-80"
          // you might want to navigate to /playlist/:pl._id here
        >
          <div className="w-10 h-10 bg-gray-600 flex items-center justify-center rounded-md">
            <FaMusic className="text-white text-xl" />
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-medium">{pl.name}</h2>
            <p className="text-gray-400 text-sm">
              Playlist • {isAuth ? user?.name : "User"}
            </p>
          </div>
        </div>
      ))}

      {/* If you still want a “Create new playlist” button here, you can add it */}
    </div>
  );
};

export default PlayListCard;
