import { User } from "../../context/UserContext";

export interface LoginUserInfo extends User {
    token: string;
}