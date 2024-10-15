import { useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import { RegistrationForm } from "../components/auth/RegistrationForm";


export const RegisterPageContent = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(30)
    const timer = setTimeout(() => setProgress(100), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 lg:grid-flow-col-dense xl:min-h-[800px]">
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="hidden bg-muted lg:block h-screen">
        <img
          src="https://picsum.photos/1920/1080"
          alt="Random image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <RegistrationForm />
      </div>
    </div>
  )
}


const RegisterPage = () => {
  const [pageLoaded, setPageLoaded] = useState(false)

  useEffect(() => {
    setPageLoaded(true)
  }, [])

  if (!pageLoaded) {
    return <LoadingBar color="#f11946" progress={100} />
  }

  return <RegisterPageContent />
}

export default RegisterPage;
