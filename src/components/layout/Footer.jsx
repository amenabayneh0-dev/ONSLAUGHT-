import Logo from '../ui/Logo.jsx'
import { navLinks, socials, site } from '../../data/site.js'

export default function Footer() {
  return (
    <footer className="border-t border-ons-silver/15 bg-ons-graphite">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.4fr_1fr_auto] lg:px-10">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ons-silver">
            {site.fullName}. {site.description}
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-ons-silver transition-colors hover:text-ons-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex items-start gap-3" aria-label="Social media">
          {socials.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center border border-ons-silver/25 text-ons-silver transition-colors duration-300 hover:border-ons-silver hover:bg-ons-silver hover:text-ons-black"
              >
                <Icon size={18} />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-ons-silver/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-xs text-ons-silver/70 sm:flex-row sm:justify-between lg:px-10">
          <p>&copy; {new Date().getFullYear()} {site.fullName}. All rights reserved.</p>
          <p>PUBG is a trademark of KRAFTON, Inc.</p>
        </div>
      </div>
    </footer>
  )
}
