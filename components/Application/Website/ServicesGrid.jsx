'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { LuImage } from 'react-icons/lu'

const ServicesGrid = ({ categories = [] }) => {
    const items = Array.isArray(categories) ? categories.slice(0, 9) : []

    return (
        <section className="relative py-20 bg-white overflow-hidden">
            <motion.div
                className="absolute inset-0 opacity-[0.28]"
                style={{
                    backgroundImage: "url('/assets/images/9e9dd376-0589-4a17-989e-e28f17c959f1.jpg')",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}
                aria-hidden="true"
                animate={{ scale: [1, 1.03, 1], backgroundPosition: ['50% 50%', '50% 54%', '50% 50%'] }}
                transition={{ duration: 18, ease: 'easeInOut', repeat: Infinity }}
            />
            <div className="relative lg:px-32 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="mb-8"
                >
                    <h2 className="text-3xl lg:text-4xl font-black text-gray-900">Shop by Category</h2>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.25 }}
                    variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.08 } }
                    }}
                    className="grid md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                    {items.map((category, index) => {
                        const slug = category?.slug || ''
                        const href = slug ? `/shop?category=${slug}` : '/shop'
                        const img = category?.image?.secure_url

                        return (
                            <Link href={href} key={category?._id || slug || index} className="block">
                                <motion.div
                                    variants={{
                                        hidden: { opacity: 0, y: 16 },
                                        show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
                                    }}
                                    whileHover={{ y: -3, scale: 1.01 }}
                                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                                    className="group border border-gray-200 rounded-[10px] bg-white text-gray-900 hover:shadow-lg hover:shadow-black/5 hover:border-primary/50 p-6 h-full"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 overflow-hidden border border-gray-200 transition-transform duration-300 group-hover:scale-110">
                                            {img ? (
                                                <img src={img} alt={category?.name || 'category'} className="w-full h-full object-contain" />
                                            ) : (
                                                <LuImage className="text-gray-400" size={22} />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors">{category?.name}</h3>
                                            <p className="text-sm text-gray-500 leading-6 line-clamp-3">Browse products in this category.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    )
}

export default ServicesGrid
