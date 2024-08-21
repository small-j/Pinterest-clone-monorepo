import { IoIosArrowDown } from 'react-icons/io';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../shadcn/ui/dropdown-menu';
import Profile from './Profile';
import { useContext, useEffect } from 'react';
import { UserContext, UserContextValue } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

function ProfileControl() {
  const { user, logout } = useContext(UserContext) as UserContextValue;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/');
  }, []);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className='w-6 h-6 mx-2 flex justify-center items-center'>
          <IoIosArrowDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className='min-w-[180px]'>
            <Profile
              name={user?.name || ''}
              email={user?.email || ''}
              marginTop='0'
              marginBottom='0'
            ></Profile>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()}>로그아웃</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ProfileControl;
