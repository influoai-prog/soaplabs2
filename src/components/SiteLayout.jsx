import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { useLenis } from '../lib/useLenis'

export function SiteLayout({ children, pageClassName = '', navbarProps = {} }) {
  useLenis()

  return (
    <main className="site-shell" id="top">
      <div className={`page${pageClassName ? ` ${pageClassName}` : ''}`}>
        <Navbar {...navbarProps} />
        <div className="page-content">{children}</div>
      </div>
      <Footer />
    </main>
  )
}
