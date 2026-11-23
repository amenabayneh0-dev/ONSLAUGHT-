import { useEffect, useState } from 'react'
import { User } from 'lucide-react'

/** Real photo when available; otherwise a clearly marked placeholder (never a fake photograph). */
export default function PlayerPhoto({ player, className = '', imgClassName = '' }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [player.photo])

  return (
    <div className={`relative overflow-hidden bg-ons-black ${className}`}>
      {player.photo && !failed ? (
        <img
          src={player.photo}
          alt={`${player.username}, ${player.role}`}
          loading="lazy"
          onError={() => setFailed(true)}
          style={{ objectPosition: player.photoPosition }}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      ) : (
        <div aria-hidden="true" className={`texture-diagonal texture-glow absolute inset-0 flex flex-col items-center justify-center gap-3 text-ons-silver/60 ${imgClassName}`}>
          <User className="h-1/3 w-1/3" strokeWidth={1} />
          <span className="text-xs">Player photograph</span>
        </div>
      )}
    </div>
  )
}
