"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import GlassSurface from '@/components/ui/glass-surface';
import styles from './header.module.scss';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(`#${id}`);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerInner}>
        {/* Logo circle with GlassSurface */}
        <Link href="/" className={styles.logoLink} aria-label="Slash Home">
          <GlassSurface
            width={44}
            height={44}
            borderRadius={9999}
            brightness={92}
            opacity={0.96}
            backgroundOpacity={0.88}
            blur={12}
            saturation={1.4}
            className={styles.glassLogo}
          >
            <Image
              src="/logo.png"
              alt="Slash Logo"
              width={22}
              height={22}
              priority
            />
          </GlassSurface>
        </Link>

        {/* Navigation pill cluster with GlassSurface */}
        <GlassSurface
          width="auto"
          height={44}
          borderRadius={9999}
          brightness={92}
          opacity={0.96}
          backgroundOpacity={0.88}
          blur={12}
          saturation={1.4}
          className={styles.glassNavCluster}
        >
          <div className={styles.navClusterInner}>
            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={16} /> : <Menu size={16} />}
              <span>Menu</span>
            </button>

            {/* Direct Connect button with black font color on a single line */}
            <button
              type="button"
              className={styles.connectButton}
              onClick={() => scrollTo('contact')}
            >
              <span>Let&apos;s Connect</span>
            </button>
          </div>
        </GlassSurface>

        {/* Dropdown Menu Modal matching Image 3 */}
        {isOpen && (
          <div className={styles.dropdownOverlay}>
            <nav className={styles.navGrid}>
              <div className={styles.navCol}>
                <button className={styles.navLink} onClick={() => scrollTo('about')}>About</button>
                <button className={styles.navLink} onClick={() => scrollTo('services')}>Services</button>
                <button className={styles.navLink} onClick={() => scrollTo('projects')}>Projects</button>
                <button className={styles.navLink} onClick={() => scrollTo('testimonials')}>Testimonials</button>
                <button className={styles.navLink} onClick={() => scrollTo('team')}>Team</button>
              </div>

              <div className={styles.navCol}>
                <button className={styles.navLink} onClick={() => scrollTo('values')}>Values</button>
                <button className={styles.navLink} onClick={() => scrollTo('process')}>Process</button>
                <button className={styles.navLink} onClick={() => scrollTo('integrations')}>Integrations</button>
                {/* <button className={styles.navLink} onClick={() => scrollTo('pricing')}>Pricing</button> */}
                <button className={styles.navLink} onClick={() => scrollTo('faqs')}>FAQs</button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
