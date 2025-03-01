import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PurchaseInput from "./pages/PurchaseInput";
import Metrics from "./pages/Metrics";

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
