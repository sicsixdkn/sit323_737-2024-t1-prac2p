import React, {Dispatch, SetStateAction} from 'react';
import {IUser} from "../types/types.ts";

interface IUserContext {
    user: IUser | null;
    setUser: Dispatch<SetStateAction<IUser | null>>;
}

const UserContext = React.createContext<IUserContext | undefined>(undefined);

export default UserContext;