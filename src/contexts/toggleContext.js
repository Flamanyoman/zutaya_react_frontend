import { createContext, useState } from 'react';

export const ToggleContext = createContext();

const ToggleContextProvider = (props) => {
  const [toggle, setToggle] = useState(true);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  return (
    <ToggleContext.Provider value={{ toggle, handleToggle }}>
      {props.children}
    </ToggleContext.Provider>
  );
};

export default ToggleContextProvider;
