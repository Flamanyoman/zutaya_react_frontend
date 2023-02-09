import { createContext, useState, useMemo } from 'react';

export const userContext = createContext();

const UserContextProvider = (props) => {
  const [user, setUser] = useState(null);

  const providerUser = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <userContext.Provider value={providerUser}>
      {props.children}
    </userContext.Provider>
  );
};

export default UserContextProvider;
