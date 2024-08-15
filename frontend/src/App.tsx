import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ImagePinFormPage from './pages/ImagePinFormPage';
import ImagePinDetailPage from './pages/ImagePinDetailPage';
import LoginPage from './pages/LoginPage';
import JoinPage from './pages/JoinPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>}></Route>
          <Route path="/login" element={<LoginPage/>}></Route>
          <Route path="/join" element={<JoinPage/>}></Route>
          <Route path="/search"element={<SearchPage/>}></Route>
          <Route path="/make-image-pin" element={<ImagePinFormPage/>}></Route>
          <Route path="/image-pin-detail" element={<ImagePinDetailPage/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
