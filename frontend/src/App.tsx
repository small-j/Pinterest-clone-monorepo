import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ImagePinFormPage from './pages/ImagePinFormPage';
import ImagePinDetailPage from './pages/ImagePinDetailPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>}></Route>
          <Route path="/search"element={<SearchPage/>}></Route>
          <Route path="/make-image-pin" element={<ImagePinFormPage/>}></Route>
          <Route path="/image-pin-detail" element={<ImagePinDetailPage/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
