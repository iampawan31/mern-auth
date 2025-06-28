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

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    if (decodedToken.id) {
      req.body.userId = decodedToken.id
    } else {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access!!'
      })
    }

    next()
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export default userAuth
