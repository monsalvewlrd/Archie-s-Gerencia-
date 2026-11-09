export type CicloEtapa = 'PLANEAR' | 'HACER' | 'VERIFICAR' | 'ACTUAR';

export type EstadoAprobacion = 'APROBADO' | 'PENDIENTE' | 'AJUSTES_REQUERIDOS' | 'RECHAZADO';

export type Prioridad = 'ALTA' | 'MEDIA' | 'ESTRATEGICA';

export interface ParametrosPlanear {
  pronosticoArchiesUnidades: number;
  pronosticoAliadosUnidades: number;
  capacidadInstaladaUnidades: number;
  inventarioDisponibleCarneKg: number;
  inventarioEmpaquesUnidades: number;
  presupuestoAprobadoCOP: number;
  fechaEntregaRequerida: string;
  estadoAprobacionGerente: EstadoAprobacion;
  firmaGerenteGeneral: string | null;
  fechaFirma: string | null;
  observacionesGerencia: string;
}

export interface ParametrosHacer {
  // 1. Recepción y verificación
  proveedorCarne: string;
  tempRecepcionCarneC: number; // <= 4.0°C
  loteCarneProveedor: string;
  guiaSanitariaInvima: string;
  actaRecepcionFirmada: boolean;
  estadoMateriaPrima: 'CONFORME' | 'OBSERVADO' | 'RECHAZADO';
  
  // 2. Molienda y mezclado
  tempMasaSalidaC: number; // <= 7.0°C
  tiempoMezcladoMinutos: number;
  dosificacionCondimentosArchies: boolean;
  homogeneidadGrasaPct: number;
  cumplimientoBpmEpp: boolean;

  // 3. Formado de hamburguesas
  tipoHamburguesa: 'Clásica 150g' | 'Angus Gourmet 180g' | 'Kids 110g';
  pesoDianaGramas: number;
  pesoPromedioMuestreadoGramas: number;
  cadenciaUnidadesHora: number;
  unidadesMoldeadas: number;
  unidadesDescartadas: number;

  // 4. Congelación y Envasado
  tempTunelIQFC: number; // <= -30.0°C
  tempCamaraAlmacenamientoC: number; // <= -18.0°C
  selladoVacioHermetico: boolean;
  detectorMetalesAprobado: boolean;
  etiquetadoTrazabilidadLote: boolean;
}

export interface NoConformidad {
  id: string;
  fechaHora: string;
  etapaPHVA: CicloEtapa;
  subproceso: string;
  severidad: 'CRITICA' | 'MAYOR' | 'MENOR';
  descripcion: string;
  accionInmediata: string;
  responsable: string;
  estado: 'ABIERTA' | 'EN_TRATAMIENTO' | 'CERRADA';
}

export interface AccionCorrectiva {
  id: string;
  origenNoConformidadId: string;
  analisisCausaRaiz: string;
  accionCorrectiva: string;
  responsableImplementacion: string;
  fechaCompromiso: string;
  estado: 'PLANIFICADA' | 'EN_CURSO' | 'VERIFICADA';
  eficaciaVerificada: boolean;
}

export interface ParametrosVerificar {
  inspeccionVisualSaborTextura: 'EXCELENTE' | 'ACEPTABLE' | 'NO_CONFORME';
  desviacionGramajePromedioGramas: number;
  porcentajeConformidadLote: number;
  telemetriaEnRango: boolean;
  noConformidades: NoConformidad[];
  costoProyectadoUnitarioCOP: number;
  costoRealUnitarioCOP: number;
  actaInspeccionCalidadFirmada: boolean;
}

export interface ParametrosActuar {
  accionesCorrectivas: AccionCorrectiva[];
  planMejoraContinua: {
    id: string;
    titulo: string;
    descripcion: string;
    beneficioEsperado: string;
    aprobadoGerencia: boolean;
    fechaAprobacion?: string;
  }[];
  estandarizacionSiguienteCiclo: string;
  nuevasCapacitacionesProgramadas: string[];
}

export interface LoteProduccion {
  id: string;
  codigoLote: string;
  fecha: string;
  turno: string;
  coordinadorProduccion: string;
  auxiliarCalidad: string;
  clienteDestino: 'Restaurantes Archie\'s' | 'Clientes Aliados HORECA' | 'Mixto (Archie\'s + Aliados)';
  tipoProducto: 'Clásica 150g' | 'Angus Gourmet 180g' | 'Kids 110g';
  cantidadPlanificada: number;
  cantidadTerminada: number;
  mermaKilos: number;
  mermaPorcentaje: number;
  estadoLote: 'EN_PROCESO' | 'LIBERADO_CALIDAD' | 'EN_CUARENTENA' | 'DESPACHADO';
  planear: ParametrosPlanear;
  hacer: ParametrosHacer;
  verificar: ParametrosVerificar;
  actuar: ParametrosActuar;
}

export interface ModuloSistema {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: 'ISO 9001' | 'Automatización' | 'Analítica' | 'Operaciones';
  instalado: boolean;
  esencial: boolean;
  icono: string;
}

export interface RecomendacionAutomatizacion {
  id: string;
  titulo: string;
  etapaPHVA: CicloEtapa;
  subproceso: string;
  descripcion: string;
  impactoEsperado: string;
  inversionEstimadaUSD: number;
  roiMeses: number;
  prioridad: Prioridad;
  estadoValidacion: EstadoAprobacion;
  requisitoISO: string;
  firmaGerenteGeneral?: string;
  fechaValidacion?: string;
  comentarioGerencia?: string;
}

export interface PrincipioAutomatizacion {
  nombre: string;
  descripcion: string;
  beneficio: string;
  normaVinculada?: string;
}

export interface TelemetriaPunto {
  tiempo: string;
  tempMolienda: number;
  tempTunelIQF: number;
  tempCamaraAlmacen: number;
  cadenciaRealUndH: number;
}

export interface OportunidadMejora {
  id: string;
  area: string;
  cuelloDeBotella: string;
  impactoMermaOCosto: string;
  solucionAutomatizada: string;
  nivelUrgencia: 'ALTA' | 'MEDIA' | 'ESTRATEGICA';
}

export interface OrdenCompra {
  id: string;
  proveedor: string;
  insumo: string;
  cantidad: string;
  montoCOP: number;
  certificacionSanitaria: string;
  estado: 'APROBADA_POR_GERENCIA' | 'PENDIENTE_VALIDACION' | 'EN_REVISION';
  fechaFirma?: string;
  firmaAutorizada?: string;
  observaciones?: string;
}

export interface DirectrizNormativa {
  id: string;
  codigo: string;
  norma: string;
  titulo: string;
  clausulaRequisito: string;
  estadoCumplimiento: 'CONFORME' | 'EN_EVALUACION' | 'SUPERVISADO';
  fechaAuditoria: string;
  auditorResponsable: string;
  evidenciaObjetiva: string;
}

export interface ProyectoTecnologicoGerencial {
  id: string;
  nombre: string;
  tecnologia: string;
  etapaPHVA: CicloEtapa;
  inversionUSD: number;
  roiMeses: number;
  impactoEstrategico: string;
  analisisRiesgo: string;
  requisitoISO: string;
  estado: 'APROBADO_GERENCIA' | 'EN_EVALUACION' | 'CONDICIONADO';
  fechaFirma?: string;
  firmaGerente?: string;
  observaciones?: string;
}


