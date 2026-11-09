import React, { useState, useEffect } from 'react';
import { 
  LoteProduccion, 
  ModuloSistema, 
  RecomendacionAutomatizacion, 
  PrincipioAutomatizacion, 
  OportunidadMejora, 
  TelemetriaPunto,
  CicloEtapa,
  OrdenCompra,
  DirectrizNormativa,
  ProyectoTecnologicoGerencial
} from './types';
import { 
  LOTE_ACTUAL_INICIAL, 
  LOTES_HISTORICOS_INICIALES, 
  MODULOS_INICIALES, 
  PRINCIPIOS_AUTOMATIZACION_BASE, 
  RECOMENDACIONES_BASE, 
  OPORTUNIDADES_MEJORA_BASE, 
  TELEMETRIA_SIMULADA_INICIAL,
  ORDENES_COMPRA_INICIALES,
  DIRECTRICES_NORMATIVAS_INICIALES,
  PROYECTOS_TECNOLOGICOS_INICIALES
} from './data/initialData';
import { Header } from './components/Header';
import { GerenciaGeneralView } from './components/GerenciaGeneralView';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { PhvaModules } from './components/PhvaModules';
import { AutomationRecommender } from './components/AutomationRecommender';
import { DataManagement } from './components/DataManagement';
import { ProcessHistory } from './components/ProcessHistory';
import { ModuleInstallerModal } from './components/ModuleInstallerModal';
import { ExitModal } from './components/ExitModal';
import { generarReporteEjecutivoPDF } from './services/pdfExportService';
import { Check, ShieldCheck } from 'lucide-react';

