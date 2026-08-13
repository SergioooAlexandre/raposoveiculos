import React, { useState } from 'react';
import { Upload, X, Star, ArrowUp, ArrowDown, Video, Loader2, Play, Check } from 'lucide-react';
import { storageService } from '../services/storageService';
import { useToast } from '../hooks/useToast';
import { VideoModal } from './VideoModal';

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
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [previewVideoModalOpen, setPreviewVideoModalOpen] = useState(false);

  // Handle local image file uploads
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

  // Handle local video file upload
  const handleVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const videoStorageUrl = await storageService.uploadVehicleImage(file, vehicleId || 'temp');
      onChangeVideoUrl(videoStorageUrl);
      showToast('Arquivo de vídeo carregado com sucesso!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Erro ao fazer upload do arquivo de vídeo.', 'error');
    } finally {
      setUploadingVideo(false);
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

      {/* Upload Drag & Drop Box for Images */}
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

      {/* Dedicated Video Section */}
      <div className="pt-6 border-t border-[#1F1F24] space-y-4">
        <div>
          <label className="block text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Video className="w-4 h-4 text-[#E11D48]" />
            <span>Vídeo de Apresentação do Veículo</span>
          </label>
          <p className="text-[11px] text-gray-400 mt-1">
            Insira o link de um vídeo do <strong>YouTube</strong>, <strong>YouTube Shorts</strong>, <strong>Vimeo</strong> ou faça upload direto de um arquivo <strong>.MP4</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-8 relative">
            <input
              type="url"
              placeholder="Cole o link do vídeo: https://www.youtube.com/watch?v=... ou YouTube Shorts"
              value={videoUrl}
              onChange={(e) => onChangeVideoUrl(e.target.value)}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48]"
            />
            {videoUrl && (
              <button
                type="button"
                onClick={() => onChangeVideoUrl('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-400 text-xs p-1"
                title="Remover vídeo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Upload Local Video File */}
          <div className="md:col-span-4 relative">
            <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#141418] hover:bg-[#1f1f24] text-white text-xs font-semibold border border-[#2A2A32] cursor-pointer transition-colors w-full">
              {uploadingVideo ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#E11D48]" />
              ) : (
                <Upload className="w-4 h-4 text-[#E11D48]" />
              )}
              <span>{uploadingVideo ? 'Enviando Vídeo...' : 'Upload Arquivo MP4'}</span>
              <input
                type="file"
                accept="video/*"
                disabled={uploadingVideo}
                onChange={handleVideoFile}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Video Preview Status Box */}
        {videoUrl ? (
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <div className="truncate">
                <span className="font-semibold text-white block">Vídeo vinculado com sucesso!</span>
                <span className="text-[11px] text-gray-400 truncate block">{videoUrl}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPreviewVideoModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#E11D48] hover:bg-[#F43F5E] text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 shadow-md transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Testar Player de Vídeo</span>
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-[#141418] border border-[#1F1F24] text-gray-400 text-xs">
            Nenhum vídeo vinculado a este veículo ainda. O botão "Assistir ao Vídeo do Veículo" será exibido na página do cliente assim que um vídeo for adicionado.
          </div>
        )}
      </div>

      {/* Video Modal Preview */}
      {videoUrl && (
        <VideoModal
          videoUrl={videoUrl}
          isOpen={previewVideoModalOpen}
          onClose={() => setPreviewVideoModalOpen(false)}
          vehicleTitle="Pré-visualização do Vídeo"
        />
      )}

    </div>
  );
};
