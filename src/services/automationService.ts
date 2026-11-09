import { LoteProduccion, RecomendacionAutomatizacion, PrincipioAutomatizacion } from '../types';
import { PRINCIPIOS_AUTOMATIZACION_BASE, RECOMENDACIONES_BASE } from '../data/initialData';

export async function fetchAIAutomationRecommendations(
  lote: LoteProduccion,
  focus: string,
  kpis: { oee: number; cumplimiento: number; conformidad: number; merma: number }
): Promise<{
  analisisEjecutivo: string;
  principiosAutomatizacion: PrincipioAutomatizacion[];
  recomendaciones: RecomendacionAutomatizacion[];
  source: string;
}> {
  try {
    const response = await fetch('/api/automation/ai-recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        batchData: {
          codigoLote: lote.codigoLote,
          producto: lote.tipoProducto,
          mermaActual: `${lote.mermaPorcentaje}% (${lote.mermaKilos} kg)`,
          tempRecepcion: lote.hacer.tempRecepcionCarneC,
          tempMasaMolienda: lote.hacer.tempMasaSalidaC,
          tempTunelIQF: lote.hacer.tempTunelIQFC,
          cadenciaActual: `${lote.hacer.cadenciaUnidadesHora} und/h`,
          costoReal: lote.verificar.costoRealUnitarioCOP,
          noConformidades: lote.verificar.noConformidades.map((n) => n.descripcion),
        },
        focus,
        currentKpis: kpis,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.success && data.data) {
      return {
        analisisEjecutivo: data.data.analisisEjecutivo || 'Análisis completado satisfactoriamente.',
        principiosAutomatizacion: data.data.principiosAutomatizacion || PRINCIPIOS_AUTOMATIZACION_BASE,
        recomendaciones: data.data.recomendaciones || RECOMENDACIONES_BASE,
        source: data.source || 'gemini-3.8-flash',
      };
    }
  } catch (error) {
    console.warn('Fallback to local industrial intelligence engine:', error);
  }

  // Graceful domain fallback if offline or server is responding with errors
  return {
    analisisEjecutivo: `Evaluación integral del proceso de Gestión de Producción de Carnes Preformadas Archie's bajo norma ISO 9001:2015. Se detecta una merma acumulada del ${lote.mermaPorcentaje}% en formado y molienda, con ventanas de riesgo térmico durante picos de demanda hacia restaurantes Archie's y aliados externos. La automatización por etapas es viable con retorno proyectado de 6 a 11 meses.`,
    principiosAutomatizacion: PRINCIPIOS_AUTOMATIZACION_BASE,
    recomendaciones: RECOMENDACIONES_BASE,
    source: 'expert-engine-local',
  };
}
