import { ImageReplyInfo } from '../../api/types/reply.data.type';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../shadcn/ui/accordion';
import Reply from './Reply';

interface Props {
  replies: ImageReplyInfo[];
  deleteReplyHandler: (id: number) => void;
}

function RepliesArccordion({ replies, deleteReplyHandler }: Props) {
  return (
    <Accordion type="single" collapsible className="mt-4">
      <AccordionItem value="item-1">
        <AccordionTrigger>댓글 {replies.length}개</AccordionTrigger>
        <AccordionContent>
          {replies.map((reply) => (
            <Reply
              key={reply.id}
              id={reply.id}
              content={reply.content}
              userName={reply.userName}
              userId={reply.userId}
              deleteReplyHandler={deleteReplyHandler}
            ></Reply>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default RepliesArccordion;
