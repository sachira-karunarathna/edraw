import { userAtom } from "../store/user";
import { useAtom } from "jotai";

export const isAuthenticated = (): boolean => {
    const [user, ] = useAtom(userAtom)
    return user === null ? false : true;
};