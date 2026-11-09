import React, { useState } from 'react';
import { 
  RecomendacionAutomatizacion, 
  PrincipioAutomatizacion, 
  LoteProduccion, 
  EstadoAprobacion 
} from '../types';
import { 
  Sparkles, 
  Cpu, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Check, 
  X, 
  Sliders, 
  AlertCircle,
  FileCheck2,
  TrendingUp,
  Flame,
  Award
} from 'lucide-react';
import { fetchAIAutomationRecommendations } from '../services/automationService';

interface AutomationRecommenderProps {
  lote: LoteProduccion;
  recomendaciones: RecomendacionAutomatizacion[];
  principios: PrincipioAutomatizacion[];
  onUpdateRecomendaciones: (nuevas: RecomendacionAutomatizacion[]) => void;
  onUpdatePrincipios: (nuevos: PrincipioAutomatizacion[]) => void;
  kpis: {
    oee: number;
    cumplimiento: number;
    conformidad: number;
    merma: number;
  };
}

export const AutomationRecommender: React.FC<AutomationRecommenderProps> = ({
  lote,
  recomendaciones,
  principios,
  onUpdateRecomendaciones,
  onUpdatePrincipios,
  kpis,
}) => {
  const [enfoqueSeleccionado, setEnfoqueSeleccionado] = useState(
    'Optimización OEE Global y Reducción de Mermas Cárnicas'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [mensajeEjecutivo, setMensajeEjecutivo] = useState<string | null>(null);
  const [fuenteGeneracion, setFuenteGeneracion] = useState<string | null>(null);

  // Focus areas
  const enfoques = [
    'Optimización OEE Global y Reducción de Mermas Cárnicas',
    'Control Criogénico y Eficiencia Energética IQF',
    'Inspección Automática Fin de Línea (Rayos X y Rechazo)',
    'Trazabilidad Digital ISA-95 y Política Cero Papel',
  ];

  // Trigger AI generation
  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setMensajeEjecutivo(null);

    const result = await fetchAIAutomationRecommendations(lote, enfoqueSeleccionado, kpis);
    onUpdatePrincipios(result.principiosAutomatizacion);
    onUpdateRecomendaciones(result.recomendaciones);
    setMensajeEjecutivo(result.analisisEjecutivo);
    setFuenteGeneracion(result.source);
    setIsGenerating(false);
  };

  // Change validation state of a recommendation by General Manager
  const handleValidarRecomendacion = (
    id: string, 
    nuevoEstado: EstadoAprobacion,
    comentario?: string
  ) => {
    const ahora = new Date().toISOString().substring(0, 10);
    const updated = recomendaciones.map((rec) => {
      if (rec.id === id) {
        return {
          ...rec,
          estadoValidacion: nuevoEstado,
          firmaGerenteGeneral: nuevoEstado === 'APROBADO' 
            ? 'Brayan Estiven Monsalve (Gerente General / Representante de la Dirección)' 
            : undefined,
          fechaValidacion: ahora,
          comentarioGerencia: comentario || rec.comentarioGerencia,
        };
      }
      return rec;
    });

    onUpdateRecomendaciones(updated);
  };

  // Metrics for validated recommendations
  const recomendacionesAprobadas = recomendaciones.filter((r) => r.estadoValidacion === 'APROBADO');
  const inversionTotalAprobadaUSD = recomendacionesAprobadas.reduce(
    (acc, r) => acc + r.inversionEstimadaUSD, 
    0
  );
  const roiPromedioMeses = recomendacionesAprobadas.length > 0
    ? Number((recomendacionesAprobadas.reduce((acc, r) => acc + r.roiMeses, 0) / recomendacionesAprobadas.length).toFixed(1))
    : 0;

  // Approximate annual savings estimate based on merma and efficiency
  const ahorroAnualEstimadoUSD = Math.round(inversionTotalAprobadaUSD * 1.6);
  const ahorroAnualCOP = ahorroAnualEstimadoUSD * 4200;

  return (
    <div className="space-y-6">
      
      {/* Top Header & AI Generator Trigger */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold uppercase tracking-wider mb-1">
              <Cpu className="w-4 h-4" />
              <span>INDUSTRIA 4.0 & GESTIÓN GERENCIAL ISO 9001</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Principios de Automatización Industrial y Recomendaciones Estratégicas
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Generación de soluciones técnicas para la línea de carnes preformadas Archie's con validación ejecutiva del Gerente General.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              value={enfoqueSeleccionado}
              onChange={(e) => setEnfoqueSeleccionado(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500"
            >
              {enfoques.map((enf) => (
                <option key={enf} value={enf}>
                  {enf}
                </option>
              ))}
            </select>

            <button
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 whitespace-nowrap"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Analizando Planta...' : 'Generar con IA (Gemini)'}</span>
            </button>
          </div>
        </div>

        {/* Executive diagnostic summary if generated */}
        {mensajeEjecutivo && (
          <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-900/40 text-xs text-slate-200 space-y-1">
            <div className="flex items-center justify-between font-semibold text-rose-400">
              <span>Diagnóstico de Automatización para Gerencia General:</span>
              <span className="font-mono text-[10px] text-slate-400">Motor: {fuenteGeneracion}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{mensajeEjecutivo}</p>
          </div>
        )}

        {/* Investment & Impact Dashboard for General Manager */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400">Inversión Total Autorizada</span>
            <div className="text-xl font-bold font-mono text-white mt-1">
              ${inversionTotalAprobadaUSD.toLocaleString()} USD
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              {recomendacionesAprobadas.length} proyecto(s) aprobados
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400">Ahorro Anual Proyectado (Mermas & Tiempos)</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
              +${(ahorroAnualCOP / 1000000).toFixed(1)}M COP
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              ~${ahorroAnualEstimadoUSD.toLocaleString()} USD/año
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400">Periodo Medio de Retorno (Payback)</span>
            <div className="text-xl font-bold font-mono text-blue-400 mt-1">
              {roiPromedioMeses > 0 ? `${roiPromedioMeses} meses` : '—'}
            </div>
            <span className="text-[10px] text-slate-500">Recuperación de capital ágil</span>
          </div>
        </div>

      </div>

      {/* Principles of Automation Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            Principios Fundamentales de Automatización Industrial Aplicados al Proceso
          </h3>
          <span className="text-xs text-slate-500">ISO 9001:2015 & Buenas Prácticas de Manufactura</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {principios.map((p, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-rose-400 flex items-center justify-center font-mono text-[10px]">
                    0{idx + 1}
                  </span>
                  {p.nombre}
                </h4>
                {p.normaVinculada && (
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {p.normaVinculada}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {p.descripcion}
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Impacto: {p.beneficio}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Recommendations Cards with General Manager Decision Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            Recomendaciones Estratégicas y Validación por la Gerencia General
          </h3>
          <span className="text-xs text-slate-400">
            Total propuestas: {recomendaciones.length}
          </span>
        </div>

        <div className="space-y-3">
          {recomendaciones.map((rec) => {
            const isAprobado = rec.estadoValidacion === 'APROBADO';
            const isRechazado = rec.estadoValidacion === 'RECHAZADO';
            const isAjuste = rec.estadoValidacion === 'AJUSTES_REQUERIDOS';

            return (
              <div
                key={rec.id}
                className={`p-4 rounded-xl border transition-all ${
                  isAprobado
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : isRechazado
                    ? 'border-rose-900/40 bg-rose-950/10'
                    : 'border-slate-800 bg-slate-900/40'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-white">{rec.id}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-rose-400 font-semibold">{rec.etapaPHVA}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-slate-400">{rec.subproceso}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-[10px] font-mono text-slate-500">{rec.requisitoISO}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      {rec.titulo}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-white">
                        ${rec.inversionEstimadaUSD.toLocaleString()} USD
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        ROI estimado: {rec.roiMeses} meses
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 text-xs font-bold rounded ${
                      isAprobado
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isRechazado
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : isAjuste
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {rec.estadoValidacion}
                    </span>
                  </div>
                </div>

                {/* Description & Impact */}
                <div className="py-3 text-xs text-slate-300 space-y-2">
                  <p>{rec.descripcion}</p>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs text-emerald-400 font-medium">
                    <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                    <span>Beneficio Cuantificable: {rec.impactoEsperado}</span>
                  </div>
                </div>

                {/* Validation controls for the General Manager */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="text-slate-400 text-[11px]">
                    {rec.firmaGerenteGeneral ? (
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Validado por: {rec.firmaGerenteGeneral} ({rec.fechaValidacion})
                      </span>
                    ) : (
                      <span>Pendiente de decisión gerencial para presupuestación Q1/Q2</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                    <button
                      onClick={() => handleValidarRecomendacion(rec.id, 'APROBADO')}
                      className={`px-3 py-1.5 font-medium rounded-lg transition-colors flex items-center gap-1 ${
                        isAprobado
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>{isAprobado ? 'Aprobado' : 'Aprobar Inversión'}</span>
                    </button>

                    <button
                      onClick={() => handleValidarRecomendacion(rec.id, 'AJUSTES_REQUERIDOS')}
                      className={`px-2.5 py-1.5 font-medium rounded-lg transition-colors ${
                        isAjuste
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white'
                      }`}
                    >
                      Ajustar
                    </button>

                    <button
                      onClick={() => handleValidarRecomendacion(rec.id, 'RECHAZADO')}
                      className={`px-2.5 py-1.5 font-medium rounded-lg transition-colors ${
                        isRechazado
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white'
                      }`}
                    >
                      Postergar
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
