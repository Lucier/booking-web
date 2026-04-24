import { cn } from '@/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
}

export function Card({ children, className, onClick, hoverable }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border border-gray-200 bg-white shadow-sm',
        hoverable && 'cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all duration-200',
        className
      )}
    >
      {children}
    </div>
  )
}

Card.Header = function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-center justify-between px-6 py-4 border-b border-gray-100', className)}>
      {children}
    </div>
  )
}

Card.Body = function CardBody({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('p-6', className)}>{children}</div>
}

Card.Footer = function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl', className)}>
      {children}
    </div>
  )
}
