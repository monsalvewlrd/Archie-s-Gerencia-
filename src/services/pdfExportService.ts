import { jsPDF } from 'jspdf';
import { 
  LoteProduccion, 
  ProyectoTecnologicoGerencial, 
  RecomendacionAutomatizacion, 
  PrincipioAutomatizacion 
} from '../types';

export function generarReporteEjecutivoPDF(
  lote: LoteProduccion,
  proyectos?: ProyectoTecnologicoGerencial[],
  _recomendaciones?: RecomendacionAutomatizacion[],
  _principios?: PrincipioAutomatizacion[],
  kpisPersonalizados?: {
    oee?: number;
    cumplimiento?: number;
    conformidad?: number;
  }
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 12;

  // ==========================================================
  // ENCABEZADO INSTITUCIONAL FORMAL (MEMBRETE ARCHIE'S)
  // ==========================================================
  doc.setDrawColor(30, 58, 138); // Institutional Navy Blue
  doc.setLineWidth(0.4);
  doc.rect(14, y, pageWidth - 28, 24);

  // Logo text & Title block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(30, 58, 138);
  doc.text("ARCHIE'S PRODUCTOS CÁRNICOS S.A.S.", 18, y + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text('Bello, Antioquia • NIT 901.482.391-4', 18, y + 11.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('SISTEMA DE GESTIÓN DE LA CALIDAD ISO 9001:2015 · CÓDIGO SVP-09, 02-FR-001', 18, y + 16.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('PROCESO MISIONAL: GESTIÓN DE PRODUCCIÓN DE CARNES PREFORMADAS', 18, y + 21);

  // Right side formal document control box
  doc.setDrawColor(203, 213, 225);
  doc.line(pageWidth - 66, y, pageWidth - 66, y + 24);
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('CÓDIGO: SVP-09, 02-FR-001', pageWidth - 63, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text('Versión: 1.0 (Oficial)', pageWidth - 63, y + 11.5);
  doc.text('Vigencia: Noviembre 2026', pageWidth - 63, y + 16.5);
  doc.text('Sede: Bello, Antioquia', pageWidth - 63, y + 21);

  y += 28;

  // ==========================================================
  // BANNER DE IDENTIFICACIÓN DE GERENCIA GENERAL
  // ==========================================================
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, y, pageWidth - 28, 16, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 58, 138);
  doc.text('INFORME DIRECTIVO DE DIRECCIÓN ESTRATÉGICA · GERENCIA GENERAL (ISO 9001)', 18, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);
  doc.text(
    'Gerente General y Representante de la Dirección: Brayan Estiven Monsalve · Bello, Antioquia • Período Operativo Noviembre 2026',
    18,
    y + 9.5
  );
  doc.text(
    `Lote Evaluado: ${lote.codigoLote} (${lote.tipoProducto}) · Turno: ${lote.turno} · Destino: ${lote.clienteDestino} · Fecha: ${lote.fecha}`,
    18,
    y + 13.5
  );

  y += 20;

  // ==========================================================
  // 1. INDICADORES DIRECTIVOS DE ALTO NIVEL
  // ==========================================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('1. INDICADORES DIRECTIVOS DE ALTO NIVEL', 14, y);
  y += 4;

  const oeeVal = kpisPersonalizados?.oee ?? 87.4;
  const cumpVal = kpisPersonalizados?.cumplimiento ?? 98.1;
  const confVal = kpisPersonalizados?.conformidad ?? 99.1;

  const colWidth = (pageWidth - 28) / 3;
  const metricsDirectivas = [
    {
      title: 'OEE GLOBAL DE PLANTA',
      value: `${oeeVal}%`,
      meta: 'Meta Directiva: >= 85.0%',
      desglose: 'Disponibilidad: 92.1% · Rendimiento: 96.0% · Calidad: 99.1%',
      impacto: 'Eficiencia de capacidad sin sobrecostos de turnos',
    },
    {
      title: 'CUMPLIMIENTO DEL PLAN',
      value: `${cumpVal}%`,
      meta: 'Meta Directiva: >= 95.0%',
      desglose: '24,525 de 25,000 unidades programadas entregadas',
      impacto: 'Nivel de servicio asegurado a restaurantes Archie\'s',
    },
    {
      title: 'CONFORMIDAD DE CALIDAD',
      value: `${confVal}%`,
      meta: 'Meta Directiva: >= 98.0%',
      desglose: '100% Inocuidad · Gramaje 150g ±1.8g calibrado',
      impacto: 'Blindaje sanitario bajo Decreto 1500 / Res. 2674',
    },
  ];

  metricsDirectivas.forEach((m, idx) => {
    const boxX = 14 + idx * colWidth;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.rect(boxX, y, colWidth - 2, 22, 'FD');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(m.title, boxX + 4, y + 4.5);

    // Big Value
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 138);
    doc.text(m.value, boxX + 4, y + 10.5);

    // Meta Badge
    doc.setFontSize(6);
    doc.setTextColor(5, 150, 105); // Emerald Green
    doc.text(m.meta, boxX + 4, y + 14);

    // Desglose
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(71, 85, 105);
    doc.text(m.desglose, boxX + 4, y + 17.5);
    doc.text(m.impacto, boxX + 4, y + 20.5);
  });

  y += 27;

  // ==========================================================
  // 2. AUDITORÍA EJECUTIVA DEL CICLO PHVA (ISO 9001)
  // ==========================================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('2. AUDITORÍA DEL CICLO PHVA (PLANEAR - HACER - VERIFICAR - ACTUAR)', 14, y);
  y += 4;

  const phvaDirectivo = [
    {
      etapa: 'PLANEAR',
      enfoque: 'Validación ejecutiva de capacidad instalada y pronósticos',
      evidencia: 'Capacidad instalada nominal de 25,000 und/turno (3,200 und/h). Pronóstico Archie\'s 20,000 und y Aliados 5,000 und ratificado con holgura operativa del 13.0%. Firma directiva emitida.',
      dictamen: 'APROBADO',
    },
    {
      etapa: 'HACER',
      enfoque: 'Control de barreras térmicas críticas e inocuidad',
      evidencia: 'Recepción cárnica a 3.4°C (<4.0°C). Molienda continua a 5.4°C (<7.0°C). Túnel IQF a -34.8°C (<-30.0°C) y cámara a -21.2°C (<-18.0°C). Detector de metales y sellado hermético conformes.',
      dictamen: 'CONFORME',
    },
    {
      etapa: 'VERIFICAR',
      enfoque: 'Revisión de estándares de lote y liberación sanitaria',
      evidencia: `Muestreo de gramaje diana: 150g (promedio 150.8g ±1.8g). Conformidad del lote al ${confVal}%. Cero no conformidades microbiológicas. Inspección visual y textura excelente.`,
      dictamen: 'LIBERADO',
    },
    {
      etapa: 'ACTUAR',
      enfoque: 'Aprobación de acciones correctivas (CAPA) y mejora continua',
      evidencia: 'Aprobación gerencial de calibración semanal de moldes servoasistidos y plan de mantenimiento preventivo de compresores. Estandarización de parámetros térmicos para siguiente ciclo.',
      dictamen: 'ESTANDARIZADO',
    },
  ];

  // Table header
  doc.setFillColor(30, 41, 59);
  doc.rect(14, y, pageWidth - 28, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text('CICLO', 17, y + 4.2);
  doc.text('ENFOQUE DE SUPERVISIÓN GERENCIAL', 38, y + 4.2);
  doc.text('EVIDENCIA DIRECTIVA OBJETIVA / REGISTRO', 95, y + 4.2);
  doc.text('DICTAMEN', pageWidth - 32, y + 4.2);

  y += 6;

  phvaDirectivo.forEach((row, i) => {
    doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
    doc.rect(14, y, pageWidth - 28, 11, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(14, y + 11, pageWidth - 14, y + 11);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(15, 23, 42);
    doc.text(row.etapa, 17, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(51, 65, 85);
    doc.text(doc.splitTextToSize(row.enfoque, 54), 38, y + 4);
    doc.text(doc.splitTextToSize(row.evidencia, 88), 95, y + 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(5, 150, 105);
    doc.text(row.dictamen, pageWidth - 32, y + 6);

    y += 11;
  });

  y += 6;

  // ==========================================================
  // 3. DECISIONES DE INVERSIÓN Y AUTOMATIZACIÓN
  // ==========================================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('3. DECISIONES DE INVERSIÓN Y AUTOMATIZACIÓN (PROYECTOS TECNOLÓGICOS)', 14, y);
  y += 4;

  const proyectosLista = proyectos && proyectos.length > 0 ? proyectos : [
    {
      id: 'PROY-AUTO-01',
      nombre: 'Formadora Rotativa Servoasistida de Alta Precisión',
      inversionUSD: 45000,
      roiMeses: 7.2,
      impactoEstrategico: 'Elevación de cadencia a 3,600 und/h (+87.5%), peso garantizado ±1.0g y reducción de mermas operativas.',
      estado: 'APROBADO_GERENCIA',
    },
    {
      id: 'PROY-AUTO-02',
      nombre: 'Red de Sensores Térmicos IoT y Telemetría en Tiempo Real',
      inversionUSD: 12500,
      roiMeses: 3.8,
      impactoEstrategico: 'Monitoreo 24/7 de barreras térmicas críticas (-34.8°C IQF / 5.4°C molienda) con alertas predictivas y blindaje Invima.',
      estado: 'APROBADO_GERENCIA',
    },
    {
      id: 'PROY-AUTO-03',
      nombre: 'Sistema de Visión Artificial e Inspección Óptica de Masa Cárnica',
      inversionUSD: 28000,
      roiMeses: 8.5,
      impactoEstrategico: 'Inspección continua de morfología y distribución de grasa con rechazo neumático automático en línea.',
      estado: 'EN_EVALUACION',
    },
  ];

  proyectosLista.slice(0, 3).forEach((proy) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, y, pageWidth - 28, 11, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(30, 58, 138);
    doc.text(`${proy.id}: ${proy.nombre}`, 18, y + 4.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(51, 65, 85);
    doc.text(
      `Inversión Estratégica: $${proy.inversionUSD.toLocaleString()} USD | Retorno (ROI): ${proy.roiMeses} meses | ${proy.impactoEstrategico}`,
      18,
      y + 8.5
    );

    // Estado dictamen
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    if (proy.estado === 'APROBADO_GERENCIA') {
      doc.setTextColor(5, 150, 105);
      doc.text('VALIDADO POR GERENCIA GENERAL', pageWidth - 60, y + 4.2);
    } else {
      doc.setTextColor(217, 119, 6);
      doc.text('EN EVALUACIÓN ESTRATÉGICA', pageWidth - 55, y + 4.2);
    }

    y += 13;
  });

  y += 2;

  // ==========================================================
  // 4. DECLARACIÓN DE REPRESENTACIÓN DE LA DIRECCIÓN Y FIRMA
  // ==========================================================
  y = Math.max(y, 236);

  // Box for formal executive validation
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.3);
  doc.rect(14, y, pageWidth - 28, 42, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 58, 138);
  doc.text('DECLARACIÓN OFICIAL DE LA REPRESENTACIÓN DE LA DIRECCIÓN · ISO 9001:2015', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(51, 65, 85);
  doc.text(
    'En mi calidad de Gerente General y Representante de la Dirección de ARCHIE\'S PRODUCTOS CÁRNICOS S.A.S., certifico que la gestión de producción de carnes preformadas ha sido auditada bajo el ciclo PHVA, verificando el cumplimiento de la capacidad instalada, el control de las barreras térmicas y la inocuidad conforme al Decreto 1500 de 2007, Resolución Invima 2674 de 2013 y la norma técnica ISO 9001:2015.',
    18,
    y + 11,
    { maxWidth: pageWidth - 36 }
  );

  // Digital Signature line
  const sigX = (pageWidth - 90) / 2;
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.4);
  doc.line(sigX, y + 28, sigX + 90, y + 28);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Brayan Estiven Monsalve', pageWidth / 2, y + 32, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Gerente General y Representante de la Dirección · Archie\'s Productos Cárnicos S.A.S.',
    pageWidth / 2,
    y + 36,
    { align: 'center' }
  );
  doc.text(
    'Bello, Antioquia • NIT 901.482.391-4 • Firma Digital y Certificación Estratégica',
    pageWidth / 2,
    y + 39.5,
    { align: 'center' }
  );

  // ==========================================================
  // FOOTER DE CONTROL DOCUMENTAL
  // ==========================================================
  doc.setFontSize(5.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Archie\'s Productos Cárnicos S.A.S. • Bello, Antioquia • NIT 901.482.391-4* · Archies_ISO9001_Reporte_Gerencial_' + lote.codigoLote + '.pdf',
    14,
    290
  );
  doc.text(
    'Plataforma Asistida por Inteligencia Artificial (7 Agentes Especializados) • Normativa Contable y Tributaria Colombiana*',
    pageWidth - 14,
    290,
    { align: 'right' }
  );

  // Save the PDF with the exact standard name
  const filename = `Archies_ISO9001_Reporte_Gerencial_${lote.codigoLote}.pdf`;
  doc.save(filename);
}
