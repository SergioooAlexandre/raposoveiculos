import React from 'react';
import { FileText, AlertCircle } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      
      {/* Header */}
      <div className="space-y-3 border-b border-[#1F1F24] pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#E11D48] uppercase tracking-widest font-bold">
          <FileText className="w-4 h-4" />
          <span>Regras de Utilização</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
          Termos de Uso
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Última atualização: Fevereiro de 2026
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8 text-xs sm:text-sm text-gray-300 leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-heading text-white">
            1. Aceite dos Termos
          </h2>
          <p>
            Ao navegar ou utilizar os serviços do catálogo digital da <strong>Raposo Veículos</strong>, o usuário declara concordar plenamente com as condições e termos aqui dispostos.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#E11D48]" />
            <span>2. Informações dos Veículos e Disponibilidade</span>
          </h2>
          <p>
            Nos empenhamos para manter as informações sobre preços, quilometragens, fotos e opcionais rigorosamente atualizadas em tempo real. No entanto:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
            <li>A disponibilidade física de qualquer veículo está sujeita à confirmação prévia no momento do contato, podendo ter sido vendido ou reservado instantes antes da atualização online;</li>
            <li>Eventuais erros tipográficos ou de digitação referentes a valores ou versões serão corrigidos imediatamente após identificados, prevalecendo a negociação formal realizada na loja;</li>
            <li>As fotos exibidas representam os veículos reais do nosso estoque.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-heading text-white">
            3. Simulações de Financiamento e Propostas
          </h2>
          <p>
            Os valores apresentados na ferramenta de <strong>Simulação de Financiamento</strong> possuem caráter puramente estimativo e informativo. As taxas de juros, valores de parcelas e exigência de entrada reais dependem exclusivamente da análise cadastral e aprovação de crédito pelas instituições bancárias parceiras.
          </p>
          <p>
            O envio de propostas pelo site não gera compromisso de venda ou reserva automática do veículo até que haja confirmação expressa por parte da equipe comercial da Raposo Veículos.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-heading text-white">
            4. Direitos Autorais e Propriedade Intelectual
          </h2>
          <p>
            Todo o layout, identidade visual, elementos gráficos, textos e fotografias contidos neste catálogo digital são de titularidade da Raposo Veículos e de seus desenvolvedores autorizados, sendo vedada a reprodução total ou parcial sem autorização prévia.
          </p>
        </section>

      </div>

    </div>
  );
};
