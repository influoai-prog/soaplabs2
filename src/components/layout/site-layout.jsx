import { Navbar } from './navbar'
import { Footer } from './footer'
import { useLenis } from '../../utilities/smooth-scroll'

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
