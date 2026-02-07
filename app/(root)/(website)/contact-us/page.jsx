'use client'

import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatWebsiteUrl, normalizeContactInfo, splitPhones, FALLBACK_CONTACT_INFO } from '@/lib/contactInfo'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export const dynamic = 'force-dynamic'

const breadcrumb = {
  title: 'Contact Us',
  links: [{ label: 'Contact Us' }],
}

const ContactUsPage = () => {
  const [loading, setLoading] = useState(false)
  const [contactForm, setContactForm] = useState({ email: '', phone: '', query: '' })
  const [contactInfo, setContactInfo] = useState(FALLBACK_CONTACT_INFO)
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/api/site-config/contact-us')
        const normalized = normalizeContactInfo(data?.data?.contactUs || {})
        setContactInfo(normalized.info)
        setIsConfigured(normalized.isConfigured)
      } catch (e) {
        setContactInfo(FALLBACK_CONTACT_INFO)
        setIsConfigured(false)
      }
    }

    load()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: res } = await axios.post('/api/contact', contactForm)
      if (!res.success) {
        throw new Error(res.message)
      }
      const supportId = res?.data?.supportId
      showToast('success', supportId ? `${res.message} Support ID: ${supportId}` : res.message)
      setContactForm({ email: '', phone: '', query: '' })
    } catch (error) {
      showToast('error', error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <WebsiteBreadcrumb props={breadcrumb} />

      <div className='lg:px-40 px-5 py-20'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
          <div className='rounded-2xl border bg-white p-6'>
            <h1 className='text-2xl font-semibold mb-4'>{contactInfo?.heading || 'Contact Information'}</h1>

            <div className='space-y-3 text-gray-600'>
              {(
                contactInfo?.addressLine1 ||
                contactInfo?.addressLine2 ||
                contactInfo?.city ||
                contactInfo?.state ||
                contactInfo?.pincode ||
                contactInfo?.country
              ) ? (
                <div>
                  <p className='font-medium text-gray-900'>Address</p>
                  <p className='text-sm'>
                    {[contactInfo?.addressLine1, contactInfo?.addressLine2].filter(Boolean).join(', ')}
                    {(contactInfo?.city || contactInfo?.state || contactInfo?.pincode || contactInfo?.country) ? (
                      <>
                        <br />
                        {[contactInfo?.city, contactInfo?.state, contactInfo?.pincode, contactInfo?.country]
                          .filter(Boolean)
                          .join(', ')}
                      </>
                    ) : null}
                  </p>
                </div>
              ) : null}

              {splitPhones(contactInfo?.phone).length ? (
                <div>
                  <p className='font-medium text-gray-900'>Phone</p>
                  <div className='text-sm flex flex-col'>
                    {splitPhones(contactInfo.phone).map((phone) => (
                      <a key={phone} className='hover:text-primary' href={`tel:${phone.replace(/\s+/g, '')}`}>
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}

              {contactInfo?.email ? (
                <div>
                  <p className='font-medium text-gray-900'>Email</p>
                  <a className='text-sm hover:text-primary' href={`mailto:${contactInfo.email}`}>
                    {contactInfo.email}
                  </a>
                </div>
              ) : null}

              {contactInfo?.website ? (
                <div>
                  <p className='font-medium text-gray-900'>Website</p>
                  <a
                    className='text-sm hover:text-primary'
                    href={formatWebsiteUrl(contactInfo.website)}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {contactInfo.website}
                  </a>
                </div>
              ) : null}

              {contactInfo?.workingHours ? (
                <div>
                  <p className='font-medium text-gray-900'>Working Hours</p>
                  <p className='text-sm'>{contactInfo.workingHours}</p>
                </div>
              ) : null}

              {contactInfo?.mapUrl ? (
                <div>
                  <p className='font-medium text-gray-900'>Map</p>
                  <a
                    className='text-sm hover:text-primary'
                    href={contactInfo.mapUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Open in Google Maps
                  </a>
                </div>
              ) : null}

              {!isConfigured ? (
                <p className='text-xs text-gray-500 pt-2 border-t'>Using default contact details. Configure from Admin → Page Config → Contact Us.</p>
              ) : null}
            </div>
          </div>

          <div className='rounded-2xl border bg-white p-6'>
            <h2 className='text-2xl font-semibold mb-4'>Send us a message</h2>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='text-sm font-medium'>Email</label>
                <Input
                  type='email'
                  value={contactForm.email}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder='Enter your email'
                  required
                />
              </div>

              <div>
                <label className='text-sm font-medium'>Phone</label>
                <Input
                  type='tel'
                  value={contactForm.phone}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder='Enter your phone number'
                  required
                />
              </div>

              <div>
                <label className='text-sm font-medium'>Query</label>
                <Textarea
                  value={contactForm.query}
                  onChange={(e) => setContactForm((prev) => ({ ...prev, query: e.target.value }))}
                  placeholder='Write your query'
                  required
                />
              </div>

              <ButtonLoading loading={loading} type='submit' text='Submit' className='w-full cursor-pointer' />
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUsPage
