import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '@/services/axios'; // supondo que você tenha axios configurado com baseURL
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

function formatCurrency(value) {
  const num = Number(value);
  return !isNaN(num)
    ? num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'R$ 0,00';
}

function formatCurrencyUSD(value) {
  const num = Number(value);
  return !isNaN(num)
    ? num.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' })
    : '$ 0,00';
}

function formatTimer(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function Card({ title, icon, value, to, className }) {
  return (
    <Link
      to={to}
      className={`bg-[#1f2937] rounded-xl p-6 shadow-lg flex flex-col items-center hover:bg-opacity-80 transition group focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      style={{ minWidth: 220 }}
    >
      <div className="mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-gray-300 text-2xl group-hover:text-white transition">{value}</p>
    </Link>
  );
}

function Carousel({ items, interval = 5000 }) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % items.length);
        setFade(true);
      }, 500);
    }, interval);
    return () => clearInterval(timer);
  }, [items.length, interval]);

  return (
    <div className="w-full bg-[#1f2937] rounded-xl p-6 shadow-lg flex flex-col items-center min-h-[180px] relative overflow-visible">
      <div className="relative w-full min-h-[130px] flex flex-col items-center justify-center">
        {items.map((item, i) => (
          <div
            key={i}
            className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${
              i === index ? (fade ? 'opacity-100' : 'opacity-0') : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={i !== index}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4 z-10 justify-center">
        {items.map((_, i) => (
          <span
            key={i}
            className={`block w-3 h-3 rounded-full cursor-pointer ${
              i === index ? 'bg-blue-500' : 'bg-gray-600'
            }`}
            onClick={() => setIndex(i)}
          ></span>
        ))}
      </div>
    </div>
  );
}

// Busca histórico dólar AwesomeAPI últimos N dias
async function fetchDollarHistoryAwesomeAPI(days = 5) {
  try {
    const res = await axios.get(`https://economia.awesomeapi.com.br/json/daily/USD-BRL/${days}`);
    return res.data;
  } catch (error) {
    console.error('Erro ao buscar histórico do dólar na AwesomeAPI:', error);
    return [];
  }
}

export default function DashboardFinance() {
  // Extrai userId do localStorage, tratando JSON ou string simples
  const rawUser = localStorage.getItem('user');
  let userId = null;
  try {
    const userObj = JSON.parse(rawUser);
    userId = userObj?.id ?? rawUser;
  } catch {
    userId = rawUser;
  }

  const navigate = useNavigate();

  const [vidaScore, setVidaScore] = useState(null);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(null);

  const [dollarQuote, setDollarQuote] = useState(null);
  const [dollarLastUpdate, setDollarLastUpdate] = useState(null);
  const [dollarTimer, setDollarTimer] = useState(300);
  const [dollarChangePercent, setDollarChangePercent] = useState(null);

  const [dollarHistory, setDollarHistory] = useState([]);
  const [carouselItems, setCarouselItems] = useState([]);
  const [stockLastUpdate, setStockLastUpdate] = useState(null);
  const [stockTimer, setStockTimer] = useState(300);

  useEffect(() => {
    if (!userId) {
      console.warn('Usuário não autenticado ou userId inválido');
      return;
    }

    async function fetchAll() {
      try {
        const txRes = await axios.get(`/finance/${userId}/transactions`);
        const txs = txRes.data;
        if (Array.isArray(txs)) {
          const incomeSum = txs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
          const expenseSum = txs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
          setIncome(incomeSum);
          setExpense(expenseSum);
          setBalance(incomeSum - expenseSum);
        } else {
          console.warn('Transações não são array:', txs);
          setIncome(0);
          setExpense(0);
          setBalance(0);
        }
      } catch (error) {
        console.error('Erro ao buscar transações:', error);
        setIncome(0);
        setExpense(0);
        setBalance(0);
      }

      try {
        const res = await axios.get(`/finance/${userId}/vida-score`);
        const score = res.data?.vidaScore;
        if (typeof score === 'number') {
          setVidaScore(score);
        } else {
          console.warn('vidaScore inválido:', score);
          setVidaScore(null);
        }
      } catch (error) {
        console.error('Erro ao buscar vidaScore:', error);
        setVidaScore(null);
      }
    }
    fetchAll();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    let dollarInterval;
    let dollarTimerInterval;

    async function fetchDollar() {
      try {
        const res = await axios.get('https://economia.awesomeapi.com.br/json/last/USD-BRL');
        const data = res.data?.USDBRL;
        const bidNum = Number(data?.bid);
        const pctChangeNum = Number(data?.pctChange);
        if (!isNaN(bidNum)) setDollarQuote(bidNum);
        else {
          console.warn('Cotação bid inválida:', data?.bid);
          setDollarQuote(null);
        }
        if (!isNaN(pctChangeNum)) setDollarChangePercent(pctChangeNum);
        else {
          console.warn('Cotação pctChange inválida:', data?.pctChange);
          setDollarChangePercent(null);
        }
        setDollarLastUpdate(new Date());
        setDollarTimer(300);
      } catch (error) {
        console.error('Erro ao buscar cotação atual do dólar:', error);
        setDollarQuote(null);
        setDollarChangePercent(null);
      }
    }

    fetchDollar();

    dollarInterval = setInterval(fetchDollar, 5 * 60 * 1000);

    dollarTimerInterval = setInterval(() => {
      setDollarTimer(t => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(dollarInterval);
      clearInterval(dollarTimerInterval);
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    let stockInterval;
    let stockTimerInterval;

    async function fetchStocks() {
      try {
        const res = await axios.get('https://brapi.dev/api/quote/list', {
          params: {
            sortField: 'percentChange',
            sortOrder: 'desc',
            limit: 10,
          },
        });

        const stocks = res.data?.stocks || [];

        const items = stocks.map((stock) => {
          const changePercent = Number(stock.change);
          const price = Number(stock.close);
          const color = changePercent >= 0 ? 'green' : 'red';
          const Icon = changePercent >= 0 ? TrendingUp : TrendingDown;
          const symbol = stock.stock || '—';
          const name = stock.name || '—';

          return (
            <div key={symbol} className="flex flex-col items-center">
              <Icon className={`w-8 h-8 text-${color}-400 mb-2`} />
              <h3 className="text-lg font-semibold text-center">
                {name} ({symbol})
              </h3>
              <p className={`text-2xl font-bold text-${color}-300`}>
                {!isNaN(price) ? price.toFixed(2) : '0.00'}
              </p>
              <p className="text-sm text-gray-400">
                {!isNaN(changePercent) ? changePercent.toFixed(2) : '0.00'}% hoje
              </p>
            </div>
          );
        });

        setCarouselItems(items);
        setStockLastUpdate(new Date());
        setStockTimer(300);
      } catch (err) {
        console.error('Erro ao buscar ações em alta:', err);
      }
    }

    fetchStocks();

    stockInterval = setInterval(fetchStocks, 5 * 60 * 1000);

    stockTimerInterval = setInterval(() => {
      setStockTimer(t => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(stockInterval);
      clearInterval(stockTimerInterval);
    };
  }, [userId]);

  useEffect(() => {
    async function loadDollarHistory() {
      const history = await fetchDollarHistoryAwesomeAPI(5);
      setDollarHistory(history);
    }
    loadDollarHistory();
  }, []);

  const dollarSlides = [
    <div key="cotacao" className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2">Cotação USD-BRL</h3>
      <p className="text-3xl font-bold text-yellow-400">
        {dollarQuote !== null ? dollarQuote.toFixed(4) : 'Carregando...'}
      </p>
      {dollarChangePercent !== null && (
        <p
          className={`text-sm mt-1 font-semibold ${
            dollarChangePercent >= 0 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {dollarChangePercent >= 0 ? '+' : ''}
          {dollarChangePercent.toFixed(2)}% hoje
        </p>
      )}
    </div>,
    <div key="historico" className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2">Histórico Últimos 5 Dias</h3>
      <ul className="text-sm text-gray-300 max-h-40 overflow-auto w-full px-4">
        {dollarHistory.length === 0 && <li>Carregando histórico...</li>}
        {dollarHistory.map(({ timestamp, bid }) => {
          const date = new Date(timestamp * 1000);
          const formattedDate = date.toLocaleDateString('pt-BR');
          const bidNum = Number(bid);
          return (
            <li key={timestamp} className="flex justify-between border-b border-gray-600 py-1">
              <span>{formattedDate}</span>
              <span>R$ {!isNaN(bidNum) ? bidNum.toFixed(4) : '0.0000'}</span>
            </li>
          );
        })}
      </ul>
    </div>,
    <div key="info" className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2">Informações Adicionais</h3>
      <p className="text-sm text-gray-300 max-w-xs text-center">
        O dólar influencia diretamente a economia brasileira e o mercado financeiro. Acompanhe as variações para melhores decisões.
      </p>
    </div>,
  ];

  const cards = [
    {
      title: 'V.I.D.A. Score',
      value: vidaScore !== null && !isNaN(vidaScore) ? vidaScore.toFixed(1) : '...',
      icon: <TrendingUp className="w-10 h-10 text-purple-400" />,
      to: '/dashboard/finance/vida-score',
    },
    {
      title: 'Receitas',
      value: formatCurrency(income),
      icon: <DollarSign className="w-10 h-10 text-green-400" />,
      to: '/dashboard/finance/income',
    },
    {
      title: 'Despesas',
      value: formatCurrency(expense),
      icon: <TrendingDown className="w-10 h-10 text-red-400" />,
      to: '/dashboard/finance/expense',
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col px-12 py-8 overflow-y-auto max-w-[1280px] mx-auto w-full">
        {/* Cards superiores */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          {cards.map((card, i) => (
            <Card key={i} {...card} />
          ))}
        </section>

        {/* Título do Saldo alinhado à esquerda */}
        <h2 className="text-xl font-semibold mb-4 max-w-[1280px] mx-auto px-2 w-full text-left">Saldo</h2>

        {/* Card do Saldo com espaçamento dinâmico */}
        <section className="mb-10 w-full max-w-[1280px] mx-auto px-2">
          <div className="bg-[#1f2937] rounded-xl p-8 shadow-lg flex items-center gap-10 w-full">
            {/* Saldo em BRL */}
            <div className="flex flex-col text-left flex-grow">
              <span className="text-3xl font-bold text-green-400">{formatCurrency(balance)}</span>
              <p className="text-sm text-gray-400 mt-1">Saldo em BRL</p>
            </div>

            {/* Saldo convertido em USD */}
            <div className="flex flex-col border-l border-gray-600 pl-8 text-left flex-grow">
              <span className="text-3xl font-bold text-yellow-400">
                {balance !== null && dollarQuote
                  ? formatCurrencyUSD(balance / dollarQuote)
                  : '$ 0,00'}
              </span>
              <p className="text-sm text-gray-400 mt-1">Saldo em USD</p>
            </div>

            {/* Botão editar */}
            <button
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold whitespace-nowrap ml-4"
              onClick={() => navigate('/dashboard/finance/edit-balance')}
            >
              Editar
            </button>
          </div>
        </section>

        {/* Seção Cotação do Dólar e Bolsa lado a lado alinhadas nas margens do container */}
        <section className="mb-10 w-full max-w-[1280px] mx-auto px-2 flex justify-between gap-6 flex-wrap">
          {/* Carrossel da Cotação do Dólar */}
          <div className="bg-[#1f2937] rounded-xl p-6 shadow-lg flex flex-col w-full md:w-[48%] min-h-[180px]">
            <h2 className="text-xl font-semibold mb-2 text-left">Informações do Dólar</h2>
            <Carousel items={dollarSlides} interval={6000} />
            <span className="text-xs text-gray-400 mt-3 block text-left">
              Atualizado em: {dollarLastUpdate ? dollarLastUpdate.toLocaleTimeString('pt-BR') : '--'}
            </span>
            <span className="text-xs text-gray-400 mt-1 font-mono text-left">
              Próxima atualização em: {formatTimer(dollarTimer)}
            </span>
          </div>

          {/* Card da Bolsa de Valores */}
          <div className="bg-[#1f2937] rounded-xl p-6 shadow-lg flex flex-col w-full md:w-[48%] min-h-[180px]">
            <h2 className="text-xl font-semibold mb-2 text-left">Bolsa de Valores</h2>
            <Carousel items={carouselItems} interval={5000} />
            <span className="text-xs text-gray-400 mt-3 block text-left">
              Atualizado em: {stockLastUpdate ? stockLastUpdate.toLocaleTimeString('pt-BR') : '--'}
            </span>
            <span className="text-xs text-gray-400 mt-1 font-mono text-left">
              Próxima atualização em: {formatTimer(stockTimer)}
            </span>
          </div>
        </section>
      </div>

      <DashboardRightPanel />
    </div>
  );
}
