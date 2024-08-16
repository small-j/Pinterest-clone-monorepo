import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ImagePinFormPage from './pages/ImagePinFormPage';
import ImagePinDetailPage from './pages/ImagePinDetailPage';
import LoginPage from './pages/LoginPage';
import JoinPage from './pages/JoinPage';
import Layout from './Layout';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          ></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/join" element={<JoinPage />}></Route>
          <Route
            path="/search/:searchWord"
            element={
              <Layout>
                <SearchPage />
              </Layout>
            }
          ></Route>
          <Route
            path="/make-image-pin"
            element={
              <Layout>
                <ImagePinFormPage />
              </Layout>
            }
          ></Route>
          <Route
            path="/image-pin-detail"
            element={
              <Layout>
                <ImagePinDetailPage />
              </Layout>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
