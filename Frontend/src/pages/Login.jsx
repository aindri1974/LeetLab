import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router'; // Note: react-router-dom is the standard
import { useEffect, useState } from 'react';
import { loginUser } from '../authSlice';

// Schema remains the same
const loginSchema = z.object({
  emailId: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." })
});

// Eye icons for password visibility toggle
const EyeOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);


function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  // Base input classes for a consistent look
  const inputClasses = "w-full p-3 bg-neutral-800 rounded-md border border-neutral-700 text-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500";
  const errorInputClasses = "border-red-500 focus:ring-red-500";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#1A1A1A] text-gray-200">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#282828] rounded-lg border border-neutral-800">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-yellow-500">Sign In</h1>
            <p className="mt-2 text-gray-400">to continue to LeetCode</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="emailId" className="block text-sm font-medium text-gray-400 mb-2">
              Email Address
            </label>
            <input
              id="emailId"
              type="email"
              placeholder="john@example.com"
              className={`${inputClasses} ${errors.emailId ? errorInputClasses : 'border-neutral-700'}`}
              {...register('emailId')}
            />
            {errors.emailId && (
              <p className="text-red-500 text-xs mt-2">{errors.emailId.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" a className="block text-sm font-medium text-gray-400 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`${inputClasses} ${errors.password ? errorInputClasses : 'border-neutral-700'} pr-10`}
                {...register('password')}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-100"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-2">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 font-semibold text-neutral-900 bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : 'Sign In'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <NavLink to="/signup" className="font-medium text-yellow-500 hover:underline">
            Create one
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;