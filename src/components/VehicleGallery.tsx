import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut } from 'lucide-react';
import type { VehicleMedia } from '../types';

interface VehicleGalleryProps {
  media?: VehicleMedia[];
  title: string;
  fallbackImage?: string;
}

export const VehicleGallery: React.FC<VehicleGalleryProps> = ({
  media = [],
  title,
  fallbackImage = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
}) => {
  const imageList = media.filter(m => m.type === 'image').length > 0
    ? media.filter(m => m.type === 'image')
    : [{ id: 'fallback', vehicle_id: '', type: 'image' as const, url: fallbackImage, is_primary: true, sort_order: 1 }];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const currentImage = imageList[currentIndex]?.url || fallbackImage;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
    setZoomLevel(1);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
    setZoomLevel(1);
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.4, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.4, 1));

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-[16/10] bg-[#070709] rounded-2xl overflow-hidden border border-[#1F1F24] shadow-2xl group select-none">
        <img
          src={currentImage}
          alt={`${title} - Foto ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500"
        />

        {/* Counter Pill */}
        <div className="absolute bottom-4 left-4 z-10 px-3 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-xs font-mono font-medium text-white">
          {currentIndex + 1} / {imageList.length}
        </div>

        {/* Fullscreen Trigger */}
        <button
          type="button"
          onClick={() => setFullscreenOpen(true)}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-xl bg-black/60 hover:bg-[#E11D48] text-white backdrop-blur-md border border-white/10 transition-all duration-200"
          title="Ver em tela cheia"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Navigation Arrows */}
        {imageList.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/60 hover:bg-[#E11D48] text-white backdrop-blur-md transition-all duration-200 opacity-80 group-hover:opacity-100 hover:scale-110"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/60 hover:bg-[#E11D48] text-white backdrop-blur-md transition-all duration-200 opacity-80 group-hover:opacity-100 hover:scale-110"
              aria-label="Próxima foto"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {imageList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {imageList.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => {
                setCurrentIndex(idx);
                setZoomLevel(1);
              }}
              className={`relative shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                currentIndex === idx
                  ? 'border-[#E11D48] ring-2 ring-[#E11D48]/30 scale-105'
                  : 'border-[#1F1F24] opacity-50 hover:opacity-100'
              }`}
            >
              <img
                src={img.url}
                alt={`Miniatura ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen & Zoom Modal */}
      {fullscreenOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 animate-fadeIn">
          {/* Modal Header */}
          <div className="flex items-center justify-between z-20 pb-4 border-b border-white/10 text-white">
            <div className="flex items-center gap-3">
              <span className="font-heading font-bold text-base truncate max-w-md">{title}</span>
              <span className="text-xs text-gray-400 font-mono">({currentIndex + 1} de {imageList.length})</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 disabled:opacity-30"
                title="Ampliar zoom"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 disabled:opacity-30"
                title="Reduzir zoom"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setFullscreenOpen(false);
                  setZoomLevel(1);
                }}
                className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-[#E11D48] text-white ml-2"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Main Viewport */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
            <img
              src={currentImage}
              alt={title}
              style={{ transform: `scale(${zoomLevel})` }}
              className="max-w-full max-h-[80vh] object-contain transition-transform duration-200"
            />

            {imageList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-4 p-4 rounded-full bg-black/60 hover:bg-[#E11D48] text-white backdrop-blur-md"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-4 p-4 rounded-full bg-black/60 hover:bg-[#E11D48] text-white backdrop-blur-md"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Modal Bottom Thumbnails */}
          {imageList.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto pt-2 custom-scrollbar">
              {imageList.map((img, idx) => (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(idx);
                    setZoomLevel(1);
                  }}
                  className={`w-16 h-12 rounded-lg overflow-hidden border transition-all ${
                    currentIndex === idx ? 'border-[#E11D48] scale-105' : 'border-neutral-800 opacity-40 hover:opacity-90'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
