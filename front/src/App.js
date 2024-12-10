import { BrowserRouter, Routes, Route } from 'react-router-dom';

import RegisterC from './Pages/RegisterC';
import RegisterA from './Pages/RegisterA';
import Login from './Pages/Login';
import HomeCl from './Pages/HomeCl';
import HomeAd from './Pages/HomeAd';
import Visiteur from './Pages/Visiteur';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/admin-home" element={<HomeAd />} />
          <Route path="/client-home" element={<HomeCl />} />
          <Route path="/registerC" element={<RegisterC/>} />
          <Route path="/registerA" element={<RegisterA/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Visiteur />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
