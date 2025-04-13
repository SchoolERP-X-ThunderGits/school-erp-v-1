import React from "react";
import images from "../../../../constants/Images";
// import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
    children,
}) {
    return (
        <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
            <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
                {children}
                <div style={{ backgroundColor: '#161950' }} className="items-center hidden w-full h-full lg:w-1/2 dark:bg-white/5 lg:grid">
                    <div className="relative flex items-center justify-center z-1">
                        {/* <!-- ===== Common Grid Shape Start ===== --> */}
                        <div className="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]">
                            <img src={images.gridImg} alt="grid" />
                        </div>
                        <div className="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
                            <img src={images.gridImg} alt="grid" />
                        </div>
                        <div className="flex flex-col items-center max-w-xs">
                            {/* <Link to="/" className="block mb-4">
                <img
                  width={231}
                  height={48}
                  src="/images/logo/auth-logo.svg"
                  alt="Logo"
                />
              </Link> */}
                            <div className="text-4xl text-white font-bold">School ERP</div>
                            <p className="text-center text-gray-400 dark:text-white/60">
                                School ERP by ThunderGits is a comprehensive school management system that simplifies student enrollment, attendance tracking, grading, and communication for educational institutions.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
                    {/* <ThemeTogglerTwo /> */}
                </div>
            </div>
        </div>
    );
}
