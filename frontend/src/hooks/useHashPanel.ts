import { useCallback, useEffect, useState } from 'react'

function readHash(prefix: string): string | null {
  const hash = window.location.hash.replace(/^#/, '')
  const [section, id] = hash.split('/')
  return section === prefix && id ? id : null
}

export function useHashPanel(prefix: string) {
  const [openId, setOpenId] = useState<string | null>(() => readHash(prefix))

  useEffect(() => {
    const onHashChange = () => setOpenId(readHash(prefix))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [prefix])

  const open = useCallback(
    (id: string) => {
      setOpenId(id)
      window.location.hash = `${prefix}/${id}`
    },
    [prefix]
  )

  const close = useCallback(() => {
    setOpenId(null)
    if (readHash(prefix)) {
      window.history.replaceState(null, '', `${window.location.pathname}#${prefix}`)
    }
  }, [prefix])

  return { openId, open, close }
}
