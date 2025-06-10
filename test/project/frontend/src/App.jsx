import './styles/main.css';
import Layout from './components/Layout';
import ChatBot from './components/ChatBot';
import EmotionChart from './components/EmotionChart';
import DiaryCard from './components/DiaryCard';

function App() {
  return (
    <Layout
      left={<EmotionChart />}
      center={<ChatBot />}
      right={<DiaryCard />}
    />
  );
}

export default App;
