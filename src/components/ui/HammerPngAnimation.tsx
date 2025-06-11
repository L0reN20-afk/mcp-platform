'use client'

import React, { useRef, useImperativeHandle, forwardRef } from 'react'

interface HammerVideoAnimationProps {
  autoPlay?: boolean
  muted?: boolean
  onEnded?: () => void
  className?: string
  style?: React.CSSProperties
  width?: number
  height?: number
  fps?: number // Mantenuto per compatibilità, ma non usato (video è già 60fps)
  loop?: boolean
  showLoadingProgress?: boolean // Mantenuto per compatibilità, ma non necessario
}

interface HammerVideoRef {
  play: () => void
  pause: () => void
  reset: () => void
}

const HammerVideoAnimation = forwardRef<HammerVideoRef, HammerVideoAnimationProps>(({
  autoPlay = true,
  muted = true,
  onEnded,
  className = "",
  style = {},
  width = 170,
  height = 170,
  loop = false,
  showLoadingProgress = false
}, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useImperativeHandle(ref, () => ({
    play: () => {
      if (videoRef.current) {
        videoRef.current.play()
      }
    },
    pause: () => {
      if (videoRef.current) {
        videoRef.current.pause()
      }
    },
    reset: () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        if (autoPlay) {
          videoRef.current.play()
        }
      }
    }
  }))

  const handleVideoEnded = () => {
    if (onEnded) {
      onEnded()
    }
  }

  return (
    <video
      ref={videoRef}
      className={className}
      style={{
        objectFit: 'contain',
        width: width,
        height: height,
        ...style
      }}
      width={width}
      height={height}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline
      onEnded={handleVideoEnded}
      preload="auto"
    >
      <source src="/images/hammer-animation/hammer-animation-60fps.webm" type="video/webm" />
      {/* Fallback per browser che non supportano WebM */}
      <div 
        style={{
          width: width,
          height: height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#fff'
        }}
      >
        🔨 Loading...
      </div>
    </video>
  )
})

HammerVideoAnimation.displayName = 'HammerVideoAnimation'

export default HammerVideoAnimation

// 🎯 HOOK PERSONALIZZATO per controlli esterni (compatibilità)
export function useHammerAnimation() {
  const [animationRef, setAnimationRef] = React.useState<{
    play: () => void
    pause: () => void
    reset: () => void
  } | null>(null)

  return {
    animationRef,
    setAnimationRef,
    play: () => animationRef?.play(),
    pause: () => animationRef?.pause(),
    reset: () => animationRef?.reset()
  }
}