import { forwardRef, Ref } from 'react'

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  isError?: boolean
  errorText?: string
}
function Input(
  { isError = false, errorText, ...props }: InputProps,
  ref: Ref<HTMLInputElement>
) {
  const styleClasses =
    'w-full rounded-md border-2 border-gray-300 p-2 px-3 focus:outline-none focus:ring focus:border-orange-300 focus:ring-orange-300 focus:ring-opacity-50'
  const errorStyleClasses =
    'border-red-400 focus:border-red-400 focus:ring-red-300'
  const className = [
    styleClasses,
    ...(isError ? [errorStyleClasses] : []),
    props.className,
  ].join(' ')
  return (
    <div className="block w-full">
      <input ref={ref} {...props} className={className} />
      {isError && errorText && (
        <p className="mt-1 text-sm text-red-400">{errorText}</p>
      )}
    </div>
  )
}

export default forwardRef<HTMLInputElement, InputProps>(Input)
