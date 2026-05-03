import { Trash2, Weight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FoodList({ alimentos, aoRemover, aoAlterarQuantidade }) {
  if (alimentos.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {alimentos.map((alimento) => (
          <motion.div
            key={alimento.id}
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-4 p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl group"
          >
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                {alimento.nome}
              </h4>
              <div className="flex gap-3 mt-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                <span>P: {(alimento.proteina * (alimento.quantidade / 100)).toFixed(1)}g</span>
                <span>L: {(alimento.lipideos * (alimento.quantidade / 100)).toFixed(1)}g</span>
                <span>C: {(alimento.carboidratos * (alimento.quantidade / 100)).toFixed(1)}g</span>
                <span className="text-emerald-600 dark:text-emerald-500">
                  {(alimento.calorias * (alimento.quantidade / 100)).toFixed(0)} kcal
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex items-center">
                <Weight className="absolute left-2.5 text-zinc-400" size={14} />
                <input
                  type="number"
                  value={alimento.quantidade}
                  onChange={(e) => aoAlterarQuantidade(alimento.id, Number(e.target.value))}
                  className="w-20 pl-8 pr-2 py-1.5 text-xs font-semibold bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300 transition-all"
                  placeholder="g"
                />
                <span className="ml-1.5 text-[10px] font-bold text-zinc-400">g</span>
              </div>

              <button
                onClick={() => aoRemover(alimento.id)}
                className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
                title="Remover alimento"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
