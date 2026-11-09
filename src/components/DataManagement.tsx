import React, { useState } from 'react';
import { LoteProduccion, OportunidadMejora } from '../types';
import { OPORTUNIDADES_MEJORA_BASE, LOTE_ACTUAL_INICIAL } from '../data/initialData';
import { 
  Upload, 
  FileSpreadsheet, 
  Database, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  Check, 
  Plus, 
  Download,
  Building,
  RefreshCw
} from 'lucide-react';

interface DataManagementProps {
  loteActual: LoteProduccion;
  onUpdateLote: (nuevoLote: LoteProduccion) => void;
  oportunidades: OportunidadMejora[];
  onUpdateOportunidades: (ops: OportunidadMejora[]) => void;
  onNavigateToAutomation: () => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({
  loteActual,
  onUpdateLote,
  oportunidades,
  onUpdateOportunidades,
  onNavigateToAutomation,
}) => {
  const [mensajeCarga, setMensajeCarga] = useState<string | null>(null);
  const [formDemandaArchies, setFormDemandaArchies] = useState(
    loteActual.planear.pronosticoArchiesUnidades
  );
  const [formDemandaAliados, setFormDemandaAliados] = useState(
    loteActual.planear.pronosticoAliadosUnidades
  );
  const [formCapacidad, setFormCapacidad] = useState(
    loteActual.planear.capacidadInstaladaUnidades
  );
  const [formCarneInventario, setFormCarneInventario] = useState(
    loteActual.planear.inventarioDisponibleCarneKg
  );

  // New opportunity state
  const [showAddOp, setShowAddOp] = useState(false);
  const [opArea, setOpArea] = useState('');
  const [opCuello, setOpCuello] = useState('');
  const [opImpacto, setOpImpacto] = useState('');
  const [opSolucion, setOpSolucion] = useState('');
  const [opUrgencia, setOpUrgencia] = useState<'ALTA' | 'MEDIA' | 'ESTRATEGICA'>('ALTA');

  // Load preset scenarios
  const handleLoadPreset = (tipo: string) => {
    let nuevoLote = { ...loteActual };
    let mensaje = '';

    if (tipo === 'TEMPORADA_ALTA') {
      nuevoLote = {
        ...nuevoLote,
        codigoLote: 'LP-CP-2026-ALTA-99',
        tipoProducto: 'Angus Gourmet 180g',
        cantidadPlanificada: 10500,
        cantidadTerminada: 10120,
        mermaKilos: 34.2,
        mermaPorcentaje: 1.88,
        planear: {
          ...nuevoLote.planear,
          pronosticoArchiesUnidades: 8500,
          pronosticoAliadosUnidades: 2000,
          capacidadInstaladaUnidades: 11000,
          inventarioDisponibleCarneKg: 1950,
          presupuestoAprobadoCOP: 39500000,
          observacionesGerencia: 'Temporada alta fin de año. Turnos dobles autorizados.',
        },
        hacer: {
          ...nuevoLote.hacer,
          tipoHamburguesa: 'Angus Gourmet 180g',
          pesoDianaGramas: 180.0,
          pesoPromedioMuestreadoGramas: 180.6,
          cadenciaUnidadesHora: 2200,
        },
      };
      mensaje = 'Cargado escenario: Temporada Alta Angus Gourmet (10,500 unidades).';
    } else if (tipo === 'DESVIO_TERMICO') {
      nuevoLote = {
        ...nuevoLote,
        codigoLote: 'LP-CP-2026-AUDIT-02',
        cantidadPlanificada: 8000,
        cantidadTerminada: 7600,
        mermaKilos: 48.0,
        mermaPorcentaje: 3.15,
        hacer: {
          ...nuevoLote.hacer,
          tempMasaSalidaC: 7.6, // Desvío crítico
        },
        verificar: {
          ...nuevoLote.verificar,
          porcentajeConformidadLote: 94.2,
          noConformidades: [
            {
              id: 'NC-2026-901',
              fechaHora: new Date().toISOString().substring(0, 16),
              etapaPHVA: 'HACER',
              subproceso: 'Molienda y mezclado',
              severidad: 'CRITICA',
              descripcion: 'Masa cárnica alcanzó 7.6°C por fricción en sin fin de molienda.',
              accionInmediata: 'Detención preventiva de línea y adición de nieve de hielo cárnico.',
              responsable: 'Coordinador de Producción',
              estado: 'ABIERTA',
            },
          ],
        },
      };
      mensaje = 'Cargado escenario de prueba: Auditoría con desvío térmico (+7.6°C en molienda).';
    } else {
      nuevoLote = LOTE_ACTUAL_INICIAL;
      mensaje = 'Restablecido escenario estándar: Hamburguesa Clásica Archie\'s 150g.';
    }

    setFormDemandaArchies(nuevoLote.planear.pronosticoArchiesUnidades);
    setFormDemandaAliados(nuevoLote.planear.pronosticoAliadosUnidades);
    setFormCapacidad(nuevoLote.planear.capacidadInstaladaUnidades);
    setFormCarneInventario(nuevoLote.planear.inventarioDisponibleCarneKg);

    onUpdateLote(nuevoLote);
    setMensajeCarga(mensaje);
    setTimeout(() => setMensajeCarga(null), 4000);
  };

  // Upload JSON file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.codigoLote || parsed.planear) {
          const merged: LoteProduccion = {
            ...loteActual,
            ...parsed,
          };
          onUpdateLote(merged);
          setMensajeCarga(`Archivo "${file.name}" cargado exitosamente en el sistema.`);
        } else {
          setMensajeCarga('Estructura de archivo válida pero no contiene claves de lote.');
        }
      } catch (err) {
        setMensajeCarga('Error al leer el archivo JSON. Verifique la sintaxis.');
      }
    };
    reader.readAsText(file);
  };

  // Update business form
  const handleApplyFormChanges = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: LoteProduccion = {
      ...loteActual,
      planear: {
        ...loteActual.planear,
        pronosticoArchiesUnidades: Number(formDemandaArchies),
        pronosticoAliadosUnidades: Number(formDemandaAliados),
        capacidadInstaladaUnidades: Number(formCapacidad),
        inventarioDisponibleCarneKg: Number(formCarneInventario),
      },
      cantidadPlanificada: Number(formDemandaArchies) + Number(formDemandaAliados),
    };
    onUpdateLote(updated);
    setMensajeCarga('Datos empresariales actualizados en el plan activo.');
    setTimeout(() => setMensajeCarga(null), 3000);
  };

  // Add custom opportunity
  const handleAddOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opCuello || !opSolucion) return;

    const nuevaOp: OportunidadMejora = {
      id: `OP-${String(oportunidades.length + 1).padStart(2, '0')}`,
      area: opArea || 'Planta de producción',
      cuelloDeBotella: opCuello,
      impactoMermaOCosto: opImpacto || 'Impacto en OEE y costo operacional.',
      solucionAutomatizada: opSolucion,
      nivelUrgencia: opUrgencia,
    };

    onUpdateOportunidades([...oportunidades, nuevaOp]);
    setShowAddOp(false);
    setOpArea('');
    setOpCuello('');
    setOpImpacto('');
    setOpSolucion('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header and File Ingestion Area */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold uppercase tracking-wider mb-1">
              <Database className="w-4 h-4" />
              <span>GESTIÓN DE DATOS EMPRESARIALES</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Carga de Datos Operacionales & Análisis de Oportunidades
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Ingesta de pronósticos, inventarios y parámetros de planta para alimentar las decisiones de Gerencia.
            </p>
          </div>

          {/* Quick preset selector buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleLoadPreset('ESTANDAR')}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
            >
              Lote Estándar 150g
            </button>
            <button
              onClick={() => handleLoadPreset('TEMPORADA_ALTA')}
              className="px-3 py-1.5 text-xs font-medium text-rose-300 bg-rose-950/40 border border-rose-900/60 hover:bg-rose-900/40 rounded-lg transition-colors"
            >
              Temporada Alta Angus 180g
            </button>
            <button
              onClick={() => handleLoadPreset('DESVIO_TERMICO')}
              className="px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/40 border border-amber-900/60 hover:bg-amber-900/40 rounded-lg transition-colors"
            >
              Caso Desvío Térmico
            </button>
          </div>
        </div>

        {mensajeCarga && (
          <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{mensajeCarga}</span>
          </div>
        )}

        {/* File Ingestion Dropzone & Manual Input */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* Ingest box */}
          <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 flex flex-col items-center justify-center text-center space-y-2">
            <Upload className="w-8 h-8 text-rose-500 mb-1" />
            <h4 className="text-xs font-bold text-white">Importar Lote (JSON / CSV)</h4>
            <p className="text-[11px] text-slate-400 max-w-xs">
              Cargue registros históricos del sistema POS, básculas o ERP para análisis ISO 9001.
            </p>
            <label className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
              <span>Seleccionar Archivo</span>
              <input
                type="file"
                accept=".json,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Form to update business variables */}
          <form onSubmit={handleApplyFormChanges} className="md:col-span-2 p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span>Ajuste Rápido de Variables Empresariales (Lote Activo)</span>
              <span className="font-mono text-slate-500 text-[10px]">{loteActual.codigoLote}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Demanda Restaurantes Archie's:</label>
                <input
                  type="number"
                  value={formDemandaArchies}
                  onChange={(e) => setFormDemandaArchies(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Demanda Clientes Aliados:</label>
                <input
                  type="number"
                  value={formDemandaAliados}
                  onChange={(e) => setFormDemandaAliados(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Capacidad Instalada Planta (und/turno):</label>
                <input
                  type="number"
                  value={formCapacidad}
                  onChange={(e) => setFormCapacidad(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Carne Cruda Disponible (Kg):</label>
                <input
                  type="number"
                  value={formCarneInventario}
                  onChange={(e) => setFormCarneInventario(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors"
              >
                Actualizar Demanda y Parámetros
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* Analysis of Improvement Opportunities Matrix */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Matriz de Oportunidades de Mejora Detectadas en Planta</span>
            </h3>
            <p className="text-xs text-slate-400">
              Diagnóstico derivado del análisis de mermas, tiempos de ciclo y cuellos de botella en el proceso.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddOp(true)}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar Oportunidad</span>
            </button>

            <button
              onClick={onNavigateToAutomation}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shadow-sm"
            >
              Vincular a Automatización
            </button>
          </div>
        </div>

        {/* Opportunity cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {oportunidades.map((op) => (
            <div
              key={op.id}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white">{op.id}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-300 font-semibold">{op.area}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  op.nivelUrgencia === 'ALTA'
                    ? 'bg-rose-500/20 text-rose-400'
                    : op.nivelUrgencia === 'ESTRATEGICA'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {op.nivelUrgencia}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-mono block">Cuello de Botella Actual:</span>
                  <p className="text-slate-200">{op.cuelloDeBotella}</p>
                </div>

                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] text-amber-300">
                  <strong className="text-slate-400">Impacto en Pérdidas:</strong> {op.impactoMermaOCosto}
                </div>

                <div className="pt-1 text-[11px] text-emerald-400 font-medium flex items-start gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>Solución Tecnológica: {op.solucionAutomatizada}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Add Opportunity */}
      {showAddOp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Registrar Nueva Oportunidad de Mejora</h3>

            <form onSubmit={handleAddOpportunity} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Área o Subproceso:</label>
                <input
                  type="text"
                  required
                  value={opArea}
                  onChange={(e) => setOpArea(e.target.value)}
                  placeholder="ej. Envasado, Molienda, Recepción..."
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nivel de Urgencia:</label>
                <select
                  value={opUrgencia}
                  onChange={(e) => setOpUrgencia(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-white"
                >
                  <option value="ALTA">ALTA (Causa merma directa o paro de línea)</option>
                  <option value="MEDIA">MEDIA (Ineficiencia operativa moderada)</option>
                  <option value="ESTRATEGICA">ESTRATÉGICA (Escalabilidad de planta a 3 años)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Cuello de Botella Observado:</label>
                <textarea
                  required
                  rows={2}
                  value={opCuello}
                  onChange={(e) => setOpCuello(e.target.value)}
                  placeholder="Descripción de la limitación manual o técnica actual..."
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Impacto en Merma o Costos:</label>
                <input
                  type="text"
                  value={opImpacto}
                  onChange={(e) => setOpImpacto(e.target.value)}
                  placeholder="ej. Pérdida de 150 kg mensuales por sobrepeso..."
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Solución Automatizada Recomendada:</label>
                <input
                  type="text"
                  required
                  value={opSolucion}
                  onChange={(e) => setOpSolucion(e.target.value)}
                  placeholder="ej. Celda de pesaje y descarte automático en línea..."
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddOp(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded"
                >
                  Guardar Oportunidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
