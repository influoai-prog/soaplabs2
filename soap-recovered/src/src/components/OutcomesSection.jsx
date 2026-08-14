import { motion } from 'framer-motion'
import { FileText, Mic2, UploadCloud, Waves } from 'lucide-react'
import { ArrowIcon } from './ArrowIcon'
import { Button } from './ui/button'
import './OutcomesSection.css'

const cards = [
  {
    className: 'outcome-card--letters',
    icon: FileText,
    label: 'Operations map',
    title: 'Instantly expose costly manual workflows',
    button: 'About Mapping',
    visual: 'letters',
  },
  {
    className: 'outcome-card--transcribe',
    icon: Mic2,
    label: 'Process intelligence',
    title: 'Turn scattered business activity into clear systems',
    button: 'About Systems',
    visual: 'transcribe',
  },
]

function CardVisual({ type }) {
  if (type === 'letters') {
    return (
      <div className="outcome-demo outcome-demo--letters" aria-hidden="true">
        <div className="outcome-upload-row">
          <span><b>Upload workflows</b><small>Choose documents</small></span>
          <span><b>Upload recordings</b><small>Choose meetings</small></span>
        </div>
        <div className="outcome-input"><UploadCloud size={15} /> Type or upload a process</div>
        <div className="outcome-files">
          <FileText size={27} />
          <FileText size={27} />
        </div>
      </div>
    )
  }

  return (
    <div className="outcome-demo outcome-demo--transcribe" aria-hidden="true">
      <p>The team spends hours moving the same information between disconnected tools.</p>
      <div className="outcome-wave">
        <span />
        <Waves size={122} strokeWidth={2.6} />
        <span />
      </div>
    </div>
  )
}

export function OutcomesSection() {
  return (
    <section className="outcomes-section" id="outcomes">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        Real Business Outcomes
      </motion.h2>

      <div className="outcomes-grid">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.article
              className={`outcome-card ${card.className}`}
              key={card.label}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.75, delay: index * 0.08 }}
            >
              <span className="outcome-card__label"><Icon size={16} />{card.label}</span>
              <h3>{card.title}</h3>
              <CardVisual type={card.visual} />
              <Button href="#process" variant="outline" className="outcome-card__button">
                {card.button}
                <ArrowIcon direction="right" size={24} aria-hidden="true" />
              </Button>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
