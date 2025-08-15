/*
================================================================================
Backend con Node.js y Firebase Firestore.

- Este servidor se conecta a una base de datos en la nube (Firestore).
- Reemplaza el uso del archivo local 'db.json'.
- Está listo para ser desplegado en un servicio de hosting como Render.

================================================================================
*/

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// --- CONFIGURACIÓN DE FIREBASE ---

// 1. Descarga tu archivo de credenciales JSON desde Firebase.
// 2. Conviértelo a un string de una sola línea (puedes usar un minificador de JSON online).
// 3. Pega ese string en la variable de entorno 'FIREBASE_CREDENTIALS' en tu servicio de hosting.
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

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

// --- Lógica de la API con Firestore ---

app.get('/api/plan-de-estudios', async (req, res) => {
  try {
    const doc = await planDocRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Plan de estudios no encontrado.' });
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
    await planDocRef.set(data);
    res.status(200).json({ message: 'Plan de estudios actualizado exitosamente.' });
  } catch (error) {
    console.error("Error actualizando el plan:", error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Los demás endpoints (addMateria, updateMateria, etc.) se simplifican,
// ya que el frontend ahora envía el plan completo para ser guardado.

// === Iniciar el servidor ===
app.listen(port, () => {
  console.log(`🚀 Servidor API con Firestore corriendo en el puerto ${port}`);
});
