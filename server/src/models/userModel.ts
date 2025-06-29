import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  verificationCode: {
    type: String,
    default: ''
  },
  verificationCodeExpiresAt: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordCode: {
    type: String,
    default: ''
  },
  resetPasswordCodeExpiresAt: {
    type: Number,
    default: 0
  }
})

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel
