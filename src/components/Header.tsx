import React from 'react';
import { 
  Save, 
  FileDown, 
  SlidersHorizontal, 
  LogOut, 
  Check, 
  Building2,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenModules: () => void;
  onSave: () => void;
  onExportPdf: () => void;
  onExit: () => void;
  isSaving: boolean;
  lastSaved: string | null;
  activeModulesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenModules,
  onSave,
  onExportPdf,
  onExit,
  isSaving,
  lastSaved,
  activeModulesCount,
}) => {
  const navTabs = [
    { id: 'gerencia', label: 'Gerencia General' },
    { id: 'dashboard', label: 'Telemetría IoT' },
    { id: 'phva', label: 'Ciclo PHVA' },
    { id: 'automatizacion', label: 'Automatización & IA' },
    { id: 'datos', label: 'Datos Empresariales' },
    { id: 'historial', label: 'Historial Lotes' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
<div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">        {/* Zone 1: Single text wordmark with corporate blue & emerald accent */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-600/40 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold tracking-tight text-white whitespace-nowrap">
                ARCHIE'S PRODUCTOS CÁRNICOS S.A.S.
              </span>
              <span className="text-xs text-emerald-400 font-mono hidden sm:inline">
                SVP-09, 02-FR-001 · ISO 9001:2015
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Gestor de Módulos (Instalar / Desinstalar) */}
          <button
            onClick={onOpenModules}
            title="Instalar / Desinstalar Módulos del Sistema"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Módulos</span>
            <span className="font-mono text-[10px] text-slate-400 ml-0.5">({activeModulesCount})</span>
          </button>

          {/* Guardar Avances */}
          <button
            onClick={onSave}
            disabled={isSaving}
            title="Guardar avances del proceso en el sistema local"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            {isSaving ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className="hidden sm:inline">Guardar</span>
          </button>

          {/* Exportar Resultados en PDF */}
          <button
            onClick={onExportPdf}
            title="Exportar informe oficial de producción SVP-09, 02-FR-001 en PDF"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Exportar PDF</span>
          </button>

          {/* Salir */}
          <button
            onClick={onExit}
            title="Cerrar sesión gerencial"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Mobile nav row */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 border-t border-slate-800/80 overflow-x-auto no-scrollbar bg-slate-950">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
                isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
