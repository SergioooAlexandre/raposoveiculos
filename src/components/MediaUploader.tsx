import React, { useState } from 'react';
import { Upload, X, Star, ArrowUp, ArrowDown, Video, Loader2 } from 'lucide-react';
import { storageService } from '../services/storageService';
import { useToast } from '../hooks/useToast';

interface MediaUploaderProps {
  vehicleId: string;
  images: string[];
  onChangeImages: (images: string[]) => void;
  videoUrl?: string;
  onChangeVideoUrl: (url: string) => void;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  vehicleId,
  images,
  onChangeImages,
  videoUrl = '',
  onChangeVideoUrl,
}) => {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  // Handle local file uploads
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map((file) =>
        storageService.uploadVehicleImage(file, vehicleId || 'temp')
      );
      const uploadedUrls = await Promise.all(uploadPromises);
      onChangeImages([...images, ...uploadedUrls]);
      showToast(`${uploadedUrls.length} ${uploadedUrls.length === 1 ? 'imagem adicionada' : 'imagens adicionadas'}!`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Erro ao fazer upload das imagens.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Add image via direct URL
  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onChangeImages([...images, urlInput.trim()]);
    setUrlInput('');
    showToast('Imagem adicionada via URL!', 'success');
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChangeImages(updated);
  };

  // Set as primary image (move to index 0)
  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const rest = images.filter((_, i) => i !== index);
    onChangeImages([target, ...rest]);
    showToast('Foto definida como capa principal!', 'info');
  };

  // Reorder up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[index - 1];
    newImages[index - 1] = temp;
    onChangeImages(newImages);
  };

  // Reorder down
  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[index + 1];
    newImages[index + 1] = temp;
    onChangeImages(newImages);
  };

  return (
    <div className="space-y-6 bg-[#0A0A0C] border border-[#1F1F24] rounded-2xl p-6 sm:p-8 shadow-xl">
      
      {/* Header */}
      <div className="border-b border-[#1F1F24] pb-4">
        <h3 className="text-lg font-bold font-heading text-white">Galeria de Fotos e Mídia</h3>
        <p className="text-xs text-gray-400">
          Faça upload das fotos do veículo ou insira URLs de imagens de alta resolução.
        </p>
      </div>

      {/* Upload Drag & Drop Box */}
      <div className="border-2 border-dashed border-[#2A2A32] hover:border-[#E11D48]/50 rounded-2xl p-6 text-center transition-colors bg-[#141418]/50 relative group">
        <input
          type="file"
          multiple
          accept="image/*"
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="space-y-3 pointer-events-none">
          <div className="w-12 h-12 rounded-xl bg-[#E11D48]/10 text-[#E11D48] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {uploading ? 'Enviando imagens...' : 'Clique ou arraste as fotos aqui'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Formatos JPG, PNG ou WEBP até 10MB</p>
          </div>
        </div>
      </div>

      {/* Add Direct URL Form */}
      <div className="flex gap-2">
        <input
          type="url"
          placeholder="Ou cole a URL direta de uma imagem (https://...)"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="flex-1 bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48]"
        />
        <button
          type="button"
          onClick={handleAddUrl}
          className="px-4 py-2 rounded-xl bg-[#141418] hover:bg-[#1f1f24] text-white text-xs font-semibold border border-[#2A2A32] transition-colors"
        >
          Adicionar URL
        </button>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Fotos cadastradas ({images.length}) • A primeira foto é a foto de capa
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((url, idx) => (
              <div
                key={idx}
                className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 bg-neutral-900 group shadow-md ${
                  idx === 0 ? 'border-[#E11D48] ring-2 ring-[#E11D48]/30' : 'border-[#1F1F24]'
                }`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />

                {/* Primary Tag */}
                {idx === 0 && (
                  <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-[#E11D48] text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-current" />
                    CAPA
                  </div>
                )}

                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex items-center justify-between">
                    {idx !== 0 ? (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(idx)}
                        className="p-1.5 rounded-lg bg-black/60 hover:bg-[#E11D48] text-white text-[10px] flex items-center gap-1"
                        title="Tornar foto de capa"
                      >
                        <Star className="w-3 h-3" />
                        <span>Capa</span>
                      </button>
                    ) : <div />}

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-600 text-white"
                      title="Excluir imagem"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Ordering Buttons */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveUp(idx)}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white disabled:opacity-30"
                      title="Mover para frente"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMoveDown(idx)}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white disabled:opacity-30"
                      title="Mover para trás"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video URL Input */}
      <div className="pt-4 border-t border-[#1F1F24] space-y-2">
        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
          <Video className="w-4 h-4 text-[#E11D48]" />
          <span>Vídeo do Veículo (YouTube / MP4 / Vimeo)</span>
        </label>
        <input
          type="url"
          placeholder="Ex: https://www.youtube.com/watch?v=... ou link direto .mp4"
          value={videoUrl}
          onChange={(e) => onChangeVideoUrl(e.target.value)}
          className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48]"
        />
      </div>

    </div>
  );
};
