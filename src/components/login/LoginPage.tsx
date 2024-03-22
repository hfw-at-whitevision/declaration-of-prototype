import useAuth from "@/hooks/useAuth";
import Button from "@/components/Button";
import {useEffect} from "react";
import {useAtom} from "jotai";
import {accessTokenAtom} from "@/store/authAtoms";
import useDocbase from "@/hooks/useDocbase";
import {FaMicrosoft} from "react-icons/fa6";

const LoginPage = ({children}: any) => {
    const {loginWithMicrosoft, isAuthenticated, shouldLoginWithBiometry, loginWithBiometry} = useAuth();
    const {docbaseAuth}: any = useDocbase();
    const [accessToken] = useAtom(accessTokenAtom);

    useEffect(() => {
        console.log('shouldLoginWithBiometry', shouldLoginWithBiometry);

        if (shouldLoginWithBiometry) {
            loginWithBiometry();
        }
    }, [shouldLoginWithBiometry]);

    useEffect(() => {
        if (!accessToken) return;
        docbaseAuth({
            azureToken: accessToken,
        });
    }, []);

    return (
        <>
            {
                (!isAuthenticated)
                    ? <section className="flex flex-col items-center justify-center h-full w-full p-8 gap-8">
                        <img src="/images/whitevision_logo_2024_yellow.png" alt="WhiteVision"
                             className="h-16 object-contain mx-auto"/>
                        <section className="bg-transparent rounded-2xl max-w-[350px] w-full">
                            <Button
                                onClick={() => loginWithMicrosoft()}
                                padding="small"
                                rounded="full"
                                className="!bg-black w-full !text-white font-medium"
                                icon={<FaMicrosoft className="text-white"/>}
                            >
                                Login met Microsoft
                            </Button>
                        </section>
                    </section>
                    : children
            }
        </>
    );
};

export default LoginPage;
