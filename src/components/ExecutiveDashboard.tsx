import React from 'react';
import { 
  LoteProduccion, 
  TelemetriaPunto, 
  ModuloSistema 
} from '../types';
import { 
  Gauge, 
  TrendingUp, 
  CheckCircle2, 
  ThermometerSnowflake, 
  Flame, 
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Building,
  RefreshCw,
  Clock,
  Layers
} from 'lucide-react';

interface ExecutiveDashboardProps {
  lote: LoteProduccion;
  telemetria: TelemetriaPunto[];
  modulos: ModuloSistema[];
  onNavigateToPhva: (fase?: string) => void;
  onNavigateToAutomation: () => void;
  onSimulateTelemetryTick: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  lote,
  telemetria,
  modulos,
  onNavigateToPhva,
  onNavigateToAutomation,
  onSimulateTelemetryTick,
}) => {
  const isModuleActive = (id: string) => {
    const mod = modulos.find((m) => m.id === id);
    return mod ? mod.instalado : true;
  };

  // Real OEE calculation: Disponibilidad (94%) * Rendimiento (93.5%) * Calidad (99.1%)
  const disponibilidad = 94.2;
  const rendimiento = 93.6;
  const calidad = lote.verificar.porcentajeConformidadLote;
  const oeeGlobal = Number(((disponibilidad * rendimiento * calidad) / 10000).toFixed(1));

  const cumplimientoPlan = Number(
    ((lote.cantidadTerminada / lote.cantidadPlanificada) * 100).toFixed(1)
  );

  const puntoActual = telemetria[telemetria.length - 1] || {
    tiempo: 'En vivo',
    tempMolienda: lote.hacer.tempMasaSalidaC,
    tempTunelIQF: lote.hacer.tempTunelIQFC,
    tempCamaraAlmacen: lote.hacer.tempCamaraAlmacenamientoC,
    cadenciaRealUndH: lote.hacer.cadenciaUnidadesHora,
  };

  const totalDemanda = lote.planear.pronosticoArchiesUnidades + lote.planear.pronosticoAliadosUnidades;
  const porcentajeArchies = Math.round((lote.planear.pronosticoArchiesUnidades / totalDemanda) * 100);
  const porcentajeAliados = 100 - porcentajeArchies;
  const porcentajeCapacidadUtilizada = Math.round(
    (totalDemanda / lote.planear.capacidadInstaladaUnidades) * 100
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Contexto de Dirección General & Estado Normativo */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Planta Central de Preformados</span>
            <span aria-hidden="true">·</span>
            <span>Lote Activo: <strong className="text-white font-mono">{lote.codigoLote}</strong></span>
            <span aria-hidden="true">·</span>
            <span>{lote.tipoProducto}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">ISO 9001:2015 Vigente</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Panel de Control Estratégico · Gerencia General
          </h1>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-400">Estado Aprobación:</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {lote.planear.estadoAprobacionGerente}
            </span>
          </div>

          <button
            onClick={onSimulateTelemetryTick}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            title="Actualizar telemetría de sensores industriales"
          >
            <RefreshCw className="w-3 h-3 text-rose-400" />
            <span>Muestrear Sensores</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (Tabular numerals, disciplined 4-column layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: OEE Industrial */}
        {isModuleActive('mod-oee') && (
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-medium">OEE Global de Planta</span>
              <Gauge className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-white tracking-tight">
                {oeeGlobal}%
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +2.4%
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-3 text-[11px] font-mono text-slate-400">
              <div>
                <span className="block text-slate-500 text-[10px]">Disp.</span>
                <span>{disponibilidad}%</span>
              </div>
              <div>
                <span className="block text-slate-500 text-[10px]">Rend.</span>
                <span>{rendimiento}%</span>
              </div>
              <div>
                <span className="block text-slate-500 text-[10px]">Cal.</span>
                <span>{calidad}%</span>
              </div>
            </div>
          </div>
        )}

        {/* KPI 2: Cumplimiento de Plan de Producción */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium">Cumplimiento del Plan</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tracking-tight">
              {cumplimientoPlan}%
            </span>
            <span className="text-xs text-slate-400">
              Meta: 95%
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Producido:</span>
            <span className="font-mono text-white font-medium">
              {lote.cantidadTerminada.toLocaleString()} / {lote.cantidadPlanificada.toLocaleString()} und
            </span>
          </div>
        </div>

        {/* KPI 3: Conformidad de Calidad ISO 9001 */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium">Conformidad ISO 9001</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tracking-tight">
              {lote.verificar.porcentajeConformidadLote}%
            </span>
            <span className="text-xs text-emerald-400">Lote Conforme</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>No Conformidades:</span>
            <span className="font-mono text-white">
              {lote.verificar.noConformidades.length} registradas
            </span>
          </div>
        </div>

        {/* KPI 4: Merma Cárnica Actual */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-medium">Merma Cárnica de Línea</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tracking-tight">
              {lote.mermaPorcentaje}%
            </span>
            <span className="text-xs font-mono text-slate-400">
              ({lote.mermaKilos} kg)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Límite Tolerable:</span>
            <span className="font-mono text-amber-400 font-medium">≤ 2.0%</span>
          </div>
        </div>

      </div>

      {/* Middle Section: IoT Real-Time Telemetry & Demand Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: IoT Real-time Thermal Monitoring (2 columns) */}
        {isModuleActive('mod-telemetria') && (
          <div className="lg:col-span-2 p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Telemetría Industrial en Tiempo Real · Cadena de Frío
                </h2>
                <p className="text-xs text-slate-400">
                  Lecturas continuas de sondas PT100 en puntos críticos del formato SVP-09, 02-FR-001.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                <span>Último muestreo: {puntoActual.tiempo}</span>
              </div>
            </div>

            {/* Live Sensor Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Sensor 1: Molienda */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Masa Cárcnica (Molienda)</span>
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold font-mono ${puntoActual.tempMolienda > 7.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    +{puntoActual.tempMolienda.toFixed(1)}°C
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">límite ≤ 7.0°C</span>
                </div>
                <div className="mt-2 text-[10px] text-slate-400">
                  Estado: <strong className="text-white">Inocuidad Nominal</strong>
                </div>
              </div>

              {/* Sensor 2: Túnel Criogénico IQF */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Túnel de Congelación IQF</span>
                  <ThermometerSnowflake className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono text-sky-400">
                    {puntoActual.tempTunelIQF.toFixed(1)}°C
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">meta -35.0°C</span>
                </div>
                <div className="mt-2 text-[10px] text-slate-400">
                  Estado: <strong className="text-white">Congelación Ultrarrápida</strong>
                </div>
              </div>

              {/* Sensor 3: Cámara de Almacén */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Cámara Almacenamiento</span>
                  <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono text-blue-400">
                    {puntoActual.tempCamaraAlmacen.toFixed(1)}°C
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">límite ≤ -18.0°C</span>
                </div>
                <div className="mt-2 text-[10px] text-slate-400">
                  Estado: <strong className="text-white">Preservación Óptima</strong>
                </div>
              </div>
            </div>

            {/* History trend bar/sparkline simulation */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Registro Histórico Reciente de Temperatura de Proceso</span>
                <span className="font-mono text-[11px] text-slate-500">Muestreo a intervalos de 15 min</span>
              </div>
              <div className="h-28 w-full bg-slate-950 rounded-lg p-3 border border-slate-800 flex items-end gap-2">
                {telemetria.map((pt, i) => {
                  const moliendaHeight = Math.min(100, Math.max(20, (pt.tempMolienda / 8) * 100));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                      <div className="w-full flex items-end gap-1 h-20 justify-center">
                        {/* Masa molienda bar */}
                        <div 
                          style={{ height: `${moliendaHeight}%` }} 
                          className="w-2.5 bg-amber-500/80 rounded-t transition-all group-hover:bg-amber-400" 
                        />
                        {/* Túnel IQF bar */}
                        <div 
                          style={{ height: `${Math.min(100, Math.abs(pt.tempTunelIQF) * 2.2)}%` }} 
                          className="w-2.5 bg-sky-500/80 rounded-t transition-all group-hover:bg-sky-400" 
                        />
                      </div>
                      <span className="text-[9px] font-mono text-slate-500">{pt.tiempo}</span>
                      
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full mb-1 hidden group-hover:block z-20 p-2 bg-slate-900 border border-slate-700 rounded shadow-lg text-[10px] whitespace-nowrap font-mono text-white">
                        <div>Molienda: +{pt.tempMolienda}°C</div>
                        <div>Túnel: {pt.tempTunelIQF}°C</div>
                        <div>Cadencia: {pt.cadenciaRealUndH} u/h</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
                  Masa Cárnica Molienda
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 inline-block" />
                  Túnel Congelación IQF
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Right: Demand vs Capacity & Executive Decisions (1 column) */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-white">
              Demanda & Balance de Capacidad
            </h2>
            <p className="text-xs text-slate-400">
              Distribución de pedidos aprobados por Gerencia.
            </p>
          </div>

          {/* Demand split */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-rose-400" />
                Restaurantes Archie's ({porcentajeArchies}%)
              </span>
              <span className="font-mono text-white font-medium">
                {lote.planear.pronosticoArchiesUnidades.toLocaleString()} und
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-rose-600 h-full rounded-full transition-all"
                style={{ width: `${porcentajeArchies}%` }} 
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                Aliados HORECA Externos ({porcentajeAliados}%)
              </span>
              <span className="font-mono text-white font-medium">
                {lote.planear.pronosticoAliadosUnidades.toLocaleString()} und
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all"
                style={{ width: `${porcentajeAliados}%` }} 
              />
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Uso de Capacidad Instalada</span>
                <span className="font-mono font-bold text-white">{porcentajeCapacidadUtilizada}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    porcentajeCapacidadUtilizada > 90 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${porcentajeCapacidadUtilizada}%` }} 
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Capacidad total de planta: {lote.planear.capacidadInstaladaUnidades.toLocaleString()} und/turno
              </span>
            </div>
          </div>

          {/* Quick Action Buttons for General Manager */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider">
              ACCIONES DIRECTAS DE GERENCIA
            </span>
            <button
              onClick={() => onNavigateToPhva('PLANEAR')}
              className="w-full py-2 px-3 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Aprobar / Revisar Plan de Producción</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              onClick={onNavigateToAutomation}
              className="w-full py-2 px-3 text-xs font-semibold text-white bg-rose-600/90 hover:bg-rose-500 rounded-lg transition-colors flex items-center justify-between shadow-sm"
            >
              <span>Validar Recomendaciones de Automatización</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Bottom Section: PHVA Stage Progression Bar */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
        <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
          <span className="font-semibold text-white">Avance del Ciclo PHVA en el Lote Activo</span>
          <span>Norma ISO 9001:2015 · Código SVP-09, 02-FR-001</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          
          {/* Planear */}
          <div 
            onClick={() => onNavigateToPhva('PLANEAR')}
            className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-200">1. PLANEAR</span>
              <span className="text-[10px] font-mono text-emerald-400">Completado</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Pronósticos de demanda y compras aprobados por Gerencia.
            </p>
          </div>

          {/* Hacer */}
          <div 
            onClick={() => onNavigateToPhva('HACER')}
            className="p-3 rounded-lg bg-slate-950 border border-rose-500/30 hover:border-rose-500/60 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-white">2. HACER</span>
              <span className="text-[10px] font-mono text-rose-400">En Ejecución</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Recepción, molienda a &lt;7°C, formado y túnel IQF a -34.8°C.
            </p>
          </div>

          {/* Verificar */}
          <div 
            onClick={() => onNavigateToPhva('VERIFICAR')}
            className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-200">3. VERIFICAR</span>
              <span className="text-[10px] font-mono text-amber-400">Monitoreo</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Control de calidad, gramaje 150g ±2g y registro de NC.
            </p>
          </div>

          {/* Actuar */}
          <div 
            onClick={() => onNavigateToPhva('ACTUAR')}
            className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-200">4. ACTUAR</span>
              <span className="text-[10px] font-mono text-slate-400">Mejora</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Acciones correctivas CAPA y estandarización para el próximo ciclo.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
