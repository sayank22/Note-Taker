import axios from "axios";

const API_BASE = "http://localhost:5000/api/auth";

export const sendOtp = async (email: string) => {
  return axios.post(`${API_BASE}/send-otp`, { email });
};

export const verifyOtp = async (email: string, otp: string, name: string, dob: string) => {
  return axios.post(`${API_BASE}/verify-otp`, { email, otp, name, dob });
};
