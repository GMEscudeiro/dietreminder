import { FoodItem } from './FoodItem';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed } from 'lucide-react';

export function FoodList({ alimentos, aoRemover }) {
  if (!alimentos || alimentos.length === 0) {
    return (
      <div className="w-full py-10 flex flex-col items-center justify-center gap-3 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center text-zinc-400 dark:text-zinc-500">
          <UtensilsCrossed size={20} strokeWidth={1.5} />
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-[200px]">
          Nenhum alimento adicionado a esta refeição.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      <AnimatePresence mode="popLayout">
        {alimentos.map((alimento) => (
          <motion.div
            key={alimento.id}
            layout
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <FoodItem alimento={alimento} aoRemover={() => aoRemover(alimento.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
