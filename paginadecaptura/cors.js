const cors = require('cors');

const corsOptions = {
  origin: 'https://www.patiomonitoramento.com/', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = cors(corsOptions);
