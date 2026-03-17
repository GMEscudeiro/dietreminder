import { useState } from 'react';
import { ChevronDown, UtensilsCrossed, Plus, Clock, Flame, Beef, Wheat, Pencil, X, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Dados mockados ───────────────────────────────────────────────────────────

const dietasMock = [
  {
    id: '1',
    nome: 'Hipertrofia',
    descricao: 'Foco em ganho de massa',
    refeicoes: [
      {
        id: 'r1', nome: 'Café da Manhã', horario: '07:30',
        alimentos: [
          { id: 'a1', nome: 'Aveia', gramas: 80, proteina: 10.4, carboidratos: 54.2, gordura: 5.6, calorias: 303 },
          { id: 'a2', nome: 'Banana', gramas: 120, proteina: 1.3, carboidratos: 27.0, gordura: 0.4, calorias: 107 },
          { id: 'a3', nome: 'Leite Integral', gramas: 200, proteina: 6.6, carboidratos: 9.6, gordura: 6.4, calorias: 122 },
        ],
      },
      {
        id: 'r2', nome: 'Almoço', horario: '12:00',
        alimentos: [
          { id: 'b1', nome: 'Arroz Branco', gramas: 150, proteina: 3.9, carboidratos: 43.5, gordura: 0.5, calorias: 194 },
          { id: 'b2', nome: 'Feijão Carioca', gramas: 100, proteina: 8.7, carboidratos: 22.0, gordura: 0.6, calorias: 130 },
          { id: 'b3', nome: 'Frango Grelhado', gramas: 200, proteina: 47.4, carboidratos: 0.0, gordura: 5.0, calorias: 234 },
        ],
      },
      {
        id: 'r3', nome: 'Lanche da Tarde', horario: '15:30',
        alimentos: [
          { id: 'c1', nome: 'Iogurte Grego', gramas: 170, proteina: 17.0, carboidratos: 6.0, gordura: 0.7, calorias: 100 },
          { id: 'c2', nome: 'Mix de Castanhas', gramas: 30, proteina: 3.6, carboidratos: 5.4, gordura: 9.6, calorias: 120 },
        ],
      },
      { id: 'r4', nome: 'Jantar', horario: '19:30', alimentos: [] },
    ],
  },
  {
    id: '2',
    nome: 'Emagrecimento',
    descricao: 'Déficit calórico',
    refeicoes: [
      {
        id: 'r5', nome: 'Café da Manhã', horario: '08:00',
        alimentos: [
          { id: 'd1', nome: 'Ovo Mexido', gramas: 100, proteina: 13.0, carboidratos: 1.1, gordura: 9.5, calorias: 143 },
          { id: 'd2', nome: 'Pão Integral', gramas: 50, proteina: 4.0, carboidratos: 22.0, gordura: 1.5, calorias: 118 },
        ],
      },
      {
        id: 'r6', nome: 'Almoço', horario: '12:30',
        alimentos: [
          { id: 'e1', nome: 'Frango Grelhado', gramas: 150, proteina: 35.6, carboidratos: 0.0, gordura: 3.8, calorias: 176 },
          { id: 'e2', nome: 'Salada Verde', gramas: 120, proteina: 1.8, carboidratos: 4.8, gordura: 0.4, calorias: 27 },
        ],
      },
      { id: 'r7', nome: 'Jantar', horario: '19:00', alimentos: [] },
    ],
  },
  {
    id: '3',
    nome: 'Manutenção',
    descricao: 'Equilíbrio calórico',
    refeicoes: [
      {
        id: 'r8', nome: 'Café da Manhã', horario: '07:00',
        alimentos: [
          { id: 'f1', nome: 'Granola', gramas: 60, proteina: 5.4, carboidratos: 40.2, gordura: 6.0, calorias: 234 },
          { id: 'f2', nome: 'Iogurte Natural', gramas: 150, proteina: 6.0, carboidratos: 7.5, gordura: 3.0, calorias: 81 },
        ],
      },
      { id: 'r9', nome: 'Almoço', horario: '12:00', alimentos: [] },
      { id: 'r10', nome: 'Jantar', horario: '19:30', alimentos: [] },
    ],
  },
];

// ─── MacroBar ─────────────────────────────────────────────────────────────────

function MacroBar({ proteina, carboidratos, gordura }) {
  const total = proteina + carboidratos + gordura;
  if (total === 0) return null;
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
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                  <AlertCircle size={18} strokeWidth={1.5} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Trocar dieta ativa?
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    As refeições exibidas serão trocadas para a dieta{' '}
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">"{dietaAlvo.nome}"</span>.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onCancelar}
                  className="flex-1 py-2.5 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={onConfirmar}
                  className="flex-1 py-2.5 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Drawer lateral de dietas ─────────────────────────────────────────────────

function DietaDrawer({ aberto, onFechar, dietaAtiva, onSelecionarDieta }) {
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
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Minhas Dietas</h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Selecione a dieta ativa</p>
              </div>
              <button
                type="button"
                onClick={onFechar}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Lista de dietas */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {dietasMock.map((dieta) => {
                const ativa = dietaAtiva.id === dieta.id;
                return (
                  <button
                    key={dieta.id}
                    type="button"
                    onClick={() => onSelecionarDieta(dieta)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      ativa
                        ? 'border-zinc-900 dark:border-zinc-300 bg-zinc-900 dark:bg-zinc-100'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold ${ativa ? 'text-white dark:text-zinc-900' : 'text-zinc-900 dark:text-zinc-100'}`}>
                        {dieta.nome}
                      </span>
                      {ativa && (
                        <div className="w-5 h-5 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center shrink-0">
                          <Check size={11} strokeWidth={2.5} className="text-zinc-900 dark:text-zinc-100" />
                        </div>
                      )}
                    </div>
                    <span className={`text-xs mt-1 block ${ativa ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-400 dark:text-zinc-500'}`}>
                      {dieta.descricao}
                    </span>
                    <span className={`text-xs mt-2 block ${ativa ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-400 dark:text-zinc-500'}`}>
                      {dieta.refeicoes.length} refeições
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center">
                Dieta ativa:{' '}
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{dietaAtiva.nome}</span>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── AlimentoItem ─────────────────────────────────────────────────────────────

function AlimentoItem({ alimento }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{alimento.nome}</span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">{alimento.gramas}g</span>
      </div>
      <div className="flex items-center gap-3 text-xs text-right">
        <span className="flex flex-col items-end">
          <span className="text-zinc-400 dark:text-zinc-500 mb-0.5">Prot.</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">{alimento.proteina.toFixed(1)}g</span>
        </span>
        <span className="flex flex-col items-end">
          <span className="text-zinc-400 dark:text-zinc-500 mb-0.5">Carbs</span>
          <span className="font-semibold text-amber-600 dark:text-amber-400">{alimento.carboidratos.toFixed(1)}g</span>
        </span>
        <span className="flex flex-col items-end">
          <span className="text-zinc-400 dark:text-zinc-500 mb-0.5">Gord.</span>
          <span className="font-semibold text-rose-500 dark:text-rose-400">{alimento.gordura.toFixed(1)}g</span>
        </span>
        <span className="flex flex-col items-end min-w-[40px]">
          <span className="text-zinc-400 dark:text-zinc-500 mb-0.5">Kcal</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{alimento.calorias}</span>
        </span>
      </div>
    </div>
  );
}

// ─── RefeicaoCard ─────────────────────────────────────────────────────────────

function RefeicaoCard({ refeicao, onEditar }) {
  const [aberto, setAberto] = useState(false);

  const totais = refeicao.alimentos.reduce(
    (acc, a) => ({
      proteina: acc.proteina + a.proteina,
      carboidratos: acc.carboidratos + a.carboidratos,
      gordura: acc.gordura + a.gordura,
      calorias: acc.calorias + a.calorias,
    }),
    { proteina: 0, carboidratos: 0, gordura: 0, calorias: 0 }
  );

  const temAlimentos = refeicao.alimentos.length > 0;

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
      {/* Cabeçalho */}
      <div
        onClick={() => temAlimentos && setAberto(!aberto)}
        className={`w-full flex items-center justify-between p-5 text-left transition-colors ${temAlimentos ? 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer' : 'cursor-default'}`}
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shrink-0">
            <Clock size={12} strokeWidth={1.5} className="text-zinc-400 dark:text-zinc-500 mb-0.5" />
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 leading-none">{refeicao.horario}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{refeicao.nome}</span>
            {temAlimentos ? (
              <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <Flame size={11} strokeWidth={1.5} className="text-emerald-500" />
                  {totais.calorias.toFixed(0)} kcal
                </span>
                <span className="flex items-center gap-1">
                  <Beef size={11} strokeWidth={1.5} className="text-blue-500" />
                  {totais.proteina.toFixed(1)}g prot.
                </span>
                <span className="flex items-center gap-1">
                  <Wheat size={11} strokeWidth={1.5} className="text-amber-500" />
                  {totais.carboidratos.toFixed(1)}g carbs
                </span>
              </div>
            ) : (
              <span className="text-xs text-zinc-400 dark:text-zinc-500">Nenhum alimento cadastrado</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          {temAlimentos && (
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/60 px-2 py-0.5 rounded-full hidden sm:block">
              {refeicao.alimentos.length} {refeicao.alimentos.length === 1 ? 'item' : 'itens'}
            </span>
          )}
          {temAlimentos ? (
            <motion.div
              animate={{ rotate: aberto ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-zinc-400 dark:text-zinc-500"
            >
              <ChevronDown size={18} strokeWidth={1.5} />
            </motion.div>
          ) : (
            <button
              type="button"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Adicionar alimento"
            >
              <Plus size={16} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      {/* Barra de macros */}
      {temAlimentos && (
        <div className="px-5 pb-3">
          <MacroBar proteina={totais.proteina} carboidratos={totais.carboidratos} gordura={totais.gordura} />
        </div>
      )}

      {/* Conteúdo expansível */}
      <AnimatePresence initial={false}>
        {aberto && temAlimentos && (
          <motion.div
            key="alimentos"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-zinc-100 dark:border-zinc-800/60">
              {/* Legenda */}
              <div className="flex items-center justify-between pt-4 pb-2 text-xs text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wider">
                <span>Alimento</span>
                <div className="flex gap-3">
                  <span className="hidden sm:block">Prot.</span>
                  <span className="hidden sm:block">Carbs</span>
                  <span className="hidden sm:block">Gord.</span>
                  <span>Kcal</span>
                </div>
              </div>

              {/* Alimentos */}
              <div>
                {refeicao.alimentos.map((alimento) => (
                  <AlimentoItem key={alimento.id} alimento={alimento} />
                ))}
              </div>

              {/* Total */}
              <div className="mt-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total</span>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
                  <span className="flex flex-col items-end">
                    <span className="text-zinc-400 dark:text-zinc-500 mb-0.5">Proteína</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{totais.proteina.toFixed(1)}g</span>
                  </span>
                  <span className="flex flex-col items-end">
                    <span className="text-zinc-400 dark:text-zinc-500 mb-0.5">Carbs</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{totais.carboidratos.toFixed(1)}g</span>
                  </span>
                  <span className="flex flex-col items-end">
                    <span className="text-zinc-400 dark:text-zinc-500 mb-0.5">Gordura</span>
                    <span className="font-bold text-rose-500 dark:text-rose-400">{totais.gordura.toFixed(1)}g</span>
                  </span>
                  <span className="flex flex-col items-end">
                    <span className="text-zinc-400 dark:text-zinc-500 mb-0.5">Calorias</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{totais.calorias.toFixed(0)} kcal</span>
                  </span>
                </div>
              </div>

              {/* Botão Editar */}
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={onEditar}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                >
                  <Pencil size={13} strokeWidth={1.5} />
                  Editar Refeição
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function ListaRefeicoes({ onNovaRefeicao, onEditar, drawerAberto, onAbrirDrawer, onFecharDrawer}) {
  const [dietaAtiva, setDietaAtiva] = useState(dietasMock[0]);
  const [dietaPendente, setDietaPendente] = useState(null);

  const refeicoes = dietaAtiva.refeicoes;

  const totaisDia = refeicoes.reduce(
    (acc, refeicao) => {
      const t = refeicao.alimentos.reduce(
        (a, al) => ({
          proteina: a.proteina + al.proteina,
          carboidratos: a.carboidratos + al.carboidratos,
          gordura: a.gordura + al.gordura,
          calorias: a.calorias + al.calorias,
        }),
        { proteina: 0, carboidratos: 0, gordura: 0, calorias: 0 }
      );
      return {
        proteina: acc.proteina + t.proteina,
        carboidratos: acc.carboidratos + t.carboidratos,
        gordura: acc.gordura + t.gordura,
        calorias: acc.calorias + t.calorias,
      };
    },
    { proteina: 0, carboidratos: 0, gordura: 0, calorias: 0 }
  );

  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const handleSelecionarDieta = (dieta) => {
    if (dieta.id === dietaAtiva.id) {
      onFecharDrawer();
      return;
    }
    setDietaPendente(dieta);
  };

  const handleConfirmarTroca = () => {
    setDietaAtiva(dietaPendente);
    setDietaPendente(null);
    onFecharDrawer();
  };

  return (
    <>
      <DietaDrawer
        aberto={drawerAberto}
        onFechar={onFecharDrawer}
        dietaAtiva={dietaAtiva}
        onSelecionarDieta={handleSelecionarDieta}
      />

      <ConfirmacaoModal
        dietaAlvo={dietaPendente}
        onConfirmar={handleConfirmarTroca}
        onCancelar={() => setDietaPendente(null)}
      />

      <div className="w-full max-w-xl mx-auto p-6 sm:p-8 bg-white dark:bg-zinc-950 rounded-2xl sm:border border-zinc-200 dark:border-zinc-800 sm:shadow-sm">

        {/* Cabeçalho */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
                Refeições do Dia
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 capitalize">{hoje}</p>
          </div>
          <button
            type="button"
            onClick={onNovaRefeicao}
            className="shrink-0 flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl text-xs font-medium transition-colors shadow-sm">
            <Plus size={14} strokeWidth={2} />
            Nova Refeição
          </button>
        </div>

        {/* Badge da dieta ativa */}
        <button
          type="button"
          onClick={onAbrirDrawer}
          className="mb-6 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Dieta ativa:</span>
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{dietaAtiva.nome}</span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
            — {dietaAtiva.descricao}
          </span>
        </button>

        {/* Resumo do dia */}
        <div className="mb-8 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Resumo do Dia
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {totaisDia.calorias.toFixed(0)} kcal
            </span>
          </div>
          <MacroBar proteina={totaisDia.proteina} carboidratos={totaisDia.carboidratos} gordura={totaisDia.gordura} />
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-center">
            <div className="flex flex-col gap-0.5">
              <span className="flex items-center justify-center gap-1 text-zinc-400 dark:text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
                Proteína
              </span>
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">{totaisDia.proteina.toFixed(1)}g</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="flex items-center justify-center gap-1 text-zinc-400 dark:text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
                Carboidratos
              </span>
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">{totaisDia.carboidratos.toFixed(1)}g</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="flex items-center justify-center gap-1 text-zinc-400 dark:text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block"></span>
                Gordura
              </span>
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">{totaisDia.gordura.toFixed(1)}g</span>
            </div>
          </div>
        </div>

        {/* Lista de refeições com animação ao trocar de dieta */}
        <AnimatePresence mode="wait">
          <motion.div
            key={dietaAtiva.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          >
            {refeicoes.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center text-zinc-400">
                  <UtensilsCrossed size={20} strokeWidth={1.5} />
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-[200px]">
                  Nenhuma refeição cadastrada para esta dieta.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {refeicoes.map((refeicao, index) => (
                  <motion.div
                    key={refeicao.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06, type: 'spring', stiffness: 400, damping: 30 }}
                  >
                    <RefeicaoCard refeicao={refeicao} onEditar={onEditar} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </>
  );
}