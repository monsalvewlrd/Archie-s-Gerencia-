import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Error initializing Gemini client:', err);
  }
}

// Fallback recommendations if Gemini API is unavailable or offline
function getExpertFallbackRecommendations(context: any) {
  return {
    analisisEjecutivo: `Evaluación integral del proceso de Gestión de Producción de Carnes Preformadas Archie's bajo norma ISO 9001:2015. Se detecta una merma acumulada del ${context?.mermaActual || '3.8%'} en formado y molienda, con ventanas de riesgo térmico durante picos de demanda hacia restaurantes Archie's y aliados externos. La automatización por etapas es viable con retorno proyectado de 6 a 11 meses.`,
    principiosAutomatizacion: [
      {
        nombre: 'Principio de EEAO (Eliminar, Estandarizar, Automatizar, Optimizar)',
        descripcion: 'Eliminar el pesaje y desmoldeo manual en hamburguesas de 150g/180g; estandarizar la receta de emulsión cárnica; automatizar la dosificación y formado continuo; optimizar el control térmico en tiempo real.',
        beneficio: 'Reducción de variabilidad de gramaje de ±6g a ±1.2g.'
      },
      {
        nombre: 'Principio de Integración de Procesos (ISA-88 / ISA-95)',
        descripcion: 'Enlazar la recepción de carne refrigerada (<4°C), la molienda a temperatura controlada (<7°C) y el túnel de congelación criogénica IQF (-35°C) con un sistema SCADA centralizado.',
        beneficio: 'Trazabilidad digital instantánea lote por lote requerida por Invima e ISO 9001.'
      },
      {
        nombre: 'Principio de Poka-Yoke y Detección Automática en Línea',
        descripcion: 'Incorporación de detector de metales trifrecuencia y célula de pesaje dinámico con descarte neumático automático para unidades fuera de tolerancia.',
        beneficio: 'Cero producto no conforme enviado a centros de distribución y clientes.'
      }
    ],
    recomendaciones: [
      {
        id: 'REC-AUTO-01',
        titulo: 'Formadora Rotativa Continua de Alta Cadencia con Alimentación Forzada',
        etapaPHVA: 'HACER',
        subproceso: 'Formado de hamburguesas con peso estandarizado',
        descripcion: 'Implementar celda de formado rotativo servo-asistida con tolva presurizada para moldes de 110g, 150g y 180g. Incluye sistema automático de colocación de papel separador biodegradable.',
        impactoEsperado: 'Aumento de capacidad de 1,200 a 3,600 und/h; reducción de merma cárnica al 0.8%.',
        inversionEstimadaUSD: 42000,
        roiMeses: 7.5,
        prioridad: 'ALTA',
        estadoValidacion: 'PENDIENTE',
        requisitoISO: 'Cláusula 8.5.1 Control de la producción y de la provisión del servicio'
      },
      {
        id: 'REC-AUTO-02',
        titulo: 'Telemetría IoT Criptosegura para Monitoreo Térmico Continuo en Molienda y Cámaras',
        etapaPHVA: 'VERIFICAR',
        subproceso: 'Control de temperatura de cámaras y masa cárnica',
        descripcion: 'Sensores PT100 industriales inalámbricos con registro continuo cada 30 segundos, alertas push por desviación térmica (>6.5°C en molienda o > -18°C en almacén) y bitácora criptográfica.',
        impactoEsperado: 'Inocuidad garantizada al 100%, eliminación de registros manuales en papel (política Cero Papel PIGA-SGA).',
        inversionEstimadaUSD: 8500,
        roiMeses: 3.8,
        prioridad: 'ALTA',
        estadoValidacion: 'PENDIENTE',
        requisitoISO: 'Cláusula 9.1 Seguimiento, medición, análisis y evaluación'
      },
      {
        id: 'REC-AUTO-03',
        titulo: 'Dosificador Gravimétrico Automático de Condimentos y Mezcla Archie\'s',
        etapaPHVA: 'HACER',
        subproceso: 'Molienda y mezclado de carnes con condimentos',
        descripcion: 'Células de carga de alta precisión para adición programada de condimentos secos y emulsionantes, reduciendo la dependencia de operarios en formulación secreta.',
        impactoEsperado: 'Consistencia de sabor 100% homogénea entre lotes de Archie\'s y marcas aliadas.',
        inversionEstimadaUSD: 16000,
        roiMeses: 9.2,
        prioridad: 'MEDIA',
        estadoValidacion: 'PENDIENTE',
        requisitoISO: 'Cláusula 8.5.2 Identificación y trazabilidad'
      },
      {
        id: 'REC-AUTO-04',
        titulo: 'Inspección Fin de Línea: Rayos X / Detector de Metales con Rechazador Neumático',
        etapaPHVA: 'VERIFICAR',
        subproceso: 'Inspección final de empaque y detección de extraños',
        descripcion: 'Sistema combinado de rayos X y control ponderal dinámico para validación de paquetes termosellados antes de ingresar a cámara de despacho final.',
        impactoEsperado: 'Riesgo de contaminación física reducido a cero; auditorías Invima con 100% de cumplimiento.',
        inversionEstimadaUSD: 28000,
        roiMeses: 11.0,
        prioridad: 'ALTA',
        estadoValidacion: 'PENDIENTE',
        requisitoISO: 'Cláusula 8.6 Liberación de los productos y servicios'
      },
      {
        id: 'REC-AUTO-05',
        titulo: 'Módulo Predictivo de Mantenimiento y Balance Dinámico Demanda-Capacidad',
        etapaPHVA: 'PLANEAR',
        subproceso: 'Plan de producción semanal y programación de compras',
        descripcion: 'Integración automática entre pedidos POS de Archie\'s y stock en cámaras para cálculo de lotes óptimos con amortiguador de seguridad.',
        impactoEsperado: 'Reducción de quiebres de stock en restaurantes del 6.2% al 0.4%.',
        inversionEstimadaUSD: 12000,
        roiMeses: 5.5,
        prioridad: 'MEDIA',
        estadoValidacion: 'PENDIENTE',
        requisitoISO: 'Cláusula 6.1 Acciones para abordar riesgos y oportunidades'
      }
    ]
  };
}

