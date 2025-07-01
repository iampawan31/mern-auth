import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets.ts'

const Navbar = () => {
  const navigate = useNavigate()

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img
        src={assets.logo}
        className="w-28 sm:w-32"
        alt="Client React App"
      />
      <button
        onClick={() => navigate('/login')}
        className="flex items-center gap-2 border rounded-full px-6 py-2 border-gray-500 text-gray-800 hover:bg-gray-100 transition-all"
      >
        Login
        <img
          src={assets.arrow_icon}
          alt="Login Button"
        />
      </button>
    </div>
  )
}

export default Navbar
