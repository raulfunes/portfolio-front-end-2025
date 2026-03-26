import { useLikes } from '../hooks/useLikes'
import { track } from '@vercel/analytics'
import './HeartButton.css'

export const HeartButton = () => {
  const { count, liked, toggleLike } = useLikes()

  const handleClick = () => {
    track('heart_button_click', { action: liked ? 'unlike' : 'like' })
    toggleLike()
  }

  return (
    <button
      className={`heart-btn${liked ? ' heart-btn--liked' : ''}`}
      onClick={handleClick}
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
