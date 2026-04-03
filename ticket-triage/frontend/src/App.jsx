import { useEffect, useState } from 'react';
import { getTickets } from './api/ticketApi';
import TicketForm from './components/TicketForm';
import ResultPanel from './components/ResultPanel';
import TicketList from './components/TicketList';
import './App.css';

function App() {
  const [currentResult, setCurrentResult] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [toast, setToast] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const timer = window.setTimeout(() => setToast(''), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const subtitle =
    'Heuristic AI workflow for categorization, urgency detection, and instant prioritization.';

  const fetchTickets = async () => {
    setListLoading(true);
    try {
      const data = await getTickets(50);
      setTickets(data.tickets || []);
    } catch (error) {
      setToast(error?.response?.data?.detail || 'Failed to fetch tickets');
    } finally {
      setListLoading(false);
    }
  };

  const handleResult = async (result) => {
    setCurrentResult(result);
    await fetchTickets();
  };

  const handleError = (error) => {
    setToast(error?.response?.data?.detail || 'Something went wrong while analyzing');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>AI Ticket Triage</h1>
          <p>{subtitle}</p>
        </div>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
        >
          {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
        </button>
      </header>

      <main className="app-content">
        <TicketForm
          onResult={handleResult}
          onError={handleError}
          onLoadingChange={setAnalyzing}
        />
        <ResultPanel result={currentResult} />
        <TicketList tickets={tickets} loading={listLoading || analyzing} onRefresh={fetchTickets} />
      </main>

      {toast ? (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

export default App;
