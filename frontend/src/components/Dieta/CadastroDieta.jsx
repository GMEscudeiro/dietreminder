import { useState } from 'react';
import { Save, ArrowLeft, Loader2, AlertCircle, Type, Target, Zap, Activity } from 'lucide-react';
import api from '../../services/api';
import { SyncManager } from '../../services/syncManager';

// --- Sub-componentes de Formulário (Reutilizando padrão) ---

function FormInput({ label, icon: Icon, error, containerClassName = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 relative group/input ${containerClassName}`}>
      <label className={`text-xs font-semibold ml-1 uppercase tracking-wider transition-colors ${error ? 'text-red-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${error ? 'text-red-400' : 'text-zinc-400 dark:text-zinc-500 group-focus-within/input:text-zinc-900 dark:group-focus-within/input:text-zinc-100'}`}
            size={16}
            strokeWidth={1.5}
          />
        )}
        <input
          {...props}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 bg-transparent border text-sm rounded-xl transition-all focus:outline-none focus:ring-1 ${error ? 'border-red-500 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500 placeholder:text-red-300 dark:placeholder:text-red-800' : 'border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-300 focus:ring-zinc-900 dark:focus:ring-zinc-300 placeholder:text-zinc-400'}`}
        />
      </div>
      {error && (
        <span className="text-[10px] font-medium text-red-500 ml-1 flex items-center gap-1 mt-0.5">
          <AlertCircle size={10} /> {error}
        </span>
      )}
    </div>
  );
}

export function CadastroDieta({ onVoltar, dietaParaEditar }) {
  const [nomeDieta, setNomeDieta] = useState(dietaParaEditar?.nomeDieta || '');
  const [caloriasTot, setCaloriasTot] = useState(dietaParaEditar?.caloriasTot || '');
  const [proteinaAlvo, setProteinaAlvo] = useState(dietaParaEditar?.proteinaAlvo || '');
  const [carboidratoAlvo, setCarboidratoAlvo] = useState(dietaParaEditar?.carboidratoAlvo || '');
  const [gorduraAlvo, setGorduraAlvo] = useState(dietaParaEditar?.gorduraAlvo || '');
  const [ativa, setAtiva] = useState(dietaParaEditar?.Ativa ?? true);

  const [errosCampos, setErrosCampos] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = !!dietaParaEditar;

  const limparErro = (campo) => {
    if (errosCampos[campo]) {
      setErrosCampos(prev => ({ ...prev, [campo]: null }));
    }
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!nomeDieta.trim()) novosErros.nomeDieta = 'Dê um nome para a dieta.';
    if (!caloriasTot) novosErros.caloriasTot = 'Informe as calorias totais.';
    if (!proteinaAlvo) novosErros.proteinaAlvo = 'Informe a proteína alvo.';
    if (!carboidratoAlvo) novosErros.carboidratoAlvo = 'Informe o carboidrato alvo.';
    if (!gorduraAlvo) novosErros.gorduraAlvo = 'Informe a gordura alvo.';

    setErrosCampos(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = async () => {
    if (!validarFormulario()) return;

    setIsSaving(true);

    const payload = {
      nomeDieta,
      caloriasTot: Number(caloriasTot),
      proteinaAlvo: Number(proteinaAlvo),
      carboidratoAlvo: Number(carboidratoAlvo),
      gorduraAlvo: Number(gorduraAlvo),
      Ativa: ativa,
      created_at: dietaParaEditar?.created_at || new Date().toISOString()
    };

    if (navigator.onLine) {
      try {
        if (isEditing) {
          await api.patch(`/diets/${dietaParaEditar.id}`, payload);
        } else {
          await api.post('/diets', payload);
        }
        onVoltar();
      } catch (err) {
        alert("Erro ao salvar a dieta. Verifique a conexão com o servidor.");
      } finally {
        setIsSaving(false);
      }
    } else {
      const metodo = isEditing ? 'patch' : 'post';
      const url = isEditing ? `/diets/${dietaParaEditar.id}` : '/diets';

      SyncManager.adicionarNaFila(metodo, url, payload);

      alert(isEditing
        ? "Você está offline. A edição foi salva e será sincronizada em breve."
        : "Você está offline. A nova dieta foi salva localmente e aparecerá quando a internet voltar.");

      setIsSaving(false);
      onVoltar();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 bg-white dark:bg-zinc-950 rounded-2xl sm:border border-zinc-200 dark:border-zinc-800 sm:shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={onVoltar}
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-2 transition-colors">
            <ArrowLeft size={16} />
            Voltar
          </button>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
            {isEditing ? 'Editar Dieta' : 'Nova Dieta'}
          </h2>
        </div>
      </div>

      <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 gap-5">
          <FormInput
            label="Nome da Dieta"
            icon={Type}
            value={nomeDieta}
            onChange={(e) => { setNomeDieta(e.target.value); limparErro('nomeDieta'); }}
            placeholder="Ex: Cutting Verão"
            error={errosCampos.nomeDieta}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormInput
              label="Calorias Totais (kcal)"
              icon={Zap}
              type="number"
              value={caloriasTot}
              onChange={(e) => { setCaloriasTot(e.target.value); limparErro('caloriasTot'); }}
              placeholder="Ex: 2500"
              error={errosCampos.caloriasTot}
            />

            <FormInput
              label="Proteína Alvo (g)"
              icon={Target}
              type="number"
              value={proteinaAlvo}
              onChange={(e) => { setProteinaAlvo(e.target.value); limparErro('proteinaAlvo'); }}
              placeholder="Ex: 180"
              error={errosCampos.proteinaAlvo}
            />

            <FormInput
              label="Carboidrato Alvo (g)"
              icon={Activity}
              type="number"
              value={carboidratoAlvo}
              onChange={(e) => { setCarboidratoAlvo(e.target.value); limparErro('carboidratoAlvo'); }}
              placeholder="Ex: 300"
              error={errosCampos.carboidratoAlvo}
            />

            <FormInput
              label="Gordura Alvo (g)"
              icon={Activity}
              type="number"
              value={gorduraAlvo}
              onChange={(e) => { setGorduraAlvo(e.target.value); limparErro('gorduraAlvo'); }}
              placeholder="Ex: 70"
              error={errosCampos.gorduraAlvo}
            />
          </div>

          {isEditing && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <input
                type="checkbox"
                id="ativa"
                checked={ativa}
                onChange={(e) => setAtiva(e.target.checked)}
                className="w-5 h-5 rounded-md border-zinc-300 dark:border-zinc-700 text-zinc-900 focus:ring-zinc-900"
              />
              <label htmlFor="ativa" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
                Definir como dieta ativa
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800/50">
          <button type="button" onClick={onVoltar} className="px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-colors">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSalvar}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold flex items-center gap-2 shadow-sm disabled:opacity-70 transition-all hover:scale-[1.02]"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isEditing ? 'Salvar Alterações' : 'Salvar Dieta'}
          </button>
        </div>
      </form>
    </div>
  );
}
