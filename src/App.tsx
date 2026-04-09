import Portfolio from './pages/Portfolio';
import { LoginModal } from './components/LoginModal';
import { EditToolbar } from './components/EditToolbar';
import { Analytics } from "@vercel/analytics/react";
import "./App.css"

function App() {
  return (
    <>
      <Portfolio />
      <LoginModal />
      <EditToolbar />
      <Analytics />
    </>
  );
}

export default App
