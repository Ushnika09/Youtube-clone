import { createContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check localStorage on page load
    const storedUser = localStorage.getItem("userYT");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
