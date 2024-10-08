import { Link } from "react-router-dom";

interface Props {
  id: number;
  url: string;
}

function ImagePin({ id, url }: Props) {
  return (
    <Link to={`/image-pin-detail/${id}`}>
      <div className="border rounded-lg w-[236px] h-[400px] flex items-center justify-center m-2">
        <img className="max-w-full max-h-full" src={url} alt="" />
      </div>
    </Link>
  );
}

export default ImagePin;
