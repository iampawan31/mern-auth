import { useContext, useState, type SyntheticEvent } from "react"
import { assets } from "../assets/assets"
import { useNavigate } from "react-router-dom"
import type { LoginStateType } from "../types"
import { AppContext } from "../context/AppContextDefinition"
import { LOGIN_STATES } from "../constants"
import { getAxiosInstance } from "../api/axios"
import { toast } from "react-toastify"
import envConfig from "../config/environmentTokens"

const Login: React.FC = () => {
  const navigate = useNavigate()

  const { setIsLoggedIn } = useContext(AppContext)

  const [state, setState] = useState<LoginStateType>(LOGIN_STATES.LOGIN)

  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const onSubmitHandler = async (e: SyntheticEvent): Promise<void> => {
    try {
      e.preventDefault()

      if (state === LOGIN_STATES.LOGIN) {
        const { data } = await getAxiosInstance().post("/auth/login", {
          email,
          password
        })

        if (data.success) {
          setIsLoggedIn(true)
          navigate("/")
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await getAxiosInstance().post("/auth/register", {
          name,
          email,
          password
        })

        if (data.success) {
          setIsLoggedIn(true)
          navigate("/")
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6 sm: px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        alt="Client React App Logo"
      />

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "login" ? "Login" : "Create Account"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "login" ? "Login to your account" : "Create your Account"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === LOGIN_STATES.REGISTER && (
            <div className="flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
              <img src={assets.person_icon} alt="" />
              <input
                className="bg-transparent outline-none text-gray-100"
                type="text"
                required
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
            <img src={assets.mail_icon} alt="" />
            <input
              className="bg-transparent outline-none text-gray-100"
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
            <img src={assets.lock_icon} alt="" />
            <input
              className="bg-transparent outline-none text-gray-100"
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {state == LOGIN_STATES.LOGIN && (
            <p
              onClick={() => navigate("/reset-password")}
              className="mb-4 text-indigo-500 cursor-pointer"
            >
              Forgot Password?
            </p>
          )}

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state === LOGIN_STATES.LOGIN ? "Login" : "Register"}
          </button>
        </form>

        {state === LOGIN_STATES.LOGIN ? (
          <p className="text-gray-400 text-xs text-center mt-4">
            Already have an account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-blue-400 cursor-pointer underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-xs text-center mt-4">
            Don't have an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-blue-400 cursor-pointer underline"
            >
              Register
            </span>
          </p>
        )}
      </div>
    </div>
  )
}

export default Login
