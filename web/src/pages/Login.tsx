import { SubmitHandler, useForm } from 'react-hook-form'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import Input from '../components/Input'
import { pb } from '../services'

interface LoginForm {
  username: string
  password: string
}

export default function Login() {
  const location = useLocation()
  const navigate = useNavigate()

  const from = location.state?.from?.pathname || '/'

  const { handleSubmit, register, formState, setError } = useForm<LoginForm>()

  const onSubmitLogin: SubmitHandler<LoginForm> = async ({
    username,
    password,
  }) => {
    try {
      await pb.collection('users').authWithPassword(username, password)

      if (pb.authStore.isValid) {
        // Send them back to the page they tried to visit when they were
        // redirected to the login page. Use { replace: true } so we don't create
        // another entry in the history stack for the login page.  This means that
        // when they get to the protected page and click the back button, they
        // won't end up back on the login page, which is also really nice for the
        // user experience.
        navigate(from, { replace: true })
      }
    } catch (e) {
      setError(
        'root',
        { message: 'Invalid Credentials!' },
        { shouldFocus: true }
      )
    }
  }

  const forgotPassword = async () => {
    return
  }

  if (pb.authStore.isValid) {
    return <Navigate to={from} replace />
  }

  return (
    <div className="flex h-96 min-h-screen flex-col items-center justify-center space-y-8">
      <h1 className="text-4xl">Login</h1>
      <form
        onSubmit={handleSubmit(onSubmitLogin)}
        className="flex w-full max-w-xs flex-col items-start space-y-3"
      >
        {formState.errors.root && (
          <p className="text-center text-red-400">
            {formState.errors.root.message}
          </p>
        )}
        <Input
          type="text"
          {...register('username', { required: true })}
          placeholder="Enter your username or email"
          isError={!!formState.errors.username}
          errorText="Username is required"
        />
        <Input
          type="password"
          {...register('password', { required: true, minLength: 8 })}
          placeholder="Password"
          isError={!!formState.errors.password}
          errorText={
            formState.errors.password?.type === 'required'
              ? 'Password is required'
              : 'Password is invalid'
          }
        />
        <button
          type="button"
          onClick={forgotPassword}
          className="text-xs font-semibold text-orange-300 hover:text-orange-400 focus:underline focus:outline-none"
        >
          Forgot password?
        </button>
        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold leading-6 text-white shadow transition duration-150 ease-in-out hover:bg-orange-400 focus:outline-none focus:ring focus:ring-orange-300 disabled:cursor-not-allowed disabled:bg-gray-700"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting && (
            <svg
              className="-ml-1 mr-2 h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          Submit
        </button>
      </form>
    </div>
  )
}
