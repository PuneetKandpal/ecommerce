import Image from 'next/image'
import Link from 'next/link'
import logo from '@/public/assets/images/logo-black.png'
import { WEBSITE_HOME, WEBSITE_SHOP } from '@/routes/WebsiteRoute'
import { FALLBACK_CONTACT_INFO, formatWebsiteUrl, splitPhones } from '@/lib/contactInfo'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from 'react-icons/fa6'
import { MdEmail, MdLocationOn, MdPhone } from 'react-icons/md'
import { IoMdGlobe } from 'react-icons/io'

const linkCols = [
    {
        title: 'Company',
        links: [
            { label: 'Our Journey', href: '/about-us' },
            { label: 'Shop', href: WEBSITE_SHOP },
        ],
    },
    {
        title: 'Useful Links',
        links: [
            { label: 'Home', href: WEBSITE_HOME },
            { label: 'Shop', href: WEBSITE_SHOP },
            { label: 'About', href: '/about-us' },
            { label: 'Register', href: '/register' },
            { label: 'Login', href: '/login' },
        ],
    },
    {
        title: 'Help Center',
        links: [
            { label: 'Register', href: '/register' },
            { label: 'Login', href: '/login' },
            { label: 'My Account', href: '/user/dashboard' },
            { label: 'Privacy Policy', href: '/privacy-policy' },
            { label: 'Terms & Conditions', href: '/terms-conditions' },
        ],
    },
]

const Footer = () => {
    const info = FALLBACK_CONTACT_INFO
    const websiteUrl = formatWebsiteUrl(info.website)
    const phones = splitPhones(info.phone)

    return (
        <footer className="relative bg-[#0b0c0f] text-white">
            <div className="relative max-w-[1400px] mx-auto px-6 lg:px-16 py-14 grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4 flex flex-col gap-5">
                    <Image src={logo} alt="logo" width={200} height={80} className="w-28 invert brightness-0" />
                    <p className="text-sm text-white/70 leading-6">
                        Air Control Industries, established in 2016 in Ahmedabad, Gujarat, is a leading supplier of pneumatic products, industrial valves, automation products, and hydraulic hoses. We deliver quality, reliability, and value with strong technical support and dependable service.
                    </p>
                    <Link
                        href={WEBSITE_SHOP}
                        className="inline-flex items-center justify-center px-5 py-3 rounded-md border border-white/15 bg-white/5 text-sm font-semibold text-white hover:bg-white hover:text-black transition-colors w-fit"
                    >
                        Find locations
                    </Link>
                </div>

                <div className="lg:col-span-8 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
                    {linkCols.map((col) => (
                        <div key={col.title} className="space-y-4">
                            <h4 className="text-sm font-bold uppercase tracking-[0.12em] text-white/80">{col.title}</h4>
                            <ul className="space-y-2 text-sm text-white/65">
                                {col.links.map((item) => (
                                    <li key={item.label}>
                                        <Link href={item.href} className="hover:text-white transition-colors">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-[0.12em] text-white/80">Contact Us</h4>
                        <ul className="space-y-3 text-sm text-white/65">
                            <li className="flex gap-2">
                                <MdLocationOn className="mt-0.5 text-white/60" size={16} />
                                <span>
                                    {info.addressLine1}, {info.addressLine2}, {info.city} {info.state} {info.pincode}, {info.country}
                                </span>
                            </li>
                            <li className="flex gap-2">
                                <MdPhone className="mt-0.5 text-white/60" size={16} />
                                <span>{phones.join(', ')}</span>
                            </li>
                            <li className="flex gap-2">
                                <MdEmail className="mt-0.5 text-white/60" size={16} />
                                <a href={`mailto:${info.email}`} className="hover:text-white transition-colors">{info.email}</a>
                            </li>
                            <li className="flex gap-2">
                                <IoMdGlobe className="mt-0.5 text-white/60" size={16} />
                                <a href={websiteUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">{info.website}</a>
                            </li>
                        </ul>

                        <div className="flex items-center gap-3 pt-2">
                            <a href="#" className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-colors" aria-label="facebook">
                                <FaFacebookF size={14} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-colors" aria-label="instagram">
                                <FaInstagram size={14} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-colors" aria-label="linkedin">
                                <FaLinkedinIn size={14} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-colors" aria-label="youtube">
                                <FaYoutube size={14} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-colors" aria-label="twitter">
                                <FaXTwitter size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative border-t border-white/10 py-4 text-center text-white/60 text-sm">
                2024 Air Control Industries. All Rights Reserved.
            </div>
        </footer>
    )
}

export default Footer