import Layout from '../components/Layout';
import ChatBot from '../components/ChatBot';
import EmotionChart from '../components/EmotionChart';
import DiaryCard from '../components/DiaryCard';

export default function HomePage() {
  return (
    <Layout
      left={<EmotionChart />}
      center={<ChatBot />}
      right={<DiaryCard />}
    />
  );
}
