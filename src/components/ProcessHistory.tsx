import React, { useState } from 'react';
import { LoteProduccion } from '../types';
import { 
  History, 
  Search, 
  Filter, 
  FileDown, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ChevronRight, 
  Building, 
  ThermometerSnowflake,
  ShieldCheck,
  RefreshCw,
  X
} from 'lucide-react';

interface ProcessHistoryProps {
  lotes: LoteProduccion[];
  loteActivoId: string;
  onSelectLoteAsActivo: (lote: LoteProduccion) => void;
  onExportPdfLote: (lote: LoteProduccion) => void;
}

export const ProcessHistory: React.FC<ProcessHistoryProps> = ({
  lotes,
  loteActivoId,
  onSelectLoteAsActivo,
  onExportPdfLote,
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [filtroCliente, setFiltroCliente] = useState('TODOS');
  const [loteDetalle, setLoteDetalle] = useState<LoteProduccion | null>(null);

  // Filter batches
  const lotesFiltrados = lotes.filter((l) => {
    const matchBusqueda =
      l.codigoLote.toLowerCase().includes(busqueda.toLowerCase()) ||
      l.tipoProducto.toLowerCase().includes(busqueda.toLowerCase()) ||
      l.coordinadorProduccion.toLowerCase().includes(busqueda.toLowerCase());

    const matchEstado =
      filtroEstado === 'TODOS' || l.estadoLote === filtroEstado;

    const matchCliente =
      filtroCliente === 'TODOS' || l.clienteDestino.includes(filtroCliente);

    return matchBusqueda && matchEstado && matchCliente;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Controls */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold uppercase tracking-wider mb-1">
              <History className="w-4 h-4" />
              <span>REGISTROS HISTÓRICOS AUDITABLES · ISO 9001</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Historial de Procesos y Lotes Anteriores
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Trazabilidad integral de producción de carnes preformadas según formato SVP-09, 02-FR-001.
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Registros en sistema: <strong className="text-white">{lotes.length} lotes</strong>
          </div>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por lote, producto o líder..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="EN_PROCESO">En Proceso</option>
            <option value="LIBERADO_CALIDAD">Liberado por Calidad</option>
            <option value="DESPACHADO">Despachado</option>
            <option value="EN_CUARENTENA">En Cuarentena</option>
          </select>

          <select
            value={filtroCliente}
            onChange={(e) => setFiltroCliente(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
          >
            <option value="TODOS">Todos los Clientes</option>
            <option value="Archie's">Restaurantes Archie's</option>
            <option value="Aliados">Aliados HORECA Externos</option>
          </select>
        </div>
      </div>

      {/* Historical Batches Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
            <tr>
              <th className="p-3">CÓDIGO LOTE</th>
              <th className="p-3">FECHA / TURNO</th>
              <th className="p-3">PRODUCTO & CLIENTE</th>
              <th className="p-3 text-right">PRODUCCIÓN</th>
              <th className="p-3 text-right">MERMA</th>
              <th className="p-3 text-center">CONFORMIDAD</th>
              <th className="p-3 text-center">ESTADO LOTE</th>
              <th className="p-3 text-right">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {lotesFiltrados.map((lote) => {
              const isActivo = lote.id === loteActivoId;

              return (
                <tr 
                  key={lote.id} 
                  className={`hover:bg-slate-900/60 transition-colors ${isActivo ? 'bg-slate-900/80' : ''}`}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{lote.codigoLote}</span>
                      {isActivo && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          ACTIVO
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      Aprobó: {lote.planear.estadoAprobacionGerente}
                    </span>
                  </td>

                  <td className="p-3 text-slate-300">
                    <div className="font-mono text-white">{lote.fecha}</div>
                    <div className="text-[10px] text-slate-500">{lote.turno}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-medium text-white">{lote.tipoProducto}</div>
                    <div className="text-[10px] text-slate-400">{lote.clienteDestino}</div>
                  </td>

                  <td className="p-3 text-right font-mono">
                    <div className="text-white font-medium">
                      {lote.cantidadTerminada.toLocaleString()} und
                    </div>
                    <div className="text-[10px] text-slate-500">
                      de {lote.cantidadPlanificada.toLocaleString()}
                    </div>
                  </td>

                  <td className="p-3 text-right font-mono">
                    <div className={`font-bold ${lote.mermaPorcentaje > 2.0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {lote.mermaPorcentaje}%
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {lote.mermaKilos} kg
                    </div>
                  </td>

                  <td className="p-3 text-center">
                    <span className="font-mono font-bold text-emerald-400">
                      {lote.verificar.porcentajeConformidadLote}%
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {lote.verificar.noConformidades.length} NC
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      lote.estadoLote === 'LIBERADO_CALIDAD' || lote.estadoLote === 'DESPACHADO'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : lote.estadoLote === 'EN_PROCESO'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {lote.estadoLote}
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setLoteDetalle(lote)}
                        title="Ver detalle del formato de caracterización"
                        className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                      >
                        Detalle
                      </button>

                      <button
                        onClick={() => onExportPdfLote(lote)}
                        title="Exportar PDF oficial de este lote"
                        className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                      >
                        <FileDown className="w-4 h-4" />
                      </button>

                      {!isActivo && (
                        <button
                          onClick={() => onSelectLoteAsActivo(lote)}
                          title="Cargar este lote como lote activo en la planta"
                          className="px-2 py-1 text-[11px] font-medium text-emerald-400 hover:text-white hover:bg-emerald-600 rounded transition-colors"
                        >
                          Cargar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Detailed View of Selected Batch */}
      {loteDetalle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-rose-400 block uppercase">
                  FORMATO CARACTERIZACIÓN SVP-09, 02-FR-001
                </span>
                <h3 className="text-base font-bold text-white">
                  Ficha Técnica Lote: {loteDetalle.codigoLote}
                </h3>
                <span className="text-xs text-slate-400">
                  {loteDetalle.tipoProducto} · {loteDetalle.clienteDestino} · Fecha: {loteDetalle.fecha}
                </span>
              </div>
              <button
                onClick={() => setLoteDetalle(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PHVA Summary Tabs/Sections in modal */}
            <div className="space-y-3 text-xs">
              
              {/* Planear */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-white text-xs block">1. PLANEAR</span>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>Demanda Archie's: {loteDetalle.planear.pronosticoArchiesUnidades} und</div>
                  <div>Demanda Aliados: {loteDetalle.planear.pronosticoAliadosUnidades} und</div>
                  <div>Presupuesto: ${(loteDetalle.planear.presupuestoAprobadoCOP / 1000000).toFixed(1)}M COP</div>
                  <div>Estado Gerencia: <strong className="text-emerald-400">{loteDetalle.planear.estadoAprobacionGerente}</strong></div>
                </div>
                {loteDetalle.planear.observacionesGerencia && (
                  <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                    Directriz: "{loteDetalle.planear.observacionesGerencia}"
                  </p>
                )}
              </div>

              {/* Hacer */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-white text-xs block">2. HACER (Parámetros Térmicos & Línea)</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300">
                  <div>Recepción: <span className="font-mono text-emerald-400">+{loteDetalle.hacer.tempRecepcionCarneC}°C</span></div>
                  <div>Molienda: <span className="font-mono text-amber-400">+{loteDetalle.hacer.tempMasaSalidaC}°C</span></div>
                  <div>Túnel IQF: <span className="font-mono text-sky-400">{loteDetalle.hacer.tempTunelIQFC}°C</span></div>
                  <div>Cámara: <span className="font-mono text-blue-400">{loteDetalle.hacer.tempCamaraAlmacenamientoC}°C</span></div>
                </div>
                <div className="pt-1 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800">
                  <span>Peso Diana: {loteDetalle.hacer.pesoDianaGramas}g (Real: {loteDetalle.hacer.pesoPromedioMuestreadoGramas}g)</span>
                  <span>Cadencia: {loteDetalle.hacer.cadenciaUnidadesHora} und/h</span>
                </div>
              </div>

              {/* Verificar */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-white text-xs block">3. VERIFICAR (Calidad e Inspección)</span>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>Sensorial/Textura: {loteDetalle.verificar.inspeccionVisualSaborTextura}</div>
                  <div>Conformidad: <strong className="text-emerald-400">{loteDetalle.verificar.porcentajeConformidadLote}%</strong></div>
                  <div>No Conformidades: {loteDetalle.verificar.noConformidades.length}</div>
                  <div>Costo Unitario Real: ${loteDetalle.verificar.costoRealUnitarioCOP} COP</div>
                </div>
              </div>

              {/* Actuar */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-white text-xs block">4. ACTUAR (Mejora Continua)</span>
                <p className="text-slate-300 text-[11px]">
                  Estandarización: {loteDetalle.actuar.estandarizacionSiguienteCiclo}
                </p>
                <div className="text-[10px] text-slate-500">
                  Acciones CAPA registradas: {loteDetalle.actuar.accionesCorrectivas.length}
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => onExportPdfLote(loteDetalle)}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Exportar este Lote a PDF</span>
              </button>

              <button
                onClick={() => {
                  onSelectLoteAsActivo(loteDetalle);
                  setLoteDetalle(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cargar en Planta Activa
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
