import { useState } from 'react';
import { Search, Plus, Save, X, Clock, Type, List, ArrowLeft } from 'lucide-react';
import { FoodList } from './FoodList';

const dietasMock = [
  { id: '1', nome: 'Hipertrofia - Foco em ganho de massa' },
  { id: '2', nome: 'Emagrecimento - Déficit calórico' },
  { id: '3', nome: 'Manutenção - Equilíbrio' }
];

function FormInput({ label, icon: Icon, containerClassName = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 relative group/input ${containerClassName}`}>
      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 ml-1 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 group-focus-within/input:text-zinc-900 dark:group-focus-within/input:text-zinc-100 pointer-events-none transition-colors"
            size={16}
            strokeWidth={1.5}
          />
        )}
        <input
          {...props}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 bg-transparent border border-zinc-200 dark:border-zinc-800 text-sm rounded-xl transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-300 ${props.type === 'time' ? 'appearance-none [&::-webkit-calendar-picker-indicator]:dark:invert' : ''} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      </div>
    </div>
  );
}

function FormSelect({ label, icon: Icon, options, containerClassName = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 relative group/input ${containerClassName}`}>
      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 ml-1 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 group-focus-within/input:text-zinc-900 dark:group-focus-within/input:text-zinc-100 pointer-events-none transition-colors"
            size={16}
            strokeWidth={1.5}
          />
        )}
        <select
          {...props}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-10 py-2.5 bg-transparent border border-zinc-200 dark:border-zinc-800 text-sm rounded-xl transition-all text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-300 appearance-none cursor-pointer`}
        >
          <option value="" disabled className="dark:bg-zinc-900">Selecione uma opção...</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="dark:bg-zinc-900">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
        </div>
      </div>
    </div>
  );
}

export function CadastroRefeicao({ onVoltar }) {
  const [alimentosAdicionados, setAlimentosAdicionados] = useState([]);
  const [nomeRefeicao, setNomeRefeicao] = useState('');
  const [horarioRefeicao, setHorarioRefeicao] = useState('');
  const [dietaSelecionada, setDietaSelecionada] = useState('');
  const [termoBusca, setTermoBusca] = useState('');

  const lidarComRemocaoAlimento = (id) => {
    setAlimentosAdicionados(alimentosAdicionados.filter(alimento => alimento.id !== id));
  };

  const totais = alimentosAdicionados.reduce((acc, alimento) => ({
    proteina: acc.proteina + alimento.proteina,
    carboidratos: acc.carboidratos + alimento.carboidratos,
    calorias: acc.calorias + alimento.calorias
  }), { proteina: 0, carboidratos: 0, calorias: 0 });

  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 bg-white dark:bg-zinc-950 rounded-2xl sm:border border-zinc-200 dark:border-zinc-800 sm:shadow-sm">
      <div className="mb-8">
        <button
          type="button"
          onClick={onVoltar}
          className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-6">
          <ArrowLeft size={16} strokeWidth={1.5} />
          Voltar
        </button>
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Cadastrar Refeição
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Preencha os detalhes e adicione os alimentos da sua refeição.
        </p>
      </div>

      <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormInput
            label="Nome da Refeição"
            icon={Type}
            type="text"
            value={nomeRefeicao}
            onChange={(e) => setNomeRefeicao(e.target.value)}
            placeholder="Ex: Café da Manhã"
          />

          <FormInput
            label="Horário"
            icon={Clock}
            type="time"
            value={horarioRefeicao}
            onChange={(e) => setHorarioRefeicao(e.target.value)}
          />

          <FormSelect
            label="Dieta Vinculada"
            icon={List}
            value={dietaSelecionada}
            onChange={(e) => setDietaSelecionada(e.target.value)}
            containerClassName="sm:col-span-2"
            options={dietasMock.map(dieta => ({ value: dieta.id, label: dieta.nome }))}
          />
        </div>

        <div className="flex flex-col gap-5 border-t border-zinc-100 dark:border-zinc-800/50 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 tracking-tight">
              Alimentos
            </h3>
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 px-2 py-0.5 rounded-full">
              {alimentosAdicionados.length} itens
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-end gap-3">
            <FormInput
              label="Buscar Alimento"
              icon={Search}
              type="text"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              containerClassName="flex-1 w-full"
            />
            <button
              type="button"
              className="w-full sm:w-auto px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-sm h-[42px]"
            >
              <Plus size={16} strokeWidth={2} />
              Adicionar
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <FoodList alimentos={alimentosAdicionados} aoRemover={lidarComRemocaoAlimento} />

            {alimentosAdicionados.length > 0 && (
              <div className="mt-2 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex flex-wrap flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Total da Refeição
                </span>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
                  <span className="flex flex-col">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Proteína</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{totais.proteina.toFixed(1)}g</span>
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Carbs</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">{totais.carboidratos.toFixed(1)}g</span>
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Calorias</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{totais.calorias.toFixed(0)} kcal</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/50 flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl text-sm font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2"
          >
            <X size={16} strokeWidth={1.5} />
            Cancelar
          </button>
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Save size={16} strokeWidth={1.5} />
            Salvar Refeição
          </button>
        </div>
      </form>
    </div>
  );
}

