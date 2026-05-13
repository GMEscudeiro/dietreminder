import { useEffect, useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { 
  Activity, Target, Flame, ChevronLeft, 
  CheckCircle2, Circle, Calculator, PieChart as PieIcon, Share2, ImageDown
} from 'lucide-react';
import { DietsService } from '../services/diets';
import jsPDF from 'jspdf';


const COLORS = {
  protein: '#3b82f6',
  carbs: '#eab308',
  fat: '#ef4444',
  calories: '#10b981'
};


export function Dashboard({ onVoltar }) {
  const [loading, setLoading] = useState(true);
  const [dieta, setDieta] = useState(null);
  const [error, setError] = useState(null);
  const [compartilhando, setCompartilhando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const dashboardRef = useRef(null);


  useEffect(() => {
    async function loadData() {
      try {
        const data = await DietsService.getActive();
        setDieta(data);
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
        setError('Não foi possível carregar as informações da dieta.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);


  const stats = useMemo(() => {
    if (!dieta) return null;

    const hoje = new Date().getDay();
    const diaBackend = hoje === 0 ? 7 : hoje;

    const refeicoesHoje = dieta.refeicoes.filter(r => {
      const dia = r.dia_da_semana;
      if (dia === null || dia === undefined || Number(dia) === 0) return true;
      return Number(dia) === diaBackend;
    });

    let totalKcal = 0;
    let totalProt = 0;
    let totalCarb = 0;
    let totalFat = 0;
    let concluidaCount = 0;

    refeicoesHoje.forEach(refeicao => {
      if (refeicao.concluida) concluidaCount++;
      refeicao.alimentos_refeicoes.forEach(item => {
        const { alimentos, quantidade } = item;
        if (!alimentos) return;
        const mult = quantidade / 100;
        totalKcal += parseFloat(alimentos.energia_kcal || 0) * mult;
        totalProt += parseFloat(alimentos.Prote_na__g_ || 0) * mult;
        totalCarb += parseFloat(alimentos.Carboidrato__g_ || 0) * mult;
        totalFat += parseFloat(alimentos.Lip_deos__g_ || 0) * mult;
      });
    });

    const targetKcal = Number(dieta.caloriasTot || 0);
    const targetProt = Number(dieta.proteinaAlvo || 0);
    const targetCarb = Number(dieta.carboidratoAlvo || 0);
    const targetFat = Number(dieta.gorduraAlvo || 0);

    const macroData = [
      { name: 'Proteína', value: Math.round(totalProt), target: targetProt, color: COLORS.protein },
      { name: 'Carboidrato', value: Math.round(totalCarb), target: targetCarb, color: COLORS.carbs },
      { name: 'Gordura', value: Math.round(totalFat), target: targetFat, color: COLORS.fat },
    ];

    return {
      refeicoesHoje,
      concluidaCount,
      totalKcal: Math.round(totalKcal),
      totalProt: Math.round(totalProt),
      totalCarb: Math.round(totalCarb),
      totalFat: Math.round(totalFat),
      targetKcal,
      targetProt,
      targetCarb,
      targetFat,
      macroData
    };
  }, [dieta]);


  function gerarDocPDF() {
    const doc = new jsPDF();
    const corVerde = [16, 185, 129];
    const corAzul = [59, 130, 246];
    const corCinza = [113, 113, 122];
    const hoje = new Date().toLocaleDateString('pt-BR', {
      weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
    });

    // Cabeçalho
    doc.setFillColor(24, 24, 27);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(dieta.nomeDieta, 14, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...corCinza);
    doc.text('Dashboard de acompanhamento diario', 14, 26);
    doc.text(hoje, 14, 33);

    // Cards métricas
    const cards = [
      { label: 'CALORIAS',  value: `${stats.totalKcal} kcal`, meta: `Meta: ${stats.targetKcal} kcal`, percent: Math.min(100, Math.round((stats.totalKcal / stats.targetKcal) * 100) || 0), cor: corVerde },
      { label: 'REFEICOES', value: `${stats.concluidaCount} / ${stats.refeicoesHoje.length}`, meta: 'Concluidas hoje', percent: Math.min(100, Math.round((stats.concluidaCount / stats.refeicoesHoje.length) * 100) || 0), cor: corAzul },
      { label: 'PROTEINAS', value: `${stats.totalProt}g`, meta: `Meta: ${stats.targetProt}g`, percent: Math.min(100, Math.round((stats.totalProt / stats.targetProt) * 100) || 0), cor: corAzul },
    ];

    let y = 50;
    cards.forEach((card, i) => {
      const x = 14 + i * 62;
      doc.setFillColor(39, 39, 42);
      doc.roundedRect(x, y, 58, 35, 3, 3, 'F');
      doc.setTextColor(...corCinza);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text(card.label, x + 4, y + 8);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text(card.value, x + 4, y + 18);
      doc.setFontSize(8);
      doc.setTextColor(...corCinza);
      doc.text(card.meta, x + 4, y + 25);
      doc.setFillColor(63, 63, 70);
      doc.roundedRect(x + 4, y + 29, 50, 3, 1, 1, 'F');
      doc.setFillColor(...card.cor);
      doc.roundedRect(x + 4, y + 29, Math.max(1, 50 * card.percent / 100), 3, 1, 1, 'F');
    });

    // Macros
    y = 100;
    doc.setFillColor(39, 39, 42);
    doc.roundedRect(14, y, 182, 65, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Distribuicao de Macros', 20, y + 10);

    const macros = [
      { label: 'Proteina',    value: stats.totalProt, target: stats.targetProt, cor: corAzul },
      { label: 'Carboidrato', value: stats.totalCarb, target: stats.targetCarb, cor: [234, 179, 8] },
      { label: 'Gordura',     value: stats.totalFat,  target: stats.targetFat,  cor: [239, 68, 68] },
    ];

    macros.forEach((macro, i) => {
      const my = y + 20 + i * 14;
      const percent = Math.min(100, Math.round((macro.value / macro.target) * 100) || 0);
      doc.setTextColor(...corCinza);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(macro.label, 20, my);
      doc.text(`${macro.value}g / ${macro.target}g`, 80, my);
      doc.text(`${percent}%`, 170, my);
      doc.setFillColor(63, 63, 70);
      doc.roundedRect(110, my - 4, 55, 3, 1, 1, 'F');
      doc.setFillColor(...macro.cor);
      doc.roundedRect(110, my - 4, Math.max(1, 55 * percent / 100), 3, 1, 1, 'F');
    });

    // Refeições
    y = 175;
    const alturaRefeicoes = 10 + Math.max(1, stats.refeicoesHoje.length) * 14;
    doc.setFillColor(39, 39, 42);
    doc.roundedRect(14, y, 182, alturaRefeicoes, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Refeicoes de Hoje', 20, y + 8);

    stats.refeicoesHoje.forEach((refeicao, i) => {
      const ry = y + 18 + i * 14;
      const kcal = Math.round(refeicao.alimentos_refeicoes.reduce((acc, item) => {
        return acc + (parseFloat(item.alimentos?.energia_kcal || 0) * item.quantidade / 100);
      }, 0));
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      if (refeicao.concluida) {
        doc.setTextColor(16, 185, 129);
      } else {
        doc.setTextColor(113, 113, 122);
      }
      doc.text(refeicao.concluida ? '[OK]' : '[ ]', 20, ry);
      doc.setTextColor(255, 255, 255);
      doc.text(refeicao.nome, 32, ry);
      doc.setTextColor(...corCinza);
      doc.text(`${kcal} kcal`, 170, ry);
    });

    // Rodapé
    doc.setTextColor(...corCinza);
    doc.setFontSize(8);
    doc.text('Gerado pelo DietReminder', 14, 285);
    doc.text(new Date().toLocaleString('pt-BR'), 150, 285);

    return doc;
  }


  // Botão "Exportar" — abre menu de compartilhamento nativo (WhatsApp, Email, etc.)
  async function compartilharDashboard() {
    if (!stats || !dieta) return;
    setCompartilhando(true);

    try {
      const doc = gerarDocPDF();
      const nomeArquivo = `dashboard-${dieta.nomeDieta.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      const pdfBlob = doc.output('blob');
      const pdfFile = new File([pdfBlob], nomeArquivo, { type: 'application/pdf' });
      const textoResumo = `Meu acompanhamento de hoje pelo DietReminder\n\nCalorias: ${stats.totalKcal}/${stats.targetKcal} kcal\nProteinas: ${stats.totalProt}g/${stats.targetProt}g\nCarboidratos: ${stats.totalCarb}g/${stats.targetCarb}g\nGorduras: ${stats.totalFat}g/${stats.targetFat}g\nRefeicoes: ${stats.concluidaCount}/${stats.refeicoesHoje.length} concluidas`;

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        // Celular com suporte a compartilhar arquivos (Android Chrome, iOS Safari)
        await navigator.share({
          title: `Dashboard - ${dieta.nomeDieta}`,
          text: textoResumo,
          files: [pdfFile],
        });
      } else if (navigator.share) {
        // Celular sem suporte a arquivos: compartilha só o texto
        await navigator.share({
          title: `Dashboard - ${dieta.nomeDieta}`,
          text: textoResumo,
        });
      } else {
        // Desktop: baixa o PDF normalmente
        doc.save(nomeArquivo);
      }

    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Erro ao compartilhar:', err);
        alert('Não foi possível compartilhar.');
      }
    } finally {
      setCompartilhando(false);
    }
  }


  // Botão "Salvar PDF" — baixa direto sem abrir menu
  async function salvarPdf() {
    if (!stats || !dieta) return;
    setSalvando(true);

    try {
      const doc = gerarDocPDF();
      const nomeArquivo = `dashboard-${dieta.nomeDieta.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      doc.save(nomeArquivo);
    } catch (err) {
      console.error('Erro ao salvar PDF:', err);
      alert('Não foi possível salvar o PDF.');
    } finally {
      setSalvando(false);
    }
  }


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-zinc-50 rounded-full animate-spin mb-4" />
        <p className="text-zinc-500 animate-pulse">Calculando seu progresso...</p>
      </div>
    );
  }

  if (error || !dieta) {
    return (
      <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
        <Activity size={48} className="mx-auto text-zinc-400 mb-4" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Ops!</h2>
        <p className="text-zinc-500 mb-6">{error || 'Você ainda não tem uma dieta ativa.'}</p>
        <button
          onClick={onVoltar}
          className="px-6 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-full font-semibold transition-transform hover:scale-105"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div ref={dashboardRef} className="w-full max-w-4xl mx-auto space-y-6">
      <header className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={onVoltar}
            className="flex items-center gap-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors mb-2"
          >
            <ChevronLeft size={18} />
            <span className="text-sm font-medium">Voltar</span>
          </button>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {dieta.nomeDieta}
          </h1>
          <p className="text-zinc-500">Dashboard de acompanhamento diário</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={compartilharDashboard}
            disabled={compartilhando}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-full font-semibold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Share2 size={16} />
            {compartilhando ? 'Abrindo...' : 'Compartilhar'}
          </button>

          <button
            onClick={salvarPdf}
            disabled={salvando}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ImageDown size={16} />
            {salvando ? 'Salvando...' : 'Exportar PDF'}
          </button>

          <div className="hidden sm:block p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <Flame className="text-emerald-500 mb-1" size={24} />
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Status</div>
            <div className="text-lg font-black text-emerald-700 dark:text-emerald-300">Ativa</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardStat
          title="Calorias"
          value={stats.totalKcal}
          target={stats.targetKcal}
          unit="kcal"
          color="emerald"
          icon={<Flame size={20} />}
        />
        <CardStat
          title="Refeições"
          value={stats.concluidaCount}
          target={stats.refeicoesHoje.length}
          unit=""
          color="blue"
          icon={<CheckCircle2 size={20} />}
        />
        <CardStat
          title="Proteínas"
          value={stats.totalProt}
          target={stats.targetProt}
          unit="g"
          color="blue"
          icon={<Target size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <PieIcon size={20} className="text-zinc-400" />
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50">Distribuição de Macros (g)</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.macroData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                  {stats.macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Calculator size={20} className="text-zinc-400" />
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50">Consumo vs Metas</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.macroData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#3f3f46" opacity={0.1} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={12} width={80} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="value" name="Atual" radius={[0, 4, 4, 0]} barSize={20}>
                  {stats.macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <Bar dataKey="target" name="Meta" fill="#3f3f46" radius={[0, 4, 4, 0]} barSize={20} opacity={0.2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <h3 className="font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
          <Activity size={20} className="text-zinc-400" />
          Refeições de Hoje
        </h3>
        <div className="space-y-3">
          {stats.refeicoesHoje.length > 0 ? (
            stats.refeicoesHoje.map((refeicao) => (
              <div key={refeicao.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  {refeicao.concluida ? (
                    <CheckCircle2 size={24} className="text-emerald-500" />
                  ) : (
                    <Circle size={24} className="text-zinc-300 dark:text-zinc-700" />
                  )}
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-50">{refeicao.nome}</div>
                    <div className="text-xs text-zinc-500">
                      {new Date(refeicao.horario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                    {Math.round(refeicao.alimentos_refeicoes.reduce((acc, item) => {
                      const mult = item.quantidade / 100;
                      return acc + (parseFloat(item.alimentos?.energia_kcal || 0) * mult);
                    }, 0))} kcal
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-zinc-500 italic">Nenhuma refeição planejada para hoje.</p>
          )}
        </div>
      </div>
    </div>
  );
}


function CardStat({ title, value, target, unit, color, icon }) {
  const percent = Math.min(100, Math.round((value / target) * 100) || 0);

  const colorClasses = {
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    yellow: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    red: 'text-red-500 bg-red-500/10 border-red-500/20',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-xl border ${colorClasses[color]}`}>{icon}</div>
        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{title}</div>
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-3xl font-black text-zinc-900 dark:text-zinc-50">{value}</span>
        <span className="text-sm font-medium text-zinc-500">{unit}</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold text-zinc-400">
          <span>{percent}% DA META</span>
          <span>{target}{unit}</span>
        </div>
        <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            className={`h-full rounded-full ${
              color === 'emerald' ? 'bg-emerald-500' :
              color === 'blue' ? 'bg-blue-500' :
              color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
          />
        </div>
      </div>
    </motion.div>
  );
}
