'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RiShakeHandsLine } from '@remixicon/react'
import { menuList } from '@/utlits/fackData/menuList'
import Image from 'next/image'

const Header = () => {
    const pathName = usePathname()
    const [isSticky, setisSticky] = useState(false)

    useEffect(() => {
        const navbar_collapse = document.querySelector(".navbar-collapse")
        if (navbar_collapse) {
            navbar_collapse.classList.remove("show")
        }
    }, [pathName])

    useEffect(() => {
        window.addEventListener("scroll", stickyHeader)
        return () => window.removeEventListener("scroll", stickyHeader)
    }, [])

    const stickyHeader = () => {
        const scrollTop = window.scrollY
        if (scrollTop > 85) {
            setisSticky(true)
        }
        else {
            setisSticky(false)
        }
    }

    if (pathName?.startsWith('/101098')) return null;
    return (
        <header className={`main-header ${isSticky ? "fixed-header" : ""}`}>
            <div className="header-upper">
                <div className="container">
                    <div className="header-inner d-flex align-items-center">
                        {/* <!-- START LOGO DESIGN AREA --> */}
                        <div className="logo-outer">
                            <div className="logo">
                                <Link href="/">
                                    <Image width={120} height={40} sizes='100vw' src={"/images/logo.png"} alt="Logo" title="Logo" />
                                </Link>
                            </div>
                        </div>
                        {/* <!-- / END LOGO DESIGN AREA -->
                        <!-- START NAV DESIGN AREA --> */}
                        <div className="nav-outer clearfix mx-auto">
                            {/* <!-- Main Menu --> */}
                            <nav className="main-menu navbar-expand-lg">
                                <div className="navbar-header">
                                    <div className="mobile-logo">
                                        <Link href="/">
                                            <Image width={75} height={25} sizes='100vw' src={"/images/logo.png"} alt="Logo" title="Logo" />
                                        </Link>
                                    </div>
                                    {/* <!-- Toggle Button --> */}
                                    <button type="button" className="navbar-toggle" data-bs-toggle="collapse" data-bs-target=".navbar-collapse">
                                        <span className="icon-bar"></span>
                                        <span className="icon-bar"></span>
                                        <span className="icon-bar"></span>
                                    </button>
                                </div>
                                <div className="navbar-collapse collapse">
                                    <ul className="navigation onepage clearfix">
                                        {
                                            menuList.map(({ id, label, path }) => <li key={id}><Link href={path} className="nav-link-click" >{label}</Link></li>)
                                        }
                                    </ul>
                                </div>
                            </nav>

                        </div>
                        <div className="menu-btns d-flex align-items-center">
                            <Link href="/contact" className="theme-btn">Hire Me <RiShakeHandsLine size={15} /> </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header