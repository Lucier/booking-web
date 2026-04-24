import { Link } from 'react-router-dom'
import type { LinkProps } from 'react-router-dom'
import { cn } from '@/utils/cn'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface LinkButtonProps extends LinkProps {
  variant?: Variant
  size?: Size
  icon?: React.ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-6 text-base gap-2',
}

export function LinkButton({
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </Link>
  )
}
