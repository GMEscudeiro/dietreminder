import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock } from 'lucide-react';
import { useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
};

export function LoginForm({ onSwitchMode, onLogin }) {
  const [formData, setFormData] = useState({ email: '', senha: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    if (onLogin) onLogin();
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full flex flex-col gap-8 px-4 sm:px-0"
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Bem-vindo(a)</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Entre com sua conta para acessar suas dietas.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <motion.div variants={itemVariants} className="flex flex-col gap-1.5 group">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 ml-1 uppercase tracking-wider">
            E-mail
          </label>
          <div className="relative group/input">
            <Mail
              className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors text-zinc-400 dark:text-zinc-500 group-focus-within/input:text-zinc-900 dark:group-focus-within/input:text-white pointer-events-none"
              size={18}
              strokeWidth={1.5}
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="exemplo@email.com"
              className="w-full pl-11 pr-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-800 text-sm rounded-xl transition-all duration-300 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 hover:border-zinc-300 dark:hover:border-zinc-700 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-300"
              required
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-1.5 group">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 ml-1 uppercase tracking-wider">
            Senha
          </label>
          <div className="relative group/input">
            <Lock
              className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors text-zinc-400 dark:text-zinc-500 group-focus-within/input:text-zinc-900 dark:group-focus-within/input:text-white pointer-events-none"
              size={18}
              strokeWidth={1.5}
            />
            <input
              type="password"
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 bg-transparent border border-zinc-200 dark:border-zinc-800 text-sm rounded-xl transition-all duration-300 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 hover:border-zinc-300 dark:hover:border-zinc-700 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-300"
              required
            />
          </div>
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="mt-4 w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 py-3 rounded-xl text-sm font-medium transition-colors border border-transparent shadow-sm"
        >
          Entrar
          <ArrowRight size={16} strokeWidth={1.5} />
        </motion.button>
      </form>

      <motion.div variants={itemVariants} className="mt-4 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Novo por aqui?{' '}
          <button
            onClick={onSwitchMode}
            className="text-zinc-900 dark:text-white font-medium hover:underline underline-offset-4 transition-all"
          >
            Criar conta
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
}
