'use client'
import { USER_DASHBOARD, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import Image from 'next/image'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
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
import { usePathname } from 'next/navigation'

const Header = () => {
    const auth = useSelector(store => store.authStore.auth)
    const [isMobileMenu, setIsMobileMenu] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const pathname = usePathname()

    const navLinks = useMemo(() => ([
        { label: 'Home', href: WEBSITE_HOME, match: (path) => path === '/' },
        { label: 'Shop', href: WEBSITE_SHOP, match: (path) => path.startsWith('/shop') || path.startsWith('/product') },
        { label: 'Contact Us', href: '/contact-us', match: (path) => path.startsWith('/contact') },
    ]), [])

    const isActive = (link) => (link.match ? link.match(pathname || '') : pathname === link.href)

    return (
        <div className='bg-white border-b shadow-sm'>
            <div className='lg:px-32 px-4 max-w-[1600px] mx-auto'>
                <div className='flex items-center justify-between h-[92px]'>
                    <Link href={WEBSITE_HOME} className='flex items-center'>
                        <Image
                            src={logo}
                            width={383}
                            height={146}
                            alt='logo'
                            className='lg:w-32 w-24'
                        />
                    </Link>

                    <div className='flex-1 flex justify-center'>
                        <nav className={`lg:relative lg:w-auto lg:h-auto lg:top-0 lg:left-0 lg:p-0 bg-white fixed z-50 top-0 w-full h-screen transition-all ${isMobileMenu ? 'left-0' : '-left-full'}`}>
                            <div className='lg:hidden flex justify-between items-center bg-gray-50 py-3 border-b px-3'>
                                <Image
                                    src={logo}
                                    width={383}
                                    height={146}
                                    alt='logo'
                                    className='lg:w-24 w-20'
                                />
                                <button type='button' onClick={() => setIsMobileMenu(false)} >
                                    <IoMdClose size={25} className='text-gray-500 hover:text-primary' />
                                </button>
                            </div>
                            <ul className='lg:flex items-center gap-12 px-5 text-[15px] tracking-[0.05em]'>
                                {navLinks.map((link) => (
                                    <li
                                        key={link.href}
                                        className={`text-gray-900 hover:text-primary font-semibold transition-colors ${isActive(link) ? 'relative' : ''}`}
                                    >
                                        <Link href={link.href} className='block py-2'>
                                            {link.label}
                                        </Link>
                                        {isActive(link) ? <span className='absolute left-0 right-0 -bottom-1 h-0.5 bg-primary hidden lg:block' /> : null}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                    <div className='flex items-center gap-5'>
                        <button type='button' onClick={() => setShowSearch(!showSearch)}>
                            <IoIosSearch className='text-gray-500 hover:text-primary cursor-pointer' size={20} />
                        </button>
                        <span className='hidden lg:block w-px h-5 bg-gray-200' />
                        <Cart
                            iconSize={20}
                            iconClassName="text-gray-500 hover:text-primary"
                            badgeClassName="absolute bg-primary text-black text-[10px] font-bold rounded-full w-4 h-4 flex justify-center items-center -right-2 -top-2"
                        />

                        <span className='hidden lg:block w-px h-5 bg-gray-200' />
                        {!auth
                            ?
                            <Link href={WEBSITE_LOGIN} className='hidden lg:inline-flex'>
                                <VscAccount
                                    className='text-gray-500 hover:text-primary cursor-pointer'
                                    size={20}
                                />
                            </Link>
                            :
                            <Link href={USER_DASHBOARD} className='hidden lg:inline-flex'>
                                <Avatar>
                                    <AvatarImage src={auth?.avatar?.url || userIcon.src} />
                                </Avatar>
                            </Link>
                        }
                        <button type='button' className='lg:hidden block' onClick={() => setIsMobileMenu(true)}>
                            <HiMiniBars3 size={22} className='text-gray-500 hover:text-primary' />
                        </button>
                    </div>
                </div>
            </div>
            <Search isShow={showSearch} />
        </div>

    )

}

export default Header