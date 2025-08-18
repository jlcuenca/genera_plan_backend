/*
================================================================================
Backend con Node.js y Firebase Firestore

- CORRECCIÓN: Se ha añadido lógica para inicializar la base de datos
  con datos por defecto si esta se encuentra vacía. Esto soluciona el
  error 404 al cargar la aplicación por primera vez.
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
    nombre: "Plan de Estudios de Ganadería Sustentable",
    facultad: "Ciencias Biológicas y Agropecuarias",
    opcionProfesional: "Licenciatura en Ganadería Sustentable",
    nivelEstudios: "Licenciatura",
    tituloOtorga: "Licenciado(a) en Ganadería Sustentable",
    periodo: "2025",
    areaAcademica: "Ciencias Biológicas y Agropecuarias",
    regionImparte: "Veracruz",
    sedeImparte: "Facultad de Medicina Veterinaria y Zootecnia",
    sistema: "Virtual",
    totalCreditosPlan: 374,
    totalCreditosGrado: 350,
    modalidadEducativa: "Virtual",
    estatus: "Aprobado",
    fechaElaboracion: new Date().toISOString().split('T')[0],
    areas: [
      { 
        nombre: 'Área de Formación Básica General (AFBG)', 
        materias: [
          { clave: 'AFBG01', nombre: 'Lectura y escritura de textos académicos', seriacion: null, acd: '', caracter: 'Ob', ht: 0, hp: 0, ho: 4, cr: 4, oe: 'O', rd: 'I', ma: 'CT', e: 'IeF', ca: 'Ob', af: 'AFB', aa: null, estatus: 'P' },
          { clave: 'AFBG02', nombre: 'Lengua I', seriacion: null, acd: '', caracter: 'Ob', ht: 0, hp: 0, ho: 6, cr: 4, oe: 'O', rd: 'I', ma: 'T', e: 'IeF', ca: 'Ob', af: 'AFB', aa: null, estatus: 'P' },
        ],
        subAreas: []
      },
      { 
        nombre: 'Área de Formación Básica de Iniciación a la Disciplina (AFBID)',
        materias: [],
        subAreas: []
      },
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
