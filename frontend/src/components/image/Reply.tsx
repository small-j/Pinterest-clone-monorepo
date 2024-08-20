import { Badge } from '../shadcn/ui/badge';
import { CiMenuKebab } from "react-icons/ci";

interface Props {
  userName: string;
  id: number;
  content: string;
}

function Reply({ userName, id, content }: Props) {
  const handleDelete = () => {
    // todo delete 요청
  };

  return (
      <div className="flex mt-2 mb-2">
        <Badge className="mr-2">{userName === '' ? 'Unknown' : userName}</Badge>
        <div className='w-full flex justify-between'>
          <div>{content}</div>
          <button className='rotate-90' onClick={handleDelete}><CiMenuKebab /></button>
        </div>
      </div>
  );
}

export default Reply;
