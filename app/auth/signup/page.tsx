import SignUpForm from "@/component/signup/SignUpForm";
import Image from "next/image";
import image from "@/public/images/landscape-morning-fog-mountains-with-hot-air-balloons-sunrise.jpg";

const RegisterPage = () => {
  
  return (
    <div className="flex h-screen">
      <div className="hidden lg:block flex-1 h-full">
        <Image
          src={image}
          alt="Hero image"
          className="w-full object-cover h-full" />
      </div>
      <SignUpForm />
    </div>
  )
}

export default RegisterPage;