'use client'
import { USER_DASHBOARD, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import logo from '@/public/assets/images/logo-black.png'
import { IoIosSearch } from "react-icons/io";
import Cart from './Cart'
import { VscAccount } from "react-icons/vsc";
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import userIcon from '@/public/assets/images/user.png'
import { IoMdClose } from "react-icons/io";

import { HiMiniBars3 } from "react-icons/hi2";
import Search from './Search'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import ButtonLoading from '@/components/Application/ButtonLoading'
import axios from 'axios'
import { showToast } from '@/lib/showToast'

const Header = () => {
    const auth = useSelector(store => store.authStore.auth)
    const [isMobileMenu, setIsMobileMenu] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [isContactOpen, setIsContactOpen] = useState(false)
    const [contactLoading, setContactLoading] = useState(false)
    const [contactForm, setContactForm] = useState({ email: '', phone: '', query: '' })

    const handleContactSubmit = async (e) => {
        e.preventDefault()
        setContactLoading(true)
        try {
            const { data: res } = await axios.post('/api/contact', contactForm)
            if (!res.success) {
                throw new Error(res.message)
            }
            const supportId = res?.data?.supportId
            showToast('success', supportId ? `${res.message} Support ID: ${supportId}` : res.message)
            setContactForm({ email: '', phone: '', query: '' })
            setIsContactOpen(false)
        } catch (error) {
            showToast('error', error.message)
        } finally {
            setContactLoading(false)
        }
    }
    return (
        <div className='bg-white border-b lg:px-32 px-4'>
            <div className='flex justify-between items-center lg:py-5 py-3'>
                <Link href={WEBSITE_HOME}>
                    <Image
                        src={logo}
                        width={383}
                        height={146}
                        alt='logo'
                        className='lg:w-32 w-24'
                    />
                </Link>

                <div className='flex justify-between gap-20'>
                    <nav className={`lg:relative lg:w-auto lg:h-auto lg:top-0 lg:left-0 lg:p-0 bg-white fixed z-50 top-0 w-full h-screen transition-all ${isMobileMenu ? 'left-0' : '-left-full'}`}>


                        <div className='lg:hidden flex justify-between items-center bg-gray-50 py-3 border-b px-3'>

                            <Image
                                src={logo}
                                width={383}
                                height={146}
                                alt='logo'
                                className='lg:w-32 w-24'
                            />

                            <button type='button' onClick={() => setIsMobileMenu(false)} >
                                <IoMdClose size={25} className='text-gray-500 hover:text-primary' />
                            </button>

                        </div>


                        <ul className='lg:flex justify-between items-center gap-10 px-3 '>
                            <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                                <Link href={WEBSITE_HOME} className='block py-2'>
                                    Home
                                </Link>
                            </li>
                            <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                                <Link href="/about-us" className='block py-2'>
                                    Our Journey
                                </Link>
                            </li>
                            <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                                <Link href={WEBSITE_SHOP} className='block py-2'>
                                    Shop
                                </Link>
                            </li>
                            <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                                <button type='button' className='block py-2' onClick={() => setIsContactOpen(true)}>
                                    Contact Us
                                </button>
                            </li>
                        </ul>
                    </nav>


                    <div className='flex justify-between items-center gap-8'>
                        <button type='button' onClick={() => setShowSearch(!showSearch)}>
                            <IoIosSearch
                                className='text-gray-500 hover:text-primary cursor-pointer'
                                size={25}
                            />
                        </button>

                        <Cart />

                        {!auth
                            ?
                            <Link href={WEBSITE_LOGIN}>
                                <VscAccount
                                    className='text-gray-500 hover:text-primary cursor-pointer'
                                    size={25}
                                />
                            </Link>
                            :

                            <Link href={USER_DASHBOARD}>
                                <Avatar >
                                    <AvatarImage src={auth?.avatar?.url || userIcon.src} />
                                </Avatar>
                            </Link>

                        }


                        <button type='button' className='lg:hidden block' onClick={() => setIsMobileMenu(true)} >
                            <HiMiniBars3 size={25} className='text-gray-500 hover:text-primary' />
                        </button>

                    </div>

                </div>

            </div>

            <Search isShow={showSearch} />

            <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Contact Us</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleContactSubmit} className='space-y-4'>
                        <div>
                            <label className='text-sm font-medium'>Email</label>
                            <Input
                                type='email'
                                value={contactForm.email}
                                onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                                placeholder='Enter your email'
                                required
                            />
                        </div>
                        <div>
                            <label className='text-sm font-medium'>Phone</label>
                            <Input
                                type='tel'
                                value={contactForm.phone}
                                onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder='Enter your phone number'
                                required
                            />
                        </div>
                        <div>
                            <label className='text-sm font-medium'>Query</label>
                            <Textarea
                                value={contactForm.query}
                                onChange={(e) => setContactForm(prev => ({ ...prev, query: e.target.value }))}
                                placeholder='Write your query'
                                required
                            />
                        </div>
                        <ButtonLoading loading={contactLoading} type='submit' text='Submit' className='w-full cursor-pointer' />
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default Header