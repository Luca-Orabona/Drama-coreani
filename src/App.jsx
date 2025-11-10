import { Route, Routes, BrowserRouter } from "react-router-dom";
import GuestLayout from "./layout/GuestLayout";
import Home from "./pages/Home";
import DramaList from "./pages/DramaList";

function App() {


  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route element={<GuestLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/dramaList" element={<DramaList />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
