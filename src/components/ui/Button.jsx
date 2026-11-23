const angle = '[clip-path:polygon(12px_0,100%_0,calc(100%-12px)_100%,0_100%)]'
const sizes = { md: 'px-8 py-3.5', sm: 'px-6 py-2.5' }
const label = 'inline-flex items-center justify-center gap-2 text-sm font-semibold tracking-wide'

/**
 * primary: brushed-silver fill. ghost: 1px silver outline
 * (outer silver layer + inner black layer, so the angled edge keeps its border).
 */
export default function Button({ href, variant = 'primary', size = 'md', className = '', children, ...rest }) {
  if (variant === 'ghost') {
    return (
      <a
        href={href}
        className={`group inline-block bg-ons-silver/50 p-px transition-colors duration-300 hover:bg-ons-silver ${angle} ${className}`}
        {...rest}
      >
        <span className={`${label} ${sizes[size]} ${angle} flex w-full bg-ons-black text-ons-white transition-colors duration-300 group-hover:bg-ons-graphite`}>
          {children}
        </span>
      </a>
    )
  }
  return (
    <a
      href={href}
      className={`${label} ${sizes[size]} ${angle} silver-surface text-ons-black transition duration-300 hover:brightness-110 active:brightness-95 ${className}`}
      {...rest}
    >
      {children}
    </a>
  )
}
