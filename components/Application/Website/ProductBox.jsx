import Image from 'next/image'
import React from 'react'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import Link from 'next/link'
import { WEBSITE_PRODUCT_DETAILS } from '@/routes/WebsiteRoute'

const ProductBox = ({ product }) => {

    return (
        <div className='group rounded-2xl border border-gray-200 bg-white overflow-hidden transition-all hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5'>
            <Link href={WEBSITE_PRODUCT_DETAILS(product.slug)} className='block'>
                <div className='relative bg-gray-50'>
                    <Image
                        src={product?.media?.[0]?.secure_url || imgPlaceholder.src}
                        width={520}
                        height={520}
                        alt={product?.media?.[0]?.alt || product?.name}
                        title={product?.media?.[0]?.title || product?.name}
                        className='w-full aspect-square object-contain transition-transform duration-500 group-hover:scale-[1.04]'
                    />
                </div>

                <div className='p-4 border-t border-gray-100'>
                    <h4 className='text-[15px] font-bold text-gray-900 leading-5 line-clamp-2 min-h-[40px]'>
                        {product?.name}
                    </h4>

                    <div className='flex items-baseline gap-2 mt-3'>
                        {product?.mrp ? (
                            <span className='text-sm line-through text-gray-400'>
                                {product.mrp.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                            </span>
                        ) : null}
                        {product?.sellingPrice ? (
                            <span className='text-[15px] font-extrabold text-gray-900'>
                                {product.sellingPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                            </span>
                        ) : null}
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ProductBox