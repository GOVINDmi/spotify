import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { Song, useSongData } from "../context/SongContext";
import { useUserData } from "../context/UserContext";
import { FaBookmark, FaPlay } from "react-icons/fa";
import Loading from "../components/Loading";

const PlayList: React.FC = () => {
  const { songs, setIsPlaying, setSelectedSong, loading,isPlaying } = useSongData();
  const { playlists, addSongToPlaylist } = useUserData();

  // get playlistId from URL
  const params = useParams<{ id: string }>();
 

  // songs to show in this playlist
  const [myPlayList, setMyPlayList] = useState<Song[]>([]);
  // which song’s menu is open
  const [showMenuFor, setShowMenuFor] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) {
      setMyPlayList([]);
      return;
    }
    // find the playlist object
    const pl = playlists.find((p) => p._id === params.id);
  
    if (!pl) {
      setMyPlayList([]);
      return;
    }
    // filter all songs by this playlist’s song IDs
    const filtered = songs.filter(song =>
      // turn the number into a string before checking
      pl.songs.includes(song.id.toString())
    );
    console.log(filtered);
    setMyPlayList(filtered);
  }, [songs, playlists, params.id]);

  return (
    <div>
      <Layout>
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-center">
              <img src={"/download.jpeg"} className="w-48 rounded" alt="" />
              <div className="flex flex-col">
                <p>PlayList</p>
                <h2 className="text-3xl font-bold mb-4 md:text-5xl">
                  {/** you could display the playlist name here, but if you want to keep user name: */}
                  {playlists.find((p) => p._id === params.id)?.name} Playlist
                </h2>
                <h4>Your Favorite Songs</h4>
                <p className="mt-1">
                  <img src="/logo.png" className="inline-block w-6" alt="" />
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
              <p>
                <b className="mr-4">#</b>
              </p>
              <p className="hidden sm:block">Description</p>
              <p className="text-center">Actions</p>
            </div>

            <hr />
            {myPlayList.length === 0 ? (
              <p className="text-gray-400 mt-4">No songs in this playlist.</p>
            ) : (
              myPlayList.map((song, index) => (
                <div
                  key={song.id}
                  className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7] hover:bg-[#ffffff2b]  relative"
                >
                  <p className="text-white col-span-2 flex items-center">
                    <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
                    <img
                      src={song.thumbnail || "/download.jpeg"}
                      className="inline w-10 mr-5"
                      alt=""
                    />{" "}
                    {song.title}
                  </p>
                  <p className="text-[15px] hidden sm:block">
                    {song.description.slice(0, 30)}...
                  </p>
                 <div className="flex justify-center items-center gap-5 relative">
                  {/* Bookmark Button + Dropdown Menu Wrapper */}
                                  <div className="relative">
                                    <button
                                      className="text-[15px] text-center cursor-pointer"
                                      onClick={() =>
                                        setShowMenuFor((prev) => (prev === song.id ? null : song.id))
                                      }
                                    >
                                      <FaBookmark />
                                    </button>
                
                                    {/* Playlist Menu */}
                                    {showMenuFor === song.id && (
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black p-2 rounded z-10 min-w-[120px] shadow-lg">
                                        {playlists.map((pl) => (
                                          <div
                                            key={pl._id}
                                            className="p-1 hover:bg-gray-700 cursor-pointer text-white text-sm"
                                            onClick={() => {
                                              addSongToPlaylist(pl._id, song.id);
                                              setShowMenuFor(null);
                                            }}
                                          >
                                            {pl.name}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                
                                  {/* Play Button */}
                                  <button
                                    className="text-[15px] text-center cursor-pointer"
                                    onClick={() => {
                                      setSelectedSong(song.id);
                                      setIsPlaying(true);
                                    }}
                                  >
                                    <FaPlay />
                                  </button>
                                </div>
                </div>
              ))
            )}
          </>
        )}
      </Layout>
    </div>
  );
};

export default PlayList;
