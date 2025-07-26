import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
{
email: { type: String, required: true, unique: true },
otp: { type: String, required: true },
createdAt: { type: Date, default: Date.now, expires: 300 }, // auto delete after 5 min
},
{ timestamps: true }
);

export default mongoose.model('Otp', otpSchema);