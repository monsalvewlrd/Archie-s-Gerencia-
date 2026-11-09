import React from 'react';
import { ModuloSistema } from '../types';
import { 
  X, 
  Check, 
  Plus, 
  Trash2, 
  SlidersHorizontal, 
  ShieldAlert, 
  Cpu, 
  Activity, 
  Gauge, 
  RefreshCw,
  Truck,
  DollarSign,
  CheckCircle2
} from 'lucide-react';

interface ModuleInstallerModalProps {
  isOpen: boolean;
  onClose: () => void;
  modulos: ModuloSistema[];
  onToggleModule: (id: string) => void;
  onResetModules: () => void;
}

export const ModuleInstallerModal: React.FC<ModuleInstallerModalProps> = ({
  isOpen,
  onClose,
  modulos,
  onToggleModule,
  onResetModules,
}) => {
  if (!isOpen) return null;

  const getModuleIcon = (icono: string) => {
    switch (icono) {
      case 'RefreshCw': return <RefreshCw className="w-4 h-4 text-rose-400" />;
      case 'Activity': return <Activity className="w-4 h-4 text-sky-400" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-emerald-400" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-4 h-4 text-blue-400" />;
      case 'Gauge': return <Gauge className="w-4 h-4 text-amber-400" />;
      case 'DollarSign': return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4 text-purple-400" />;
      case 'Truck': return <Truck className="w-4 h-4 text-slate-400" />;
      default: return <SlidersHorizontal className="w-4 h-4 text-slate-400" />;
    }
  };

  const instaladosCount = modulos.filter((m) => m.instalado).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold uppercase tracking-wider mb-0.5">
              <SlidersHorizontal className="w-4 h-4" />
              <span>GESTOR DE MÓDULOS DE LA PLATAFORMA</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Instalar o Desinstalar Módulos del Sistema Gerencial
            </h3>
            <p className="text-xs text-slate-400">
              Personalice las capacidades visibles de la plataforma según los requisitos de auditoría ISO 9001.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Counter & Reset Action */}
        <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span>
            Módulos activos: <strong className="text-white font-mono">{instaladosCount} de {modulos.length}</strong>
          </span>
          <button
            onClick={onResetModules}
            className="text-rose-400 hover:text-rose-300 font-medium transition-colors"
          >
            Restablecer por defecto
          </button>
        </div>

        {/* Module List */}
        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
          {modulos.map((modulo) => (
            <div
              key={modulo.id}
              className={`p-3.5 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                modulo.instalado
                  ? 'bg-slate-950 border-slate-800'
                  : 'bg-slate-950/40 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                  {getModuleIcon(modulo.icono)}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{modulo.nombre}</span>
                    <span className="text-[10px] text-slate-500 font-mono">[{modulo.categoria}]</span>
                    {modulo.esencial && (
                      <span className="text-[9px] text-rose-400 font-semibold px-1 rounded bg-rose-500/10 border border-rose-500/20">
                        NÚCLEO
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {modulo.descripcion}
                  </p>
                </div>
              </div>

              {/* Install / Uninstall Button */}
              <div className="shrink-0">
                {modulo.esencial ? (
                  <span className="text-[11px] font-mono text-slate-500">
                    Requerido
                  </span>
                ) : (
                  <button
                    onClick={() => onToggleModule(modulo.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                      modulo.instalado
                        ? 'bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-800'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
                    }`}
                  >
                    {modulo.instalado ? (
                      <>
                        <Trash2 className="w-3 h-3 text-rose-400" />
                        <span>Desinstalar</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        <span>Instalar</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Guardar Configuración y Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
