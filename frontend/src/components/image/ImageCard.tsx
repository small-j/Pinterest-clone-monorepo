interface Props {
  url: string;
  width: string;
  height: string;
}

function ImageCard({ url, width, height }: Props) {
  return (
    <div
      className={`border rounded-lg w-${width} h-${height} flex items-center justify-center m-2`}
    >
      <img className="max-w-full max-h-full" src={url} alt="" />
    </div>
  );
}

export default ImageCard;
