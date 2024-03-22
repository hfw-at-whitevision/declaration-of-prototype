import useAuth from "@/hooks/useAuth";
import Button from "@/components/Button";
import {FaMicrosoft} from "react-icons/fa6";
import Content from "@/components/Content";
import {useAtom} from "jotai";
import {environmentCodeAtom} from "@/store/authAtoms";
import {useState} from "react";
import {Dialog} from "@capacitor/dialog";

const LoginPage = ({children}: any) => {
    const {loginWithMicrosoft, isAuthenticated} = useAuth();
    const [environmentCode] = useAtom(environmentCodeAtom);
    const [inputEnvironmentCode, setInputEnvironmentCode] = useState(environmentCode);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!inputEnvironmentCode) {
            await Dialog.alert({
                title: 'Omgeving',
                message: 'Voer eerst een omgevingscode in om in te loggen.',
            });
            return;
        }
        const res = await loginWithMicrosoft({
            environmentCode: inputEnvironmentCode,
        });
        if (!res) await Dialog.alert({
            title: 'Login',
            message: 'Oops! Het inloggen is niet gelukt..',
        });
    }

    return (
        <>
            {
                (!isAuthenticated)
                    ? <section className="flex flex-col items-center justify-center h-full w-full p-8 gap-8">
                        <Content className="bg-transparent rounded-2xl max-w-[350px] w-full" vAlign="center">
                            <img src="/images/whitevision_logo_2024_yellow.png" alt="WhiteVision"
                                 className="h-16 object-contain mx-auto"/>

                            <input
                                type="text"
                                defaultValue={inputEnvironmentCode}
                                placeholder="Omgevingscode"
                                className="mt-8 bg-white w-full p-4 rounded-lg mb-4 text-black/75 font-thin border-none focus:ring-0 focus:outline-none placeholder:text-black/25"
                                onChange={(e) => setInputEnvironmentCode(e.target.value)}
                            />

                            <Button
                                onClick={handleLogin}
                                padding="small"
                                rounded="full"
                                className="!bg-black w-full !text-white font-medium"
                                icon={<FaMicrosoft className="text-white"/>}
                            >
                                Login met Microsoft
                            </Button>
                        </Content>
                    </section>
                    : children
            }
        </>
    );
};

export default LoginPage;
