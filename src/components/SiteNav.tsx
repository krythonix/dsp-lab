import { useEffect, useId, useRef, useState } from 'react'
import { getConcept } from '../content/concepts'
import { getRouteLabel, navMenu, routesEqual, type Route } from '../navigation'

type SiteNavProps = {
  route: Route
  onNavigate: (route: Route) => void
}

function getPageTitle(route: Route): string {
  if (route.type === 'concept') {
    return getConcept(route.slug)?.name ?? 'Concept guide'
  }
  return getRouteLabel(route)
}

function isItemActive(route: Route, itemRoute: Route): boolean {
  return routesEqual(route, itemRoute)
}

export function SiteNav({ route, onNavigate }: SiteNavProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const pageTitle = getPageTitle(route)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [route])

  const go = (next: Route) => {
    onNavigate(next)
    setOpen(false)
  }

  return (
    <nav className="site-nav">
      <button type="button" className="site-nav__brand site-nav__brand-btn" onClick={() => go({ type: 'map' })}>
        Guitar DSP
      </button>

      <div className="site-nav__menu" ref={menuRef}>
        <span className="site-nav__current">{pageTitle}</span>
        <button
          type="button"
          className={open ? 'site-nav__menu-btn active' : 'site-nav__menu-btn'}
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls={menuId}
          onClick={() => setOpen((prev) => !prev)}
        >
          Menu
          <span className="site-nav__menu-chevron" aria-hidden>
            {open ? '▴' : '▾'}
          </span>
        </button>

        {open && (
          <div id={menuId} className="site-nav__dropdown" role="menu">
            {navMenu.map((group) => (
              <div key={group.id} className="site-nav__section">
                <p className="site-nav__section-label">{group.label}</p>
                <ul className="site-nav__section-list">
                  {group.items.map((item) => {
                    const active = isItemActive(route, item.route)
                    return (
                      <li key={item.label}>
                        <button
                          type="button"
                          role="menuitem"
                          className={active ? 'site-nav__item site-nav__item--active' : 'site-nav__item'}
                          onClick={() => go(item.route)}
                        >
                          {item.icon && <span className="site-nav__item-icon">{item.icon}</span>}
                          <span className="site-nav__item-text">
                            <span className="site-nav__item-label">{item.label}</span>
                            <span className="site-nav__item-desc">{item.description}</span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
