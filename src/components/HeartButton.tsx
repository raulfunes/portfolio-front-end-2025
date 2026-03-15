import { useLikes } from '../hooks/useLikes'
import './HeartButton.css'

export const HeartButton = () => {
  const { count, liked, toggleLike } = useLikes()

  return (
    <button
      className={`heart-btn${liked ? ' heart-btn--liked' : ''}`}
      onClick={toggleLike}
      aria-label={liked ? 'Quitar like' : 'Dar like al portfolio'}
      aria-pressed={liked}
    >
      <span className="heart-icon" aria-hidden="true">
        {liked ? '♥' : '♡'}
      </span>
      <span className="heart-count">
        {count !== null ? count : '–'}
      </span>
    </button>
  )
}
