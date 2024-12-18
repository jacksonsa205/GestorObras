const supabase = require('./Supabase');

class SupabaseAuth {
  async autenticar({ usuario, senha }) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: usuario,
        password: senha,
      });

      if (error) {
        return { autenticado: false, erro: error.message };
      }

      return { autenticado: true, user: data.user };
    } catch (error) {
      return { autenticado: false, erro: error.message };
    }
  }
}

module.exports = new SupabaseAuth();
