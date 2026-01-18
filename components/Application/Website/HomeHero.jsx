'use client'

import React from 'react'
import MainSlider from '@/components/Application/Website/MainSlider'
import BannerImages from '@/components/Application/Website/BannerImages'

const HomeHero = ({ sliderImages = [], bannerImages = [] }) => {
  return (
    <>
      <section>
        <MainSlider images={sliderImages} />
      </section>

      <BannerImages images={bannerImages} />
    </>
  )
}

export default HomeHero
