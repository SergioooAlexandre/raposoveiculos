import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  Loader2,
  Check,
  Sparkles,
  Flame
} from 'lucide-react';
import type { Vehicle, FuelType, TransmissionType, BodyType, VehicleStatus } from '../../types';
import { vehicleService } from '../../services/vehicleService';
import { MediaUploader } from '../../components/MediaUploader';
import { initialAvailableFeatures } from '../../data/mockVehicles';
import { useToast } from '../../hooks/useToast';

export const AdminVehicleForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  // Form states
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [version, setVersion] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [modelYear, setModelYear] = useState<number>(new Date().getFullYear());
  const [price, setPrice] = useState<number | ''>('');
  const [promotionalPrice, setPromotionalPrice] = useState<number | ''>('');
  const [mileage, setMileage] = useState<number | ''>('');
  const [fuel, setFuel] = useState<FuelType>('FLEX');
  const [transmission, setTransmission] = useState<TransmissionType>('AUTOMATICO');
  const [bodyType, setBodyType] = useState<BodyType>('SUV');
  const [color, setColor] = useState('Preto');
  const [engine, setEngine] = useState('2.0');
  const [power, setPower] = useState('180 cv');
  const [traction, setTraction] = useState('Dianteira');
  const [doors, setDoors] = useState<number>(4);
  const [plateEnd, setPlateEnd] = useState('0');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<VehicleStatus>('DISPONIVEL');
  const [featured, setFeatured] = useState(false);
  const [isOffer, setIsOffer] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  // Media and features
  const [images, setImages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [customFeatureInput, setCustomFeatureInput] = useState('');

  // Load existing vehicle data if editing
  useEffect(() => {
    if (!id) return;
    const loadVehicle = async () => {
      setFetching(true);
      try {
        const data = await vehicleService.getVehicleById(id);
        if (data) {
          setBrand(data.brand);
          setModel(data.model);
          setVersion(data.version);
          setYear(data.year);
          setModelYear(data.model_year);
          setPrice(data.price);
          setPromotionalPrice(data.promotional_price || '');
          setMileage(data.mileage);
          setFuel(data.fuel);
          setTransmission(data.transmission);
          setBodyType(data.body_type);
          setColor(data.color);
          setEngine(data.engine);
          setPower(data.power);
          setTraction(data.traction);
          setDoors(data.doors);
          setPlateEnd(data.plate_end);
          setDescription(data.description);
          setStatus(data.status);
          setFeatured(data.featured);
          setIsOffer(data.is_offer);
          setVideoUrl(data.video_url || '');

          const imgList = data.media?.map(m => m.url) || (data.primary_image ? [data.primary_image] : []);
          setImages(imgList);
          setFeatures(data.features || []);
        } else {
          showToast('Veículo não encontrado.', 'error');
          navigate('/admin/veiculos');
        }
      } catch (err) {
        console.error(err);
        showToast('Erro ao carregar dados do veículo.', 'error');
      } finally {
        setFetching(false);
      }
    };
    loadVehicle();
  }, [id, navigate, showToast]);

  const handleFeatureToggle = (feat: string) => {
    setFeatures(prev =>
      prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
    );
  };

  const handleAddCustomFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFeatureInput.trim()) return;
    if (!features.includes(customFeatureInput.trim())) {
      setFeatures(prev => [...prev, customFeatureInput.trim()]);
    }
    setCustomFeatureInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model || !price) {
      showToast('Por favor, preencha Marca, Modelo e Preço.', 'error');
      return;
    }

    setLoading(true);
    try {
      const vehiclePayload: Partial<Vehicle> = {
        brand,
        model,
        version,
        year: Number(year),
        model_year: Number(modelYear),
        price: Number(price),
        promotional_price: promotionalPrice ? Number(promotionalPrice) : null,
        mileage: Number(mileage) || 0,
        fuel,
        transmission,
        body_type: bodyType,
        color,
        engine,
        power,
        traction,
        doors: Number(doors),
        plate_end: plateEnd,
        description,
        status,
        featured,
        is_offer: isOffer,
        video_url: videoUrl || null,
      };

      if (isEditing && id) {
        await vehicleService.updateVehicle(id, vehiclePayload, images, features);
        showToast('Veículo atualizado com sucesso!', 'success');
      } else {
        await vehicleService.createVehicle(vehiclePayload, images, features);
        showToast('Veículo cadastrado no estoque com sucesso!', 'success');
      }

      navigate('/admin/veiculos');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Erro ao salvar veículo.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 text-[#E11D48] animate-spin mx-auto mb-3" />
        <span className="text-xs text-gray-400 font-mono">Carregando dados para edição...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/admin/veiculos"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Lista de Veículos</span>
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#F43F5E] text-white text-xs font-bold shadow-lg shadow-rose-900/30 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isEditing ? 'Salvar Alterações' : 'Cadastrar Veículo'}</span>
        </button>
      </div>

      {/* 1. Basic Technical Details */}
      <div className="bg-[#0A0A0C] border border-[#1F1F24] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="border-b border-[#1F1F24] pb-3">
          <h3 className="font-heading font-bold text-lg text-white">Dados Principais do Veículo</h3>
          <p className="text-xs text-gray-400">Identificação, marca, modelo e preços</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          
          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Marca *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: BMW, Toyota, Porsche"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Modelo *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: 320i, Corolla Cross, 911"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Versão Completa *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: 2.0 M Sport GP ActiveFlex"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Preço de Venda (R$) *
            </label>
            <input
              type="number"
              required
              placeholder="Ex: 339900"
              value={price}
              onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white font-mono font-bold text-[#E11D48] focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Preço Promocional (R$)
            </label>
            <input
              type="number"
              placeholder="Ex: 324900 (Opcional)"
              value={promotionalPrice}
              onChange={(e) => setPromotionalPrice(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white font-mono font-bold text-[#D4AF37] focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Quilometragem (km) *
            </label>
            <input
              type="number"
              required
              placeholder="Ex: 8200"
              value={mileage}
              onChange={(e) => setMileage(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Ano de Fabricação *
            </label>
            <input
              type="number"
              required
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Ano do Modelo *
            </label>
            <input
              type="number"
              required
              value={modelYear}
              onChange={(e) => setModelYear(Number(e.target.value))}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Status no Estoque
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as VehicleStatus)}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
            >
              <option value="DISPONIVEL">Disponível</option>
              <option value="RESERVADO">Reservado</option>
              <option value="VENDIDO">Vendido</option>
            </select>
          </div>

        </div>

        {/* Highlight / Offer check toggles */}
        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[#1F1F24]">
          <label className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded accent-[#E11D48]"
            />
            <span className="flex items-center gap-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#E11D48]" />
              Exibir como Veículo em Destaque na Home
            </span>
          </label>

          <label className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isOffer}
              onChange={(e) => setIsOffer(e.target.checked)}
              className="w-4 h-4 rounded accent-[#D4AF37]"
            />
            <span className="flex items-center gap-1 font-semibold">
              <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
              Marcar como Oferta Promocional
            </span>
          </label>
        </div>
      </div>

      {/* 2. Technical Specifications */}
      <div className="bg-[#0A0A0C] border border-[#1F1F24] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="border-b border-[#1F1F24] pb-3">
          <h3 className="font-heading font-bold text-lg text-white">Especificações Detalhadas</h3>
          <p className="text-xs text-gray-400">Motorização, câmbio, combustível e carroceria</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          
          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Combustível
            </label>
            <select
              value={fuel}
              onChange={(e) => setFuel(e.target.value as FuelType)}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
            >
              <option value="FLEX">Flex</option>
              <option value="GASOLINA">Gasolina</option>
              <option value="HIBRIDO">Híbrido</option>
              <option value="ELETRICO">Elétrico</option>
              <option value="DIESEL">Diesel</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Câmbio
            </label>
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value as TransmissionType)}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
            >
              <option value="AUTOMATICO">Automático</option>
              <option value="MANUAL">Manual</option>
              <option value="CVT">CVT</option>
              <option value="DUPLA_EMBREAGEM">Dupla Embreagem</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Carroceria
            </label>
            <select
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value as BodyType)}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
            >
              <option value="SUV">SUV</option>
              <option value="SEDAN">Sedan</option>
              <option value="HATCH">Hatch</option>
              <option value="PICKUP">Pickup</option>
              <option value="COUPE">Coupé</option>
              <option value="CONVERSIVEL">Conversível</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Cor
            </label>
            <input
              type="text"
              placeholder="Ex: Preto Mito, Branco"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Motor
            </label>
            <input
              type="text"
              placeholder="Ex: 2.0 Turbo, 3.0 V6"
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Potência
            </label>
            <input
              type="text"
              placeholder="Ex: 184 cv, 272 cv"
              value={power}
              onChange={(e) => setPower(e.target.value)}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Tração
            </label>
            <input
              type="text"
              placeholder="Ex: Dianteira, 4x4, Traseira"
              value={traction}
              onChange={(e) => setTraction(e.target.value)}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Final da Placa
            </label>
            <input
              type="text"
              maxLength={1}
              placeholder="Ex: 9"
              value={plateEnd}
              onChange={(e) => setPlateEnd(e.target.value)}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
            />
          </div>

        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
            Descrição do Veículo
          </label>
          <textarea
            rows={4}
            placeholder="Informações adicionais, estado dos pneus, revisões, histórico de procedência..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48]"
          />
        </div>
      </div>

      {/* 3. Media Uploader */}
      <MediaUploader
        vehicleId={id || 'new'}
        images={images}
        onChangeImages={setImages}
        videoUrl={videoUrl}
        onChangeVideoUrl={setVideoUrl}
      />

      {/* 4. Features & Optional Items Selector */}
      <div className="bg-[#0A0A0C] border border-[#1F1F24] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="border-b border-[#1F1F24] pb-3">
          <h3 className="font-heading font-bold text-lg text-white">Itens e Opcionais</h3>
          <p className="text-xs text-gray-400">Marque os opcionais presentes neste veículo ou adicione novos</p>
        </div>

        {/* Preset Checklist */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto pr-2 custom-scrollbar p-2">
          {initialAvailableFeatures.map((feat) => {
            const isChecked = features.includes(feat);
            return (
              <label
                key={feat}
                className="flex items-center gap-2 p-2 rounded-xl bg-[#141418] border border-[#2A2A32] text-xs text-gray-300 hover:text-white cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleFeatureToggle(feat)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    isChecked
                      ? 'bg-[#E11D48] border-[#E11D48] text-white'
                      : 'bg-[#0A0A0C] border-[#2A2A32]'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3" />}
                </div>
                <span className="truncate">{feat}</span>
              </label>
            );
          })}
        </div>

        {/* Custom Feature Add */}
        <div className="pt-3 border-t border-[#1F1F24] flex gap-2">
          <input
            type="text"
            placeholder="Adicionar opcional personalizado..."
            value={customFeatureInput}
            onChange={(e) => setCustomFeatureInput(e.target.value)}
            className="flex-1 bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48]"
          />
          <button
            type="button"
            onClick={handleAddCustomFeature}
            className="px-4 py-2 rounded-xl bg-[#141418] hover:bg-[#1f1f24] text-white text-xs font-semibold border border-[#2A2A32]"
          >
            Adicionar
          </button>
        </div>
      </div>

      {/* Submit Button Bottom */}
      <div className="flex justify-end gap-3 pt-4">
        <Link
          to="/admin/veiculos"
          className="px-6 py-3 rounded-xl bg-[#141418] hover:bg-[#1f1f24] text-gray-300 text-xs font-semibold border border-[#2A2A32]"
        >
          Cancelar
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#E11D48] hover:bg-[#F43F5E] text-white text-xs font-bold shadow-lg shadow-rose-900/30 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isEditing ? 'Salvar Alterações' : 'Concluir Cadastro'}</span>
        </button>
      </div>

    </form>
  );
};
