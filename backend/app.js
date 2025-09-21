
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


app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


app.use('/api', authRoutes);          
app.use('/api', filtersRoutes);       
app.use('/api/parts', partsRoutes);   
app.use('/api/orders', ordersRoutes); 
app.use('/api', filtersRoutes);
app.use('/api', cartRoutes);
app.use('/api', profileRoutes);
app.use('/api/admin', adminRoutes);


app.get('/api/health', (_req, res) => res.json({ ok: true }));

module.exports = app;
