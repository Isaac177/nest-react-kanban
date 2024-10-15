import { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { useAmoCRMAuth } from '@/hooks/useAmoCRMAuth';
import { redirectToAmoCRM } from "@/utils/authUtils.tsx";
import LoadingBar from "react-top-loading-bar";
import React from "react";

export function EmfyAmoIntegrationLoginForm() {
    const { isLoading } = useAmoCRMAuth();
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        setProgress(30);
        const timer = setTimeout(() => setProgress(100), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return  <LoadingBar
            color="#f11946"
            progress={progress}
            onLoaderFinished={() => setProgress(0)}
        />
    }

    return (
        <div className="flex min-h-screen">
            <div className="flex-1 flex justify-center items-center">
                <div className="w-[350px] p-8 rounded-lg">
                    <h2 className="text-2xl font-bold mb-2">Интеграция Emfy AmoCRM</h2>
                    <p className="text-gray-600 mb-4">
                        Нажмите кнопку ниже, чтобы начать процесс авторизации AmoCRM.
                    </p>
                    <Button
                        className="w-full h-10 flex justify-center items-center"
                        onClick={redirectToAmoCRM}
                    >
                        Начать вход в amoCRM
                    </Button>
                    <Toaster />
                </div>
            </div>
        </div>
    );
}
