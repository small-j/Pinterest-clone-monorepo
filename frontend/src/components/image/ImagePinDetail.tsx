import { FieldValues, useForm } from 'react-hook-form';
import Profile from '../common/Profile';
import { Button } from '../shadcn/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../shadcn/ui/card';
import { Input } from '../shadcn/ui/input';
import RepliesArccordion from './RepliesArccordion';
import { createImageReply, deleteImageReply } from '../../api/reply.api';
import { useContext, useState } from 'react';
import { ImageReplyInfo } from '../../api/types/reply.data.type';
import { HiPaperAirplane } from 'react-icons/hi';
import { UserContext, UserContextValue } from '../../context/UserContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../shadcn/ui/dropdown-menu';
import { CiMenuKebab } from 'react-icons/ci';
import { createSaveImage } from '../../api/saveimage.api';

interface Props {
  id: number;
  url: string;
  title: string;
  content: string;
  userId: number;
  userName: string;
  userEmail: string;
  replies: ImageReplyInfo[];
  deleteImagePinRequest: (id: number) => void;
}

function ImagePinDetail({
  id,
  url,
  title,
  content,
  userId,
  userName,
  userEmail,
  replies,
  deleteImagePinRequest,
}: Props) {
  const { register, handleSubmit } = useForm();
  const [repliesState, setRepliesState] = useState<ImageReplyInfo[]>(replies);
  const { user } = useContext(UserContext) as UserContextValue;
  const [isSaved, setIsSaved] = useState(false);

  const addReply = (data: FieldValues) => {
    createImageReply({ content: data.reply, imageId: id }, (res) => {
      if (!res || !res.success) return; // todo: reply 생성 실패했다는 toast? alert? 띄우기.
      const newReply = res.data as ImageReplyInfo;
      setRepliesState([newReply, ...repliesState]);
    });
  };

  const checkUserAthorization = () => {
    return user && user.id === userId;
  };

  const handleDelete = () => {
    if (!checkUserAthorization()) return;
    deleteImagePinRequest(id);
  };

  const deleteReplyInState = (id: number) => {
    setRepliesState([...repliesState.filter((reply) => reply.id !== id)]);
  };

  const deleteImageReplyRequest = (id: number) => {
    deleteImageReply(id.toString(), (res) => {
      if (!res || !res.success) {
        // todo 댓글 삭제 실패 안내문 alert 띄우기.
        return;
      } else if (res.success) deleteReplyInState(id);
    });
  };

  const requesToCreateSaveImage = () => {
    createSaveImage(id, (res) => {
      if (!res || !res.success) {
        // todo 댓글 삭제 실패 안내문 alert 띄우기.
        return;
      }
      else if (res.success) setIsSaved(true);
    });
  }

  const requesToDeleteSaveImage = () => {

  }

  return (
    <Card className="flex w-[1016px] max-h-[1087px] mt-3 mb-3 relative">
      <div className="w-2/4 min-h-[472.5px] max-h-full">
        <img className="max-w-full max-h-full" src={url} alt="pin image" />
      </div>
      <div className="w-2/4 h-full grow flex">
        <Card className="border-none shadow-none w-full h-full flex flex-col">
          <CardHeader className="flex flex-row justify-between items-center pb-0 sticky top-0 bg-white">
            {checkUserAthorization() ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rotate-90 w-8 h-8 flex items-center justify-center">
                    <CiMenuKebab />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleDelete}>
                    삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : <div></div>}
            {!isSaved ? 
            <Button className="m-0 bg-[#e60023]" onClick={requesToCreateSaveImage}>저장</Button> :
            <Button className="m-0" onClick={requesToDeleteSaveImage}>저장됨</Button>
}
          </CardHeader>
          <CardContent className="mt-8 grow">
            <h1 className="text-[28px] font-semibold">{title}</h1>
            <div className="text-base mt-4 mb-4">{content}</div>
            <Profile name={userName} email={userEmail}></Profile>
            <RepliesArccordion
              replies={repliesState}
              deleteReplyHandler={deleteImageReplyRequest}
            ></RepliesArccordion>
          </CardContent>
          <CardFooter className="sticky bottom-0 bg-white">
            <form className="flex w-full">
              <Input
                placeholder="댓글 추가"
                {...register('reply', { required: true })}
              ></Input>
              <button
                className="w-8 h-8 rotate-90 ml-2 flex justify-center items-center"
                onClick={handleSubmit((data) => addReply(data))}
              >
                <HiPaperAirplane />
              </button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </Card>
  );
}

export default ImagePinDetail;
