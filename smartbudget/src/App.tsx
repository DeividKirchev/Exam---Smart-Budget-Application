import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TransactionsList from './pages/TransactionsList';
import TransactionForm from './pages/TransactionForm';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <Link to="/dashboard" style={{ marginRight: '1rem' }}>
          Dashboard
        </Link>
        <Link to="/transactions" style={{ marginRight: '1rem' }}>
          Transactions
        </Link>
        <Link to="/transactions/new">Add Transaction</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<TransactionsList />} />
        <Route
          path="/transactions/new"
          element={<TransactionForm mode="create" />}
        />
        <Route
          path="/transactions/:id/edit"
          element={<TransactionForm mode="edit" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
