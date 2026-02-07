import Link from 'next/link'
import React from 'react'
import { IoIosArrowRoundForward } from "react-icons/io";
import ProductBox from './ProductBox';
import { getFeaturedProducts } from '@/lib/productService';

const FeaturedProduct = async () => {
    let productData = null
    try {
        const products = await getFeaturedProducts(8);
        productData = { success: true, data: products };
    } catch (error) {
        console.log(error)
    }

    if (!productData) return null
    return (
        <section className='lg:px-32 px-4 sm:py-10'>
            <div className='flex justify-between items-center mb-5'>
                <h2 className='sm:text-4xl text-2xl font-semibold'>Featured Products</h2>
                <Link href="" className='flex items-center gap-2 underline underline-offset-4 hover:text-primary'>
                    View All
                    <IoIosArrowRoundForward />
                </Link>
            </div>
            <div className='grid md:grid-cols-4 grid-cols-2 sm:gap-10 gap-2'>
                {!productData.success && <div className='text-center py-5'>Data Not Found.</div>}

                {productData.success && productData.data.map((product) => (
                    <ProductBox key={product._id} product={product} />
                ))}

            </div>
        </section>
    )
}

export default FeaturedProduct