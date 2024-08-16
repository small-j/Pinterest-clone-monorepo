import { useLocation, useNavigate } from 'react-router-dom';
import { Menubar, MenubarMenu, MenubarTrigger } from '../shadcn/ui/menubar';
import SearchInput from './SearchInput';
import { useEffect, useState } from 'react';

function MainMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const [homeBg, setHomeBg] = useState('');
  const [makeImagePinBg, setMakeImagePinBg] = useState('');
  const buttonClasses = "h-12 min-w-[60px] px-[8px] py-0 rounded-full flex justify-center";

  const toHomePage = () => {
    navigate('/');
  };
  const toImagePinFormPage = () => {
    navigate('/make-image-pin');
  };

  useEffect(() => {
    if (location.pathname === '/') {
      setHomeBg('bg-black text-white');
    } else {
      setHomeBg('bg-transperant text-black');
    }
    if (location.pathname === '/make-image-pin') {
      setMakeImagePinBg('bg-black text-white');
    } else {
      setMakeImagePinBg('bg-transperant text-black');
    }
  }, [location.pathname]);

  return (
    <div>
      <Menubar className="h-[80px]">
        <MenubarMenu>
          <MenubarTrigger
            className={`${buttonClasses} ${homeBg}`}
            onClick={toHomePage}
          >
            <div>홈</div>
          </MenubarTrigger>
          <MenubarTrigger
            className={`${buttonClasses} ${makeImagePinBg}`}
            onClick={toImagePinFormPage}
          >
            <div>만들기</div>
          </MenubarTrigger>
          <SearchInput className="grow"></SearchInput>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}

export default MainMenu;
