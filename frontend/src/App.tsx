import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ImagePinFormPage from './pages/ImagePinFormPage';
import ImagePinDetailPage from './pages/ImagePinDetailPage';
import LoginPage from './pages/LoginPage';
import JoinPage from './pages/JoinPage';
import Layout from './Layout';
import { UserProvider } from './context/UserContext';
import PrivateRoute from './components/common/PrivateRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />}></Route>
              <Route path="/join" element={<JoinPage />}></Route>
              <Route element={<PrivateRoute />}>
                <Route
                  path="/"
                  element={
                    <Layout>
                      <HomePage />
                    </Layout>
                  }
                ></Route>
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
                  path="/image-pin-detail/:id"
                  element={
                    <Layout>
                      <ImagePinDetailPage />
                    </Layout>
                  }
                ></Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export default App;
