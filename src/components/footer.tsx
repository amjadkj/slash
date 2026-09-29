"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ArrowUpRight, Sparkles } from 'lucide-react';
import GlassSurface from '@/components/ui/glass-surface';
import { ShaderBackground } from '@/components/ui/waves-background';
import styles from './footer.module.scss';

export default function Footer() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Please add your name';
    if (!formData.company.trim()) errors.company = 'Please add your company name';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errors.email = 'Add your work email';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitted(true);
  };

  return (
    <footer className={styles.footer} id="contact">
      {/* ── Animated Wave Shader Background ─────────────────────────── */}
      <ShaderBackground className={styles.shaderBg} />

      {/* ── Radial darkening overlay ─────────────────────────────────── */}
      <div className={styles.shaderOverlay} />

      <div className={styles.footerContainer}>
        <div className={styles.footerTop}>
        {/* ── Contact Form (GlassSurface card) ────────────────────────── */}
        <div className={styles.glassFormWrap}>
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={28}
            borderWidth={0.07}
            brightness={40}
            opacity={0.88}
            blur={14}
            backgroundOpacity={0.1}
            className={styles.glassSurface}
          >
            <div className={styles.cardInner}>
              {/* Form headline */}
              <div className={styles.formHeader}>
                <Sparkles className={styles.sparkleIcon} />
                <h3>Your Competitors Are Automating. Are you?</h3>
                <p>Stop wasting time on manual processes. Start building a self-running business.</p>
              </div>

              {/* Form / success state */}
              {isSubmitted ? (
                <div className={styles.successCard}>
                  <div className={styles.checkBadge}>
                    <Check />
                  </div>
                  <h4>Request Sent!</h4>
                  <p>We&apos;ll reply within one business day.</p>
                </div>
              ) : (
                <form className={styles.contactForm} onSubmit={handleFormSubmit} noValidate>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      placeholder="Your name*"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={formErrors.name ? styles.inputError : ''}
                    />
                    {formErrors.name && <span className={styles.errorText}>{formErrors.name}</span>}
                  </div>

                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      placeholder="Your company name*"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className={formErrors.company ? styles.inputError : ''}
                    />
                    {formErrors.company && <span className={styles.errorText}>{formErrors.company}</span>}
                  </div>

                  <div className={styles.inputWrapper}>
                    <input
                      type="email"
                      placeholder="Your business email*"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={formErrors.email ? styles.inputError : ''}
                    />
                    {formErrors.email && <span className={styles.errorText}>{formErrors.email}</span>}
                  </div>

                  <div className={styles.inputWrapper}>
                    <textarea
                      placeholder="Message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <div className={styles.submitRow}>
                    <button type="submit" className={styles.submitBtn}>
                      Send Your Request!
                    </button>
                  </div>
                </form>
              )}
            </div>
          </GlassSurface>
        </div>
        </div>
        {/* ── Social Links ─────────────────────────────────────────────── */}
        <div className={styles.socialRow}>
          {[
            { badge: 'in', label: 'LinkedIn',   href: 'https://linkedin.com' },
            { badge: 'ig', label: 'Instagram',  href: 'https://instagram.com' },
            { badge: 'f',  label: 'Facebook',   href: 'https://facebook.com' },
            { badge: '𝕏',  label: 'Twitter X',  href: 'https://x.com' },
          ].map(({ badge, label, href }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" className={styles.socialLink}>
              <span className={styles.socialBadge}>{badge}</span>
              <span>{label}</span>
              <ArrowUpRight className={styles.socialArrow} />
            </a>
          ))}
        </div>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className={styles.dividerLine} />

        {/* ── Nav Links ────────────────────────────────────────────────── */}
        <nav className={styles.navRow} aria-label="Footer navigation">
          <Link href="#about">About</Link>
          <Link href="#capabilities">Services</Link>
          <Link href="#testimonials">Projects</Link>
          <Link href="#values">Pricing</Link>
          <Link href="#faqs">FAQs</Link>
        </nav>

        {/* ── Slash Logo Watermark (Image 2, with gradient fade) ────── */}
        <div className={styles.logoWatermark}>
          <Image
            src="/Slash.svg"
            alt="Slash"
            width={100}
            height={50}
            className={styles.watermarkImg}
            priority={false}
          />
          {/* Gradient mask: fades the image from visible → black at the bottom */}
          {/* <div className={styles.logoMask} /> */}
        </div>
        {/* ── Bottom Bar ───────────────────────────────────────────────── */}
        <div className={styles.bottomRow}>
          <p className={styles.copyright}>
            © Slash {new Date().getFullYear()} |&nbsp;
            <Link href="/license">License</Link>
            &nbsp;| Powered by Next.js
          </p>

          {/* <Link href="/" className={styles.bottomLogo}>
            <Image src="/Slash.svg" alt="Slash" width={110} height={28} />
          </Link> */}
        </div>
      </div>
    </footer>
  );
}
