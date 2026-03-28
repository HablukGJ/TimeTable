import type {User} from "../types/AuthTypes.ts";
import axios from "axios";

class AuthService {
    public baseUrl = "http://127.0.0.1:8000";

    async register(userData: User) {
        try {
            console.log(userData);
            const resp = await axios.post(`${this.baseUrl}/api/auth/register`, userData, {
                'headers': {
                    'Content-Type': 'application/json',
                }
            });
            console.log(resp);
            return resp.data;
        } catch (error) {
            console.log(error);
        }
    }
    async login(userData: {username: string; password: string}) {
        try {
            console.log(userData);
            const resp = await axios.post(`${this.baseUrl}/api/auth/login`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            localStorage.setItem("accessToken", resp.data.access);
            localStorage.setItem("user", JSON.stringify(resp.data.user));
            console.log(resp);
            return resp.data;
        } catch (error) {
            console.log(error);
        }
    }
    isAuthenticated() {
        return !!localStorage.getItem("accessToken");
    }
}
export const authService = new AuthService();