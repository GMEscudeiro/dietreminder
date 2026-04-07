import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import api from '../../services/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 30 } },
};

export function RegisterForm({ onSwitchMode }) {
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });
  const [errosCampos, setErrosCampos] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.nome.trim()) {
      novosErros.nome = 'O nome é obrigatório.';
    }

    if (!formData.email.trim()) {
      novosErros.email = 'O e-mail é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      novosErros.email = 'Digite um e-mail válido.';
    }

    if (!formData.senha) {
      novosErros.senha = 'A senha é obrigatória.';
    } else if (formData.senha.length < 6) {
      novosErros.senha = 'A senha deve ter no mínimo 6 caracteres.';
    }

    setErrosCampos(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validarFormulario()) return;

    setIsLoading(true);

    try {
      await api.post('/auth/register', {
        name: formData.nome,
        email: formData.email,
        password: formData.senha,
      });

      onSwitchMode();
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao criar conta. E-mail já em uso?';
      setError(Array.isArray(message) ? message[0] : message);
    } finally {
      setIsLoading(false);
    }
  };

  const limparErro = (campo) => {
    if (errosCampos[campo]) {
      setErrosCampos({ ...errosCampos, [campo]: null });
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full flex flex-col gap-8 px-4 sm:px-0">
      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Criar conta</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Preencha os dados abaixo para começar.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 font-medium text-center bg-red-50 dark:bg-red-900/10 py-2.5 rounded-lg border border-red-100 dark:border-red-900/20">
            {error}
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="flex flex-col gap-1.5 group">
          <label className={`text-xs font-semibold ml-1 uppercase tracking-wider ${errosCampos.nome ? 'text-red-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
            Nome Completo
          </label>
          <div className="relative group/input">
            <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${errosCampos.nome ? 'text-red-400' : 'text-zinc-400 dark:text-zinc-500 group-focus-within/input:text-zinc-900 dark:group-focus-within/input:text-white'}`} size={18} strokeWidth={1.5} />
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => { setFormData({ ...formData, nome: e.target.value }); limparErro('nome'); }}
              placeholder="João Silva"
              className={`w-full pl-11 pr-4 py-3 bg-transparent border text-sm rounded-xl transition-all duration-300 focus:outline-none focus:ring-1 ${errosCampos.nome ? 'border-red-500 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-300 focus:ring-zinc-900 dark:focus:ring-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-600'}`}
            />
          </div>
          {errosCampos.nome && (
            <span className="text-[10px] font-medium text-red-500 ml-1 flex items-center gap-1 mt-0.5">
              <AlertCircle size={10} /> {errosCampos.nome}
            </span>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-1.5 group">
          <label className={`text-xs font-semibold ml-1 uppercase tracking-wider ${errosCampos.email ? 'text-red-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
            E-mail
          </label>
          <div className="relative group/input">
            <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${errosCampos.email ? 'text-red-400' : 'text-zinc-400 dark:text-zinc-500 group-focus-within/input:text-zinc-900 dark:group-focus-within/input:text-white'}`} size={18} strokeWidth={1.5} />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => { setFormData({ ...formData, email: e.target.value }); limparErro('email'); }}
              placeholder="exemplo@email.com"
              className={`w-full pl-11 pr-4 py-3 bg-transparent border text-sm rounded-xl transition-all duration-300 focus:outline-none focus:ring-1 ${errosCampos.email ? 'border-red-500 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-300 focus:ring-zinc-900 dark:focus:ring-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-600'}`}
            />
          </div>
          {errosCampos.email && (
            <span className="text-[10px] font-medium text-red-500 ml-1 flex items-center gap-1 mt-0.5">
              <AlertCircle size={10} /> {errosCampos.email}
            </span>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-1.5 group">
          <label className={`text-xs font-semibold ml-1 uppercase tracking-wider ${errosCampos.senha ? 'text-red-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
            Senha
          </label>
          <div className="relative group/input">
            <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${errosCampos.senha ? 'text-red-400' : 'text-zinc-400 dark:text-zinc-500 group-focus-within/input:text-zinc-900 dark:group-focus-within/input:text-white'}`} size={18} strokeWidth={1.5} />
            <input
              type="password"
              value={formData.senha}
              onChange={(e) => { setFormData({ ...formData, senha: e.target.value }); limparErro('senha'); }}
              placeholder="Min. 6 caracteres"
              className={`w-full pl-11 pr-4 py-3 bg-transparent border text-sm rounded-xl transition-all duration-300 focus:outline-none focus:ring-1 ${errosCampos.senha ? 'border-red-500 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-300 focus:ring-zinc-900 dark:focus:ring-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-600'}`}
            />
          </div>
          {errosCampos.senha && (
            <span className="text-[10px] font-medium text-red-500 ml-1 flex items-center gap-1 mt-0.5">
              <AlertCircle size={10} /> {errosCampos.senha}
            </span>
          )}
        </motion.div>

        <motion.button variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="mt-4 w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 py-3 rounded-xl text-sm font-medium transition-colors shadow-sm disabled:opacity-70">
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <><>Criar Conta</><ArrowRight size={16} strokeWidth={1.5} /></>}
        </motion.button>
      </form>

      <motion.div variants={itemVariants} className="mt-4 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Já tem uma conta?{' '}
          <button onClick={onSwitchMode} className="text-zinc-900 dark:text-white font-medium hover:underline underline-offset-4 transition-all">Fazer login</button>
        </p>
      </motion.div>
    </motion.div>
  );
}
