import './styles/main.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatDetailPage from './pages/ChatDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
