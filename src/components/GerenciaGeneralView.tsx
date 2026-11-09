import React, { useState } from 'react';
import { 
  LoteProduccion, 
  DirectrizNormativa,
  ProyectoTecnologicoGerencial
} from '../types';
import { 
  Building2, 
  ShieldCheck, 
  FileCheck2, 
  CheckCircle2, 
  TrendingUp, 
  Cpu, 
  FileDown, 
  Check, 
  X, 
  Clock, 
  Scale, 
  ThermometerSnowflake, 
  Sparkles,
  ArrowRight,
  Shield,
  FileText,
  Activity,
  Layers,
  ChevronRight,
  Sliders,
  Users,
  Boxes,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';

interface GerenciaGeneralViewProps {
  lote: LoteProduccion;
  directrices: DirectrizNormativa[];
  proyectosTecnologicos?: ProyectoTecnologicoGerencial[];
  onUpdateLote: (updatedLote: LoteProduccion) => void;
  onUpdateProyectos?: (updated: ProyectoTecnologicoGerencial[]) => void;
  onExportPdf: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const GerenciaGeneralView: React.FC<GerenciaGeneralViewProps> = ({
  lote,
  directrices,
  proyectosTecnologicos = [],
  onUpdateLote,
  onUpdateProyectos,
  onExportPdf,
  onNavigateToTab,
}) => {
  // Modal states for executive actions
  const [showAprobarPlanModal, setShowAprobarPlanModal] = useState(false);
  const [showInversionesModal, setShowInversionesModal] = useState(false);
  const [showFichaCompletaModal, setShowFichaCompletaModal] = useState(false);

  // Active PHVA Tab for the characterization matrix (from SVP-09, 02-FR-001)
  const [faseMatrizActiva, setFaseMatrizActiva] = useState<'PLANEAR' | 'HACER' | 'VERIFICAR' | 'ACTUAR'>('PLANEAR');

  // Form states for Strategic Plan Approval
  const [nombreFirmante, setNombreFirmante] = useState('Brayan Estiven Monsalve');
  const [cargoFirmante, setCargoFirmante] = useState('Gerente General y Representante de la Dirección');
  const [observacionPlan, setObservacionPlan] = useState(
    lote.planear.observacionesGerencia || 'Plan de producción semanal y mensual aprobado por Gerencia General para cumplimiento de demanda en restaurantes Archie\'s y aliados externos bajo norma ISO 9001:2015.'
  );

  // Success notifications
  const [feedbackAccion, setFeedbackAccion] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackAccion(msg);
    setTimeout(() => setFeedbackAccion(null), 3500);
  };

  // Handler: Aprobar Plan Estratégico y de Producción
  const handleConfirmarAprobacionPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const ahora = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const updated: LoteProduccion = {
      ...lote,
      planear: {
        ...lote.planear,
        estadoAprobacionGerente: 'APROBADO',
        firmaGerenteGeneral: `${nombreFirmante} (${cargoFirmante})`,
        fechaFirma: ahora,
        observacionesGerencia: observacionPlan,
      },
    };

    onUpdateLote(updated);
    setShowAprobarPlanModal(false);
    showFeedback('Plan de producción semanal y mensual firmado y aprobado oficialmente por el Gerente General.');
  };

  // Handler: Aprobar Proyecto Tecnológico
  const handleAprobarProyecto = (id: string, dictamenCustom?: string) => {
    if (!onUpdateProyectos) return;
    const ahora = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updated = proyectosTecnologicos.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          estado: 'APROBADO_GERENCIA' as const,
          fechaFirma: ahora,
          firmaGerente: `${nombreFirmante} (Gerente General)`,
          observaciones: dictamenCustom || p.observaciones || 'Aprobado para implementación con alta prioridad estratégica.',
        };
      }
      return p;
    });

    onUpdateProyectos(updated);
    showFeedback(`Proyecto ${id} validado y aprobado por la Gerencia General.`);
  };

  // KPIs exactos requeridos por el usuario (OEE 87.4%, Cumplimiento 98.1%, Conformidad 99.1%)
  const oeePlanta = 87.4;
  const cumplimientoPlan = 98.1;
  const conformidadCalidad = 99.1;

  // MATRIZ DE CARACTERIZACIÓN ESTRICTA DEL DOCUMENTO SVP-09, 02-FR-001 (Versión 1)
  const matrizCaracterizacion = {
    PLANEAR: [
      {
        subproceso: 'Definir la demanda y cantidad de carnes hamburguesas preformadas producidas.',
        proveedores: {
          interno: 'Gerente General (dirección estratégica, validación de proyección), Coordinador de Producción (capacidad instalada y turnos), Auxiliar de Despacho (inventario de insumos y carne almacenada), Contabilidad (costos proyectados).',
          externo: 'Restaurantes Archie\'s, Restaurantes aliados externos, Sistema POS.'
        },
        entradas: 'Pronóstico de ventas, Pedidos de restaurantes Archie\'s y externos, Reportes históricos del sistema POS, Niveles de inventario disponibles, Capacidades de producción y almacenamiento, Excel avanzado con macros y Power BI.',
        salidas: 'Plan de producción semanal y mensual en Excel firmado por el Gerente General, Adquisición consolidada de materias primas (carne, empaques, condimentos), Reporte comparativo de ventas históricas vs. proyección (gráficas en PDF), Informe de capacidad instalada vs. demanda (en porcentajes y gráficos), Listado detallado de hamburguesas a producir por cliente (Archie\'s y externos).',
        clientes: {
          interno: 'Producción (ejecución del plan), Compras (planeación de abastecimiento), Calidad (planificación de controles), Contabilidad (validación de costos).',
          externo: 'Restaurantes Archie\'s, Restaurantes aliados externos.'
        }
      },
      {
        subproceso: 'Programar compras de carnes e insumos.',
        proveedores: {
          interno: 'Gerente General (autorización de compras), Coordinador de Producción (cantidades requeridas), Auxiliar Administrativo (gestión de órdenes de compra), Contabilidad (validación de costos y presupuesto).',
          externo: 'Ganaderías certificadas (carne), Proveedores de empaques y etiquetas, Proveedores de condimentos y aditivos, Empresas de transporte refrigerado.'
        },
        entradas: 'Plan de producción aprobado (documento firmado por Gerente General), Listado consolidado de insumos requeridos (Coordinador de Producción), Reporte de inventarios (Auxiliar de Despacho), Presupuesto aprobado (Contabilidad).',
        salidas: 'Órdenes de compra aprobadas y firmadas, Cronograma detallado de entregas de insumos, Contratos y convenios con proveedores certificados, Registro actualizado de proveedores (con certificaciones sanitarias vigentes), Informe de costos de abastecimiento, Plan de contingencia en caso de retrasos de proveedores.',
        clientes: {
          interno: 'Producción, Auxiliar de Despacho, Calidad.',
          externo: 'Proveedores (ejecutan órdenes de compra).'
        }
      },
      {
        subproceso: 'Establecer cronograma de producción.',
        proveedores: {
          interno: 'Coordinador de Producción (planificación de lotes), Auxiliar Administrativo (apoyo en horarios y turnos), Auxiliar de Despacho (inventarios), Gerente General (validación del cronograma).',
          externo: 'Empresas de transporte (para distribución posterior).'
        },
        entradas: 'Plan de producción aprobado, Reporte de disponibilidad de equipos y herramientas, Inventario de insumos disponibles, Listado de turnos de manipuladores y despachadores.',
        salidas: 'Cronograma de producción semanal y mensual firmado por el Coordinador, Turnos laborales asignados a manipuladores y despachadores, Agenda de lotes planificados (documento en Excel), Informe de capacidad operativa por turno, Reporte de disponibilidad de insumos para producción.',
        clientes: {
          interno: 'Manipuladores, Auxiliar de Calidad, Despachadores.',
          externo: 'Restaurantes Archie\'s, Restaurantes externos.'
        }
      },
      {
        subproceso: 'Determinar estándares de calidad y seguridad de alimentos.',
        proveedores: {
          interno: 'Auxiliar de Calidad (protocolos de inspección), Coordinador de Producción (ajuste de procesos), Asesor SST (condiciones seguras de trabajo), Manual de BPM interno, Registros de capacitaciones previas.',
          externo: 'Invima, Secretaría de Salud.'
        },
        entradas: 'Normas BPM (manual interno), Requisitos del Invima, Políticas internas de calidad, Reglamentos de SST.',
        salidas: 'Estándares de calidad documentados en manual interno, Protocolos de inspección y muestreo por lote, Instructivos impresos para manipuladores y despachadores, Checklists de control de procesos en planta, Registros de capacitación en BPM y SST, Informe de validación normativa ante entes externos.',
        clientes: {
          interno: 'Producción, Logística, Despacho.',
          externo: 'Restaurantes Archie\'s, Restaurantes externos, Consumidores finales.'
        }
      }
    ],
    HACER: [
      {
        subproceso: 'Recepción y verificación de materias primas.',
        proveedores: {
          interno: 'Coordinador de Producción (supervisión), Auxiliar Administrativo (órdenes de compra), Contabilidad (validación de facturas), Auxiliar de Despacho (espacio en cámaras de refrigeración).',
          externo: 'Ganaderías certificadas (carne), Proveedores de empaques y etiquetas, Proveedores de condimentos y aditivos, Empresas transportadoras.'
        },
        entradas: 'Órdenes de compra aprobadas (documento emitido por Auxiliar Administrativo y firmado por Gerente General), Cronograma de entregas de proveedores, Carne cruda certificada (guías de transporte y facturas), Condimentos, empaques y etiquetas, Certificados sanitarios de proveedores.',
        salidas: 'Acta de recepción firmada, Registros de control de calidad de insumos, Inventario actualizado en sistema, Facturas y soportes validados, Materia prima almacenada bajo condiciones seguras.',
        clientes: {
          interno: 'Producción, Coordinador de Producción, Auxiliar de Calidad.',
          externo: 'Proveedores (reciben retroalimentación de aceptación o rechazo).'
        }
      },
      {
        subproceso: 'Molienda y mezclado de carnes con condimentos.',
        proveedores: {
          interno: 'Coordinador de Producción (supervisión del proceso), Manipuladores (ejecución de molienda, mezclado y formado), Auxiliar de Calidad (monitoreo de inocuidad), Instructivos de BPM, Equipos de molienda y mezclado.',
          externo: 'Certificaciones sanitarias del proveedor de carne.'
        },
        entradas: 'Carne cruda almacenada, Condimentos, empaques y etiquetas, Plan de producción semanal, Protocolos de calidad e inocuidad (BPM), Uso de EPP por manipuladores.',
        salidas: 'Lotes de carne molida y mezclada listos para formado, Registros de control en proceso (peso, temperatura, gramaje), Informe diario de producción parcial, Verificación de cumplimiento de BPM.',
        clientes: {
          interno: 'Manipuladores (para siguiente etapa de formado), Auxiliar de Calidad, Coordinador de Producción.',
          externo: 'Ninguno directo (es etapa interna del proceso).'
        }
      },
      {
        subproceso: 'Formado de hamburguesas con peso estandarizado.',
        proveedores: {
          interno: 'Manipuladores (formado y empaque), Auxiliar de Calidad (control de gramaje y peso por unidad), Coordinador de Producción (validación de volúmenes), Equipos de formado y empacado.',
          externo: 'Proveedores de empaques y etiquetas.'
        },
        entradas: 'Carne procesada (molida y mezclada), Moldes de hamburguesas, Empaques y etiquetas, Plan de lotes programados, Etiquetas con código de trazabilidad.',
        salidas: 'Hamburguesas empacadas y etiquetadas por lote, Registro de control de gramaje y peso, Informe de lotes terminados y trazabilidad, Productos listos para almacenamiento.',
        clientes: {
          interno: 'Despachadores, Auxiliar de Despacho, Logística.',
          externo: 'Ninguno directo (es etapa interna).'
        }
      },
      {
        subproceso: 'Congelación del producto y envasado / Almacenamiento y refrigeración.',
        proveedores: {
          interno: 'Auxiliar de Despacho (organiza cámaras y actualiza inventarios), Auxiliar de Calidad (control de temperatura y condiciones), Coordinador de Producción (verificación de volúmenes), Cámaras de refrigeración y congelación, Sistemas internos de inventario.',
          externo: 'Normativa sanitaria vigente (Invima, Secretaría de Salud), Proveedores de energía, Proveedores de empaques.'
        },
        entradas: 'Producto listo para congelar / Carne procesada, Hamburguesas empacadas y etiquetadas, Informe de lotes terminados, Cámaras de refrigeración y congelación, Protocolos de almacenamiento, Material de empaque.',
        salidas: 'Carne congelada empacada, Inventario de productos terminados actualizado en sistema, Registros de control de temperatura, Informe de condiciones de almacenamiento, Producto terminado disponible para despacho.',
        clientes: {
          interno: 'Despachadores, Logística, Coordinador de Producción.',
          externo: 'Restaurantes Archie\'s (reciben producto posteriormente), Restaurantes externos, Distribuidores.'
        }
      }
    ],
    VERIFICAR: [
      {
        subproceso: 'Verificación integral del proceso y producto terminado.',
        proveedores: {
          interno: 'Auxiliar de Calidad (checklists de inspección), Coordinador de Producción (reportes de cumplimiento de lotes), Auxiliar de Despacho (informes de inventario final), Manipuladores (registros de procesos en ejecución), Asesor SST (verificación de condiciones seguras e higiénicas), Contabilidad (costos de producción), Cámaras de refrigeración, Manual BPM.',
          externo: 'Clientes externos (comentarios sobre calidad percibida), Proveedores de empaques (resistencia y funcionalidad), Entes de control (Invima, Secretaría de Salud).'
        },
        entradas: 'Lotes de hamburguesas terminados, Reportes diarios de producción, Registros de control en proceso (peso, gramaje, temperatura, higiene), Checklists de BPM y SST, Inventarios finales de producto terminado, Retroalimentación inicial de clientes internos, Normativa sanitaria.',
        salidas: 'Acta de inspección final por lote (Auxiliar de Calidad), Reporte de verificación de sabor, gramaje, textura y apariencia, Registro de control de higiene y EPP, Informe de temperaturas de proceso y cámaras de almacenamiento, Checklists firmados de BPM y SST, Reporte de empaques y etiquetas validadas, Informe de cumplimiento del plan de producción (Coordinador de Producción), Reporte de inventarios finales de producto terminado, Informe financiero comparativo (costos reales vs proyectados), Consolidado de no conformidades y acciones preventivas.',
        clientes: {
          interno: 'Gerente General (para decisiones estratégicas), Coordinador de Producción (para ajustes en procesos), Auxiliar de Calidad (para retroalimentación de control), Contabilidad (para ajustes presupuestales), Logística y Despachadores (para programar entregas).',
          externo: 'Restaurantes Archie\'s (producto validado), Restaurantes externos (producto validado), Consumidores finales (hamburguesas con calidad garantizada), Entes reguladores (Invima, Secretaría de Salud en auditorías).'
        }
      },
      {
        subproceso: 'Control de higiene y manipulación & Verificar la temperatura de los equipos.',
        proveedores: {
          interno: 'Auxiliar de Calidad, Coordinador de Producción, Operarios.',
          externo: 'Entidades sanitarias (Invima).'
        },
        entradas: 'Registros de temperatura continua, Checklists de higiene y EPP, Sondas termométricas en molienda y túnel IQF.',
        salidas: 'Registro de temperatura conforme, Informe de control de calidad avalado, Protocolo de inocuidad validado.',
        clientes: {
          interno: 'Calidad, Gerencia General, Producción.',
          externo: 'Entidades regulatorias, Clientes.'
        }
      }
    ],
    ACTUAR: [
      {
        subproceso: 'Corregir fallas detectadas.',
        proveedores: {
          interno: 'Auxiliar de Calidad (reportes de fallas de calidad e higiene), Coordinador de Producción (informes de incumplimiento de cronograma), Auxiliar de Despacho (registros de inventarios afectados), Contabilidad (variaciones de costos), Asesor SST (fallas en seguridad o higiene), Manipuladores y despachadores.',
          externo: 'Clientes (quejas o reclamos por producto recibido), Invima o Secretaría de Salud (observaciones regulatorias).'
        },
        entradas: 'Reportes de no conformidades de Verificar (gramaje, sabor, higiene, temperatura, empaques), Actas de inspección y retroalimentación de clientes, Informes de costos reales vs. planificados.',
        salidas: 'Registro de acciones correctivas ejecutadas, Informe de causas identificadas y solución aplicada, Ajustes inmediatos en lotes afectados, Comunicación de acciones correctivas a clientes externos (si aplica), Proceso mejorado.',
        clientes: {
          interno: 'Producción, Calidad, Contabilidad, Gerente General.',
          externo: 'Restaurantes Archie\'s, Restaurantes aliados externos, Consumidores finales (cuando se hace retiro de producto).'
        }
      },
      {
        subproceso: 'Plan de mejora continua (prevención y optimización), Capacitar al personal y Estandarizar.',
        proveedores: {
          interno: 'Gerente General (dirección de mejoras estratégicas), Coordinador de Producción (ajustes en procesos), Auxiliar de Calidad (actualización de protocolos de control), Asesor SST (nuevos planes de higiene y seguridad), Contabilidad (análisis de costos de mejora), Auxiliar Administrativo (soporte documental).',
          externo: 'Clientes externos (sugerencias de mejora), Entes reguladores (recomendaciones normativas), Proveedores de insumos (nuevas opciones de carne, empaques, aditivos).'
        },
        entradas: 'Consolidado de no conformidades recurrentes, Retroalimentación de clientes externos, Informes de producción, calidad y costos, Auditorías internas y externas.',
        salidas: 'Plan de mejora continua documentado y aprobado por Gerente General, Nuevos registros de capacitación de personal, Protocolos de calidad e inocuidad actualizados, Checklists y formatos mejorados, Informe consolidado de mejoras aplicadas, Reporte de satisfacción de clientes después de mejoras, Estandarización de mejoras para el próximo ciclo.',
        clientes: {
          interno: 'Producción, Calidad, Logística, Contabilidad, Dirección (Gerente General).',
          externo: 'Restaurantes Archie\'s, Restaurantes aliados externos, Consumidores finales (reciben productos con calidad mejorada), Entes reguladores (validan cumplimiento normativo).'
        }
      }
    ]
  };

  return (
    <div className="space-y-6">
      
      {/* ======================================================== */}
      {/* 1. ENCABEZADO INSTITUCIONAL DE GERENCIA GENERAL          */}
      {/* ======================================================== */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 shadow-sm space-y-5">
        
        {/* Top Company Title & Subtitle explaining Gerente General's Role in ISO 9001 and PHVA */}
        <div className="space-y-2 border-b border-slate-800/80 pb-4">
          <div className="flex flex-wrap items-center justify-end gap-2">
            {/* Location & Period Indicator */}
            <div className="px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
              <span className="font-semibold text-white">Bello, Antioquia</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-blue-300">Período Operativo Noviembre 2026</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            ARCHIE'S PRODUCTOS CÁRNICOS S.A.S.
          </h1>

          <div className="text-xs text-emerald-300 font-mono font-medium">
            PROCESO MISIONAL, GESTIÓN DE PRODUCCIÓN DE CARNES PREFORMADAS (SUBPROCESO: CONGELACIÓN Y ENVASADO ARCHIE'S)
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
            Como <strong className="text-white">Gerente General y Representante de la Dirección</strong>, lidero las decisiones de dirección estratégica en la <strong className="text-white">Gestión de Producción de Carnes Preformadas (ISO 9001)</strong> a través del <strong className="text-emerald-400">ciclo PHVA</strong>: valido las proyecciones y autorizo las compras de materias primas (<strong className="text-blue-300">Planear</strong>), aseguro la molienda, formado y congelación bajo barrera térmica (<strong className="text-blue-300">Hacer</strong>), recibo los informes de calidad y temperatura para decisiones estratégicas (<strong className="text-blue-300">Verificar</strong>) y apruebo los planes de mejora continua y estandarización (<strong className="text-blue-300">Actuar</strong>).
          </p>
        </div>

        {/* Executive Identification Card & Status Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          
          {/* Tarjeta de Identificación Superior */}
          <div className="p-4 rounded-xl bg-slate-950 border border-blue-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                CREDENCIAL DE DIRECCIÓN
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Dirección Estratégica
              </span>
            </div>

            <div>
              <div className="text-base font-bold text-white tracking-tight">
                Brayan Estiven Monsalve
              </div>
              <div className="text-xs text-blue-300 font-medium">
                Gerente General y Representante de la Dirección
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>NIT: 901.482.391-4</span>
              <span>Sede: Bello, Antioquia</span>
            </div>
          </div>

          {/* Dictamen del Plan y Supervisión PHVA */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              ESTADO DEL PLAN DE PRODUCCIÓN
            </span>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-sm font-bold text-white">
                  {lote.planear.estadoAprobacionGerente} por Gerencia
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Lote activo: {lote.codigoLote} ({lote.tipoProducto})
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between font-mono">
              <span>Capacidad: {lote.planear.capacidadInstaladaUnidades} und/turno</span>
              <span className="text-emerald-400 font-semibold">87.0% Ocupación</span>
            </div>
          </div>

          {/* Decisiones de Inversión Tecnológica */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              INVERSIÓN TECNOLÓGICA & ROI
            </span>

            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <div className="text-sm font-bold text-white">
                  {proyectosTecnologicos.filter(p => p.estado === 'APROBADO_GERENCIA').length} de {proyectosTecnologicos.length} Proyectos Validados
                </div>
                <div className="text-[11px] text-slate-400">
                  Formadora Servoasistida & Sensores IoT
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between font-mono">
              <span>Retorno Promedio: 5.5 meses</span>
              <span className="text-blue-300">ROI Operativo Alto</span>
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Action Feedback Notification */}
      {feedbackAccion && (
        <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{feedbackAccion}</span>
          </div>
          <button 
            onClick={() => setFeedbackAccion(null)}
            className="text-emerald-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. BOTONES DIRECTIVOS INTERACTIVOS MODERNOS              */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Botón 1: Aprobar Plan Estratégico */}
        <button
          onClick={() => setShowAprobarPlanModal(true)}
          className="group p-4 rounded-xl border border-slate-800 hover:border-emerald-500/50 bg-slate-900/60 hover:bg-slate-900 transition-all text-left flex items-center justify-between cursor-pointer"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
              DIRECCIÓN ESTRATÉGICA
            </span>
            <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Aprobar Plan Estratégico</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Validar capacidad nominal (25,000 und) y firmar digitalmente.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </button>

        {/* Botón 2: Decisiones de Inversión y Automatización */}
        <button
          onClick={() => setShowInversionesModal(true)}
          className="group p-4 rounded-xl border border-slate-800 hover:border-blue-500/50 bg-slate-900/60 hover:bg-slate-900 transition-all text-left flex items-center justify-between cursor-pointer"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
              TECNOLOGÍA & EFICIENCIA
            </span>
            <div className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Decisiones de Inversión y Automatización</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Validar Formadora Servoasistida, Sensores IoT y análisis de ROI.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </button>

        {/* Botón 3: Exportar Informe Gerencial PDF */}
        <button
          onClick={onExportPdf}
          className="group p-4 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 transition-all text-left flex items-center justify-between cursor-pointer"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              DOCUMENTO OFICIAL DIRECTIVO
            </span>
            <div className="text-sm font-bold text-white group-hover:text-white transition-colors flex items-center gap-1.5">
              <FileDown className="w-4 h-4 text-slate-300" />
              <span>Exportar Informe Gerencial PDF</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Descargar Archies_ISO9001_Reporte_Gerencial_{lote.codigoLote}.pdf firmado.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </button>

      </div>

      {/* ======================================================== */}
      {/* 3. INDICADORES DIRECTIVOS DE ALTO NIVEL (EXACTOS)        */}
      {/* ======================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Indicadores Directivos de Alto Nivel
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Supervisión Gerencial de Planta • Archie's Productos Cárnicos S.A.S.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: OEE Global de Planta (87.4%) */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                OEE Global de Planta
              </span>
              <Activity className="w-4 h-4 text-blue-400" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                {oeePlanta}%
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                Meta Directiva: ≥ 85.0%
              </span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Disponibilidad Operativa:</span>
                <span className="font-mono text-slate-200 font-medium">92.1% (Sin paradas no programadas)</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Rendimiento de Línea:</span>
                <span className="font-mono text-slate-200 font-medium">96.0% (Cadencia 3,200 und/h)</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Calidad de Primer Paso:</span>
                <span className="font-mono text-emerald-400 font-semibold">99.1% (Conforme sin reproceso)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Cumplimiento del Plan de Producción (98.1%) */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                Cumplimiento del Plan de Producción
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                {cumplimientoPlan}%
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                Meta Directiva: ≥ 95.0%
              </span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Volumen Real Producido:</span>
                <span className="font-mono text-white font-medium">
                  24,525 / 25,000 unidades elaboradas
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Restaurantes Archie's:</span>
                <span className="font-mono text-slate-300">
                  42 puntos abastecidos (100% SLA)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Reserva Operativa:</span>
                <span className="font-mono text-blue-300">
                  13.0% de holgura para fin de semana
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Conformidad de Calidad e Inocuidad (99.1%) */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
                Conformidad de Calidad e Inocuidad
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                {conformidadCalidad}%
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                Meta Directiva: ≥ 98.0%
              </span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Estándar de Gramaje:</span>
                <span className="font-mono text-slate-200 font-medium">
                  150g ± 1.8g (Dentro de tolerancia)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Inocuidad Microbiológica:</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  100% Negativo (Decreto 1500)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Control Térmico Crítico:</span>
                <span className="font-mono text-blue-300">
                  Túnel IQF: -34.8°C | Molienda: 5.4°C
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. FICHA TÉCNICA Y CARACTERIZACIÓN SVP-09, 02-FR-001    */}
      {/* ======================================================== */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Ficha Técnica de Caracterización del Proceso (SVP-09, 02-FR-001)
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Parámetros oficiales del formato de producción y congelación aprobado el 08/09/2025 bajo la norma ISO 9001:2015.
            </p>
          </div>
          <button
            onClick={() => setShowFichaCompletaModal(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 border border-slate-700"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Ver Ficha Institucional Completa</span>
          </button>
        </div>

        {/* Ficha Resumen con los datos exactos del documento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              OBJETIVO DEL PROCESO
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Terminar carnes de hamburguesa con estándares de calidad bajo la norma ISO 9001 con sabor e higiene preestablecidos; garantizar la conservación, inocuidad y calidad mediante congelación y empaque.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              ALCANCE DEL PROCESO
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Desde definir la demanda y cantidad de hamburguesas producidas, hasta estandarizar las mejoras para el próximo ciclo. Inicia con recepción de carne formada y finaliza con almacenamiento listo para distribución.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              LÍDER & COGESTORES
            </span>
            <div className="space-y-1 text-[11px]">
              <div className="text-white font-semibold">
                Líder: Coordinador de Producción
              </div>
              <div className="text-slate-400">
                Cogestores: Manipuladoras de alimentos, Auxiliar de bodega, Auxiliar de calidad, Auxiliar de despacho.
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              DIRECCIÓN ESTRATÉGICA
            </span>
            <div className="space-y-1 text-[11px]">
              <div className="text-white font-bold">
                Brayan Estiven Monsalve
              </div>
              <div className="text-blue-300 font-medium">
                Gerente General y Representante de la Dirección
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Aprobación de plan, compras y CAPA
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* 5. AUDITORÍA DEL CICLO PHVA (MATRIZ OFICIAL DEL DOCUMENTO)*/}
      {/* ======================================================== */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Matriz Oficial del Ciclo PHVA (Formato SVP-09, 02-FR-001)
            </h2>
            <p className="text-xs text-slate-400">
              Estructura formal de Entradas, Proveedores, Subprocesos, Salidas y Clientes según el formato institucional de Archie's.
            </p>
          </div>

          {/* Subtabs for PHVA */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['PLANEAR', 'HACER', 'VERIFICAR', 'ACTUAR'] as const).map((fase) => (
              <button
                key={fase}
                onClick={() => setFaseMatrizActiva(fase)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer ${
                  faseMatrizActiva === fase
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {fase}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Display of Subprocesses for the selected PHVA Phase */}
        <div className="space-y-3">
          {matrizCaracterizacion[faseMatrizActiva].map((item, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    SUBPROCESO {idx + 1}
                  </span>
                  <h3 className="font-bold text-sm text-white">
                    {item.subproceso}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-medium">
                  {faseMatrizActiva === 'PLANEAR' && 'Aprobación Gerencia General Requerida'}
                  {faseMatrizActiva === 'HACER' && 'Control de Inocuidad & Frío'}
                  {faseMatrizActiva === 'VERIFICAR' && 'Informe para Decisiones Estratégicas'}
                  {faseMatrizActiva === 'ACTUAR' && 'Mejora Continua & Estandarización'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Entradas & Proveedores */}
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-blue-300 font-semibold font-mono text-[11px]">
                    <Boxes className="w-3.5 h-3.5" />
                    <span>ENTRADAS Y PROVEEDORES</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <div>
                      <strong className="text-white block text-[10px] uppercase font-mono text-slate-400">Proveedores:</strong>
                      <span className="text-slate-300">{item.proveedores.interno}</span>
                      {item.proveedores.externo && (
                        <span className="text-slate-400 block mt-0.5">Externos: {item.proveedores.externo}</span>
                      )}
                    </div>
                    <div className="pt-1 border-t border-slate-800/60">
                      <strong className="text-white block text-[10px] uppercase font-mono text-slate-400">Entradas / Insumos:</strong>
                      <span className="text-slate-300">{item.entradas}</span>
                    </div>
                  </div>
                </div>

                {/* Salidas & Clientes */}
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-semibold font-mono text-[11px]">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>SALIDAS Y CLIENTES / USUARIOS</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <div>
                      <strong className="text-white block text-[10px] uppercase font-mono text-slate-400">Productos / Salidas:</strong>
                      <span className="text-slate-300">{item.salidas}</span>
                    </div>
                    <div className="pt-1 border-t border-slate-800/60">
                      <strong className="text-white block text-[10px] uppercase font-mono text-slate-400">Clientes:</strong>
                      <span className="text-slate-300">{item.clientes.interno}</span>
                      {item.clientes.externo && (
                        <span className="text-slate-400 block mt-0.5">Externos: {item.clientes.externo}</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>

      {/* ======================================================== */}
      {/* 6. DECISIONES DE INVERSIÓN Y AUTOMATIZACIÓN              */}
      {/* ======================================================== */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Decisiones de Inversión y Automatización (Aprobaciones Tecnológicas)
            </h2>
            <p className="text-xs text-slate-400">
              Evaluación y dictamen directivo de proyectos de modernización con análisis de ROI y retorno estratégico.
            </p>
          </div>
          <button
            onClick={() => setShowInversionesModal(true)}
            className="px-3 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800/50 border border-blue-700/50 text-blue-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Gestionar Decisiones Gerenciales</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {proyectosTecnologicos.map((proy) => {
            const isAprobado = proy.estado === 'APROBADO_GERENCIA';

            return (
              <div 
                key={proy.id}
                className={`p-4 rounded-xl border transition-all ${
                  isAprobado 
                    ? 'border-emerald-500/30 bg-slate-950/90' 
                    : 'border-slate-800 bg-slate-950/60'
                } space-y-3`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      {proy.id} • FASE PHVA: {proy.etapaPHVA}
                    </span>
                    <h3 className="text-sm font-bold text-white">
                      {proy.nombre}
                    </h3>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                    isAprobado
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {isAprobado ? 'APROBADO POR GERENCIA' : 'EN EVALUACIÓN'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {proy.impactoEstrategico}
                </p>

                {/* Directorial Key Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Inversión Tecnológica</span>
                    <span className="text-sm font-bold text-white">
                      ${proy.inversionUSD.toLocaleString()} USD
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Retorno Estratégico (ROI)</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {proy.roiMeses} Meses
                    </span>
                  </div>
                </div>

                {/* ISO & Governance badge */}
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500">
                    {proy.requisitoISO}
                  </span>
                  
                  {!isAprobado && (
                    <button
                      onClick={() => handleAprobarProyecto(proy.id)}
                      className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      <span>Aprobar Proyecto</span>
                    </button>
                  )}
                  {isAprobado && (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Firmado por Brayan Estiven Monsalve
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ======================================================== */}
      {/* 7. MARCO DE GOBERNANZA, STAKEHOLDERS Y NORMOGRAMA       */}
      {/* ======================================================== */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Directrices Normativas, Stakeholders y Recursos del Proceso
            </h2>
            <p className="text-xs text-slate-400">
              Marco legal e institucional oficial dispuesto en el documento SVP-09, 02-FR-001.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-semibold">
            Resolución 300 de 2015 (Política Cero Papel)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          {/* Stakeholders del documento */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-blue-300 font-bold font-mono text-[11px]">
              <Users className="w-4 h-4" />
              <span>STAKEHOLDERS (GRUPOS DE INTERÉS)</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 text-[11px] list-disc list-inside">
              <li><strong className="text-white">Gerencia General</strong> (Dirección estratégica y validación)</li>
              <li><strong className="text-white">Área de Producción</strong> (Líder: Coordinador de Producción)</li>
              <li><strong className="text-white">Área de Calidad</strong> (Auxiliar de calidad)</li>
              <li><strong className="text-white">Distribuidores y Logística</strong></li>
              <li><strong className="text-white">Reguladores y Entes de Control:</strong> Invima, Secretaría de Salud, Contraloría Distrital</li>
              <li><strong className="text-white">Proveedores:</strong> Internos y Externos</li>
              <li><strong className="text-white">Clientes:</strong> Restaurantes Archie's y Aliados externos</li>
            </ul>
          </div>

          {/* Recursos del Proceso */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold font-mono text-[11px]">
              <Boxes className="w-4 h-4" />
              <span>RECURSOS OFICIALES DEL PROCESO</span>
            </div>
            <div className="space-y-2 text-[11px] text-slate-300">
              <div>
                <strong className="text-white block font-mono text-[10px]">Recursos Humanos:</strong>
                <span>Operarios de producción, Supervisor de planta, Manipuladoras de alimentos, Auxiliar de calidad, Auxiliar de despacho.</span>
              </div>
              <div>
                <strong className="text-white block font-mono text-[10px]">Recursos Físicos:</strong>
                <span>Cámaras de congelación, Área de empaque, Línea de formado y molienda.</span>
              </div>
              <div>
                <strong className="text-white block font-mono text-[10px]">Recursos Tecnológicos:</strong>
                <span>Termómetros industriales, Selladoras de vacío hermético, Plataforma digital Cero Papel (Resolución 300 de 2015).</span>
              </div>
            </div>
          </div>

          {/* Normograma Oficial */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold font-mono text-[11px]">
              <FileCheck2 className="w-4 h-4" />
              <span>NORMOGRAMA APLICADO</span>
            </div>
            <div className="space-y-2 text-[11px] text-slate-300">
              <div>
                <strong className="text-white block font-mono text-[10px]">ISO 9001:2015:</strong>
                <span>Requisitos aplicados a los procesos de producción y gestión gerencial.</span>
              </div>
              <div>
                <strong className="text-white block font-mono text-[10px]">Resolución 300 de 2015:</strong>
                <span>Política de Cero Papel dispuesta por PIGA-SGA (uso preferente digital).</span>
              </div>
              <div>
                <strong className="text-white block font-mono text-[10px]">Resolución Invima 2674 de 2013 & Decreto 1500 de 2007:</strong>
                <span>Buenas prácticas de manufactura e inspección oficial sanitaria cárnica.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* MODAL 1: APROBAR PLAN ESTRATÉGICO Y DE PRODUCCIÓN        */}
      {/* ======================================================== */}
      {showAprobarPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-lg w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <FileCheck2 className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">
                  Aprobar Plan de Producción Semanal y Mensual (Excel)
                </h3>
              </div>
              <button 
                onClick={() => setShowAprobarPlanModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmarAprobacionPlan} className="space-y-4 text-xs">
              
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Lote a Ratificar</span>
                <div className="text-sm font-bold text-white">
                  {lote.codigoLote} — {lote.tipoProducto} ({lote.cantidadPlanificada.toLocaleString()} unidades)
                </div>
                <div className="text-[11px] text-slate-400">
                  Capacidad nominal utilizada: 87.0% con reserva de contingencia.
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nombre del Representante de la Dirección:
                </label>
                <input
                  type="text"
                  value={nombreFirmante}
                  onChange={(e) => setNombreFirmante(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Cargo Directivo:
                </label>
                <input
                  type="text"
                  value={cargoFirmante}
                  onChange={(e) => setCargoFirmante(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-medium focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Directriz y Observaciones de la Gerencia General:
                </label>
                <textarea
                  rows={3}
                  value={observacionPlan}
                  onChange={(e) => setObservacionPlan(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white leading-relaxed focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAprobarPlanModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/40"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Firmar y Emitir Aprobación</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: GESTIÓN DE DECISIONES DE INVERSIÓN & ROI        */}
      {/* ======================================================== */}
      {showInversionesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-3xl w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-blue-400">
                <Cpu className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">
                  Decisiones de Inversión y Automatización Tecnológica
                </h3>
              </div>
              <button 
                onClick={() => setShowInversionesModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Como Gerente General y Representante de la Dirección, evalúa cada proyecto de modernización tecnológica para la planta de carnes preformadas de Bello, Antioquia. Cada validación se certifica en el informe oficial ISO 9001:2015.
            </p>

            <div className="space-y-3">
              {proyectosTecnologicos.map((p) => {
                const isAprobado = p.estado === 'APROBADO_GERENCIA';

                return (
                  <div 
                    key={p.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-blue-400 font-semibold">
                          {p.id} • FASE PHVA: {p.etapaPHVA}
                        </span>
                        <div className="text-sm font-bold text-white">
                          {p.nombre}
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isAprobado 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {isAprobado ? 'APROBADO' : 'EN EVALUACIÓN'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Inversión:</span>
                        <span className="font-bold text-white">${p.inversionUSD.toLocaleString()} USD</span>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Retorno Estimado (ROI):</span>
                        <span className="font-bold text-emerald-400">{p.roiMeses} Meses</span>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Norma ISO:</span>
                        <span className="text-slate-300 text-[10px]">{p.requisitoISO.split('·')[0]}</span>
                      </div>
                    </div>

                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      <strong className="text-white">Impacto Estratégico:</strong> {p.impactoEstrategico}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <div className="text-[10px] text-slate-500 font-mono">
                        {p.firmaGerente ? `Validado por: ${p.firmaGerente}` : 'Pendiente de dictamen gerencial'}
                      </div>

                      {!isAprobado ? (
                        <button
                          onClick={() => handleAprobarProyecto(p.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Aprobar Inversión</span>
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Validado por Gerente General
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowInversionesModal(false)}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
              >
                Cerrar Panel de Decisiones
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: FICHA INSTITUCIONAL COMPLETA SVP-09, 02-FR-001  */}
      {/* ======================================================== */}
      {showFichaCompletaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-4xl w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  FORMATO CARACTERIZACIÓN DEL PROCESO DE PRODUCCIÓN
                </h3>
                <span className="text-xs font-mono text-emerald-400">
                  Código: SVP-09, 02-FR-001 · Versión: 1 · Fecha de Aprobación: 08/09/2025
                </span>
              </div>
              <button 
                onClick={() => setShowFichaCompletaModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Proceso:</span>
                  <div className="text-white font-bold text-sm">Gestión de producción de carnes preformadas</div>
                  <div className="text-slate-400 text-[11px] mt-1">Subproceso: Congelación y envasado Archie's</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Representación de la Dirección:</span>
                  <div className="text-white font-bold text-sm">Brayan Estiven Monsalve</div>
                  <div className="text-blue-300 text-[11px] mt-1">Gerente General y Representante de la Dirección</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Objetivo Institucional:</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Garantizar la conservación, inocuidad y calidad de la carne para hamburguesa mediante procesos adecuados de congelación y empaque. Terminar carnes de hamburguesa con estándares de calidad bajo la norma ISO 9001 con sabor, higiene preestablecidos.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Alcance del Proceso:</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Desde definir la demanda y cantidad de hamburguesas producidas, hasta estandarizar las mejoras para el próximo ciclo. Inicia con la recepción de la carne formada y finaliza con el almacenamiento del producto congelado listo para distribución.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Control de Cambios y Firmas Reglamentarias:</span>
                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] font-mono">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block">Proyectó:</span>
                    <strong className="text-white">Coordinador de Producción</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block">Revisó:</span>
                    <strong className="text-white">Área de Calidad ISO 9001</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block">Aprobó:</span>
                    <strong className="text-emerald-400">Brayan Estiven Monsalve (Gerente General)</strong>
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowFichaCompletaModal(false)}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
              >
                Cerrar Ficha
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
