import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Save, X, Clock, Type, List, ArrowLeft, Loader2, AlertCircle, Calendar } from 'lucide-react';
import api from '../../services/api';
import { FoodList } from './FoodList';
import { SyncManager } from '../../services/syncManager';


const DIAS_SEMANA = [
  { id: 'seg', label: 'Seg', labelFull: 'Segunda' },
  { id: 'ter', label: 'Ter', labelFull: 'Terça' },
  { id: 'qua', label: 'Qua', labelFull: 'Quarta' },
  { id: 'qui', label: 'Qui', labelFull: 'Quinta' },
  { id: 'sex', label: 'Sex', labelFull: 'Sexta' },
  { id: 'sab', label: 'Sáb', labelFull: 'Sábado' },
  { id: 'dom', label: 'Dom', labelFull: 'Domingo' },
];


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
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 bg-transparent border text-sm rounded-xl transition-all focus:outline-none focus:ring-1 ${props.type === 'time' ? 'appearance-none [&::-webkit-calendar-picker-indicator]:dark:invert' : ''} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${error ? 'border-red-500 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500 placeholder:text-red-300 dark:placeholder:text-red-800' : 'border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-300 focus:ring-zinc-900 dark:focus:ring-zinc-300 placeholder:text-zinc-400'}`}
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

function FormSelect({ label, icon: Icon, options, error, containerClassName = '', ...props }) {
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
        <select
          {...props}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-10 py-2.5 bg-transparent border text-sm rounded-xl transition-all focus:outline-none focus:ring-1 appearance-none cursor-pointer ${error ? 'border-red-500 text-red-900 dark:text-red-100 focus:border-red-500 focus:ring-red-500' : 'border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-300 focus:ring-zinc-900 dark:focus:ring-zinc-300'}`}
        >
          <option value="" disabled className="dark:bg-zinc-900">Selecione uma opção...</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="dark:bg-zinc-900">
              {opt.label}
            </option>
          ))}
        </select>
        <div className={`absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${error ? 'text-red-400' : 'text-zinc-400'}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
        </div>
      </div>
      {error && (
        <span className="text-[10px] font-medium text-red-500 ml-1 flex items-center gap-1 mt-0.5">
          <AlertCircle size={10} /> {error}
        </span>
      )}
    </div>
  );
}

function DiasSemanaSelector({ diasSelecionados, onChange, error }) {
  const toggleDia = (diaId) => {
    if (diasSelecionados.includes(diaId)) {
      onChange(diasSelecionados.filter(d => d !== diaId));
    } else {
      onChange([...diasSelecionados, diaId]);
    }
  };

  const toggleTodos = () => {
    if (diasSelecionados.length === DIAS_SEMANA.length) {
      onChange([]);
    } else {
      onChange(DIAS_SEMANA.map(d => d.id));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className={`text-xs font-semibold ml-1 uppercase tracking-wider flex items-center gap-1.5 ${error ? 'text-red-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
          <Calendar size={12} strokeWidth={2} />
          Dias da Semana
        </label>
        <button
          type="button"
          onClick={toggleTodos}
          className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors font-medium"
        >
          {diasSelecionados.length === DIAS_SEMANA.length ? 'Desmarcar todos' : 'Selecionar todos'}
        </button>
      </div>

      <div className="flex gap-1.5">
        {DIAS_SEMANA.map((dia) => {
          const selecionado = diasSelecionados.includes(dia.id);
          const isWeekend = dia.id === 'sab' || dia.id === 'dom';
          return (
            <button
              key={dia.id}
              type="button"
              title={dia.labelFull}
              onClick={() => toggleDia(dia.id)}
              className={`
                flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-150 border
                ${selecionado
                  ? isWeekend
                    ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                    : 'bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                  : error
                    ? 'bg-transparent border-red-300 dark:border-red-800 text-red-400 hover:border-red-400'
                    : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-200'
                }
              `}
            >
              {dia.label}
            </button>
          );
        })}
      </div>

      {diasSelecionados.length > 0 && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500 ml-1">
          {diasSelecionados.length === 7
            ? 'Todos os dias da semana'
            : diasSelecionados.length === 1
            ? `${DIAS_SEMANA.find(d => d.id === diasSelecionados[0])?.labelFull} selecionada`
            : `${diasSelecionados.length} dias selecionados`}
        </p>
      )}

      {error && (
        <span className="text-[10px] font-medium text-red-500 ml-1 flex items-center gap-1 mt-0.5">
          <AlertCircle size={10} /> {error}
        </span>
      )}
    </div>
  );
}

// --- Componente Principal ---

