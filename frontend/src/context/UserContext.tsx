import axios from "axios";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const server = "http://localhost:5000";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  playlist: string[];
}
export interface Playlist {
  _id: string;
  name: string;
  songs: string[];
}

interface UserContextType {
  user: User | null;
  isAuth: boolean;
  loading: boolean;
  btnLoading: boolean;
  loginUser: (
    email: string,
    password: string,
    navigate: (path: string) => void
  ) => Promise<void>;
  registerUser: (
    name: string,
    email: string,
    password: string,
    navigate: (path: string) => void
  ) => Promise<void>;
  addToPlaylist: (id: string) => void;
  logoutUser: () => Promise<void>;
  fetchUser: () => Promise<void>;  // 🛠️ ADD this line
  playlists: Playlist[];
  fetchPlaylists: () => Promise<void>;
  createPlaylist: (name: string) => Promise<void>;
  addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
}


const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  async function registerUser(
    name: string,
    email: string,
    password: string,
    navigate: (path: string) => void
  ) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/v1/user/register`, {
        name,
        email,
        password,
      },{
        withCredentials:true
      });

      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occured");
      setBtnLoading(false);
    }
  }

  async function loginUser(
    email: string,
    password: string,
    navigate: (path: string) => void
  ) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/v1/user/login`, {
        email,
        password,
      },{
        withCredentials:true
      });

      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occured");
      setBtnLoading(false);
    }
  }

  async function fetchUser() {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/me`, {
        withCredentials: true,  
      });

      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function logoutUser() {
    try {
      // Perform a logout action if your backend clears the cookie on logout.
      await axios.post(`${server}/api/v1/user/logout`, {}, {
        withCredentials: true, // Ensure cookies are sent with the request
      });
    } catch (error) {
      console.log(error);
    }
    setUser(null);
    setIsAuth(false);
    setPlaylists([]);
    toast.success("User Logged Out");
  }

  async function addToPlaylist(id: string) {
    try {
      const { data } = await axios.post(
        `${server}/api/v1/song/${id}`,
        {},
        {
          withCredentials: true,  // Ensure cookies are sent with the request
        }
      );

      toast.success(data.message);
      fetchUser();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An Error Occured");
    }
  }

  
  const fetchPlaylists = async () => {
    const { data } = await axios.get<Playlist[]>(`${server}/api/v1/playlists`, { withCredentials: true });
    setPlaylists(data);
  };

  const createPlaylist = async (name: string) => {
    const { data } = await axios.post<Playlist>(
      `${server}/api/v1/playlists`,
      { name },
      { withCredentials: true }
    );
    setPlaylists((prev) => [...prev, data]);
    toast.success(`Playlist "${name}" created`);
  };

  const addSongToPlaylist = async (playlistId: string, songId: string) => {
    await axios.post(
      `${server}/api/v1/playlists/${playlistId}/songs/${songId}`,
      {},
      { withCredentials: true }
    );
    toast.success("Song added to playlist");
    // optionally refresh playlists:
    fetchPlaylists();
  };

  useEffect(() => {
    fetchUser();
    fetchPlaylists();
    console.log(playlists);
  }, [isAuth]);


  return (
    <UserContext.Provider
    value={{
      user,
      loading,
      isAuth,
      btnLoading,
      loginUser,
      registerUser,
      logoutUser,
      addToPlaylist,
      fetchUser,  // 🛠️ ADD this here
      playlists,
      fetchPlaylists,
      createPlaylist,
      addSongToPlaylist,
    }}
  >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const useUserData = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserProvider");
  }
  return context;
};
