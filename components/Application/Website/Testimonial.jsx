'use client'

import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa'
import { AiFillStar } from 'react-icons/ai'
import axios from 'axios'

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const { data: res } = await axios.get(`${baseUrl}/api/testimonials`)

      if (res?.success && res?.data?.length) {
        setTestimonials(res.data)
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
    }
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          dots: false,
          arrows: false,
        },
      },
    ],
  }

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

  return (
    <section className='py-10 lg:px-32 px-4'>
      <div className='text-center mb-10'>
        <h2 className='text-3xl font-bold mb-2'>What Our Customers Say</h2>
        <p className='text-gray-600'>Don't just take our word for it</p>
      </div>

      <div className='max-w-4xl mx-auto'>
        <Slider {...settings}>
          {testimonialsToShow.map((testimonial, index) => (
            <div key={index} className='px-4'>
              <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center'>
                <div className='flex justify-center mb-4'>
                  <FaQuoteLeft className='text-3xl text-gray-300' />
                </div>
                <p className='text-gray-700 dark:text-gray-300 mb-6 italic'>{testimonial.review}</p>
                <div className='flex justify-center mb-4'>
                  {[...Array(5)].map((_, i) => (
                    <AiFillStar
                      key={i}
                      className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}
                      size={20}
                    />
                  ))}
                </div>
                <div className='flex justify-center items-center gap-2'>
                  <FaQuoteRight className='text-xl text-gray-300' />
                  <div>
                    <h4 className='font-semibold text-lg'>{testimonial.name}</h4>
                    {testimonial.designation && (
                      <p className='text-sm text-gray-600'>
                        {testimonial.designation}
                        {testimonial.company && ` at ${testimonial.company}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  )
}

export default Testimonial
