import Portfolio from './pages/Portfolio';
import { LoginModal } from './components/LoginModal';
import { EditToolbar } from './components/EditToolbar';
import "./App.css"

function App() {
  return (
    <>
      <Portfolio />
      <LoginModal />
      <EditToolbar />
    </>
  );
}

export default App
