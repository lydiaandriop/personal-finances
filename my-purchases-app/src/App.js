import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Metrics from "./pages/Metrics";
import PurchaseInput from "./pages/PurchaseInput";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PurchaseInput />} />
        <Route path="/metrics" element={<Metrics />} />
      </Routes>
    </Router>
  );
}

export default App;
