import userModel from '../models/userModel.js'

export const getUserData = async (req, res) => {
  try {
    const { userId } = req.body

    const user = await userModel.findById(userId)

    if (!user) {
      return res.status()
    }

    return res.json({
      success: true,
      data: user,
      message: 'user data fetched successful!'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
