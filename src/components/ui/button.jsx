import { cva } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { cn } from '../../utilities/class-names'
import './button.css'

const buttonVariants = cva('button', {
  variants: {
    variant: {
      primary: 'button--primary',
      outline: 'button--outline',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

export function Button({ className, variant, children, ...props }) {
  const handleClick = (event) => {
    props.onClick?.(event)

    if (event.defaultPrevented || !props.href?.startsWith('#')) return

    const target = document.querySelector(props.href)
    if (!target) return

    event.preventDefault()
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'start',
    })
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${window.location.search}`,
    )
  }

  return (
    <motion.a
      className={cn(buttonVariants({ variant }), className)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      {...props}
      onClick={handleClick}
    >
      {children}
    </motion.a>
  )
}
