import React, { useState } from 'react';
import { 
  LoteProduccion, 
  CicloEtapa, 
  EstadoAprobacion,
  NoConformidad,
  AccionCorrectiva 
} from '../types';
import { 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  ShieldCheck, 
  ThermometerSnowflake, 
  Flame, 
  Scale, 
  Plus, 
  Sliders, 
  Cpu, 
  Award, 
  Check, 
  X, 
  FileText,
  Clock,
  UserCheck
} from 'lucide-react';

interface PhvaModulesProps {
  lote: LoteProduccion;
  onUpdateLote: (loteActualizado: LoteProduccion) => void;
  faseInicial?: CicloEtapa;
}

export const PhvaModules: React.FC<PhvaModulesProps> = ({
  lote,
  onUpdateLote,
  faseInicial = 'PLANEAR',
}) => {
  const [faseActiva, setFaseActiva] = useState<CicloEtapa>(faseInicial);
  const [firmaDigitalTexto, setFirmaDigitalTexto] = useState(
    lote.planear.firmaGerenteGeneral || 'Brayan Estiven Monsalve (Gerente General / Representante de la Dirección)'
  );
  const [nuevaObservacion, setNuevaObservacion] = useState(
    lote.planear.observacionesGerencia
  );

  // New NC form modal state
  const [showNcModal, setShowNcModal] = useState(false);
  const [ncDescripcion, setNcDescripcion] = useState('');
  const [ncSubproceso, setNcSubproceso] = useState('Formado de hamburguesas');
  const [ncSeveridad, setNcSeveridad] = useState<'CRITICA' | 'MAYOR' | 'MENOR'>('MENOR');
  const [ncAccion, setNcAccion] = useState('');

  // Handler for Planear Gerencia Approval
  const handleAprobarPlan = (nuevoEstado: EstadoAprobacion) => {
    const ahora = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updated: LoteProduccion = {
      ...lote,
      planear: {
        ...lote.planear,
        estadoAprobacionGerente: nuevoEstado,
        firmaGerenteGeneral: nuevoEstado === 'APROBADO' ? firmaDigitalTexto : null,
        fechaFirma: nuevoEstado === 'APROBADO' ? ahora : null,
        observacionesGerencia: nuevaObservacion,
      },
    };
    onUpdateLote(updated);
  };

  // Handler for Hacer: Update real-time process parameters
  const handleUpdateHacerParam = (key: string, value: any) => {
    const updated: LoteProduccion = {
      ...lote,
      hacer: {
        ...lote.hacer,
        [key]: value,
      },
    };
    onUpdateLote(updated);
  };

  // Handler for Adding a No Conformidad
  const handleAddNc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ncDescripcion) return;

    const ahora = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const nuevaNC: NoConformidad = {
      id: `NC-2026-${String(lote.verificar.noConformidades.length + 45).padStart(3, '0')}`,
      fechaHora: ahora,
      etapaPHVA: faseActiva,
      subproceso: ncSubproceso,
      severidad: ncSeveridad,
      descripcion: ncDescripcion,
      accionInmediata: ncAccion || 'Inspección y cuarentena preventiva del sub-lote.',
      responsable: 'Auxiliar de Calidad / Coordinador de Producción',
      estado: 'ABIERTA',
    };

    const updated: LoteProduccion = {
      ...lote,
      verificar: {
        ...lote.verificar,
        noConformidades: [nuevaNC, ...lote.verificar.noConformidades],
      },
    };
    onUpdateLote(updated);
    setNcDescripcion('');
    setNcAccion('');
    setShowNcModal(false);
  };

  // Handler for Toggle Plan de Mejora Continua en Actuar
  const handleToggleMejora = (id: string) => {
    const updatedMejoras = lote.actuar.planMejoraContinua.map((m) => {
      if (m.id === id) {
        return {
          ...m,
          aprobadoGerencia: !m.aprobadoGerencia,
          fechaAprobacion: !m.aprobadoGerencia ? new Date().toISOString().substring(0, 10) : undefined,
        };
      }
      return m;
    });

    onUpdateLote({
      ...lote,
      actuar: {
        ...lote.actuar,
        planMejoraContinua: updatedMejoras,
      },
    });
  };

  return (
    <div className="space-y-6">
      
      {/* PHVA Stage Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Módulos Interactivos del Ciclo PHVA
          </h2>
          <p className="text-xs text-slate-400">
            Basado en la Caracterización Oficial SVP-09, 02-FR-001 (ISO 9001:2015).
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          {(['PLANEAR', 'HACER', 'VERIFICAR', 'ACTUAR'] as CicloEtapa[]).map((fase) => {
            const isActive = faseActiva === fase;
            return (
              <button
                key={fase}
                onClick={() => setFaseActiva(fase)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {fase}
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. FASE PLANEAR */}
      {/* ======================================================== */}
      {faseActiva === 'PLANEAR' && (
        <div className="space-y-6">
          
          {/* Executive Plan Approval Card */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-rose-400 font-semibold uppercase tracking-wider">
                  MÓDULO DE PLANIFICACIÓN ESTRATÉGICA
                </span>
                <h3 className="text-base font-bold text-white">
                  Aprobación de Pronósticos y Plan de Producción por Gerencia General
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Estado Oficial:</span>
                <span className={`px-2.5 py-1 text-xs font-bold rounded ${
                  lote.planear.estadoAprobacionGerente === 'APROBADO'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {lote.planear.estadoAprobacionGerente}
                </span>
              </div>
            </div>

            {/* Demand Summary Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400">Demanda Archie's (POS)</span>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {lote.planear.pronosticoArchiesUnidades.toLocaleString()} und
                </div>
                <span className="text-[10px] text-slate-500">42 restaurantes a nivel nacional</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400">Demanda Aliados HORECA</span>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {lote.planear.pronosticoAliadosUnidades.toLocaleString()} und
                </div>
                <span className="text-[10px] text-slate-500">Hoteles y franquicias aliadas</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400">Presupuesto Aprobado (COP)</span>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                  ${(lote.planear.presupuestoAprobadoCOP / 1000000).toFixed(1)}M
                </div>
                <span className="text-[10px] text-slate-500">Validado por Contabilidad</span>
              </div>
            </div>

            {/* Suministros e Insumos Programados */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-white">
                Programación Consolidada de Materias Primas e Insumos (Contratos Certificados)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Carne en Canal Certificada</span>
                  <span className="font-mono font-medium">{lote.planear.inventarioDisponibleCarneKg} kg en andén</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Material de Empaque Primario</span>
                  <span className="font-mono font-medium">{lote.planear.inventarioEmpaquesUnidades.toLocaleString()} bolsas al vacío</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Fecha Límite de Despacho</span>
                  <span className="font-mono font-medium">{lote.planear.fechaEntregaRequerida} (Turno A)</span>
                </div>
              </div>
            </div>

            {/* General Manager Signature and Approval Block */}
            <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
                <UserCheck className="w-4 h-4" />
                <span>Panel de Validación y Firma del Gerente General</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Firma Digital Autorizada (Gerencia General):
                  </label>
                  <input
                    type="text"
                    value={firmaDigitalTexto}
                    onChange={(e) => setFirmaDigitalTexto(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-white font-mono focus:outline-none focus:border-rose-500"
                    placeholder="Nombre y cargo del Gerente General"
                  />
                  {lote.planear.fechaFirma && (
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                      Última validación firmada: {lote.planear.fechaFirma}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Directrices y Observaciones Estratégicas:
                  </label>
                  <input
                    type="text"
                    value={nuevaObservacion}
                    onChange={(e) => setNuevaObservacion(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-rose-500"
                    placeholder="Instrucciones directas al Coordinador de Producción"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleAprobarPlan('APROBADO')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Aprobar y Firmar Plan Semanal</span>
                </button>

                <button
                  onClick={() => handleAprobarPlan('AJUSTES_REQUERIDOS')}
                  className="px-4 py-2 text-xs font-medium text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800 rounded-lg transition-colors"
                >
                  Solicitar Ajuste de Capacidad
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 2. FASE HACER */}
      {/* ======================================================== */}
      {faseActiva === 'HACER' && (
        <div className="space-y-6">
          
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-6">
            <div>
              <span className="text-xs text-rose-400 font-semibold uppercase tracking-wider">
                MÓDULO DE EJECUCIÓN OPERATIVA
              </span>
              <h3 className="text-base font-bold text-white">
                Subprocesos en Línea: Recepción, Molienda, Formado y Congelación
              </h3>
            </div>

            {/* Subproceso 1: Recepción de Carne Cruda */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-mono font-bold">1</span>
                  <h4 className="text-sm font-semibold text-white">Recepción y Verificación de Materias Primas</h4>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {lote.hacer.estadoMateriaPrima}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Proveedor Certificado:</span>
                  <span className="text-slate-200 font-medium">{lote.hacer.proveedorCarne}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">Guía Sanitaria Invima:</span>
                  <span className="text-slate-200 font-mono">{lote.hacer.guiaSanitariaInvima}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">Temp. Recepción en Andén:</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-emerald-400">
                    <ThermometerSnowflake className="w-3.5 h-3.5" />
                    +{lote.hacer.tempRecepcionCarneC.toFixed(1)}°C
                    <span className="text-slate-500 font-normal text-[10px]">(límite ≤ 4.0°C)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="acta-recepcion"
                    checked={lote.hacer.actaRecepcionFirmada}
                    onChange={(e) => handleUpdateHacerParam('actaRecepcionFirmada', e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-rose-500 focus:ring-0"
                  />
                  <label htmlFor="acta-recepcion" className="text-slate-300 text-xs">
                    Acta de recepción firmada
                  </label>
                </div>
              </div>
            </div>

            {/* Subproceso 2: Molienda y Mezclado */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-mono font-bold">2</span>
                  <h4 className="text-sm font-semibold text-white">Molienda y Mezclado con Condimentos Archie's</h4>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <span className="text-slate-400">Temp. Masa Crítica:</span>
                  <span className={`font-bold ${lote.hacer.tempMasaSalidaC > 7.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    +{lote.hacer.tempMasaSalidaC.toFixed(1)}°C
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Tiempo de Mezclado:</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.5"
                      value={lote.hacer.tiempoMezcladoMinutos}
                      onChange={(e) => handleUpdateHacerParam('tiempoMezcladoMinutos', parseFloat(e.target.value) || 8)}
                      className="w-16 px-2 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-white font-mono"
                    />
                    <span className="text-slate-400 font-mono">minutos</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">Homogeneidad Grasa:</span>
                  <span className="text-slate-200 font-mono font-bold">{lote.hacer.homogeneidadGrasaPct}%</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">Fórmula Condimentos:</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Dosificación Archie's OK
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">BPM & EPP Operarios:</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> 100% Cumplimiento
                  </span>
                </div>
              </div>
            </div>

            {/* Subproceso 3: Formado de Hamburguesas */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-mono font-bold">3</span>
                  <h4 className="text-sm font-semibold text-white">Formado de Hamburguesas con Peso Estandarizado</h4>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  Diana: <strong className="text-white">{lote.hacer.pesoDianaGramas}g</strong> (±2.0g)
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Peso Promedio Muestreado:</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.1"
                      value={lote.hacer.pesoPromedioMuestreadoGramas}
                      onChange={(e) => handleUpdateHacerParam('pesoPromedioMuestreadoGramas', parseFloat(e.target.value) || 150)}
                      className="w-20 px-2 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-white font-mono"
                    />
                    <span className="text-slate-400 font-mono">gramos</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">Cadencia de Formado:</span>
                  <span className="text-white font-mono font-bold">{lote.hacer.cadenciaUnidadesHora} und/hora</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">Unidades Moldeadas:</span>
                  <span className="text-white font-mono font-medium">{lote.hacer.unidadesMoldeadas.toLocaleString()} und</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">Unidades Descartadas:</span>
                  <span className="text-rose-400 font-mono font-medium">{lote.hacer.unidadesDescartadas} und</span>
                </div>
              </div>
            </div>

            {/* Subproceso 4: Congelación Rápida IQF y Envasado */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-mono font-bold">4</span>
                  <h4 className="text-sm font-semibold text-white">Congelación IQF, Envasado al Vacío y Detector</h4>
                </div>
                <div className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Libre de Cuerpos Extraños
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Túnel Criogénico IQF:</span>
                  <span className="font-mono font-bold text-sky-400">{lote.hacer.tempTunelIQFC}°C</span>
                </div>

                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Cámara de Conservación:</span>
                  <span className="font-mono font-bold text-blue-400">{lote.hacer.tempCamaraAlmacenamientoC}°C</span>
                </div>

                <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Sellado al Vacío:</span>
                    <span className="text-emerald-400 font-medium">Hermético Conforme</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Etiquetado GS1:</span>
                    <span className="text-slate-200 font-mono">Trazabilidad OK</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 3. FASE VERIFICAR */}
      {/* ======================================================== */}
      {faseActiva === 'VERIFICAR' && (
        <div className="space-y-6">
          
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-rose-400 font-semibold uppercase tracking-wider">
                  MÓDULO DE INSPECCIÓN & CONTROL DE CALIDAD
                </span>
                <h3 className="text-base font-bold text-white">
                  Verificación Integral del Producto y Auditoría de Parámetros ISO 9001
                </h3>
              </div>

              <button
                onClick={() => setShowNcModal(true)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar No Conformidad (NC)</span>
              </button>
            </div>

            {/* Quality Inspection Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400">Inspección Sensorial y Textura</span>
                <div className="text-base font-bold text-emerald-400 mt-1">
                  {lote.verificar.inspeccionVisualSaborTextura}
                </div>
                <span className="text-[10px] text-slate-500">Receta Archie's validada</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400">Desviación Media de Peso</span>
                <div className="text-base font-bold font-mono text-white mt-1">
                  ±{lote.verificar.desviacionGramajePromedioGramas}g
                </div>
                <span className="text-[10px] text-emerald-400">Dentro de tolerancia ISO</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400">Costo Unitario Proyectado</span>
                <div className="text-base font-bold font-mono text-slate-300 mt-1">
                  ${lote.verificar.costoProyectadoUnitarioCOP.toLocaleString()} COP
                </div>
                <span className="text-[10px] text-slate-500">Presupuesto inicial</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400">Costo Unitario Real</span>
                <div className="text-base font-bold font-mono text-amber-400 mt-1">
                  ${lote.verificar.costoRealUnitarioCOP.toLocaleString()} COP
                </div>
                <span className="text-[10px] text-amber-400 font-mono">+1.9% vs proyectado</span>
              </div>
            </div>

            {/* No Conformidades Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-white">
                <span>Registro de No Conformidades (NC) del Lote</span>
                <span className="text-slate-400 font-normal">
                  Total: {lote.verificar.noConformidades.length} evento(s)
                </span>
              </div>

              {lote.verificar.noConformidades.length === 0 ? (
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                  No se han registrado desviaciones en este lote. La producción cumple los parámetros al 100%.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">CÓDIGO</th>
                        <th className="p-2.5">SUBPROCESO</th>
                        <th className="p-2.5">SEVERIDAD</th>
                        <th className="p-2.5">DESCRIPCIÓN DE LA FALLA</th>
                        <th className="p-2.5">ACCIÓN INMEDIATA</th>
                        <th className="p-2.5">ESTADO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 bg-slate-900/30">
                      {lote.verificar.noConformidades.map((nc) => (
                        <tr key={nc.id} className="hover:bg-slate-900/60">
                          <td className="p-2.5 font-mono text-white font-medium">{nc.id}</td>
                          <td className="p-2.5 text-slate-300">{nc.subproceso}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              nc.severidad === 'CRITICA'
                                ? 'bg-rose-500/20 text-rose-400'
                                : nc.severidad === 'MAYOR'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-slate-800 text-slate-300'
                            }`}>
                              {nc.severidad}
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-200">{nc.descripcion}</td>
                          <td className="p-2.5 text-slate-400 text-[11px]">{nc.accionInmediata}</td>
                          <td className="p-2.5 font-mono text-[11px] text-emerald-400 font-medium">
                            {nc.estado}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 4. FASE ACTUAR */}
      {/* ======================================================== */}
      {faseActiva === 'ACTUAR' && (
        <div className="space-y-6">
          
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs text-rose-400 font-semibold uppercase tracking-wider">
                MÓDULO DE MEJORA CONTINUA & CAPA
              </span>
              <h3 className="text-base font-bold text-white">
                Tratamiento de Causas Raíz y Plan de Mejora Continua para Gerencia
              </h3>
            </div>

            {/* Acciones Correctivas (CAPA) */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-white">
                Acciones Correctivas (CAPA) y Causa Raíz (Metodología 5 Porqués)
              </div>

              {lote.actuar.accionesCorrectivas.map((capa) => (
                <div key={capa.id} className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-rose-400">{capa.id}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Compromiso: {capa.fechaCompromiso} · Responsable: {capa.responsableImplementacion}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300">
                    <strong className="text-slate-400">Análisis Causa Raíz:</strong> {capa.analisisCausaRaiz}
                  </div>
                  <div className="text-xs text-emerald-400 bg-emerald-950/20 p-2 rounded border border-emerald-900/30">
                    <strong className="text-emerald-300">Acción Correctiva Estandarizada:</strong> {capa.accionCorrectiva}
                  </div>
                </div>
              ))}
            </div>

            {/* Plan de Mejora Continua Aprobado por Gerencia */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-white">
                <span>Iniciativas de Mejora Continua (Validación Gerencial)</span>
                <span className="text-slate-400 font-normal">Haga clic en la casilla para autorizar</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lote.actuar.planMejoraContinua.map((mejora) => (
                  <div 
                    key={mejora.id}
                    onClick={() => handleToggleMejora(mejora.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
                      mejora.aprobadoGerencia
                        ? 'bg-emerald-950/20 border-emerald-800/60'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{mejora.titulo}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{mejora.descripcion}</p>
                        <p className="text-[10px] text-emerald-400 font-medium">Beneficio: {mejora.beneficioEsperado}</p>
                      </div>
                      <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                        mejora.aprobadoGerencia ? 'bg-emerald-600 text-white' : 'border border-slate-700 bg-slate-900'
                      }`}>
                        {mejora.aprobadoGerencia && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Estandarización Próximo Ciclo */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-white">
                Estandarización y Aprendizaje para el Próximo Ciclo Productivo
              </div>
              <p className="text-xs text-slate-300">
                {lote.actuar.estandarizacionSiguienteCiclo}
              </p>
              <div className="pt-2 text-[11px] text-slate-400">
                Capacitaciones programadas: {lote.actuar.nuevasCapacitacionesProgramadas.join(' · ')}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Modal para Registrar Nueva No Conformidad */}
      {showNcModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Registrar Nueva No Conformidad (NC)</h3>
              <button 
                onClick={() => setShowNcModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNc} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Subproceso Afectado:</label>
                <select
                  value={ncSubproceso}
                  onChange={(e) => setNcSubproceso(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-white"
                >
                  <option value="Recepción de materias primas">Recepción de materias primas</option>
                  <option value="Molienda y mezclado">Molienda y mezclado</option>
                  <option value="Formado de hamburguesas">Formado de hamburguesas</option>
                  <option value="Congelación y envasado">Congelación y envasado</option>
                  <option value="Almacenamiento y despacho">Almacenamiento y despacho</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Severidad:</label>
                <select
                  value={ncSeveridad}
                  onChange={(e) => setNcSeveridad(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-white"
                >
                  <option value="MENOR">MENOR (Desviación estética o leve de gramaje)</option>
                  <option value="MAYOR">MAYOR (Desvío de temperatura o empaque)</option>
                  <option value="CRITICA">CRÍTICA (Riesgo biológico o cuerpo extraño)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Descripción del Hallazgo:</label>
                <textarea
                  required
                  rows={2}
                  value={ncDescripcion}
                  onChange={(e) => setNcDescripcion(e.target.value)}
                  placeholder="Detalle exacto de la desviación observada..."
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Acción Inmediata de Contención:</label>
                <input
                  type="text"
                  value={ncAccion}
                  onChange={(e) => setNcAccion(e.target.value)}
                  placeholder="Cuarentena, re-pesaje, ajuste de máquina..."
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNcModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded"
                >
                  Guardar No Conformidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
