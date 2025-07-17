import { Timestamp } from "firebase/firestore";

export const getTimestampMillis = (
  ts?: Timestamp | string | Date | null
): number => {
  if (!ts) return 0;
  if (typeof ts === "string") return new Date(ts).getTime();
  if (ts instanceof Date) return ts.getTime();
  if ("toDate" in ts) return ts.toDate().getTime(); // Firestore Timestamp
  return 0;
};
