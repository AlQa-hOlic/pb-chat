import { forwardRef, Ref, useId } from 'react'

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  // Error text to display hints for invalid inputs
  errorText?: string
  label?: string
}

function Input(
  { errorText, label, ...props }: InputProps,
  ref: Ref<HTMLInputElement>
) {
  const inputId = useId()

  const styleClasses =
    'w-full rounded-md border-2 p-2 px-3 focus:outline-none focus:ring focus:ring-opacity-50'
  const errorStyleClasses =
    'border-red-400 focus:border-red-400 focus:ring-red-300'
  const defaultStyleClasses =
    'border-slate-200 focus:border-orange-300 focus:ring-orange-300'
  const className = [
    styleClasses,
    ...(errorText ? [errorStyleClasses] : [defaultStyleClasses]),
    props.className,
  ].join(' ')
  return (
    <div className="flex w-full flex-col">
      {label && (
        <label className="m-1 text-sm font-semibold" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input id={inputId} ref={ref} {...props} className={className} />
      {errorText && <p className="mt-1 text-sm text-red-400">{errorText}</p>}
    </div>
  )
}

export default forwardRef<HTMLInputElement, InputProps>(Input)
