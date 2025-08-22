// server.js
require('dotenv').config();
require('./config/db'); // samo da inicira konekciju i log

const app = require('./app');

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
