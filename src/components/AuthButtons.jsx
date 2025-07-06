import { useAuth } from '../context/authContext';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineLogout } from 'react-icons/hi';

const AuthButtons = () => {
  const { user, signInWithGoogle, logout } = useAuth();

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <div className="flex items-center gap-3">
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-8 h-8 rounded-full"
          />
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <HiOutlineLogout className="text-xl" />
            Sign Out
          </button>
        </div>
      ) : (
        <button
          onClick={signInWithGoogle}
          className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          <FcGoogle className="text-xl" />
          Sign in with Google
        </button>
      )}
    </div>
  );
};

export default AuthButtons; 