import { Route, Routes, BrowserRouter } from "react-router-dom";
import GuestLayout from "./layout/GuestLayout";
import Home from "./pages/Home";
import DramaList from "./pages/DramaList";
import Favorites from "./pages/Favorites";
import Compare from "./pages/Compare";

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<GuestLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/dramaList" element={<DramaList />} />
            <Route path="/Favorites" element={<Favorites />} />
            <Route path="/confronto-drama" element={<Compare />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
