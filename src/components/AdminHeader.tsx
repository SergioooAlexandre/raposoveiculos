import React from 'react';
import { Menu, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onMenuToggle?: () => void;
  actions?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  onMenuToggle,
  actions,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#070709]/90 backdrop-blur-md border-b border-[#1F1F24] px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Mobile Toggle & Page Titles */}
        <div className="flex items-center gap-3 min-w-0">
          {onMenuToggle && (
            <button
              type="button"
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-xl bg-[#141418] border border-[#2A2A32] text-gray-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="truncate">
            <h1 className="font-heading font-bold text-xl text-white tracking-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-gray-400 truncate -mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: Custom Actions & Public Link */}
        <div className="flex items-center gap-3">
          {actions}

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141418] hover:bg-[#1f1f24] text-xs font-semibold text-gray-300 border border-[#2A2A32] transition-colors"
          >
            <span>Ver Loja</span>
            <ExternalLink className="w-3 h-3 text-[#E11D48]" />
          </Link>
        </div>

      </div>
    </header>
  );
};
