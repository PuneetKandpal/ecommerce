'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LuChevronRight } from 'react-icons/lu'
import MainSlider from '@/components/Application/Website/MainSlider'
import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'

const HomeHero = ({ sliderImages = [], hero = null }) => {
  const heroConfig = hero || {}
  const accentText = heroConfig.accentText || 'Innovation'
  const titleLine1 = heroConfig.titleLine1 || 'starts'
  const titleLine2 = heroConfig.titleLine2 || 'with a dream and a plan'
  const subtitle = heroConfig.subtitle || 'We offer flexible solutions which help your business to grow'
  const ctaText = heroConfig.ctaText || 'GO TO SHOP'
  const ctaLink = heroConfig.ctaLink || WEBSITE_SHOP

  return (
    <section className="relative">
      <MainSlider images={sliderImages} />
      <div className="absolute inset-0 flex items-center">
        <div className="lg:px-32 px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              <span className="text-primary">{accentText}</span> {titleLine1}
              <br />
              {titleLine2}
            </h1>
            <p className="text-white/90 mt-4 text-base sm:text-lg">
              {subtitle}
            </p>
            <motion.div whileHover={{ x: 6 }} className="mt-6 inline-flex">
              <Link
                href={ctaLink}
                className="inline-flex items-center justify-center gap-3 border border-white/60 text-white h-11 px-6 text-xs uppercase tracking-[0.25em]"
              >
                {ctaText}
                <LuChevronRight className="text-primary" size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HomeHero
