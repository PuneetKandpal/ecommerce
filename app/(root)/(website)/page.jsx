import MainSlider from '@/components/Application/Website/MainSlider'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import banner1 from '@/public/assets/images/banner1.png'
import banner2 from '@/public/assets/images/banner2.png'
import FeaturedProduct from '@/components/Application/Website/FeaturedProduct'
import advertisingBanner from '@/public/assets/images/advertising-banner.png'
import Testimonial from '@/components/Application/Website/Testimonial'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'

import { GiReturnArrow } from "react-icons/gi";
import { FaShippingFast } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { TbRosetteDiscountFilled } from "react-icons/tb";

export const dynamic = 'force-dynamic'

const Home = async () => {
    let categoryData = null
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/get-category`
            : `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/category/get-category`

        const res = await fetch(apiUrl, { cache: 'no-store' })
        categoryData = await res.json()
    } catch (error) {
        console.log(error)
    }

    return (
        <>
            <section>
                <MainSlider />
            </section>

            <section className='lg:px-32 px-4 sm:pt-20 pt-5 pb-10'>
                <div className='grid grid-cols-2 sm:gap-10 gap-2'>

                    <div className='border rounded-lg overflow-hidden'>
                        <Link href="" >
                            <Image
                                src={banner1.src}
                                width={banner1.width}
                                height={banner1.height}
                                alt='banner 1'
                                className='transition-all hover:scale-110'
                            />
                        </Link>
                    </div>
                    <div className='border rounded-lg overflow-hidden'>
                        <Link href="" >
                            <Image
                                src={banner2.src}
                                width={banner2.width}
                                height={banner2.height}
                                alt='banner 2'
                                className='transition-all hover:scale-110'
                            />
                        </Link>
                    </div>

                </div>
            </section>

            {categoryData?.success && categoryData?.data?.length > 0
                &&
                <section className='lg:px-32 px-4 sm:pt-10 pt-5 pb-10'>
                    <div className='flex justify-between items-center mb-5'>
                        <h2 className='sm:text-4xl text-2xl font-semibold'>Shop by Category</h2>
                    </div>
                    <div className='grid md:grid-cols-4 grid-cols-2 sm:gap-10 gap-2'>
                        {categoryData.data.map((category) => (
                            <Link
                                key={category._id}
                                href={`${WEBSITE_SHOP}?category=${category.slug}`}
                                className='border rounded-lg overflow-hidden group'
                            >
                                <Image
                                    src={category?.image?.secure_url || imgPlaceholder.src}
                                    width={400}
                                    height={300}
                                    alt={category?.name || ''}
                                    className='w-full h-[180px] object-cover transition-all group-hover:scale-110'
                                />
                                <div className='p-3 text-center font-semibold'>
                                    {category?.name}
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            }

            <FeaturedProduct />

            <section className='sm:pt-20 pt-5 pb-10'>
                <Image
                    src={advertisingBanner.src}
                    height={advertisingBanner.height}
                    width={advertisingBanner.width}
                    alt='Advertisement'

                />
            </section>

            <Testimonial />

            <section className='lg:px-32 px-4  border-t py-10'>
                <div className='grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-10'>
                    <div className='text-center'>
                        <p className='flex justify-center items-center mb-3'>
                            <GiReturnArrow size={30} />
                        </p>
                        <h3 className='text-xl font-semibold'>7-Days Returns</h3>
                        <p>Risk-free shopping with easy returns.</p>
                    </div>
                    <div className='text-center'>
                        <p className='flex justify-center items-center mb-3'>
                            <FaShippingFast size={30} />
                        </p>
                        <h3 className='text-xl font-semibold'>Free Shipping</h3>
                        <p>No extra costs, just the price you see.</p>
                    </div>
                    <div className='text-center'>
                        <p className='flex justify-center items-center mb-3'>
                            <BiSupport size={30} />
                        </p>
                        <h3 className='text-xl font-semibold'>24/7 Support</h3>
                        <p>24/7 support, alway here just for you.</p>
                    </div>
                    <div className='text-center'>
                        <p className='flex justify-center items-center mb-3'>
                            <TbRosetteDiscountFilled size={30} />
                        </p>
                        <h3 className='text-xl font-semibold'>Member Discounts</h3>
                        <p>Special offers for our loyal customers.</p>
                    </div>
                </div>
            </section>

        </>
    )
}

export default Home