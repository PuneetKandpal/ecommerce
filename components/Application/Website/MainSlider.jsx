'use client'
import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import slider1 from '@/public/assets/images/slider-1.png'
import slider2 from '@/public/assets/images/slider-2.png'
import slider3 from '@/public/assets/images/slider-3.png'
import slider4 from '@/public/assets/images/slider-4.png'
import Image from 'next/image';
import { LuChevronRight } from "react-icons/lu";
import { LuChevronLeft } from "react-icons/lu";

const ArrowNext = (props) => {
    const { onClick } = props
    return (
        <button
            onClick={onClick}
            type='button'
            className='w-16 h-16 flex justify-center items-center absolute z-30 bottom-6 right-6 bg-primary border border-primary shadow-lg'
        >
            <LuChevronRight size={22} className='text-black' />
        </button>
    )
}

const ArrowPrev = (props) => {
    const { onClick } = props
    return (
        <button
            onClick={onClick}
            type='button'
            className='w-16 h-16 flex justify-center items-center absolute z-30 bottom-6 right-6 -translate-x-full transform bg-white border border-gray-200 shadow-lg'
        >
            <LuChevronLeft size={22} className='text-gray-800' />
        </button>
    )
}

const MainSlider = ({ images = [] }) => {

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        nextArrow: <ArrowNext />,
        prevArrow: <ArrowPrev />,

        responsive: [
            {
                breakpoint: 480,
                settings: {
                    dots: false,
                    arrow: false,
                    nextArrow: '',
                    prevArrow: ''
                }
            }
        ]
    }

    const imagesToShow = images.length > 0 ? images : [
        { src: slider1.src, width: slider1.width, height: slider1.height, alt: 'slider 1', isStatic: true },
        { src: slider2.src, width: slider2.width, height: slider2.height, alt: 'slider 2', isStatic: true },
        { src: slider3.src, width: slider3.width, height: slider3.height, alt: 'slider 3', isStatic: true },
        { src: slider4.src, width: slider4.width, height: slider4.height, alt: 'slider 4', isStatic: true }
    ]

    return (
        <div className="h-[calc(100vh-100px)] relative">
            <Slider {...settings}>
                {imagesToShow.map((image, index) => (
                    <div key={index} className="outline-none h-[calc(100vh-100px)]">
                        {image.secure_url || image.url ? (
                            <img
                                src={image.secure_url || image.url}
                                alt={image.alt || `Slider ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        ) : image.isStatic ? (
                            <div className="relative w-full h-full">
                                <Image
                                    src={image.src}
                                    fill
                                    sizes="100vw"
                                    alt={image.alt}
                                    className="object-cover"
                                    priority={index === 0}
                                />
                            </div>
                        ) : (
                            <div className="relative w-full h-full">
                                <Image
                                    src={image.src}
                                    fill
                                    sizes="100vw"
                                    alt={image.alt || `Slider ${index + 1}`}
                                    className="object-cover"
                                    priority={index === 0}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default MainSlider