import { useState, useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  videoSrc: string;
  thumbnailSrc: string;
  className?: string;
}

export const VideoBackground = ({ videoSrc, thumbnailSrc, className = '' }: VideoBackgroundProps) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsVideoLoaded(true);
      // Small delay for smooth transition
      setTimeout(() => {
        setShowVideo(true);
        video.play().catch(err => console.error('Video play failed:', err));
      }, 100);
    };

    video.addEventListener('canplaythrough', handleCanPlay);

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlay);
    };
  }, []);

  return (
    <div className={`absolute inset-0 ${className}`}>
      {/* Thumbnail - shown while video loads */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
          showVideo ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundImage: `url(${thumbnailSrc})` }}
      />
      
      {/* Video background */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          showVideo ? 'opacity-100' : 'opacity-0'
        }`}
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
};
