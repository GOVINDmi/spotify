import React, { useEffect, useState, useCallback } from "react";
import { useSongData } from "../context/SongContext"; // Adjust the import according to your structure
import Layout from "../components/Layout"; // Adjust the import according to your structure

const SearchPage: React.FC = () => {
  const { songs, albums, fetchSongs, fetchAlbums } = useSongData();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredSongs, setFilteredSongs] = useState(songs);
  const [filteredAlbums, setFilteredAlbums] = useState(albums);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Fetch songs and albums when page loads
  useEffect(() => {
    fetchSongs();
    fetchAlbums();
  }, [fetchSongs, fetchAlbums]);

  // Update filtered songs and albums when songs or albums change
  useEffect(() => {
    setFilteredSongs(
      songs.sort((a, b) => a.title.localeCompare(b.title))
    );
    setFilteredAlbums(
      albums.sort((a, b) => a.title.localeCompare(b.title))
    );
  }, [songs, albums]);

  // Debounced search logic
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      const search = value.trim().toLowerCase();

      if (search === "") {
        setFilteredSongs(
          songs.sort((a, b) => a.title.localeCompare(b.title))
        );
        setFilteredAlbums(
          albums.sort((a, b) => a.title.localeCompare(b.title))
        );
      } else {
        setFilteredSongs(
          songs
            .filter((song) => song.title.toLowerCase().includes(search))
            .sort((a, b) => a.title.localeCompare(b.title))
        );
        setFilteredAlbums(
          albums
            .filter((album) => album.title.toLowerCase().includes(search))
            .sort((a, b) => a.title.localeCompare(b.title))
        );
      }
    }, 2000); // 2 seconds

    setTypingTimeout(timeout);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <input
          type="text"
          placeholder="Search songs or albums..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Albums</h2>
          {filteredAlbums.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredAlbums.map((album) => (
                <div key={album.id} className="border p-4 rounded shadow hover:shadow-md transition">
                  <img src={album.thumbnail} alt={album.title} className="w-full h-40 object-cover rounded mb-2" />
                  <h3 className="text-lg font-semibold">{album.title}</h3>
                  <p className="text-sm text-gray-600">{album.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No albums found.</p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Songs</h2>
          {filteredSongs.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredSongs.map((song) => (
                <div key={song.id} className="border p-4 rounded shadow hover:shadow-md transition">
                  <img src={song.thumbnail} alt={song.title} className="w-full h-40 object-cover rounded mb-2" />
                  <h3 className="text-lg font-semibold">{song.title}</h3>
                  <p className="text-sm text-gray-600">{song.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{song.album}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No songs found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
