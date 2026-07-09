import type {LoginRequest,LoginResponse,RegisterRequest,RegisterResponse} from "../types/user";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const login = async (credentials:LoginRequest):Promise<LoginResponse>=>{
    // Backend expects OAuth2PasswordRequestForm (form-encoded with "username" field)
    const formData = new URLSearchParams();
    formData.append("username", credentials.email);
    formData.append("password", credentials.password);

    const response = await axios.post<LoginResponse>(`${API_URL}/login`, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    
    // Store the token in localStorage
    if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
    }
    
    return response.data;
}

export const register = async (user:RegisterRequest):Promise<RegisterResponse>=>{
    const response = await axios.post<RegisterResponse>(`${API_URL}/register`,user);
    return response.data;
}

export const logout = () => {
    localStorage.removeItem("token");
}

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem("token");
}