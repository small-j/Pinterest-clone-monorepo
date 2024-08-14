import { getMainImages } from '../api/image.api';
import ImagePinList from '../components/image/ImagePinList';

function HomePage() {
    // TODO: 로그인 확인 후 안되어있다면 리다이렉션. -> /login.

  return (
    <div>
      <ImagePinList getDataFunc={getMainImages}></ImagePinList>
    </div>
  );
}
export default HomePage;
