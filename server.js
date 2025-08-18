/*
================================================================================
Backend con Node.js y Firebase Firestore

- CORRECCIÓN: Se ha añadido lógica para inicializar la base de datos
  con datos por defecto si esta se encuentra vacía. Esto soluciona el
  error 404 al cargar la aplicación por primera vez.
- ACTUALIZACIÓN: Se han cargado los datos del plan de estudios de Economía
  como los datos por defecto.
================================================================================
*/

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// --- CONFIGURACIÓN DE FIREBASE ---
let serviceAccount;
try {
    // Esta línea lee las credenciales desde la variable de entorno en Render
    serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
} catch (e) {
    console.error('Error al parsear FIREBASE_CREDENTIALS. Asegúrate de que esté configurada correctamente en Render.', e);
    process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const planDocRef = db.collection('curriculum').doc('mainPlan');
// ---------------------------------

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- Función para obtener los datos por defecto ---
const getDefaultData = () => {
  return {
    nombre: "Plan de Estudios de Economía 2024",
    facultad: "Económico - Administrativa",
    opcionProfesional: "Licenciatura en Economía",
    nivelEstudios: "Licenciatura",
    tituloOtorga: "Licenciado(a) en Economía",
    periodo: "2024",
    areaAcademica: "Económico - Administrativa",
    regionImparte: "Xalapa",
    sedeImparte: "Facultad de Economía",
    sistema: "Escolarizada",
    totalCreditosPlan: 441,
    totalCreditosGrado: 369,
    modalidadEducativa: "Escolarizada",
    estatus: "Aprobado",
    fechaElaboracion: new Date().toISOString().split('T')[0],
    areas: [
      { 
        nombre: 'Área de Formación Básica General (AFBG)', 
        materias: [
          { clave: 'AFBG01', nombre: 'Lectura y escritura de textos académicos', seriacion: null, acd: '', caracter: 'Ob', ht: 0, hp: 0, ho: 4, cr: 4, oe: 'O', rd: 'I', ma: 'CT', e: 'IeF', ca: 'Ob', af: 'AFB', aa: null, estatus: 'P' },
          { clave: 'AFBG02', nombre: 'Lengua I', seriacion: null, acd: '', caracter: 'Ob', ht: 0, hp: 0, ho: 6, cr: 4, oe: 'O', rd: 'I', ma: 'T', e: 'IeF', ca: 'Ob', af: 'AFB', aa: null, estatus: 'P' },
          { clave: 'AFBG03', nombre: 'Lengua II', seriacion: 'Lengua I', acd: '', caracter: 'Ob', ht: 0, hp: 0, ho: 6, cr: 4, oe: 'O', rd: 'I', ma: 'T', e: 'IeF', ca: 'Ob', af: 'AFB', aa: null, estatus: 'P' },
          { clave: 'AFBG04', nombre: 'Literacidad digital', seriacion: null, acd: '', caracter: 'Ob', ht: 0, hp: 0, ho: 6, cr: 4, oe: 'O', rd: 'I', ma: 'T', e: 'IeF', ca: 'Ob', af: 'AFB', aa: null, estatus: 'P' },
          { clave: 'AFBG05', nombre: 'Pensamiento crítico para la solución de problemas', seriacion: null, acd: '', caracter: 'Ob', ht: 0, hp: 0, ho: 4, cr: 4, oe: 'O', rd: 'I', ma: 'CT', e: 'IeF', ca: 'Ob', af: 'AFB', aa: null, estatus: 'P' },
        ],
        subAreas: []
      },
      { 
        nombre: 'Área de Formación Básica de Iniciación a la Disciplina (AFBID)',
        materias: [],
        subAreas: [
          {
            nombre: 'Métodos cuantitativos',
            materias: [
              { clave: 'AFBID01', nombre: 'Álgebra lineal', seriacion: null, acd: 'Métodos cuantitativos', caracter: 'Ob', ht: 3, hp: 3, ho: 0, cr: 9, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFB', aa: 'P', estatus: 'P' },
              { clave: 'AFBID02', nombre: 'Cálculo I', seriacion: null, acd: 'Métodos cuantitativos', caracter: 'Ob', ht: 3, hp: 3, ho: 0, cr: 9, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFB', aa: 'P', estatus: 'P' },
              { clave: 'AFBID07', nombre: 'Probabilidad', seriacion: null, acd: 'Métodos cuantitativos', caracter: 'Ob', ht: 2, hp: 4, ho: 0, cr: 8, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFB', aa: 'P', estatus: 'P' },
            ]
          },
          {
            nombre: 'Historia Económica',
            materias: [
              { clave: 'AFBID03', nombre: 'Historia Económica General', seriacion: null, acd: 'Historia Económica', caracter: 'Ob', ht: 2, hp: 4, ho: 0, cr: 8, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFB', aa: 'P', estatus: 'P' },
            ]
          },
          {
            nombre: 'Teoría económica',
            materias: [
              { clave: 'AFBID04', nombre: 'Introducción a la Economía', seriacion: null, acd: 'Teoría económica', caracter: 'Ob', ht: 3, hp: 3, ho: 0, cr: 9, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFB', aa: 'P', estatus: 'P' },
              { clave: 'AFBID06', nombre: 'Historia del Pensamiento Económico', seriacion: null, acd: 'Teoría económica', caracter: 'Ob', ht: 2, hp: 4, ho: 0, cr: 8, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFB', aa: 'P', estatus: 'P' },
            ]
          },
          {
            nombre: 'Investigación',
            materias: [
              { clave: 'AFBID05', nombre: 'Técnicas de investigación', seriacion: null, acd: 'Investigación', caracter: 'Ob', ht: 2, hp: 4, ho: 0, cr: 8, oe: 'O', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFB', aa: 'P', estatus: 'P' },
            ]
          }
        ]
      },
      { 
        nombre: 'Área de Formación Disciplinar (AFD)',
        materias: [],
        subAreas: [
            {
                nombre: 'Métodos cuantitativos',
                materias: [
                    { clave: 'AFD01', nombre: 'Análisis de Serie de Tiempo', seriacion: 'Econometría I', acd: 'Métodos cuantitativos', caracter: 'Ob', ht: 2, hp: 4, ho: 0, cr: 8, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                    { clave: 'AFD02', nombre: 'Cálculo II', seriacion: 'Cálculo I', acd: 'Métodos cuantitativos', caracter: 'Ob', ht: 3, hp: 3, ho: 0, cr: 9, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                    { clave: 'AFD05', nombre: 'Econometría I', seriacion: 'Estadística', acd: 'Métodos cuantitativos', caracter: 'Ob', ht: 2, hp: 4, ho: 0, cr: 8, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                    { clave: 'AFD06', nombre: 'Econometría II', seriacion: 'Econometría I', acd: 'Métodos cuantitativos', caracter: 'Ob', ht: 2, hp: 4, ho: 0, cr: 8, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                    { clave: 'AFD11', nombre: 'Estadística', seriacion: null, acd: 'Métodos cuantitativos', caracter: 'Ob', ht: 2, hp: 4, ho: 0, cr: 8, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                    { clave: 'AFD20', nombre: 'Modelos Dinámicos', seriacion: null, acd: 'Métodos cuantitativos', caracter: 'Ob', ht: 2, hp: 4, ho: 0, cr: 8, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                ]
            },
            {
                nombre: 'Teoría económica',
                materias: [
                    { clave: 'AFD03', nombre: 'Crecimiento Económico', seriacion: null, acd: 'Teoría económica', caracter: 'Ob', ht: 3, hp: 3, ho: 0, cr: 9, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                    { clave: 'AFD07', nombre: 'Economía Internacional I', seriacion: 'Microeconomía III', acd: 'Teoría económica', caracter: 'Ob', ht: 3, hp: 3, ho: 0, cr: 9, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                    { clave: 'AFD08', nombre: 'Economía Internacional II', seriacion: null, acd: 'Teoría económica', caracter: 'Ob', ht: 3, hp: 3, ho: 0, cr: 9, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                    { clave: 'AFD14', nombre: 'Macroeconomía I', seriacion: null, acd: 'Teoría económica', caracter: 'Ob', ht: 4, hp: 2, ho: 0, cr: 10, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                    { clave: 'AFD15', nombre: 'Macroeconomía II', seriacion: null, acd: 'Teoría económica', caracter: 'Ob', ht: 4, hp: 2, ho: 0, cr: 10, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                    { clave: 'AFD16', nombre: 'Macroeconomía III', seriacion: 'Macroeconomía II', acd: 'Teoría económica', caracter: 'Ob', ht: 4, hp: 2, ho: 0, cr: 10, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                    { clave: 'AFD17', nombre: 'Microeconomía I', seriacion: 'Cálculo I', acd: 'Teoría económica', caracter: 'Ob', ht: 4, hp: 2, ho: 0, cr: 10, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                    { clave: 'AFD18', nombre: 'Microeconomía II', seriacion: 'Cálculo I', acd: 'Teoría económica', caracter: 'Ob', ht: 4, hp: 2, ho: 0, cr: 10, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                    { clave: 'AFD19', nombre: 'Microeconomía III', seriacion: 'Microeconomía II', acd: 'Teoría económica', caracter: 'Ob', ht: 3, hp: 3, ho: 0, cr: 9, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                    { clave: 'AFD21', nombre: 'Organización Industrial', seriacion: null, acd: 'Teoría económica', caracter: 'Ob', ht: 2, hp: 4, ho: 0, cr: 8, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                ]
            },
            {
                nombre: 'Economía pública',
                materias: [
                    { clave: 'AFD04', nombre: 'Desarrollo Económico', seriacion: null, acd: 'Economía pública', caracter: 'Ob', ht: 3, hp: 3, ho: 0, cr: 9, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                    { clave: 'AFD12', nombre: 'Finanzas Públicas', seriacion: null, acd: 'Economía pública', caracter: 'Ob', ht: 3, hp: 3, ho: 0, cr: 9, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                    { clave: 'AFD22', nombre: 'Planeación, Programación y Presupuestación', seriacion: null, acd: 'Economía pública', caracter: 'Ob', ht: 2, hp: 4, ho: 0, cr: 8, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                    { clave: 'AFD23', nombre: 'Política Económica', seriacion: null, acd: 'Economía pública', caracter: 'Ob', ht: 2, hp: 4, ho: 0, cr: 8, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                ]
            },
            {
                nombre: 'Historia Económica',
                materias: [
                    { clave: 'AFD09', nombre: 'Economía Mexicana I', seriacion: null, acd: 'Historia Económica', caracter: 'Ob', ht: 2, hp: 4, ho: 0, cr: 8, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                    { clave: 'AFD10', nombre: 'Economía Mexicana II', seriacion: 'Economía Mexicana I', acd: 'Historia Económica', caracter: 'Ob', ht: 2, hp: 4, ho: 0, cr: 8, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                ]
            },
            {
                nombre: 'Empresa y vinculación',
                materias: [
                    { clave: 'AFD13', nombre: 'Formulación y Evaluación de Proyectos', seriacion: null, acd: 'Empresa y vinculación', caracter: 'Ob', ht: 2, hp: 2, ho: 0, cr: 6, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                    { clave: 'AFD24', nombre: 'Prácticas profesionales', seriacion: null, acd: 'Empresa y vinculación', caracter: 'Ob', ht: 2, hp: 2, ho: 180, cr: 12, oe: 'O', rd: 'I', ma: 'PP', e: 'M', ca: 'Ob', af: 'AFD', aa: 'M', estatus: 'P' },
                ]
            },
            {
                nombre: 'Investigación',
                materias: [
                    { clave: 'AFD25', nombre: 'Seminario de Investigación', seriacion: null, acd: 'Investigación', caracter: 'Ob', ht: 1, hp: 5, ho: 0, cr: 7, oe: 'O', rd: 'I', ma: 'S', e: 'IPA', ca: 'Ob', af: 'AFD', aa: 'P', estatus: 'P' },
                ]
            }
        ]
      },
      { 
        nombre: 'Área de Formación Terminal (AFT)',
        materias: [],
        subAreas: [
            {
                nombre: 'General',
                materias: [
                    { clave: 'AFT01', nombre: 'Servicio social', seriacion: null, acd: 'Empresa y vinculación', caracter: 'Ob', ht: 0, hp: 4, ho: 0, cr: 12, oe: 'O', rd: 'I', ma: 'VC', e: 'M', ca: 'Ob', af: 'AFT', aa: 'M', estatus: 'P' },
                    { clave: 'AFT02', nombre: 'Experiencia recepcional', seriacion: null, acd: 'Investigación', caracter: 'Ob', ht: 4, hp: 0, ho: 0, cr: 12, oe: 'O', rd: 'I', ma: 'I', e: 'IPA', ca: 'Ob', af: 'AFT', aa: 'M', estatus: 'P' },
                    { clave: 'AFT03', nombre: 'Acreditación de la lengua', seriacion: null, acd: '', caracter: 'Ob', ht: 0, hp: 0, ho: 0, cr: 6, oe: null, rd: null, ma: null, e: null, ca: 'Ob', af: 'AFT', aa: 'P', estatus: 'P' },
                ]
            },
            {
                nombre: 'Métodos cuantitativos',
                materias: [
                    { clave: 'AFT04', nombre: 'Análisis estadístico con software', seriacion: null, acd: 'Métodos cuantitativos', caracter: 'Ob', ht: 2, hp: 2, ho: 0, cr: 6, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFT', aa: 'P', estatus: 'P' },
                    { clave: 'AFT05', nombre: 'Análisis multivariado', seriacion: null, acd: 'Métodos cuantitativos', caracter: 'Op', ht: 2, hp: 2, ho: 0, cr: 6, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Op', af: 'AFT', aa: 'P', estatus: 'P' },
                    { clave: 'AFT18', nombre: 'Matemáticas para economistas', seriacion: null, acd: 'Métodos cuantitativos', caracter: 'Op', ht: 2, hp: 2, ho: 0, cr: 6, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Op', af: 'AFT', aa: 'P', estatus: 'P' },
                    { clave: 'AFT19', nombre: 'Teoría de juegos', seriacion: null, acd: 'Métodos cuantitativos', caracter: 'Op', ht: 2, hp: 2, ho: 0, cr: 6, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Op', af: 'AFT', aa: 'P', estatus: 'P' },
                ]
            },
            {
                nombre: 'Historia Económica',
                materias: [
                    { clave: 'AFT06', nombre: 'Demografía', seriacion: null, acd: 'Historia Económica', caracter: 'Op', ht: 2, hp: 2, ho: 0, cr: 6, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Op', af: 'AFT', aa: 'P', estatus: 'P' },
                ]
            },
            {
                nombre: 'Empresa y vinculación',
                materias: [
                    { clave: 'AFT07', nombre: 'Desarrollo de emprendedores', seriacion: null, acd: 'Empresa y vinculación', caracter: 'Op', ht: 2, hp: 2, ho: 0, cr: 6, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Op', af: 'AFT', aa: 'P', estatus: 'P' },
                    { clave: 'AFT12', nombre: 'Economía gerencial', seriacion: null, acd: 'Empresa y vinculación', caracter: 'Op', ht: 2, hp: 2, ho: 0, cr: 6, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Op', af: 'AFT', aa: 'P', estatus: 'P' },
                    { clave: 'AFT13', nombre: 'Economía de los mercados financieros', seriacion: null, acd: 'Empresa y vinculación', caracter: 'Op', ht: 2, hp: 2, ho: 0, cr: 6, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Op', af: 'AFT', aa: 'P', estatus: 'P' },
                    { clave: 'AFT17', nombre: 'Matemáticas financieras y portafolios', seriacion: null, acd: 'Empresa y vinculación', caracter: 'Op', ht: 2, hp: 2, ho: 0, cr: 6, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Op', af: 'AFT', aa: 'P', estatus: 'P' },
                ]
            },
            {
                nombre: 'Economía pública',
                materias: [
                    { clave: 'AFT08', nombre: 'Diseño y evaluación de políticas públicas', seriacion: null, acd: 'Economía pública', caracter: 'Op', ht: 2, hp: 2, ho: 0, cr: 6, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Op', af: 'AFT', aa: 'P', estatus: 'P' },
                    { clave: 'AFT15', nombre: 'Gerencia Pública y Gobernanza', seriacion: null, acd: 'Economía pública', caracter: 'Op', ht: 2, hp: 2, ho: 0, cr: 6, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Op', af: 'AFT', aa: 'P', estatus: 'P' },
                    { clave: 'AFT16', nombre: 'Hacienda Municipal', seriacion: null, acd: 'Economía pública', caracter: 'Op', ht: 2, hp: 2, ho: 0, cr: 6, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Op', af: 'AFT', aa: 'P', estatus: 'P' },
                ]
            },
            {
                nombre: 'Economía aplicada',
                materias: [
                    { clave: 'AFT09', nombre: 'Economía agrícola', seriacion: null, acd: 'Economía aplicada', caracter: 'Op', ht: 2, hp: 2, ho: 0, cr: 6, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Op', af: 'AFT', aa: 'P', estatus: 'P' },
                    { clave: 'AFT10', nombre: 'Economía ambiental', seriacion: null, acd: 'Economía aplicada', caracter: 'Op', ht: 2, hp: 2, ho: 0, cr: 6, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Op', af: 'AFT', aa: 'P', estatus: 'P' },
                    { clave: 'AFT11', nombre: 'Economía de la salud', seriacion: null, acd: 'Economía aplicada', caracter: 'Op', ht: 2, hp: 2, ho: 0, cr: 6, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Op', af: 'AFT', aa: 'P', estatus: 'P' },
                    { clave: 'AFT14', nombre: 'Economía regional', seriacion: null, acd: 'Economía aplicada', caracter: 'Op', ht: 2, hp: 2, ho: 0, cr: 6, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Op', af: 'AFT', aa: 'P', estatus: 'P' },
                ]
            }
        ]
      },
      { 
        nombre: 'Área de Formación de Elección Libre (AFEL)', 
        materias: [
            { clave: 'AFEL01', nombre: 'Optativa de Elección Libre', seriacion: null, acd: '', caracter: 'Op', ht: 0, hp: 0, ho: 0, cr: 18, oe: null, rd: null, ma: null, e: null, ca: 'Op', af: 'AFEL', aa: null, estatus: 'P' },
        ],
        subAreas: []
      }
    ]
  };
};


// --- Lógica de la API con Firestore ---

app.get('/api/plan-de-estudios', async (req, res) => {
  try {
    const doc = await planDocRef.get();
    if (!doc.exists) {
      console.log('Documento no encontrado. Creando con datos por defecto...');
      const defaultData = getDefaultData();
      await planDocRef.set(defaultData);
      console.log('Documento creado exitosamente.');
      return res.status(200).json(defaultData);
    }
    res.status(200).json(doc.data());
  } catch (error) {
    console.error("Error obteniendo el plan de estudios:", error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

app.put('/api/plan-de-estudios/full', async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ message: 'No se recibieron datos.' });
    }
    await planDocRef.set(data, { merge: true });
    res.status(200).json({ message: 'Plan de estudios actualizado exitosamente.' });
  } catch (error) {
    console.error("Error actualizando el plan:", error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

app.put('/api/plan-de-estudios', async (req, res) => {
    try {
        const updatedMetadata = req.body;
        await planDocRef.set(updatedMetadata, { merge: true });
        const doc = await planDocRef.get();
        res.status(200).json(doc.data());
    } catch (error) {
        console.error("Error actualizando metadatos del plan:", error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});


// === Iniciar el servidor ===
app.listen(port, () => {
  console.log(`🚀 Servidor API con Firestore corriendo en el puerto ${port}`);
});
