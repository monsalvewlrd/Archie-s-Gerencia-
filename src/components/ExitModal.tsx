import React, { useState } from 'react';
import { 
  LogOut, 
  Lock, 
  Save, 
  X, 
  CheckCircle2, 
  ShieldAlert,
  KeyRound
} from 'lucide-react';

interface ExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAndExit: () => void;
  onExitWithoutSave: () => void;
  isLocked: boolean;
  onUnlockSession: (pin: string) => boolean;
}

export const ExitModal: React.FC<ExitModalProps> = ({
  isOpen,
  onClose,
  onSaveAndExit,
  onExitWithoutSave,
  isLocked,
  onUnlockSession,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onUnlockSession(pinInput);
    if (!success) {
      setPinError(true);
    } else {
      setPinError(false);
      setPinInput('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5 shadow-2xl">
        
        {isLocked ? (
          /* Locked screen mode */
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-500 mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Sesión de Gerencia General Bloqueada
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Ingrese el PIN de seguridad gerencial (predeterminado: <strong className="text-white font-mono">9001</strong>) para reanudar la toma de decisiones.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-3">
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  maxLength={4}
                  autoFocus
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="PIN de 4 dígitos"
                  className="w-full pl-9 pr-3 py-2 text-center text-lg tracking-widest font-mono bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {pinError && (
                <div className="text-xs text-rose-400">
                  PIN incorrecto. Ingrese el código autorizado de la Gerencia.
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shadow-sm"
              >
                Desbloquear Sesión
              </button>
            </form>
          </div>
        ) : (
          /* Regular exit confirmation */
          <div className="space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-400">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Cerrar Sesión Gerencial
                  </h3>
                  <span className="text-xs text-slate-400">
                    Sistema de Gestión de Carnes Preformadas
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              ¿Desea guardar los avances del lote activo antes de cerrar la sesión de la Gerencia General? Todos los datos se sincronizan con el almacenamiento local criptoseguro.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={onSaveAndExit}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Avances y Cerrar Sesión</span>
              </button>

              <button
                onClick={onExitWithoutSave}
                className="w-full py-2 px-4 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Bloquear Pantalla de Gerencia
              </button>

              <button
                onClick={onClose}
                className="w-full py-1.5 px-4 text-xs text-slate-400 hover:text-white transition-colors text-center block"
              >
                Permanecer en la plataforma
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
