export default function Image() {
  return (
    <div className="items-center h-full p-8 bg-blue-400 justify-center flex">
      <div className="h-full">
        <img src="/image.png" className="h-full w-84" alt="image" />
      </div>
      <div className="w-84 h-full px-4 bg-pink">
        <img src="/image1.png" className=" w-84 " alt="image1" />
        <img src="/image2.png" className=" w-84 mt-4" alt="image2" />
      </div>
    </div>
  );
}
