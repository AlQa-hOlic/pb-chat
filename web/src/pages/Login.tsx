import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

import { ReactComponent as Logo } from '../assets/pb_chat.svg'
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

  const { handleSubmit, register, formState, reset } = useForm<LoginForm>()

  const onSubmitLogin: SubmitHandler<LoginForm> = async ({
    username,
    password,
  }) => {
    try {
      await pb.collection('users').authWithPassword(username, password)

      // Reset form
      reset()

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
      toast.error('Invalid Credentials!')
    }
  }

  // If the user is already logged in, send them back!
  if (pb.authStore.isValid) {
    return <Navigate to={from} replace />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-8 py-8">
      <h1 className="flex items-center justify-center gap-4 text-3xl">
        <span>Login to</span>
        <Logo className="h-12 w-12 text-orange-500" />
      </h1>
      <form
        onSubmit={handleSubmit(onSubmitLogin)}
        className="flex w-full max-w-xs flex-col items-start space-y-3"
      >
        <Input
          type="text"
          {...register('username', { required: true })}
          placeholder="Enter your username or email"
          errorText={formState.errors.username && 'Username is required'}
        />
        <Input
          type="password"
          {...register('password', { required: true, minLength: 8 })}
          placeholder="Password"
          errorText={
            formState.errors.password &&
            formState.errors.password?.type === 'required'
              ? 'Password is required'
              : 'Password is invalid'
          }
        />
        <Link
          to="/forgot-password"
          type="button"
          className="text-xs font-semibold text-orange-400 hover:text-orange-300 focus:text-orange-300 focus:underline focus:outline-none"
        >
          Forgot password?
        </Link>
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
        <div className="flex w-full items-center justify-center gap-3 text-slate-500">
          <div className="h-2 grow border-b border-slate-300"></div>
          <p>Or continue with</p>
          <div className="h-2 grow border-b border-slate-300"></div>
        </div>
        <div className="flex w-full items-center justify-center gap-2">
          <button
            type="button"
            className="inline-flex grow items-center justify-center rounded-md border border-slate-300 p-2 text-slate-600 hover:text-orange-400 focus:text-orange-400 focus:outline-none focus:ring focus:ring-orange-300"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 16 16"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
            >
              <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"></path>
            </svg>
          </button>
          <button
            type="button"
            className="inline-flex grow items-center justify-center rounded-md border border-slate-300 p-2 text-slate-600  hover:text-orange-400 focus:text-orange-400 focus:outline-none focus:ring focus:ring-orange-300"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 16 16"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
          </button>
        </div>
        <p className="w-full text-center text-sm text-slate-500">
          New to PB Chat?&nbsp;
          <Link
            to="/register"
            className="text-orange-400 hover:text-orange-300 focus:text-orange-300 focus:underline focus:outline-none"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  )
}
