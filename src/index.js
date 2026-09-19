import 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';

const app = express();

connectDB();

app.use(express.json());

// acá van las rutas: app.use('/api/products', productRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));