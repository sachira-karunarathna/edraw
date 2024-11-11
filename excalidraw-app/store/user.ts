import { atom } from "jotai";
import { Session, User } from "@supabase/supabase-js";

export const userAtom = atom<User | null>(null);

export const sessionAtom = atom<Session | null>(null);
