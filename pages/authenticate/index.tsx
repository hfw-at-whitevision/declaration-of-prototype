import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import BackgroundInset from "@/components/primitives/BackgroundInset";

export default function AuthenticatePage() {
    return <>
        <div className="fixed inset-0 flex items-center justify-center text-gray p-8">
            <Swiper
                className="h-full"
                pagination={{
                    dynamicBullets: true,
                }}
                modules={[Pagination]}
            >
                <SwiperSlide>
                    <section className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
                        <h2 className="text-4xl font-bold text-black">
                            Welkom
                        </h2>

                        <span>
                        Fijn dat je aan de slag gaat met ded nieuwe WhiteVision smartphone app.
                    </span>

                        <span>
                        In deze korte tutorial leggen we je in een aantal stappen uit wat je kunt doen met deze handige app.
                    </span>

                        <img
                            src="/images/intro-slide-1.png"
                            className="w-full w-[40%] max-w-[300px] mr-[10%] my-16"
                            alt="Aan de slag"
                        />

                        <span className="text-xs">
                        Swipe naar rechts om naar de volgende stap te gaan of swipe naar links om een stap terug te gaan.
                    </span>
                    </section>
                </SwiperSlide>
                <SwiperSlide>
                    <section className="absolute inset-0 flex flex-col items-center justify-center">
                        <h2 className="text-2xl font-black">
                            Welkom
                        </h2>

                        <span>
                        Fijn dat je aan de slag gaat met de nieuwe WhiteVision smartphone app.
                        <br/>
                        In deze korte tutorial leggen we je in een aantal stappen uit wat je kunt doen met deze handige app.
                    </span>
                    </section>
                </SwiperSlide>
                <SwiperSlide>
                    Stap 3
                </SwiperSlide>
                <SwiperSlide>
                    Stap 4
                </SwiperSlide>
                <SwiperSlide>
                    Stap 5
                </SwiperSlide>
            </Swiper>
        </div>
        <BackgroundInset/>
    </>
}
