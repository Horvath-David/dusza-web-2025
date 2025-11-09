import {
  createContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { UserMe } from "~/models";

interface UserContextType {
  user: UserMe;
  setUser: Dispatch<SetStateAction<UserMe>>;
}

export const UserContext = createContext<UserContextType>({
  user: {} as UserMe,
  setUser: () => {},
});

export function UserContextProvider(props: {
  children: ReactNode;
  initial: UserMe;
}) {
  const [user, setUser] = useState<UserMe>(props.initial);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
