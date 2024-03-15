import useAuth from "@/hooks/useAuth";
import Button from "@/components/Button";
import {TfiMicrosoftAlt} from "react-icons/tfi";
import {useEffect} from "react";

const LoginPage = ({children}: any) => {
    const {loginWithMicrosoft, isAuthenticated, shouldLoginWithBiometry, loginWithBiometry} = useAuth();

    useEffect(() => {
        console.log('shouldLoginWithBiometry', shouldLoginWithBiometry);

        if (shouldLoginWithBiometry) {
            loginWithBiometry();
        }
    }, [shouldLoginWithBiometry]);

    return (
        <>
            {
                (!isAuthenticated)
                    ? <>
                        <img src="/images/whitevision_logo_2024_yellow.png" alt="WhiteVision" className="h-12 object-contain mx-auto mt-8" />
                        <section className="bg-white rounded-2xl m-8 mt-28 p-4 top-0 right-0 left-0 bottom-0 fixed">
                            <div>
                                <Button
                                    onClick={() => loginWithMicrosoft()}
                                    primary
                                    padding="small"
                                    rounded="full"
                                    className="bg-black w-full"
                                    icon={<TfiMicrosoftAlt className="text-white" />}
                                >
                                    Login met Microsoft
                                </Button>
                            </div>
                    </section>
                    </>
                    : children
            }
        </>
    );
};

export default LoginPage;
