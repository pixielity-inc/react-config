import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import ConfigDemoPage from "@/pages/config-demo";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<ConfigDemoPage />} path="/config" />
    </Routes>
  );
}

export default App;
