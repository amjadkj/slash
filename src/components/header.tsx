"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import GlassSurface from '@/components/ui/glass-surface';
import styles from './header.module.scss';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

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
              onClick={() => alert("Let's Connect clicked!")}
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
                <Link href="#about" className={styles.navLink} onClick={() => setIsOpen(false)}>
                  About
                </Link>
                <Link href="#services" className={styles.navLink} onClick={() => setIsOpen(false)}>
                  Services
                </Link>
                <Link href="#projects" className={styles.navLink} onClick={() => setIsOpen(false)}>
                  Projects
                </Link>
                <Link href="#testimonials" className={styles.navLink} onClick={() => setIsOpen(false)}>
                  Testimonials
                </Link>
                <Link href="#team" className={styles.navLink} onClick={() => setIsOpen(false)}>
                  Team
                </Link>
              </div>

              <div className={styles.navCol}>
                <Link href="#values" className={styles.navLink} onClick={() => setIsOpen(false)}>
                  Values
                </Link>
                <Link href="#process" className={styles.navLink} onClick={() => setIsOpen(false)}>
                  Process
                </Link>
                <Link href="#integrations" className={styles.navLink} onClick={() => setIsOpen(false)}>
                  Integrations
                </Link>
                <Link href="#pricing" className={styles.navLink} onClick={() => setIsOpen(false)}>
                  Pricing
                </Link>
                <Link href="#faqs" className={styles.navLink} onClick={() => setIsOpen(false)}>
                  FAQs
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
