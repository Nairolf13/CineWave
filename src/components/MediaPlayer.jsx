import React, { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react"

export default function MediaPlayer({ src, type, embedId, title, description }) {
  const mediaRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const media = mediaRef.current
    if (!media) return

    const updateTime = () => setCurrentTime(media.currentTime)
    const setDur = () => setDuration(media.duration)

    media.addEventListener("timeupdate", updateTime)
    media.addEventListener("loadedmetadata", setDur)

    return () => {
      media.removeEventListener("timeupdate", updateTime)
      media.removeEventListener("loadedmetadata", setDur)
    }
  }, [])

  const togglePlay = () => {
    const media = mediaRef.current
    if (isPlaying) {
      media.pause()
    } else {
      media.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSliderChange = (value) => {
    const media = mediaRef.current
    media.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const toggleMute = () => {
    const media = mediaRef.current
    media.muted = !muted
    setMuted(!muted)
  }

  const handleVolumeChange = (value) => {
    const media = mediaRef.current
    const newVolume = value[0]
    media.volume = newVolume
    setVolume(newVolume)
    setMuted(newVolume === 0)
  }

  const enterFullscreen = () => {
    const media = mediaRef.current
    if (media.requestFullscreen) {
      media.requestFullscreen()
    }
  }

  const formatTime = (t) => {
    const minutes = Math.floor(t / 60)
    const seconds = Math.floor(t % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const isVideo = type === "video"

  return (
    <div className="w-full max-w-3xl mx-auto bg-black rounded-lg overflow-hidden shadow-lg text-white space-y-4 p-4">
      {title && (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          {description && <p className="text-sm text-gray-400">{description.substring(0, 150)}{description.length > 150 ? '...' : ''}</p>}
        </div>
      )}
    
      {embedId ? (
        <div className="relative pb-[56.25%] h-0">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${embedId}?autoplay=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title || "Media player"}
          />
        </div>
      ) : isVideo ? (
        <video
          ref={mediaRef}
          src={src}
          className="w-full h-auto max-h-[500px] bg-black rounded-md"
        />
      ) : (
        <audio ref={mediaRef} src={src} className="w-full" />
      )}

     
      {!embedId && (
        <>
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={togglePlay}
              size="icon"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-full p-2"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>

            <Slider
              min={0}
              max={duration}
              step={1}
              value={[currentTime]}
              onValueChange={handleSliderChange}
              className="flex-1"
            />

            <span className="text-xs font-mono tracking-widest text-white/70 w-20 text-right">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={toggleMute}
              size="icon"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-full p-2"
            >
              {muted || volume === 0 ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </Button>

            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[volume]}
              onValueChange={handleVolumeChange}
              className="w-32"
            />

            {isVideo && (
              <Button
                onClick={enterFullscreen}
                size="icon"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-full p-2"
              >
                <Maximize2 className="w-6 h-6" />
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