export default function App() {
  // Main state with localStorage persistence fallback
  const [loteActual, setLoteActual] = useState<LoteProduccion>(() => {
    const saved = localStorage.getItem('archies_lote_activo');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return LOTE_ACTUAL_INICIAL;
  });

  const [lotesHistoricos, setLotesHistoricos] = useState<LoteProduccion[]>(() => {
    const saved = localStorage.getItem('archies_lotes_historicos');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return LOTES_HISTORICOS_INICIALES;
  });

  const [modulos, setModulos] = useState<ModuloSistema[]>(() => {
    const saved = localStorage.getItem('archies_modulos_config');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return MODULOS_INICIALES;
  });

  const [recomendaciones, setRecomendaciones] = useState<RecomendacionAutomatizacion[]>(() => {
    const saved = localStorage.getItem('archies_recomendaciones');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return RECOMENDACIONES_BASE;
  });

  const [principios, setPrincipios] = useState<PrincipioAutomatizacion[]>(PRINCIPIOS_AUTOMATIZACION_BASE);
  const [oportunidades, setOportunidades] = useState<OportunidadMejora[]>(OPORTUNIDADES_MEJORA_BASE);
  const [telemetria, setTelemetria] = useState<TelemetriaPunto[]>(TELEMETRIA_SIMULADA_INICIAL);

  const [ordenesCompra, setOrdenesCompra] = useState<OrdenCompra[]>(() => {
    const saved = localStorage.getItem('archies_ordenes_compra');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return ORDENES_COMPRA_INICIALES;
  });

  const [directricesNormativas, setDirectricesNormativas] = useState<DirectrizNormativa[]>(() => {
    const saved = localStorage.getItem('archies_directrices_normativas');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DIRECTRICES_NORMATIVAS_INICIALES;
  });

  const [proyectosTecnologicos, setProyectosTecnologicos] = useState<ProyectoTecnologicoGerencial[]>(() => {
    const saved = localStorage.getItem('archies_proyectos_tecnologicos');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return PROYECTOS_TECNOLOGICOS_INICIALES;
  });

  // Active navigation tab (defaults to Gerencia General as requested)
  const [activeTab, setActiveTab] = useState<string>('gerencia');
  const [fasePhvaSubtab, setFasePhvaSubtab] = useState<CicloEtapa>('PLANEAR');

  // Persistence and UI states
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isModulesModalOpen, setIsModulesModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isLockedSession, setIsLockedSession] = useState(false);

  // Trigger toast feedback
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Save progress explicitly (Button 2 in Prompt requirements)
  const handleSaveProgress = () => {
    setIsSaving(true);
    const ahora = new Date().toLocaleTimeString();

    // Persist to local storage
    localStorage.setItem('archies_lote_activo', JSON.stringify(loteActual));
    localStorage.setItem('archies_lotes_historicos', JSON.stringify(lotesHistoricos));
    localStorage.setItem('archies_modulos_config', JSON.stringify(modulos));
    localStorage.setItem('archies_recomendaciones', JSON.stringify(recomendaciones));
    localStorage.setItem('archies_ordenes_compra', JSON.stringify(ordenesCompra));
    localStorage.setItem('archies_directrices_normativas', JSON.stringify(directricesNormativas));
    localStorage.setItem('archies_proyectos_tecnologicos', JSON.stringify(proyectosTecnologicos));

    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(ahora);
      triggerToast(`Avances guardados correctamente a las ${ahora}.`);
    }, 400);
  };

  // Module toggle
  const handleToggleModule = (id: string) => {
    const updated = modulos.map((m) =>
      m.id === id ? { ...m, instalado: !m.instalado } : m
    );
    setModulos(updated);
    localStorage.setItem('archies_modulos_config', JSON.stringify(updated));
    triggerToast('Configuración de módulos actualizada.');
  };

  // Reset modules
  const handleResetModules = () => {
    setModulos(MODULOS_INICIALES);
    localStorage.setItem('archies_modulos_config', JSON.stringify(MODULOS_INICIALES));
    triggerToast('Módulos restablecidos a la configuración de fábrica.');
  };

  // Real-time telemetry simulation step
  const handleSimulateTelemetryTick = () => {
    const ahora = new Date();
    const timeStr = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;

    // Subtle natural variations in industrial cold chain
    const deltaMolienda = (Math.random() * 0.4 - 0.2);
    const newMolienda = Math.min(6.8, Math.max(4.6, loteActual.hacer.tempMasaSalidaC + deltaMolienda));

    const deltaTunel = (Math.random() * 0.6 - 0.3);
    const newTunel = Math.min(-33.5, Math.max(-36.2, loteActual.hacer.tempTunelIQFC + deltaTunel));

    const deltaCamara = (Math.random() * 0.4 - 0.2);
    const newCamara = Math.min(-19.5, Math.max(-22.5, loteActual.hacer.tempCamaraAlmacenamientoC + deltaCamara));

    const deltaCadencia = Math.floor(Math.random() * 30 - 15);
    const newCadencia = Math.max(1800, loteActual.hacer.cadenciaUnidadesHora + deltaCadencia);

    const nuevoPunto: TelemetriaPunto = {
      tiempo: timeStr,
      tempMolienda: Number(newMolienda.toFixed(1)),
      tempTunelIQF: Number(newTunel.toFixed(1)),
      tempCamaraAlmacen: Number(newCamara.toFixed(1)),
      cadenciaRealUndH: newCadencia,
    };

    setTelemetria((prev) => [...prev.slice(-8), nuevoPunto]);

    // Update in active batch
    setLoteActual((prev) => ({
      ...prev,
      hacer: {
        ...prev.hacer,
        tempMasaSalidaC: Number(newMolienda.toFixed(1)),
        tempTunelIQFC: Number(newTunel.toFixed(1)),
        tempCamaraAlmacenamientoC: Number(newCamara.toFixed(1)),
        cadenciaUnidadesHora: newCadencia,
      },
    }));
  };

  // Periodic automatic telemetry tick (every 10s)
  useEffect(() => {
    const timer = setInterval(() => {
      handleSimulateTelemetryTick();
    }, 10000);
    return () => clearInterval(timer);
  }, [loteActual.hacer.tempMasaSalidaC]);

  // PDF Export trigger (Button 3 in Prompt requirements)
  const handleExportPdf = (loteToExport = loteActual) => {
    const kpis = {
      oee: 87.4,
      cumplimiento: 98.1,
      conformidad: 99.1,
    };

    generarReporteEjecutivoPDF(loteToExport, proyectosTecnologicos, recomendaciones, principios, kpis);
    triggerToast(`Informe Gerencial descargado: Archies_ISO9001_Reporte_Gerencial_${loteToExport.codigoLote}.pdf`);
  };

  // Exit actions
  const handleSaveAndExit = () => {
    handleSaveProgress();
    setIsLockedSession(true);
  };

  const handleExitWithoutSave = () => {
    setIsLockedSession(true);
  };

  const handleUnlockSession = (pin: string) => {
    if (pin === '9001' || pin === '1234') {
      setIsLockedSession(false);
      triggerToast('Bienvenido nuevamente, Gerente General.');
      return true;
    }
    return false;
  };

  // Navigate to PHVA with specific subtab
  const handleNavigateToPhva = (fase?: string) => {
    if (fase) {
      setFasePhvaSubtab(fase as CicloEtapa);
    }
    setActiveTab('phva');
  };

  // Select historical batch as active
  const handleSelectLoteAsActivo = (loteSeleccionado: LoteProduccion) => {
    setLoteActual(loteSeleccionado);
    triggerToast(`Lote ${loteSeleccionado.codigoLote} cargado como activo en planta.`);
    setActiveTab('dashboard');
  };

  const activeModulesCount = modulos.filter((m) => m.instalado).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Official Top Bar Contract with navigation & action buttons */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenModules={() => setIsModulesModalOpen(true)}
        onSave={handleSaveProgress}
        onExportPdf={() => handleExportPdf(loteActual)}
        onExit={() => setIsExitModalOpen(true)}
        isSaving={isSaving}
        lastSaved={lastSaved}
        activeModulesCount={activeModulesCount}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 0: Módulo Exclusivo de Gerencia General (Dirección Estratégica & PHVA) */}
        {activeTab === 'gerencia' && (
          <GerenciaGeneralView
            lote={loteActual}
            directrices={directricesNormativas}
            proyectosTecnologicos={proyectosTecnologicos}
            onUpdateLote={(updated) => {
              setLoteActual(updated);
              setLotesHistoricos((prev) =>
                prev.map((l) => (l.id === updated.id ? updated : l))
              );
            }}
            onUpdateProyectos={(updated) => {
              setProyectosTecnologicos(updated);
              localStorage.setItem('archies_proyectos_tecnologicos', JSON.stringify(updated));
            }}
            onExportPdf={() => handleExportPdf(loteActual)}
            onNavigateToTab={setActiveTab}
          />
        )}

        {/* Tab 1: Telemetría IoT en Vivo & OEE */}
        {activeTab === 'dashboard' && (
          <ExecutiveDashboard
            lote={loteActual}
            telemetria={telemetria}
            modulos={modulos}
            onNavigateToPhva={handleNavigateToPhva}
            onNavigateToAutomation={() => setActiveTab('automatizacion')}
            onSimulateTelemetryTick={handleSimulateTelemetryTick}
          />
        )}

        {/* Tab 2: Interactive PHVA Cycle Modules */}
        {activeTab === 'phva' && (
          <PhvaModules
            lote={loteActual}
            onUpdateLote={(updated) => {
              setLoteActual(updated);
              // Also update in history
              setLotesHistoricos((prev) =>
                prev.map((l) => (l.id === updated.id ? updated : l))
              );
            }}
            faseInicial={fasePhvaSubtab}
          />
        )}

        {/* Tab 3: Automation Principles & Strategic Recommendations */}
        {activeTab === 'automatizacion' && (
          <AutomationRecommender
            lote={loteActual}
            recomendaciones={recomendaciones}
            principios={principios}
            onUpdateRecomendaciones={setRecomendaciones}
            onUpdatePrincipios={setPrincipios}
            kpis={{
              oee: 87.4,
              cumplimiento: Number(((loteActual.cantidadTerminada / loteActual.cantidadPlanificada) * 100).toFixed(1)),
              conformidad: loteActual.verificar.porcentajeConformidadLote,
              merma: loteActual.mermaPorcentaje,
            }}
          />
        )}

        {/* Tab 4: Enterprise Data Ingestion & Improvement Opportunities */}
        {activeTab === 'datos' && (
          <DataManagement
            loteActual={loteActual}
            onUpdateLote={setLoteActual}
            oportunidades={oportunidades}
            onUpdateOportunidades={setOportunidades}
            onNavigateToAutomation={() => setActiveTab('automatizacion')}
          />
        )}

        {/* Tab 5: Process History & Audit Records */}
        {activeTab === 'historial' && (
          <ProcessHistory
            lotes={lotesHistoricos}
            loteActivoId={loteActual.id}
            onSelectLoteAsActivo={handleSelectLoteAsActivo}
            onExportPdfLote={handleExportPdf}
          />
        )}

      </main>

      {/* Official Corporate Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-400 space-y-1.5">
        <div className="font-semibold text-slate-300 tracking-wide">
          Archie's Productos Cárnicos S.A.S. • Bello, Antioquia • NIT 901.482.391-4*
        </div>
        <div className="font-mono text-slate-400 text-[11px] flex items-center justify-center gap-1.5">
          <span>IMG_6671.png</span>
        </div>
        <div className="text-slate-400 text-[11px]">
          Plataforma Asistida por Inteligencia Artificial (7 Agentes Especializados) • Normativa Contable y Tributaria Colombiana*
        </div>
      </footer>

      {/* Floating toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white shadow-2xl text-xs animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal: Instalar / Desinstalar Módulos */}
      <ModuleInstallerModal
        isOpen={isModulesModalOpen}
        onClose={() => setIsModulesModalOpen(false)}
        modulos={modulos}
        onToggleModule={handleToggleModule}
        onResetModules={handleResetModules}
      />

      {/* Modal: Salir / Bloquear Sesión */}
      <ExitModal
        isOpen={isExitModalOpen || isLockedSession}
        onClose={() => setIsExitModalOpen(false)}
        onSaveAndExit={handleSaveAndExit}
        onExitWithoutSave={handleExitWithoutSave}
        isLocked={isLockedSession}
        onUnlockSession={handleUnlockSession}
      />

    </div>
  );
}
