import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access!!'
      })
    }

    jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export default userAuth
