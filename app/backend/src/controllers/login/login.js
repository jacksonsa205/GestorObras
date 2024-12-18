const SupabaseAuth = require('../../auth/SupabaseAuth');

const sessions = {};

const post = async (req, res) => {
  const { login, password } = req.body;

  if (sessions[login]) {
    sessions[login].destroy();
  }

  try {
    const authResponse = await SupabaseAuth.autenticar({ usuario: login, senha: password });

    if (authResponse.autenticado) {
      sessions[login] = req.session;
      req.session.user = authResponse.user; // Armazene informações do usuário
      return res.status(200).send('Credenciais Válidas!');
    } else {
      return res.status(401).send(authResponse.erro || 'Credenciais inválidas');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Erro ao autenticar o usuário');
  }
};

module.exports = { post };
