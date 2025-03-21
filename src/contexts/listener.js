import { createContext, useContext } from 'react';
import { AudioListener } from 'three-stdlib';

export const listener = new AudioListener();

// export const ListenerContext = createContext();

// export const ListenerProvider = ({ children }) => {
//   return (
//     <ListenerContext.Provider value={emitter}>
//       {children}
//     </ListenerContext.Provider>
//   );
// };

// export const useListener = () => useContext(ListenerContext);
