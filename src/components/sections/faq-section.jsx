import { useId, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { easeOut } from '../../utilities/motion-settings'
import { Plus } from 'lucide-react'
import { cn } from '../../utilities/class-names'
import './faq-section.css'

const soapFaqs = [
  {
    question: 'What does Soap Labs actually do?',
    answer:
      'We map how your business really operates, identify the workflows, handoffs, and recurring work that are quietly costing you money, then build a practical system to remove that waste.',
  },
  {
    question: 'How do you find where money is being wasted?',
    answer:
      'We look beyond the org chart and follow the work itself. That means reviewing processes, tools, meetings, ownership, and repeated manual tasks to reveal where time, margin, and momentum are being lost.',
  },
  {
    question: 'What happens after you map our operations?',
    answer:
      'You get a clear, prioritized view of what is costing the business most. From there, we design and implement the right fix, whether that means simplifying a workflow, clarifying ownership, connecting tools, or removing unnecessary work.',
  },
  {
    question: 'How quickly can we expect to see an impact?',
    answer:
      'The timing depends on the complexity of your operation, but we focus first on the highest-value constraints so progress is visible early. Every recommendation is tied to a measurable operational or financial outcome.',
  },
  {
    question: 'Will we need to replace our current tools or team?',
    answer:
      'Not by default. We start with what you already have and improve how the business runs around it. New tools or structural changes are only recommended when they solve a specific, proven constraint.',
  },
  {
    question: 'What kind of businesses are a good fit for Soap Labs?',
    answer:
      'We are best suited to growing businesses that feel operational friction: too much manual work, unclear handoffs, disconnected tools, rising overhead, or a sense that growth is creating more complexity than progress.',
  },
]

export function FAQ({
  items,
  className,
  ...props
}) {
  const [openIndex, setOpenIndex] = useState(0)
  const reduceMotion = useReducedMotion()
  const titleLine = {
    hidden: { y: reduceMotion ? '0%' : '112%' },
    visible: {
      y: '0%',
      transition: { duration: reduceMotion ? 0 : 0.9, ease: easeOut },
    },
  }

  return (
    <section
      className={cn('faq-section', className)}
      aria-labelledby="faq-title"
      {...props}
    >
      <motion.h2
        id="faq-title"
        initial={reduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.14 } },
        }}
        aria-label="Frequently Asked Questions"
      >
        <span className="faq-title__clip">
          <motion.span className="faq-title__line" variants={titleLine}>
            Frequently Asked
          </motion.span>
        </span>
        <span className="faq-title__clip">
          <motion.span className="faq-title__line" variants={titleLine}>
            Questions
          </motion.span>
        </span>
      </motion.h2>

      <motion.div
        className="faq-list"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.07 } },
        }}
      >
        {items.map((faq, index) => (
          <FAQItem
            key={faq.question}
            {...faq}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
            reduceMotion={reduceMotion}
          />
        ))}
      </motion.div>
    </section>
  )
}

function FAQItem({ question, answer, isOpen, onToggle, reduceMotion }) {
  const answerId = useId()

  return (
    <motion.article
      className={cn('faq-item', isOpen && 'faq-item--open')}
      variants={{
        hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 22 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: reduceMotion ? 0 : 0.58,
            ease: easeOut,
            staggerChildren: reduceMotion ? 0 : 0.08,
          },
        },
      }}
      layout
    >
      <button
        className="faq-question"
        type="button"
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={onToggle}
      >
        <motion.span
          variants={{
            hidden: { opacity: reduceMotion ? 1 : 0, x: reduceMotion ? 0 : -10 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: reduceMotion ? 0 : 0.48, ease: easeOut },
            },
          }}
        >
          {question}
        </motion.span>
        <motion.span
          className="faq-toggle"
          aria-hidden="true"
          variants={{
            hidden: { opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.7 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { duration: reduceMotion ? 0 : 0.42, ease: easeOut },
            },
          }}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.22, ease: easeOut }}
        >
          <Plus size={24} strokeWidth={2} />
        </motion.span>
      </button>

      <motion.div
        id={answerId}
        className="faq-answer"
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
          marginBottom: isOpen ? 24 : 0,
        }}
        transition={{
          height: { duration: reduceMotion ? 0 : 0.36, ease: easeOut },
          opacity: { duration: reduceMotion ? 0 : isOpen ? 0.3 : 0.18 },
          marginBottom: { duration: reduceMotion ? 0 : 0.36, ease: easeOut },
        }}
      >
        <p>{answer}</p>
      </motion.div>
    </motion.article>
  )
}

export function FAQSection() {
  return <FAQ id="faq" items={soapFaqs} />
}
