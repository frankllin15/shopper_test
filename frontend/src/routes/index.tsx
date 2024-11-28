import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RequestRidePage from '@/pages/RequestRidePage.tsx';
import  HistoryPage from "@/pages/History.tsx";
import { Layout } from "@/components/layout";


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path={"/"} element={<Layout />}>
          <Route path="/" element={<RequestRidePage />} />
          <Route path="history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;


