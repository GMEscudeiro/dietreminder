import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { CadastroRefeicao } from './components/Refeicao/CadastroRefeicao';
import { ListaRefeicoes } from './components/Refeicao/ListaRefeicoes';

function App() {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'cadastro_refeicao'
  const { theme, toggleTheme } = useTheme();
  const [drawerAberto, setDrawerAberto] = useState(false);

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 flex flex-col w-full selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900">
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
        {/* Botão menu — só aparece na tela de lista de refeições */}
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
                onNovaRefeicao={() => setMode('cadastro_refeicao')}
                onEditar={() => setMode('login')}
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
              <CadastroRefeicao onVoltar={() => setMode('lista_refeicoes')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
