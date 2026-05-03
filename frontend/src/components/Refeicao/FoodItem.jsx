import { Trash2 } from 'lucide-react';

export function FoodItem({ alimento, aoRemover }) {
  return (
    <div className="group flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all">
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {alimento.nome}
        </span>
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            {alimento.proteina}g Proteína
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
            {alimento.lipideos}g Lipideos
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            {alimento.carboidratos}g Carbs
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {alimento.calorias} Kcal
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={aoRemover}
        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
        title="Remover alimento"
      >
        <Trash2 size={16} strokeWidth={1.5} />
      </button>
    </div>
  );
}
