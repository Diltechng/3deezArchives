import Image from "./images/page";

export default function HeaderContent() {
  return (
    <div className="bg-gray-100 h-full  text-black items-center justify-center flex">
      <div className="bg-white h-full p-2">
        <div className="bg-white h-full p-14 text-center">
          <strong className="text-5xl lining-nums font-serif">3Deez</strong>
          <br></br>
          <strong className="text-5xl text-center font-serif">
            Photo Archives
          </strong>
          <h5 className="text-2x1 mt-5 text-gray-400">
            Capturing Moments For Nostalgia
          </h5>
          <button className="bg-yellow-300 text-center rounded-xl h-8 text-sm w-44 mt-4">
            Discover Our Journey
          </button>
        </div>
        <Image />
      </div>
    </div>
  );
}
