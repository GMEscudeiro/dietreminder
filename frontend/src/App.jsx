import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun, Menu, LogOut } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { CadastroRefeicao } from './components/Refeicao/CadastroRefeicao';
import { ListaRefeicoes } from './components/Refeicao/ListaRefeicoes';
import { CadastroDieta } from './components/Dieta/CadastroDieta';
import { SyncManager } from './services/syncManager';

function App() {
  const [mode, setMode] = useState(() => {
    const token = localStorage.getItem('@DietReminder:token');

    return token ? 'lista_refeicoes' : 'login';
  });
  const { theme, toggleTheme } = useTheme();
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [refeicaoSendoEditada, setRefeicaoSendoEditada] = useState(null);
  const [dietaSendoEditada, setDietaSendoEditada] = useState(null);

  useEffect(() => {
    window.addEventListener('online', SyncManager.sincronizar);

    if (navigator.onLine) {
      SyncManager.sincronizar();
    }

    return () => window.removeEventListener('online', SyncManager.sincronizar);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('@DietReminder:token');
    setMode('login');
    setDrawerAberto(false);
  };

  const handleNovaRefeicao = () => {
    setRefeicaoSendoEditada(null);
    setMode('cadastro_refeicao');
  };

  const handleEditarRefeicao = (refeicao) => {
    setRefeicaoSendoEditada(refeicao);
    setMode('cadastro_refeicao');
  };

  const handleNovaDieta = () => {
    setDietaSendoEditada(null);
    setMode('cadastro_dieta');
    setDrawerAberto(false);
  };

  const handleEditarDieta = (dieta) => {
    setDietaSendoEditada(dieta);
    setMode('cadastro_dieta');
    setDrawerAberto(false);
  };

  const handleVoltar = () => {
    setRefeicaoSendoEditada(null);
    setDietaSendoEditada(null);
    setMode('lista_refeicoes');
  };

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 flex flex-col w-full selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900">
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
        <div className="w-10">
          {mode === 'lista_refeicoes' && (
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDrawerAberto(true)}
              className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              <Menu size={20} strokeWidth={1.5} />
            </motion.button>
          )}
        </div>

        {mode !== 'login' && mode !== 'register' && (
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-full border border-red-200 dark:border-red-900/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            aria-label="Sair da conta"
          >
            <span className="text-xs font-semibold hidden sm:block">Sair</span>
            <LogOut size={16} strokeWidth={2} />
          </motion.button>
        )}

        {/* Botão tema — direita */}
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
        </motion.button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 pt-24 pb-10">
        <AnimatePresence mode="wait">
          {mode === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-sm"
            >
              <LoginForm onSwitchMode={() => setMode('register')} onLogin={() => setMode('lista_refeicoes')} />
            </motion.div>
          )}

          {mode === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-sm"
            >
              <RegisterForm onSwitchMode={() => setMode('login')} />
            </motion.div>
          )}

          {mode === 'lista_refeicoes' && (
            <motion.div
              key="lista_refeicoes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-xl"
            >
              <ListaRefeicoes
                onNovaRefeicao={handleNovaRefeicao}
                onEditar={handleEditarRefeicao}
                onNovaDieta={handleNovaDieta}
                onEditarDieta={handleEditarDieta}
                drawerAberto={drawerAberto}
                onAbrirDrawer={() => setDrawerAberto(true)}
                onFecharDrawer={() => setDrawerAberto(false)}
              />
            </motion.div>
          )}

          {mode === 'cadastro_refeicao' && (
            <motion.div
              key="cadastro_refeicao"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-xl"
            >
              <CadastroRefeicao
                onVoltar={handleVoltar}
                refeicaoParaEditar={refeicaoSendoEditada}
              />
            </motion.div>
          )}

          {mode === 'cadastro_dieta' && (
            <motion.div
              key="cadastro_dieta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-xl"
            >
              <CadastroDieta
                onVoltar={handleVoltar}
                dietaParaEditar={dietaSendoEditada}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
