import { UserContext, UserContextValue } from '../../context/UserContext';
import { Badge } from '../shadcn/ui/badge';
import { CiMenuKebab } from 'react-icons/ci';
import { useContext } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../shadcn/ui/dropdown-menu';

interface Props {
  id: number;
  content: string;
  userId: number;
  userName: string;
  deleteReplyHandler: (id: number) => void;
}

function Reply({ userName, id, content, userId, deleteReplyHandler }: Props) {
  const { user } = useContext(UserContext) as UserContextValue;
  const checkUserAthorization = () => {
    return user && user.id === userId;
  };

  const handleDelete = () => {
    if (!checkUserAthorization()) return;
    deleteReplyHandler(id);
  };

  return (
    <div className="flex mt-2 mb-2">
      <Badge className="mr-2 h-8">{userName === '' ? 'Unknown' : userName}</Badge>
      <div className="grow flex justify-between items-center">
        <div>{content}</div>
        {checkUserAthorization() && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rotate-90 w-8 h-8 flex items-center justify-center">
                <CiMenuKebab />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleDelete}>삭제</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

export default Reply;
