import { commonValue } from './common.value';
import { ErrorResponse, Response } from './types/common.data.type';
import { CreateImageReply, ImageReplyInfo } from './types/reply.data.type';

const PREFIX_URL = '/reply';

type ImageReplyInfoResponse = {
  id: number;
  content: string;
  userId: number;
  userName: string;
};

export async function createImageReply(
  replyInfo: CreateImageReply,
  callback: (data: Response<ImageReplyInfo> | ErrorResponse) => void,
) {
  try {
    const result = await fetch(`${commonValue.ORIGIN}${PREFIX_URL}`, {
      method: 'POST',
      body: JSON.stringify({
        imageId: replyInfo.imageId,
        content: replyInfo.content,
      }),
      headers: {
        'Content-Type': 'application/json',
        [commonValue.TOKEN_HEADER]: commonValue.ACCESS_TOKEN,
      },
      credentials: 'include',
    }).then((res) => res.json());

    return callback(imageReplyDataAdaptor(result));
  } catch {
    callback({
      data: null,
      errorMessage: '이미지 댓글 생성 실패',
      success: false,
    });
  }
}

function imageReplyDataAdaptor(
  res: ImageReplyInfoResponse,
): Response<ImageReplyInfo> {
  return {
    data: {
      id: res.id,
      content: res.content,
      userId: res.userId,
      userName: res.userName,
    },
    success: true,
  };
}
