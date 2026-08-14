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
  return (
    <motion.a
      className={cn(buttonVariants({ variant }), className)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      {...props}
    >
      {children}
    </motion.a>
  )
}
