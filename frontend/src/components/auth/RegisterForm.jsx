import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useState } from 'react';
import api from '../../services/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 400, damping: 30 },
  },
};

export function RegisterForm({ onSwitchMode }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem!');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/auth/register', {
        name: formData.nome,
        email: formData.email,
        password: formData.senha,
      });

      alert('Conta criada com sucesso! Agora você pode entrar.');
      onSwitchMode();

    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao criar conta.';
      setError(Array.isArray(message) ? message[0] : message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full flex flex-col gap-8 px-4 sm:px-0"
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Criar Conta
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Preencha os dados abaixo para iniciar sua jornada.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs text-red-500 font-medium text-center bg-red-50 dark:bg-red-900/10 py-3 rounded-xl border border-red-100 dark:border-red-900/20"
          >
            {error}
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 ml-1 uppercase tracking-wider">
            Nome Completo
          </label>
          <div className="relative group">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" size={18} />
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Seu nome"
              className="w-full pl-11 pr-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-800 text-sm rounded-xl focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300 transition-all"
              required
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 ml-1 uppercase tracking-wider">
            E-mail
          </label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" size={18} />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="exemplo@email.com"
              className="w-full pl-11 pr-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-800 text-sm rounded-xl focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300 transition-all"
              required
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 ml-1 uppercase tracking-wider">
            Senha
          </label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" size={18} />
            <input
              type="password"
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-800 text-sm rounded-xl focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300 transition-all"
              required
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 ml-1 uppercase tracking-wider">
            Confirmar Senha
          </label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" size={18} />
            <input
              type="password"
              value={formData.confirmarSenha}
              onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-800 text-sm rounded-xl focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300 transition-all"
              required
            />
          </div>
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-3.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              Criar minha conta
              <ArrowRight size={16} strokeWidth={2} />
            </>
          )}
        </motion.button>
      </form>

      <motion.div variants={itemVariants} className="text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Já tem uma conta?{' '}
          <button
            onClick={onSwitchMode}
            className="text-zinc-900 dark:text-white font-semibold hover:underline underline-offset-4"
          >
            Fazer login
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
}
