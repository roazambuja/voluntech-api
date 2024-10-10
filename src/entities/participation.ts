import { User } from "./user";
import { Volunteering } from "./volunteering";

export interface Participation {
  user: User;
  volunteering: Volunteering;
  status: "pending" | "confirmed" | "rejected";
}
