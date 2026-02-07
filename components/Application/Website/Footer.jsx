import Image from 'next/image'
import Link from 'next/link'
import logo from '@/public/assets/images/logo-black.png'
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlinePhone } from "react-icons/md";
import { MdOutlineMail } from "react-icons/md";
import { AiOutlineYoutube } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { TiSocialFacebookCircular } from "react-icons/ti";
import { FiTwitter } from "react-icons/fi";

import { USER_DASHBOARD, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_REGISTER, WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import { getSiteConfigGroup } from '@/lib/getSiteConfig'
import { formatWebsiteUrl, normalizeContactInfo, splitPhones } from '@/lib/contactInfo'

const Footer = async () => {
    const config = await getSiteConfigGroup('contact_us')
    const { info } = normalizeContactInfo(config?.contactUs || {})
    const phoneNumbers = splitPhones(info.phone)
    const addressLines = [
        [info.addressLine1, info.addressLine2].filter(Boolean).join(', '),
        [info.city, info.state].filter(Boolean).join(', '),
        [info.country, info.pincode].filter(Boolean).join(' - ')
    ].filter((line) => line && line.trim().length)

    return (
        <footer className='bg-gray-50 border-t'>
            <div className='grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-10 py-10 lg:px-32 px-4'>

                <div className='lg:col-span-1 md:col-span-2 col-span-1'>
                    <Image
                        src={logo}
                        width={383}
                        height={146}
                        alt='logo'
                        className='w-36 mb-2'
                    />
                    <p className='text-gray-500 text-sm'>
                        E-store is your trusted destination for quality and convenience. From fashion to essentials, we bring everything you need right to your doorstep. Shop smart, live better — only at E-store.
                    </p>
                </div>

                <div>
                    <h4 className='text-xl font-bold uppercase mb-5'>Company</h4>
                    <ul>
                        <li className='mb-2 text-gray-500'>
                            <Link href="/about-us">Our Journey</Link>
                        </li>
                        <li className='mb-2 text-gray-500'>
                            <Link href={WEBSITE_SHOP}>Shop</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className='text-xl font-bold uppercase mb-5'>Userfull Links</h4>
                    <ul>
                        <li className='mb-2 text-gray-500'>
                            <Link href={WEBSITE_HOME}>Home</Link>
                        </li>
                        <li className='mb-2 text-gray-500'>
                            <Link href={WEBSITE_SHOP}>Shop</Link>
                        </li>
                        <li className='mb-2 text-gray-500'>
                            <Link href="/about-us">About</Link>
                        </li>
                        <li className='mb-2 text-gray-500'>
                            <Link href={WEBSITE_REGISTER}>Register</Link>
                        </li>
                        <li className='mb-2 text-gray-500'>
                            <Link href={WEBSITE_LOGIN}>Login</Link>
                        </li>

                    </ul>
                </div>
                <div>
                    <h4 className='text-xl font-bold uppercase mb-5'>Help Center</h4>
                    <ul>
                        <li className='mb-2 text-gray-500'>
                            <Link href={WEBSITE_REGISTER}>Register</Link>
                        </li>
                        <li className='mb-2 text-gray-500'>
                            <Link href={WEBSITE_LOGIN}>Login</Link>
                        </li>
                        <li className='mb-2 text-gray-500'>
                            <Link href={USER_DASHBOARD}>My Account</Link>
                        </li>
                        <li className='mb-2 text-gray-500'>
                            <Link href="/privacy-policy">Privacy Policy</Link>
                        </li>
                        <li className='mb-2 text-gray-500'>
                            <Link href="/terms-and-conditions">Terms & Conditions</Link>
                        </li>


                    </ul>
                </div>
                <div>
                    <h4 className='text-xl font-bold uppercase mb-5'>Contact Us </h4>
                    <ul>
                        {addressLines.length ? (
                            <li className='mb-2 text-gray-500 flex gap-2'>
                                <IoLocationOutline size={20} />
                                <div className='flex flex-col'>
                                    {addressLines.map((line) => (
                                        <span key={line} className='text-sm'>{line}</span>
                                    ))}
                                </div>
                            </li>
                        ) : null}

                        {phoneNumbers.length ? (
                            <li className='mb-2 text-gray-500 flex gap-2'>
                                <MdOutlinePhone size={20} />
                                <div className='flex flex-col text-sm'>
                                    {phoneNumbers.map((phone) => (
                                        <a key={phone} href={`tel:${phone.replace(/\s+/g, '')}`} className='hover:text-primary'>
                                            {phone}
                                        </a>
                                    ))}
                                </div>
                            </li>
                        ) : null}

                        {info.email ? (
                            <li className='mb-2 text-gray-500 flex gap-2'>
                                <MdOutlineMail size={20} />
                                <a href={`mailto:${info.email}`} className='hover:text-primary text-sm'>{info.email}</a>
                            </li>
                        ) : null}

                        {info.website ? (
                            <li className='mb-2 text-gray-500 flex gap-2'>
                                <MdOutlineMail size={20} />
                                <a href={formatWebsiteUrl(info.website)} target='_blank' rel='noopener noreferrer' className='hover:text-primary text-sm'>{info.website}</a>
                            </li>
                        ) : null}

                    </ul>


                    <div className='flex gap-5 mt-5'>

                        <Link href="">
                            <AiOutlineYoutube className='text-primary' size={25} />
                        </Link>
                        <Link href="">
                            <FaInstagram className='text-primary' size={25} />
                        </Link>
                        <Link href="">
                            <FaWhatsapp className='text-primary' size={25} />
                        </Link>
                        <Link href="">
                            <TiSocialFacebookCircular className='text-primary' size={25} />
                        </Link>
                        <Link href="">
                            <FiTwitter className='text-primary' size={25} />
                        </Link>

                    </div>

                </div>

            </div>


            <div className='py-5 bg-gray-100' >
                <p className='text-center'>© 2024 Estore. All Rights Reserved.</p>
            </div>

        </footer>
    )
}

export default Footer