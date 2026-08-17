import React, { useState, useEffect } from 'react';
import {
  Save,
  Loader2,
  Store,
  Search
} from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import { SupabaseStatusBanner } from '../../components/admin/SupabaseStatusBanner';
import { useToast } from '../../hooks/useToast';

export const AdminSettings: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [storeName, setStoreName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [address, setAddress] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [ogImage, setOgImage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await settingsService.getSettings();
        setStoreName(data.store_name || 'Raposo Veículos');
        setWhatsapp(data.whatsapp || '5579998476431');
        setPhone(data.phone || '(79) 99847-6431');
        setEmail(data.email || 'contato@raposoveiculos.com.br');
        setInstagram(data.instagram || '@nexussitesbr');
        setAddress(data.address || 'Rodovia Raposo Tavares, km 18 - São Paulo, SP');
        setOpeningHours(data.opening_hours || 'Segunda a Sexta: 08h às 19h | Sábado: 08h às 16h');
        setLogoUrl(data.logo_url || '');
        setFaviconUrl(data.favicon_url || '');
        setSeoTitle(data.seo_title || 'Raposo Veículos | Catálogo Digital Premium');
        setSeoDescription(data.seo_description || '');
        setOgImage(data.og_image || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsService.updateSettings({
        store_name: storeName,
        whatsapp,
        phone,
        email,
        instagram,
        address,
        opening_hours: openingHours,
        logo_url: logoUrl,
        favicon_url: faviconUrl,
        seo_title: seoTitle,
        seo_description: seoDescription,
        og_image: ogImage,
      });

      showToast('Configurações salvas com sucesso!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Erro ao salvar configurações.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 text-[#E11D48] animate-spin mx-auto mb-3" />
        <span className="text-xs text-gray-400 font-mono">Carregando configurações da loja...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-12">
      <SupabaseStatusBanner />
      
      {/* Header */}
      <div className="bg-[#0A0A0C] border border-[#1F1F24] p-6 rounded-3xl shadow-xl flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-white">Configurações Gerais da Loja</h2>
          <p className="text-xs text-gray-400">Edite canais de atendimento, WhatsApp oficial e dados de SEO</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#F43F5E] text-white text-xs font-bold shadow-lg shadow-rose-900/30 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Salvar Alterações</span>
        </button>
      </div>

      {/* 1. Store Identity & Contacts */}
      <div className="bg-[#0A0A0C] border border-[#1F1F24] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="border-b border-[#1F1F24] pb-3">
          <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
            <Store className="w-4 h-4 text-[#E11D48]" />
            <span>Dados da Empresa & Atendimento</span>
          </h3>
          <p className="text-xs text-gray-400">Estes dados aparecem no Header, Footer e botões de contato</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Nome da Loja
            </label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              WhatsApp Oficial (DDI + DDD + Número)
            </label>
            <input
              type="text"
              required
              placeholder="Ex: 5511999999999"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Telefone Fixo / Comercial
            </label>
            <input
              type="text"
              placeholder="(79) 99847-6431"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              E-mail de Contato
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Instagram Oficial
            </label>
            <input
              type="text"
              placeholder="@raposoveiculos"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Horário de Atendimento
            </label>
            <input
              type="text"
              placeholder="Segunda a Sexta: 08h às 19h | Sábado: 08h às 16h"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
            />
          </div>

        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
            Endereço Completo
          </label>
          <input
            type="text"
            placeholder="Rodovia Raposo Tavares, km 18 - São Paulo, SP"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
          />
        </div>
      </div>

      {/* 2. SEO & Meta Tags */}
      <div className="bg-[#0A0A0C] border border-[#1F1F24] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="border-b border-[#1F1F24] pb-3">
          <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-[#E11D48]" />
            <span>SEO & Indexação (Google)</span>
          </h3>
          <p className="text-xs text-gray-400">Meta tags para motores de busca e compartilhamento em redes sociais</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Título Padrão do Site (SEO Title)
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Descrição do Site (SEO Meta Description)
            </label>
            <textarea
              rows={3}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Imagem de Compartilhamento (OG Image URL)
            </label>
            <input
              type="text"
              placeholder="https://..."
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#E11D48] hover:bg-[#F43F5E] text-white text-xs font-bold shadow-lg shadow-rose-900/30 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Salvar Todas as Configurações</span>
        </button>
      </div>

    </form>
  );
};
