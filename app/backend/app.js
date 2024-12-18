require("dotenv").config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path'); // Adicione isso para lidar com caminhos

const app = express();
const PORT = process.env.PORT || 5000;

const corsOption = {
  origin: [`http://${process.env.IP_APP}:${process.env.PORT_FRONT}`],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}
app.use(cors(corsOption));

const TIME_SESSION = 1000 * 60 * 30;

const IN_PROD = process.env.NODE_ENV === 'production';

// session config
app.use(session({
  name: process.env.SESS_NAME,
  saveUninitialized: false,
  resave: true,
  rolling: true,
  secret: process.env.SESS_SECRET,
  cookie: {
    maxAge: TIME_SESSION,
    sameSite: true,
    secure: IN_PROD
  }
}));

app.use(bodyParser.json());

const { login, authenticator, painelEntrante, mapaMovel, evolucaoBacklog, configuracoes, logs } = require('./src/routes/index.routes');

const { checkSession } = require('./src/middleware/checkSession');
const { logout } = require('./src/middleware/logout');

app.get('/check-session', checkSession, (req, res) => {
  return res.status(200).send(req.session);
});

app.use('/', login);
app.use('/google', authenticator);
app.use('/dashboard', painelEntrante);
app.use('/movel', mapaMovel, evolucaoBacklog);
app.use('/user', configuracoes, logs);
app.use('/logout', logout);

// Adicione esta linha para servir os arquivos estáticos do React
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Adicione esta rota para servir o index.html do React em qualquer rota não especificada
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});