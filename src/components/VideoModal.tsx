import React from 'react';
import { X, Play } from 'lucide-react';

interface VideoModalProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
  vehicleTitle?: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  videoUrl,
  isOpen,
  onClose,
  vehicleTitle,
}) => {
  if (!isOpen || !videoUrl) return null;

  let embedUrl = videoUrl;
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const isVimeo = videoUrl.includes('vimeo.com');

  if (isYouTube) {
    if (videoUrl.includes('watch?v=')) {
      const id = videoUrl.split('watch?v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    } else if (videoUrl.includes('youtu.be/')) {
      const id = videoUrl.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    } else if (videoUrl.includes('shorts/')) {
      const id = videoUrl.split('shorts/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    }
  } else if (isVimeo) {
    const id = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
    embedUrl = `https://player.vimeo.com/video/${id}?autoplay=1`;
  }

  const isIframe = isYouTube || isVimeo;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-[#0A0A0C] border border-[#1F1F24] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1F1F24] text-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#E11D48]/20 text-[#E11D48]">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <span className="font-heading font-bold text-sm truncate">
              Vídeo: {vehicleTitle || 'Apresentação do Veículo'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#141418] text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Frame */}
        <div className="relative aspect-[16/9] bg-black">
          {isIframe ? (
            <iframe
              src={embedUrl}
              title="Vídeo do Veículo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          )}
        </div>

      </div>
    </div>
  );
};
