/*
================================================================================
Backend con Node.js y Firebase Firestore para Múltiples Planes

- REFACTORIZACIÓN: Se han modificado los endpoints para aceptar un ID de plan
  dinámico en la URL (ej. /api/plan-de-estudios/mi-plan-id).
- LÓGICA MEJORADA: El endpoint GET ahora crea un nuevo plan con datos por
  defecto si el ID solicitado no existe.
- CORRECCIÓN DE ENTORNO: Se ha añadido una lógica dual para cargar las
  credenciales de Firebase.
- DEBUG: Se ha añadido logging detallado para diagnosticar problemas de
  creación de documentos en el entorno de producción.
- CAMBIO (ID ÚNICO): Se añade un _id único a cada materia por defecto.
================================================================================
*/

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const crypto = require('crypto'); // Añadido para generar UUIDs

// --- CONFIGURACIÓN DE FIREBASE ---
let serviceAccount;

// Lógica para cargar credenciales según el entorno
// 1. Intenta cargar desde la variable de entorno (para producción en Render)
if (process.env.FIREBASE_CREDENTIALS) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
    } catch (e) {
        console.error('Error al parsear FIREBASE_CREDENTIALS. Asegúrate de que esté configurada correctamente en Render.', e);
        process.exit(1);
    }
} else {
    // 2. Si no existe, intenta cargar desde un archivo local (para desarrollo)
    try {
        serviceAccount = require('./serviceAccountKey.json');
    } catch (e) {
        console.error('Error al cargar el archivo "serviceAccountKey.json".');
        console.error('Para correr el servidor localmente, necesitas crear este archivo en la raíz del backend.');
        console.error('Obtén las credenciales desde tu proyecto de Firebase > Configuración del proyecto > Cuentas de servicio > Generar nueva clave privada.');
        process.exit(1);
    }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
// ---------------------------------

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- Función para obtener los datos por defecto ---
// CAMBIO: Se añade un _id único a cada materia usando crypto.randomUUID()
const getDefaultData = (planId) => {
  return {
    nombre: `Plan de Estudios (${planId})`,
    facultad: "Económico - Administrativa",
    opcionProfesional: `Licenciatura en (${planId})`,
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
          { _id: crypto.randomUUID(), clave: 'AFBG01', nombre: 'Lectura y escritura de textos académicos', seriacion: null, acd: '', caracter: 'Ob', ht: 0, hp: 0, ho: 4, cr: 4, oe: 'O', rd: 'I', ma: 'CT', e: 'IeF', ca: 'Ob', af: 'AFB', aa: null, estatus: 'P' },
          { _id: crypto.randomUUID(), clave: 'AFBG02', nombre: 'Lengua I', seriacion: null, acd: '', caracter: 'Ob', ht: 0, hp: 0, ho: 6, cr: 4, oe: 'O', rd: 'I', ma: 'T', e: 'IeF', ca: 'Ob', af: 'AFB', aa: null, estatus: 'P' },
          { _id: crypto.randomUUID(), clave: 'AFBG03', nombre: 'Lengua II', seriacion: 'Lengua I', acd: '', caracter: 'Ob', ht: 0, hp: 0, ho: 6, cr: 4, oe: 'O', rd: 'I', ma: 'T', e: 'IeF', ca: 'Ob', af: 'AFB', aa: null, estatus: 'P' },
          { _id: crypto.randomUUID(), clave: 'AFBG04', nombre: 'Literacidad digital', seriacion: null, acd: '', caracter: 'Ob', ht: 0, hp: 0, ho: 6, cr: 4, oe: 'O', rd: 'I', ma: 'T', e: 'IeF', ca: 'Ob', af: 'AFB', aa: null, estatus: 'P' },
          { _id: crypto.randomUUID(), clave: 'AFBG05', nombre: 'Pensamiento crítico para la solución de problemas', seriacion: null, acd: '', caracter: 'Ob', ht: 0, hp: 0, ho: 4, cr: 4, oe: 'O', rd: 'I', ma: 'CT', e: 'IeF', ca: 'Ob', af: 'AFB', aa: null, estatus: 'P' },
        ],
        subAreas: []
      },
      { 
        nombre: 'Área de Formación Básica de Iniciación a la Disciplina (AFBID)',
            materias: [
              { _id: crypto.randomUUID(), clave: 'AFBID01', nombre: 'Álgebra lineal', seriacion: null, acd: 'Métodos cuantitativos', caracter: 'Ob', ht: 3, hp: 3, ho: 0, cr: 9, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFB', aa: 'P', estatus: 'P' },
              { _id: crypto.randomUUID(), clave: 'AFBID02', nombre: 'Cálculo I', seriacion: null, acd: 'Métodos cuantitativos', caracter: 'Ob', ht: 3, hp: 3, ho: 0, cr: 9, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFB', aa: 'P', estatus: 'P' },
              { _id: crypto.randomUUID(), clave: 'AFBID07', nombre: 'Probabilidad', seriacion: null, acd: 'Métodos cuantitativos', caracter: 'Ob', ht: 2, hp: 4, ho: 0, cr: 8, oe: 'T', rd: 'I', ma: 'CT', e: 'IPA', ca: 'Ob', af: 'AFB', aa: 'P', estatus: 'P' },
            ],
        subAreas: [
        ]
      },
      { 
        nombre: 'Área de Formación Disciplinar (AFD)',
        materias: [],
        subAreas: []
      },
      { 
        nombre: 'Área de Formación Terminal (AFT)',
        materias: [],
        subAreas: []
      },
      { 
        nombre: 'Área de Formación de Elección Libre (AFEL)', 
        materias: [
            { _id: crypto.randomUUID(), clave: 'AFEL01', nombre: 'Optativa de Elección Libre', seriacion: null, acd: '', caracter: 'Op', ht: 0, hp: 0, ho: 0, cr: 18, oe: null, rd: null, ma: null, e: null, ca: 'Op', af: 'AFEL', aa: null, estatus: 'P' },
        ],
        subAreas: []
      }
    ]
  };
};

