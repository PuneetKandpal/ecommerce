'use client'

import React from 'react'
import MainSlider from '@/components/Application/Website/MainSlider'

const HomeHero = ({ sliderImages = [] }) => {
  return (
    <section>
      <MainSlider images={sliderImages} />
    </section>
  )
}

export default HomeHero
