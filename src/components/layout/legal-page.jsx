import { useEffect } from 'react'
import { SiteLayout } from './site-layout'
import './legal-page.css'

export function LegalPage({ documentTitle, eyebrow = 'Legal', title, updated, sections, contact }) {
  useEffect(() => {
    const previous = document.title
    document.title = documentTitle
    return () => {
      document.title = previous
    }
  }, [documentTitle])

  return (
    <SiteLayout pageClassName="page--legal">
      <article className="legal-page">
        <header className="legal-page__header">
          <span className="legal-page__eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          {updated ? <p className="legal-page__meta">{updated}</p> : null}
        </header>

        <div className="legal-page__body">
          {sections.map((section) => (
            <section className="legal-page__section" id={section.id} key={section.id}>
              <h2>{section.heading}</h2>
              {section.body.map((block, index) =>
                typeof block === 'string' ? (
                  <p key={index}>{block}</p>
                ) : (
                  <ul key={index}>
                    {block.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ),
              )}
            </section>
          ))}
        </div>

        {contact ? <div className="legal-page__contact">{contact}</div> : null}
      </article>
    </SiteLayout>
  )
}
