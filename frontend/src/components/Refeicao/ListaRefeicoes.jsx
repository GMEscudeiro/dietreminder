import { useState, useEffect } from 'react';
import {
  ChevronDown, UtensilsCrossed, Plus, Clock, Flame,
  Beef, Wheat, Pencil, X, Check, AlertCircle, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { SyncManager } from '../../services/syncManager';

// ─── MacroBar ─────────────────────────────────────────────────────────────────

function MacroBar({ proteina, carboidratos, gordura }) {
  const total = proteina + carboidratos + gordura;
  if (total === 0) return <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full" />;
  return (
    <div className="flex h-1.5 w-full rounded-full overflow-hidden gap-0.5">
      <div style={{ width: `${(proteina / total) * 100}%` }} className="bg-blue-500 rounded-full" />
      <div style={{ width: `${(carboidratos / total) * 100}%` }} className="bg-amber-500 rounded-full" />
      <div style={{ width: `${(gordura / total) * 100}%` }} className="bg-rose-400 rounded-full" />
    </div>
  );
}

// ─── Modal de confirmação de troca de dieta ───────────────────────────────────

function ConfirmacaoModal({ dietaAlvo, onConfirmar, onCancelar }) {
  return (
    <AnimatePresence>
      {dietaAlvo && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancelar}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                  <AlertCircle size={18} strokeWidth={1.5} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Trocar dieta ativa?</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    As refeições serão trocadas para <span className="font-semibold italic">"{dietaAlvo.nome || dietaAlvo.nomeDieta}"</span>.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={onCancelar} className="flex-1 py-2.5 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 transition-colors">Cancelar</button>
                <button onClick={onConfirmar} className="flex-1 py-2.5 rounded-xl text-xs font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 transition-colors">Confirmar</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Drawer lateral de dietas ─────────────────────────────────────────────────

function DietaDrawer({ aberto, onFechar, dietaAtiva, dietas, onSelecionarDieta }) {
  return (
    <AnimatePresence>
      {aberto && (
        <>
          <motion.div
            key="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onFechar}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          />
          <motion.div
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 z-40 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-semibold">Minhas Dietas</h3>
              <button onClick={onFechar} className="text-zinc-400 hover:text-zinc-700 transition-colors p-1.5 rounded-lg"><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {dietas.map((dieta) => {
                const ativa = dietaAtiva?.id === dieta.id;
                return (
                  <button
                    key={dieta.id}
                    onClick={() => onSelecionarDieta(dieta)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${ativa ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'}`}
                  >
                    <span className="text-sm font-semibold block">{dieta.nome || dieta.nomeDieta}</span>
                    <span className="text-xs opacity-60">Dieta cadastrada</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── AlimentoItem ─────────────────────────────────────────────────────────────

function AlimentoItem({ item }) {
  const fator = item.quantidade / 100;
  const a = item.alimentos;

  const proteina = a.Prote_na__g_ ?? a.proteina ?? 0;
  const gordura = a.Lip_deos__g_ ?? a.lipideos ?? 0;
  const carboidratos = a.Carboidrato__g_ ?? a.carboidratos ?? 0;
  const calorias = a.energia_kcal ?? a.calorias ?? 0;

  return (
    <div className="flex items-start justify-between py-3 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{a.descricao}</span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">{item.quantidade}g</span>
      </div>
      <div className="flex items-center gap-3 text-xs text-right">
        <div className="flex flex-col">
          <span className="text-zinc-400 mb-0.5 text-[10px]">Prot.</span>
          <span className="font-semibold text-blue-600">{(proteina * fator).toFixed(1)}g</span>
        </div>
        <div className="flex flex-col">
          <span className="text-zinc-400 mb-0.5 text-[10px]">Gord.</span>
          <span className="font-semibold text-rose-500">{(gordura * fator).toFixed(1)}g</span>
        </div>
        <div className="flex flex-col">
          <span className="text-zinc-400 mb-0.5 text-[10px]">Carbs</span>
          <span className="font-semibold text-amber-600">{(carboidratos * fator).toFixed(1)}g</span>
        </div>
        <div className="flex flex-col min-w-[40px]">
          <span className="text-zinc-400 mb-0.5 text-[10px]">Kcal</span>
          <span className="font-semibold text-emerald-600">{(calorias * fator).toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── RefeicaoCard ─────────────────────────────────────────────────────────────

function RefeicaoCard({ refeicao, onEditar, onToggleConcluida }) {
  const [aberto, setAberto] = useState(false);

  const totais = (refeicao.alimentos_refeicoes || []).reduce(
    (acc, item) => {
      const fator = item.quantidade / 100;
      const a = item.alimentos;

      const proteina = a.Prote_na__g_ ?? a.proteina ?? 0;
      const gordura = a.Lip_deos__g_ ?? a.lipideos ?? 0;
      const carboidratos = a.Carboidrato__g_ ?? a.carboidratos ?? 0;
      const calorias = a.energia_kcal ?? a.calorias ?? 0;

      return {
        proteina: acc.proteina + (proteina * fator),
        carboidratos: acc.carboidratos + (carboidratos * fator),
        gordura: acc.gordura + (gordura * fator),
        calorias: acc.calorias + (calorias * fator),
      };
    },
    { proteina: 0, carboidratos: 0, gordura: 0, calorias: 0 }
  );

  const temAlimentos = (refeicao.alimentos_refeicoes?.length || 0) > 0;
  const concluida = refeicao.concluida;

  const formatarHora = (data) => {
    if (!data) return "--:--";
    return new Date(data).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    });
  };

  const handleCheck = (e) => {
    e.stopPropagation();

    if (!concluida && refeicao.horario) {
      const refeicaoDate = new Date(refeicao.horario);

      const dataRefeicaoHoje = new Date();
      dataRefeicaoHoje.setHours(refeicaoDate.getUTCHours(), refeicaoDate.getUTCMinutes(), 0, 0);

      const agora = new Date();

      const diffEmMilissegundos = agora - dataRefeicaoHoje;

      const limiteAtrasoMs = 4 * 60 * 60 * 1000;

      if (diffEmMilissegundos > limiteAtrasoMs) {
        alert("Tempo esgotado! Esta refeição está atrasada há mais de 4 horas e não pode mais ser marcada.");
        return;
      }
    }

    onToggleConcluida(refeicao.id, !concluida);
  };

  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${concluida ? 'border-zinc-100 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-900/20 opacity-70' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700'}`}>

      <div className="w-full flex items-center p-4 sm:p-5">

        <button
          onClick={handleCheck}
          className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors mr-4 ${concluida ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-300 dark:border-zinc-600 text-transparent hover:border-emerald-400 dark:hover:border-emerald-500'}`}
        >
          {concluida && <Check size={16} strokeWidth={3} />}
        </button>

        <div
          onClick={() => temAlimentos && setAberto(!aberto)}
          className={`flex-1 flex items-center justify-between ${temAlimentos ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <div className="flex items-center gap-4">
            <div className={`flex flex-col items-center justify-center w-11 h-11 rounded-xl border shrink-0 transition-colors ${concluida ? 'bg-transparent border-zinc-200 dark:border-zinc-800' : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'}`}>
              <Clock size={12} className="text-zinc-400 mb-0.5" />
              <span className={`text-xs font-semibold ${concluida ? 'text-zinc-400' : ''}`}>{formatarHora(refeicao.horario)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className={`text-sm font-semibold transition-colors ${concluida ? 'text-zinc-500 line-through' : 'text-zinc-900 dark:text-zinc-100'}`}>
                {refeicao.nome}
              </span>
              {temAlimentos && (
                <div className={`flex items-center gap-3 text-[10px] uppercase font-bold tracking-tight transition-colors ${concluida ? 'text-zinc-400 grayscale' : 'text-zinc-500'}`}>
                  <span className={concluida ? '' : 'text-emerald-500'}>{totais.calorias.toFixed(0)} kcal</span>
                  <span className={concluida ? '' : 'text-blue-500'}>{totais.proteina.toFixed(1)}g P</span>
                  <span className={concluida ? '' : 'text-rose-500'}>{totais.gordura.toFixed(1)}g G</span>
                  <span className={concluida ? '' : 'text-amber-500'}>{totais.carboidratos.toFixed(1)}g C</span>
                </div>
              )}
            </div>
          </div>
          <motion.div animate={{ rotate: aberto ? 180 : 0 }} className={`text-zinc-400 ${concluida ? 'opacity-50' : ''}`}>
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </div>

      {temAlimentos && !concluida && <div className="px-5 pb-3"><MacroBar {...totais} /></div>}

      <AnimatePresence>
        {aberto && temAlimentos && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-5 pb-5 border-t border-zinc-100 dark:border-zinc-800/60">
              {refeicao.alimentos_refeicoes.map((item) => (
                <AlimentoItem key={item.alimentoId} item={item} />
              ))}
              <div className="mt-4 flex justify-end">
                <button onClick={() => onEditar(refeicao)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 transition-all">
                  <Pencil size={13} /> Editar Refeição
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export function ListaRefeicoes({ onNovaRefeicao, onEditar, drawerAberto, onAbrirDrawer, onFecharDrawer }) {
  const [dietas, setDietas] = useState([]);
  const [dietaAtiva, setDietaAtiva] = useState(null);
  const [refeicoes, setRefeicoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dietaPendente, setDietaPendente] = useState(null);

  useEffect(() => {
    async function carregarDietas() {
      try {
        const { data } = await api.get('/diets');
        setDietas(data);
        if (data.length > 0) setDietaAtiva(data[0]);
      } catch (err) {
        console.error("Erro ao buscar dietas", err);
      }
    }
    carregarDietas();
  }, []);

  const carregarRefeicoes = async () => {
    if (!dietaAtiva) return;
    setIsLoading(true);
    try {
      const { data } = await api.get(`/meals?dietaId=${dietaAtiva.id}`);
      setRefeicoes(data);
    } catch (err) {
      console.error("Erro ao buscar refeições", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarRefeicoes();
  }, [dietaAtiva]);

  const handleToggleConcluida = async (refeicaoId, novoStatus) => {
    setRefeicoes(refeicoesAtuais =>
      refeicoesAtuais.map(r =>
        r.id === refeicaoId ? { ...r, concluida: novoStatus } : r
      )
    );

    if (navigator.onLine) {
      try {
        await api.patch(`/meals/${refeicaoId}`, { concluida: novoStatus });
      } catch (error) {
        console.error("Erro ao atualizar", error);
        carregarRefeicoes();
      }
    } else {
      SyncManager.adicionarNaFila('patch', `/meals/${refeicaoId}`, { concluida: novoStatus });
    }
  };

  const totaisDia = refeicoes.reduce((acc, refeicao) => {
    const t = (refeicao.alimentos_refeicoes || []).reduce((a, item) => {
      const f = item.quantidade / 100;
      const al = item.alimentos;

      const proteina = al.Prote_na__g_ ?? al.proteina ?? 0;
      const gordura = al.Lip_deos__g_ ?? al.lipideos ?? 0;
      const carboidratos = al.Carboidrato__g_ ?? al.carboidratos ?? 0;
      const calorias = al.energia_kcal ?? al.calorias ?? 0;

      return {
        p: a.p + (proteina * f),
        c: a.c + (carboidratos * f),
        g: a.g + (gordura * f),
        k: a.k + (calorias * f),
      };
    }, { p: 0, c: 0, g: 0, k: 0 });

    return {
      proteina: acc.proteina + t.p,
      carboidratos: acc.carboidratos + t.c,
      gordura: acc.gordura + t.g,
      calorias: acc.calorias + t.k,
    };
  }, { proteina: 0, carboidratos: 0, gordura: 0, calorias: 0 });

  const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  if (isLoading && !dietaAtiva) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <Loader2 className="animate-spin text-zinc-400" size={32} />
      <span className="text-zinc-500 text-sm">Carregando seu plano...</span>
    </div>
  );

  return (
    <>
      <DietaDrawer
        aberto={drawerAberto}
        onFechar={onFecharDrawer}
        dietaAtiva={dietaAtiva}
        dietas={dietas}
        onSelecionarDieta={(d) => { setDietaPendente(d); }}
      />

      <ConfirmacaoModal
        dietaAlvo={dietaPendente}
        onConfirmar={() => { setDietaAtiva(dietaPendente); setDietaPendente(null); onFecharDrawer(); }}
        onCancelar={() => setDietaPendente(null)}
      />

      <div className="w-full max-w-xl mx-auto p-6 sm:p-8 bg-white dark:bg-zinc-950 rounded-2xl sm:border border-zinc-200 dark:border-zinc-800">

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Refeições do Dia</h2>
            <p className="text-sm text-zinc-500 capitalize">{hoje}</p>
          </div>
          <button onClick={onNovaRefeicao} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-medium shadow-sm transition-transform active:scale-95">
            <Plus size={14} strokeWidth={2} /> Nova Refeição
          </button>
        </div>

        {dietaAtiva && (
          <button onClick={onAbrirDrawer} className="mb-6 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-xs text-zinc-500 font-medium">Plano: {dietaAtiva.nome || dietaAtiva.nomeDieta}</span>
          </button>
        )}

        <div className="mb-8 p-5 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Resumo Diário</span>
            <span className="text-xl font-black">{totaisDia.calorias.toFixed(0)} kcal</span>
          </div>
          <MacroBar {...totaisDia} />
          <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] font-bold uppercase text-center opacity-80">
            <div><p>Proteína</p><p className="text-sm">{totaisDia.proteina.toFixed(1)}g</p></div>
            <div><p>Carbs</p><p className="text-sm">{totaisDia.carboidratos.toFixed(1)}g</p></div>
            <div><p>Gordura</p><p className="text-sm">{totaisDia.gordura.toFixed(1)}g</p></div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-zinc-300" /></div>
          ) : refeicoes.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <UtensilsCrossed size={24} className="text-zinc-300" />
              <p className="text-xs text-zinc-500">Toque em "Nova Refeição" para começar.</p>
            </div>
          ) : (
            refeicoes.map((refeicao) => (
              <RefeicaoCard
                key={refeicao.id}
                refeicao={refeicao}
                onEditar={onEditar}
                onToggleConcluida={handleToggleConcluida}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