// API endpoint for AI-generated industrial automation principles & recommendations
app.post('/api/automation/ai-recommendations', async (req, res) => {
  try {
    const { batchData, focus, currentKpis } = req.body;

    if (!aiClient) {
      const fallback = getExpertFallbackRecommendations(batchData);
      return res.json({ success: true, source: 'expert-engine', data: fallback });
    }

    const prompt = `
Como experto en Automatización Industrial y Gestión de la Calidad ISO 9001:2015 en el sector de alimentos (específicamente producción de carnes preformadas y hamburguesas congeladas de Archie's, código SVP-09, 02-FR-001):
Analiza los datos actuales de la planta de producción:
- KPIs Actuales: ${JSON.stringify(currentKpis || {})}
- Lotes y Datos de Operación: ${JSON.stringify(batchData || {})}
- Área de enfoque prioritario: ${focus || 'Optimización Global OEE y Reducción de Mermas'}

Genera una respuesta en formato JSON estricto con las siguientes claves:
1. "analisisEjecutivo": resumen conciso de 3 a 4 oraciones dirigido al Gerente General con diagnóstico crítico de la línea actual.
2. "principiosAutomatizacion": arreglo de 3 objetos con {"nombre", "descripcion", "beneficio"} basados en metodologías como EEAO, Poka-Yoke, Industria 4.0 / SCADA, Automatización Flexible.
3. "recomendaciones": arreglo de 4 a 6 recomendaciones estratégicas de automatización industrial, cada una con:
   - "id": ej. "REC-AUTO-01"
   - "titulo": título claro de la solución técnica
   - "etapaPHVA": "PLANEAR" | "HACER" | "VERIFICAR" | "ACTUAR"
   - "subproceso": subproceso según el manual de caracterización (ej. "Recepción", "Molienda", "Formado", "Congelación IQF", "Inspección final")
   - "descripcion": descripción técnica industrial de la solución
   - "impactoEsperado": métrica cuantificable (merma %, OEE %, reducción de tiempos)
   - "inversionEstimadaUSD": número estimado en dólares
   - "roiMeses": meses estimados de retorno de inversión
   - "prioridad": "ALTA" | "MEDIA" | "ESTRATÉGICA"
   - "estadoValidacion": "PENDIENTE"
   - "requisitoISO": cláusula de ISO 9001:2015 vinculada
Devuelve ÚNICAMENTE el objeto JSON sin delimitadores de código markdown ni texto adicional.
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      // Clean possible wrapping
      const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    return res.json({ success: true, source: 'gemini-3.8-flash', data: parsedData });
  } catch (error) {
    console.error('Error generating automation recommendations:', error);
    // Fallback to high-quality domain engine
    const fallback = getExpertFallbackRecommendations(req.body?.batchData);
    return res.json({ success: true, source: 'expert-engine-fallback', data: fallback });
  }
});

// Setup Vite or static serving
async function setupApp() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

setupApp().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
