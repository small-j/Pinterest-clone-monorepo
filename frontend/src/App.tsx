import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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
import { getMainImages } from './api/image.api';
import { commonValue } from './common.value';

function App() {
  const queryClient = new QueryClient();
  const mainImageLoader = () => {
    if (!visualViewport) throw new Error();
    const size = commonValue.IMAGE_DATA_PAGE_SIZE(visualViewport);

    return getMainImages({ size, page: 1 });
  }
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/join',
      element: <JoinPage />,
    },
    {
      element: <PrivateRoute />,
      children: [
        {
          path: '/',
          element: (
            <Layout>
              <HomePage />
            </Layout>
          ),
          loader: mainImageLoader
        },
        {
          path: '/search/:searchWord',
          element: (
            <Layout>
              <SearchPage />
            </Layout>
          ),
        },
        {
          path: '/make-image-pin',
          element: (
            <Layout>
              <ImagePinFormPage />
            </Layout>
          ),
        },
        {
          path: '/image-pin-detail/:id',
          element: (
            <Layout>
              <ImagePinDetailPage />
            </Layout>
          ),
        },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <div className="App">
          <RouterProvider router={router} />
        </div>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export default App;
