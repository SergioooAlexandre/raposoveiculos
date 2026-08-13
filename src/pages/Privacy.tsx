import React from 'react';
import { ShieldCheck, Lock, Eye, Database, HelpCircle } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      
      {/* Header */}
      <div className="space-y-3 border-b border-[#1F1F24] pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#E11D48] uppercase tracking-widest font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>LGPD & Proteção de Dados</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
          Política de Privacidade
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Última atualização: Fevereiro de 2026
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8 text-xs sm:text-sm text-gray-300 leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#E11D48]" />
            <span>1. Informações Gerais</span>
          </h2>
          <p>
            A <strong>Raposo Veículos</strong> respeita a privacidade de seus visitantes e clientes e compromete-se a resguardar os dados pessoais de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD). Esta Política descreve como tratamos as informações coletadas durante o uso do nosso catálogo digital.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-[#E11D48]" />
            <span>2. Coleta de Dados</span>
          </h2>
          <p>Coletamos dados fornecidos voluntariamente pelo usuário nos seguintes momentos:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
            <li><strong>Formulários de Interesse e Contato:</strong> Nome, telefone/WhatsApp, e-mail e mensagens descritivas.</li>
            <li><strong>Formulários de Propostas e Simulação:</strong> Valores propostos, condições de entrada, parcelas pretendidas e veículo de interesse.</li>
            <li><strong>Navegação e Preferências:</strong> Veículos adicionados aos favoritos são armazenados localmente no seu dispositivo através de <code>localStorage</code> para comodidade de navegação, sem rastreamento invasivo.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#E11D48]" />
            <span>3. Finalidade do Tratamento</span>
          </h2>
          <p>As informações coletadas são utilizadas estritamente para:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
            <li>Responder solicitações de contato e agendamento de visitas ou test-drives;</li>
            <li>Analisar e responder a propostas de compra e opções de financiamento bancário;</li>
            <li>Enviar comunicações sobre o veículo consultado pelo cliente via WhatsApp ou e-mail autorizado;</li>
            <li>Cumprir obrigações legais e regulatórias pertinentes ao comércio automotivo.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#E11D48]" />
            <span>4. Compartilhamento e Direitos do Titular</span>
          </h2>
          <p>
            A Raposo Veículos <strong>não comercializa dados de clientes</strong> com terceiros. As informações poderão ser compartilhadas exclusivamente com instituições financeiras parceiras mediante expressa solicitação do usuário para análise de crédito automotivo.
          </p>
          <p>
            O titular dos dados pode solicitar, a qualquer momento, a confirmação, retificação ou exclusão de seus dados de nossa base através do nosso canal de atendimento por e-mail ou WhatsApp.
          </p>
        </section>

      </div>

    </div>
  );
};
