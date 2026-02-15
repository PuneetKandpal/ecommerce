'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaChevronRight } from 'react-icons/fa'

const features = [
    {
        title: "Standard Operating Procedures",
        description: "SOPs for smooth order processing, dispatch, and service excellence."
    },
    {
        title: "Fast Delivery Network",
        description: "Safe and timely deliveries ensuring customer satisfaction."
    },
    {
        title: "Quality Assurance",
        description: "Rigorous quality checks on all products before delivery."
    },
    {
        title: "After-Sales Service",
        description: "Dedicated support team for post-purchase assistance."
    }
]

const KeyFeatures = () => {
    return (
        <section className="py-20 bg-gray-900 text-white">
            <div className="lg:px-32 px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                            <span className="text-primary">Key</span> Features
                        </h2>
                        <p className="text-gray-400 mb-8">
                            Learn more about the ways in which our innovation is helping evolve expectations for businesses and manufacturers alike.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex gap-3"
                                >
                                    <FaChevronRight className="text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold mb-1">{feature.title}</h4>
                                        <p className="text-gray-400 text-sm">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[500px] rounded-lg overflow-hidden bg-gradient-to-br from-yellow-600 to-orange-800"
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-white/20 text-6xl font-bold">FACILITY</div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default KeyFeatures