// --- Lógica de la API con Firestore ---

/**
 * Endpoint para obtener un plan de estudios por su ID.
 * Si no existe, crea uno con datos por defecto.
 * @param {string} planId - El ID del plan a obtener desde la URL.
 */
app.get('/api/plan-de-estudios/:planId', async (req, res) => {
  const planId = req.params.planId;
  console.log(`[GET /api/plan-de-estudios/${planId}] Request received.`);

  try {
    if (!planId) {
        console.log('[GET] Bad request: planId is missing.');
        return res.status(400).json({ message: 'El ID del plan es requerido.' });
    }
    const planDocRef = db.collection('curriculum').doc(planId);
    const doc = await planDocRef.get();
    console.log(`[GET] Firestore document fetched for planId '${planId}'. Exists: ${doc.exists}`);

    if (!doc.exists) {
      console.log(`[GET] Document for '${planId}' does not exist. Preparing to create with default data...`);
      const defaultData = getDefaultData(planId);
      await planDocRef.set(defaultData);
      console.log(`[GET] Successfully wrote new document to Firestore for '${planId}'.`);
      res.status(200).json(defaultData);
      console.log(`[GET] Sent new default data to client for '${planId}'.`);
      return;
    }
    
    console.log(`[GET] Document for '${planId}' exists. Sending data to client.`);
    res.status(200).json(doc.data());

  } catch (error) {
    console.error(`[GET] An error occurred in the GET endpoint for planId '${planId}':`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

/**
 * Endpoint para crear o actualizar un plan de estudios por su ID.
 * @param {string} planId - El ID del plan a guardar desde la URL.
 * @param {object} data - El objeto completo del plan de estudios en el body.
 */
app.put('/api/plan-de-estudios/:planId', async (req, res) => {
  const planId = req.params.planId;
  console.log(`[PUT /api/plan-de-estudios/${planId}] Request received.`);
  
  try {
    const { data } = req.body;

    if (!planId) {
        console.log('[PUT] Bad request: planId is missing.');
        return res.status(400).json({ message: 'El ID del plan es requerido.' });
    }
    if (!data) {
      console.log('[PUT] Bad request: data is missing from the body.');
      return res.status(400).json({ message: 'No se recibieron datos para guardar.' });
    }

    const planDocRef = db.collection('curriculum').doc(planId);
    await planDocRef.set(data, { merge: true });
    console.log(`[PUT] Successfully wrote document to Firestore for '${planId}'.`);

    res.status(200).json({ message: `Plan [${planId}] guardado exitosamente.` });
  } catch (error) {
    console.error(`[PUT] An error occurred in the PUT endpoint for planId '${planId}':`, error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});


// === Iniciar el servidor ===
app.listen(port, () => {
  console.log(`🚀 Servidor API con Firestore corriendo en el puerto ${port}`);
});