export function CadastroRefeicao({ onVoltar, refeicaoParaEditar }) {
  const [dietas, setDietas] = useState([]);

  const [alimentosAdicionados, setAlimentosAdicionados] = useState(() => {
    return refeicaoParaEditar?.alimentos_refeicoes?.map(item => {
      const a = item.alimentos;
      return {
        id: a.id,
        nome: a.descricao,
        proteina: a.Prote_na__g_ ?? a.proteina ?? 0,
        gordura: a.Lip_deos__g_ ?? a.lipideos ?? 0,
        carboidratos: a.Carboidrato__g_ ?? a.carboidratos ?? 0,
        calorias: a.energia_kcal ?? a.calorias ?? 0,
        quantidade: item.quantidade
      };
    }) || [];
  });

  const [nomeRefeicao, setNomeRefeicao] = useState(refeicaoParaEditar?.nome || '');
  const [horarioRefeicao, setHorarioRefeicao] = useState(() => {
    if (!refeicaoParaEditar?.horario) return '';
    return refeicaoParaEditar.horario.substring(11, 16);
  });
  const [dietaSelecionada, setDietaSelecionada] = useState(refeicaoParaEditar?.dietaId || '');
  const [diasSelecionados, setDiasSelecionados] = useState(refeicaoParaEditar?.diasSemana || []);

  const [errosCampos, setErrosCampos] = useState({});

  const [termoBusca, setTermoBusca] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef(null);

  const [isSaving, setIsSaving] = useState(false);
  const isEditing = !!refeicaoParaEditar;

  useEffect(() => {
    const fetchDietas = async () => {
      try {
        const response = await api.get('/diets');
        setDietas(response.data);
        if (response.data.length > 0 && !dietaSelecionada) {
          setDietaSelecionada(response.data[0].id);
        }
      } catch (err) {
        console.error("Erro ao carregar dietas:", err);
      }
    };
    fetchDietas();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const lidarComRemocaoAlimento = (id) => {
    setAlimentosAdicionados(alimentosAdicionados.filter(a => a.id !== id));
  };

  const lidarComAlteracaoQuantidade = (id, novaQuantidade) => {
    setAlimentosAdicionados(prev =>
      prev.map(a => a.id === id ? { ...a, quantidade: novaQuantidade } : a)
    );
  };

  const handleBuscarAlimento = async () => {
    if (!termoBusca.trim()) return;
    setIsSearching(true);
    try {
      const { data } = await api.get(`/foods?search=${termoBusca}`);
      setResultadosBusca(data);
      setShowResults(true);
    } catch (err) {
      alert("Erro ao buscar alimento.");
    } finally {
      setIsSearching(false);
    }
  };

  const adicionarAlimentoDaLista = (item) => {
    if (alimentosAdicionados.some(a => a.id === item.id)) {
      alert("Alimento já adicionado.");
    } else {
      setAlimentosAdicionados([...alimentosAdicionados, {
        id: item.id,
        nome: item.descricao,
        proteina: item.Prote_na__g_ ?? item.proteina ?? 0,
        gordura: item.Lip_deos__g_ ?? item.lipideos ?? 0,
        carboidratos: item.Carboidrato__g_ ?? item.carboidratos ?? 0,
        calorias: item.energia_kcal ?? item.calorias ?? 0,
        quantidade: 100
      }]);
    }
    setShowResults(false);
    setTermoBusca('');
  };

  const limparErro = (campo) => {
    if (errosCampos[campo]) {
      setErrosCampos(prev => ({ ...prev, [campo]: null }));
    }
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!nomeRefeicao.trim()) {
      novosErros.nome = 'Dê um nome para a refeição.';
    }

    if (!dietaSelecionada) {
      novosErros.dieta = 'Selecione uma dieta.';
    }

    if (!horarioRefeicao) {
      novosErros.horario = 'Defina o horário.';
    }

    setErrosCampos(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = async () => {
    if (!validarFormulario()) return;

    setIsSaving(true);

    const payload = {
      nome: nomeRefeicao,
      dietaId: dietaSelecionada,
      horario: horarioRefeicao || null,
      diasSemana: diasSelecionados,
      itens: alimentosAdicionados.map(item => ({
        alimentoId: item.id,
        quantidade: Number(item.quantidade)
      }))
    };

    if (navigator.onLine) {
      try {
        if (isEditing) {
          await api.patch(`/meals/${refeicaoParaEditar.id}`, payload);
        } else {
          await api.post('/meals', payload);
        }
        onVoltar();
      } catch (err) {
        alert("Erro ao salvar a refeição.");
      } finally {
        setIsSaving(false);
      }
    } else {
      const metodo = isEditing ? 'patch' : 'post';
      const url = isEditing ? `/meals/${refeicaoParaEditar.id}` : '/meals';

      SyncManager.adicionarNaFila(metodo, url, payload);

      alert(isEditing
        ? "Você está offline. A edição foi salva e será sincronizada em breve."
        : "Você está offline. A nova refeição foi salva localmente e aparecerá quando a internet voltar.");

      setIsSaving(false);
      onVoltar();
    }
  };

  const totais = alimentosAdicionados.reduce((acc, alimento) => {
    const fator = (alimento.quantidade || 0) / 100;
    return {
      proteina: acc.proteina + (alimento.proteina * fator),
      gordura: acc.gordura + (alimento.gordura * fator),
      carboidratos: acc.carboidratos + (alimento.carboidratos * fator),
      calorias: acc.calorias + (alimento.calorias * fator)
    };
  }, { proteina: 0, gordura: 0, carboidratos: 0, calorias: 0 });

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
            {isEditing ? 'Editar Refeição' : 'Nova Refeição'}
          </h2>
        </div>
      </div>

      <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormInput
            label="Nome da Refeição"
            icon={Type}
            value={nomeRefeicao}
            onChange={(e) => { setNomeRefeicao(e.target.value); limparErro('nome'); }}
            placeholder="Ex: Almoço"
            error={errosCampos.nome}
          />

          <FormInput
            label="Horário"
            icon={Clock}
            type="time"
            value={horarioRefeicao}
            onChange={(e) => { setHorarioRefeicao(e.target.value); limparErro('horario'); }}
            error={errosCampos.horario}
          />

          <FormSelect
            label="Dieta Vinculada"
            icon={List}
            value={dietaSelecionada}
            onChange={(e) => { setDietaSelecionada(e.target.value); limparErro('dieta'); }}
            containerClassName="sm:col-span-2"
            options={dietas.map(d => ({ value: d.id, label: d.nome || d.nomeDieta }))}
            error={errosCampos.dieta}
          />

          <div className="sm:col-span-2">
            <DiasSemanaSelector
              diasSelecionados={diasSelecionados}
              onChange={(novos) => { setDiasSelecionados(novos); limparErro('diasSemana'); }}
              error={errosCampos.diasSemana}
            />
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-zinc-100 dark:border-zinc-800/50 pt-6">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Alimentos</h3>

          <div className="relative flex flex-col gap-3" ref={searchContainerRef}>
            <div className="flex flex-col sm:flex-row items-end gap-3">
              <FormInput
                label="Buscar Alimento (TACO)"
                icon={Search}
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBuscarAlimento()}
                containerClassName="flex-1 w-full"
                placeholder="Frango, Arroz, Ovo..."
              />
              <button
                type="button"
                onClick={handleBuscarAlimento}
                disabled={isSearching}
                className="px-5 h-[42px] bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-sm font-medium flex items-center gap-2 transition-all hover:bg-zinc-800 dark:hover:bg-white"
              >
                {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Buscar
              </button>
            </div>

            {showResults && resultadosBusca.length > 0 && (
              <div className="absolute top-[72px] left-0 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto">
                {resultadosBusca.map((item) => {
                  const proteina = item.Prote_na__g_ ?? item.proteina ?? 0;
                  const gordura = item.Lip_deos__g_ ?? item.lipideos ?? 0;
                  const calorias = item.energia_kcal ?? item.calorias ?? 0;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => adicionarAlimentoDaLista(item)}
                      className="w-full flex items-center justify-between p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800 last:border-0 text-left"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.descricao}</span>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold">
                          {calorias} kcal · P: {proteina}g · G: {gordura}g
                        </span>
                      </div>
                      <Plus size={16} className="text-zinc-400" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <FoodList
            alimentos={alimentosAdicionados}
            aoRemover={lidarComRemocaoAlimento}
            aoAlterarQuantidade={lidarComAlteracaoQuantidade}
          />

          {alimentosAdicionados.length > 0 && (
            <div className="mt-2 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex justify-between items-center gap-4">
              <span className="text-sm font-bold text-zinc-500 uppercase tracking-tighter">Total</span>
              <div className="flex gap-4 text-sm">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Prot</span>
                  <span className="font-bold text-blue-500">{totais.proteina.toFixed(1)}g</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Gord</span>
                  <span className="font-bold text-rose-500">{totais.gordura.toFixed(1)}g</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Carb</span>
                  <span className="font-bold text-amber-500">{totais.carboidratos.toFixed(1)}g</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Kcal</span>
                  <span className="font-bold text-emerald-500">{totais.calorias.toFixed(0)}</span>
                </div>
              </div>
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
            {isEditing ? 'Salvar Alterações' : 'Salvar Refeição'}
          </button>
        </div>
      </form>
    </div>
  );
}
