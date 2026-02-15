'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FaQuoteLeft } from 'react-icons/fa'

const Testimonial = ({ testimonials = [] }) => {
  const defaultTestimonials = [
    {
      name: 'John Doe',
      review: 'Excellent products and fast delivery. Very satisfied with my purchase!',
      rating: 5,
      designation: 'CEO',
      company: 'Tech Corp',
    },
    {
      name: 'Jane Smith',
      review: 'Great quality items at reasonable prices. Will definitely shop again.',
      rating: 5,
      designation: 'Designer',
      company: 'Creative Studio',
    },
    {
      name: 'Mike Johnson',
      review: 'Amazing customer service and beautiful products. Highly recommended!',
      rating: 5,
      designation: 'Manager',
      company: 'Retail Store',
    },
  ]

  const testimonialsToShow = testimonials.length > 0 ? testimonials : defaultTestimonials
  const loop = testimonialsToShow.length ? [...testimonialsToShow, ...testimonialsToShow] : []

  const getInitials = (name) => {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean)
    const first = parts[0]?.[0] || 'U'
    const second = parts[1]?.[0] || ''
    return `${first}${second}`.toUpperCase()
  }

  return (
    <section className='py-14 bg-slate-50 overflow-hidden'>
      <div className='lg:px-32 px-4'>
        <div className='mb-10'>
          <p className='text-xs font-bold tracking-[0.3em] text-gray-500'>TESTIMONIALS</p>
          <h2 className='mt-3 text-3xl lg:text-4xl font-black text-gray-900'>What customers say</h2>
        </div>

        {loop.length ? (
          <div className='relative'>
            <div className='absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r from-slate-50 to-transparent z-10' />
            <div className='absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-slate-50 to-transparent z-10' />

            <motion.div className='overflow-hidden'>
              <motion.div
                className='flex gap-6 w-max'
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 34, ease: 'linear', repeat: Infinity }}
              >
                {loop.map((t, index) => (
                  <div
                    key={`${t?.name || 'testimonial'}-${index}`}
                    className='w-[320px] shrink-0 rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:shadow-black/5 transition-shadow flex flex-col min-h-[220px]'
                  >
                    <FaQuoteLeft className='text-primary' size={18} />
                    <p className='mt-4 text-sm leading-6 text-gray-700 line-clamp-6 flex-1'>
                      {t?.content || t?.review}
                    </p>

                    <div className='mt-6 flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-700'>
                        {getInitials(t?.name)}
                      </div>
                      <div>
                        <div className='text-sm font-bold text-gray-900'>{t?.name}</div>
                        <div className='text-xs text-gray-500'>
                          {t?.designation ? t.designation : 'Customer'}
                          {t?.company ? ` • ${t.company}` : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default Testimonial
