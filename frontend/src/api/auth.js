import axios from "axios";
const API_BASE = `${import.meta.env.VITE_API_URL}/api/auth`;
export const sendOtp = async (email) => {
    return axios.post(`${API_BASE}/send-otp`, { email });
};
export const verifyOtp = async (email, otp, name, dob) => {
    return axios.post(`${API_BASE}/verify-otp`, { email, otp, name, dob });
};
