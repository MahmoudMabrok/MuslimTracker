
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import TrackerPage from "@/pages/TrackerPage";
import StatisticsPage from "@/pages/StatisticsPage";
import AchievementsPage from "@/pages/AchievementsPage";
import Layout from "@/components/Layout";

function AppRouter() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/tracker" element={<TrackerPage/>} />
          <Route path="/statistics" element={<StatisticsPage/>} />
          <Route path="/achievements" element={<AchievementsPage/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
