'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaChevronRight } from 'react-icons/fa'

const features = [
    {
        title: "Multiple Brand Partnerships",
        description: "We collaborate with leading brands ensuring authentic, high-quality products with competitive pricing."
    },
    {
        title: "Massive Inventory",
        description: "₹5–6 crore worth of stock covering 2,000+ products for immediate availability."
    },
    {
        title: "Strong Customer Base",
        description: "Serving 3,200 regular customers across Gujarat with trust and consistency."
    },
    {
        title: "Technical Support",
        description: "Trained team providing expert guidance and quick issue resolution."
    }
]

const WhyChooseUs = () => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="lg:px-32 px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[500px] rounded-lg overflow-hidden bg-gradient-to-br from-blue-900 to-gray-800"
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-white/20 text-6xl font-bold">INDUSTRIAL</div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                            Why choose <span className="text-primary">Air Control</span>
                        </h2>
                        <p className="text-gray-600 mb-8">
                            We're continually working to change the way people think about and engage with our products.
                        </p>

                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex gap-4"
                                >
                                    <FaChevronRight className="text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold mb-1">{feature.title}</h4>
                                        <p className="text-gray-600 text-sm">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default WhyChooseUs
