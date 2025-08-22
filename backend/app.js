// app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const cartRoutes = require('./routes/cart.routes');
const authRoutes = require('./routes/auth.routes');
const filtersRoutes = require('./routes/filters.routes');
const partsRoutes = require('./routes/parts.routes');
const ordersRoutes = require('./routes/orders.routes');
const profileRoutes = require('./routes/profile.routes');
const adminRoutes = require('./routes/admin.routes');


const app = express();

app.use(cors());
app.use(express.json());

// statičke slike
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// mount rute
app.use('/api', authRoutes);          // /api/login, /api/register
app.use('/api', filtersRoutes);       // /api/brands, /api/models, /api/part-types, /api/years
app.use('/api/parts', partsRoutes);   // /api/parts (GET/POST)
app.use('/api/orders', ordersRoutes); // /api/orders
app.use('/api', filtersRoutes);
app.use('/api', cartRoutes);
app.use('/api', profileRoutes);
app.use('/api/admin', adminRoutes);

// healthcheck (opcija)
app.get('/api/health', (_req, res) => res.json({ ok: true }));

module.exports = app;
