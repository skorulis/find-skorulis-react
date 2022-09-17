import { Timestamp } from "firebase/firestore"

export interface Beer {
    name: string
    pct: string
    date: Timestamp
};