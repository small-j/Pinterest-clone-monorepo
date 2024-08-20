import { FieldValues, useForm } from 'react-hook-form';
import Profile from '../common/Profile';
import { Button } from '../shadcn/ui/button';
import { Card, CardContent, CardFooter } from '../shadcn/ui/card';
import { Input } from '../shadcn/ui/input';
import RepliesArccordion from './RepliesArccordion';
import { createImageReply } from '../../api/reply.api';
import { useState } from 'react';
import { ImageReplyInfo } from '../../api/types/reply.data.type';
import { HiPaperAirplane } from "react-icons/hi";

interface Props {
  id: number;
  url: string;
  title: string;
  content: string;
  userId: number;
  userName: string;
  userEmail: string;
  replies: ImageReplyInfo[];
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
}: Props) {
  const { register, handleSubmit } = useForm();
  const [repliesState, setRepliesState] = useState<ImageReplyInfo[]>(replies);

  const addReply = (data: FieldValues) => {
    createImageReply({ content: data.reply, imageId: id }, (res) => {
      if (!res || !res.success) return; // todo: reply 생성 실패했다는 toast? alert? 띄우기.
      const newReply = res.data as ImageReplyInfo;
      setRepliesState([newReply, ...repliesState]);
    });
  };
  
  const checkUserAthorization = () => {
    // TODO: 삭제 권한이 있는 유저인지 확인.
    return true;
  };

  const handleDelete = () => {
    // TODO 삭제 요청.
  };

  return (
    <Card className="flex w-[1016px] max-h-[1087px] mt-3 mb-3 relative">
      <div className="w-2/4 min-h-[472.5px] max-h-full">
        <img className="max-w-full max-h-full" src={url} alt="pin image" />
      </div>
      <div className="w-2/4 h-full grow flex">
        <Card className="border-none shadow-none w-full h-full flex flex-col">
          <div className="flex flex-row justify-end items-center pt-8 pr-8 sticky top-0 bg-white">
            {checkUserAthorization() && (
              <Button onClick={handleDelete}>삭제</Button>
            )}
            <Button className="m-0">저장</Button>
          </div>
          <CardContent className="mt-8 grow">
            <h1 className="text-[28px] font-semibold">{title}</h1>
            <div className="text-base mt-4 mb-4">{content}</div>
            <Profile name={userName} email={userEmail}></Profile>
            <RepliesArccordion replies={repliesState}></RepliesArccordion>
          </CardContent>
          <CardFooter className="sticky bottom-0 bg-white">
            <form className='flex w-full'>
              <Input
                placeholder="댓글 추가"
                {...register('reply', { required: true })}
              ></Input>
              <button className='w-8 h-8 rotate-90 ml-2 flex justify-center items-center' onClick={handleSubmit((data) => addReply(data))}><HiPaperAirplane /></button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </Card>
  );
}

export default ImagePinDetail;
