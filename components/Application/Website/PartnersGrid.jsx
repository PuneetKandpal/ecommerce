'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const PartnersGrid = ({ companies = [] }) => {
    // Use provided companies or fallback to placeholder grid
    const displayCompanies = companies.length > 0 ? companies : Array(12).fill({ name: 'Partner' })

    const marqueeCompanies = displayCompanies.filter((c) => c?.logo?.secure_url || c?.logo?.url || c?.name)
    const marqueeLoop = marqueeCompanies.length ? [...marqueeCompanies, ...marqueeCompanies] : marqueeCompanies

    return (
        <section className="py-20 bg-zinc-50 overflow-hidden">
            <div className="lg:px-32 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <p className="text-xs font-bold tracking-[0.3em] text-gray-500">OUR BRANDS</p>
                    <h2 className="mt-3 text-3xl lg:text-4xl font-black text-gray-900">Trusted by leading brands</h2>
                </motion.div>

                {marqueeLoop.length ? (
                    <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r from-zinc-50 to-transparent z-10" />
                        <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-zinc-50 to-transparent z-10" />

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="overflow-hidden"
                        >
                            <motion.div
                                className="flex items-stretch gap-4 w-max"
                                animate={{ x: ['0%', '-50%'] }}
                                transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
                            >
                                {marqueeLoop.map((company, index) => (
                                    <a
                                        key={`${company?.name || 'brand'}-${index}`}
                                        href={company?.link || '#'}
                                        target={company?.link ? '_blank' : undefined}
                                        rel={company?.link ? 'noopener noreferrer' : undefined}
                                        className="group h-24 w-56 shrink-0 rounded-xl border border-gray-200 bg-white flex items-center justify-center px-6 hover:border-primary/40 hover:shadow-lg hover:shadow-black/5 transition-all"
                                    >
                                        {company?.logo?.secure_url || company?.logo?.url ? (
                                            <Image
                                                src={company.logo.secure_url || company.logo.url}
                                                alt={company?.logo?.alt || company?.name || 'Brand'}
                                                width={220}
                                                height={88}
                                                className="max-h-12 w-auto object-contain grayscale group-hover:grayscale-0 transition-all"
                                            />
                                        ) : (
                                            <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-800 transition-colors">
                                                {company?.name || 'Brand'}
                                            </span>
                                        )}
                                    </a>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>
                ) : null}
            </div>
        </section>
    )
}

export default PartnersGrid
