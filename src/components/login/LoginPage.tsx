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
                    ? <section className="bg-white rounded-2xl m-8 p-4 top-0 right-0 left-0 bottom-0 fixed">
                        <div
                            className="loginBox__image"
                            style={{
                                backgroundImage: `url(./images/login.jpg)`,
                            }}
                        >
                        </div>
                        <div className="loginBox__content">
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
                        </div>
                    </section>
                    : children
            }
        </>
    );
};

export default LoginPage;
