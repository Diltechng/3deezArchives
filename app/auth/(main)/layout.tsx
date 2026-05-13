import Image from "next/image";
import image from "@/public/images/landscape-morning-fog-mountains-with-hot-air-balloons-sunrise.jpg";


const MainAuthLayout = ({ children }: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className="flex h-screen text-neutral-800 dark:text-neutral-100">
      <div className="hidden lg:block flex-1 h-full">
        <Image
          src={image}
          alt="Hero image"
          className="w-full object-cover h-full" />
      </div>
      <div className="flex w-full lg:w-140 h-full overflow-x-auto">
        {children}
      </div>
    </div>
  )
}

export default MainAuthLayout;