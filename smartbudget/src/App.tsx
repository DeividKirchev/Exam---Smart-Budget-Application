import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import TransactionsList from './pages/TransactionsList';
import TransactionForm from './pages/TransactionForm';
import NotFound from './pages/NotFound';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Layout>
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
        </Layout>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
