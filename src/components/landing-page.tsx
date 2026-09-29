"use client";

import React, { useState, useEffect, useRef, useCallback, TouchEvent as ReactTouchEvent } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Rocket,
  LayoutGrid,
  Check,
  Plus,
  Play,
  ArrowRight,
  ArrowDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { LiquidMetal, liquidMetalPresets } from '@paper-design/shaders-react';
import ScrollReveal from './ui/scroll-reveal';
import Marquee from './ui/marquee';
import GlassSurface from './ui/glass-surface';
import styles from './landing-page.module.scss';

// ─── Data ───────────────────────────────────────────────────────────────────

const TIMELINE_STEPS = [
  { index: '01', title: 'Discovery & Audit', desc: 'We assess your current workflows, tech stack, and pain points to identify the highest-impact automation opportunities.' },
  { index: '02', title: 'Automation Blueprint', desc: 'A tailored roadmap mapping every integration, trigger, and decision-logic pathway before a single line of code is written.' },
  { index: '03', title: 'Build & Integration', desc: 'We develop, wire, and connect each system—CRM, marketing, internal tools—into one intelligent, automated architecture.' },
  { index: '04', title: 'Testing & Optimization', desc: 'Rigorous QA, load testing, and edge-case validation ensure your automations perform flawlessly under real-world conditions.' },
  { index: '05', title: 'Deployment & Scaling', desc: 'We launch, monitor, and continuously refine your systems to scale seamlessly with your business growth.' },
];

const CASE_STUDIES = [
  {
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80',
    clientInitial: 'S',
    clientName: 'Skyline Realty',
    title: 'AI Workflow Automation for SaaS Company',
    desc: 'We replaced manual lead routing and follow-up processes with an intelligent pipeline that auto-scores, assigns, and nurtures prospects in real time.',
    stats: [
      { value: '+40%', label: 'Demo Booking' },
      { value: '+25%', label: 'Closing Rate' },
      { value: '3x', label: 'Engagement' },
    ],
  },
  {
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    clientInitial: 'N',
    clientName: 'Nexora Digital',
    title: 'End-to-End CRM & Marketing Automation',
    desc: 'Unified CRM, email sequences, and reporting into a single automated ecosystem—freeing 30+ hours per week of manual work.',
    stats: [
      { value: '30+', label: 'Hours Saved / Week' },
      { value: '+50%', label: 'Pipeline Visibility' },
      { value: '2x', label: 'Qualified Leads' },
    ],
  },
  {
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    clientInitial: 'B',
    clientName: 'BrightPath SaaS',
    title: 'AI Chatbot for Lead Qualification & Booking',
    desc: 'Deployed a 24/7 conversational agent that qualifies, scores, and books demos automatically—dramatically reducing response times.',
    stats: [
      { value: '+35%', label: 'Enrollment Conversion' },
      { value: '5s', label: 'Avg Response Time' },
      { value: '-50%', label: 'Admin Work' },
    ],
  },
];

// Map display name → slug used in /public/logos/<slug>.svg
const LOGO_SLUG_MAP: Record<string, string> = {
  'HubSpot': 'hubspot',
  'AWS': 'amazonaws',
  'GoHighLevel': 'gohighlevel',
  'ActiveCampaign': 'activecampaign',
  'ClickUp': 'clickup',
  'WordPress': 'wordpress',
};

const getLogoSlug = (name: string) =>
  LOGO_SLUG_MAP[name] ?? name.toLowerCase();

const TECH_LOGOS_ROW1 = ['Zapier', 'HubSpot', 'Salesforce', 'Slack', 'Notion', 'Airtable', 'Stripe', 'Twilio', 'Make', 'Webflow'];
const TECH_LOGOS_ROW2 = ['OpenAI', 'Langchain', 'Supabase', 'Firebase', 'Vercel', 'AWS', 'Retool', 'Segment', 'Intercom', 'Mailchimp'];
const TECH_LOGOS_ROW3 = ['Calendly', 'GoHighLevel', 'Typeform', 'Shopify', 'WordPress', 'Monday', 'Pipedrive', 'ActiveCampaign', 'ClickUp', 'Zendesk'];

const TEAM_MEMBERS = [
  {
    name: 'Mohammed Faaraz ',
    role: 'Co-Founder',
    photo: '/faaraz.webp',
  },
  {
    name: 'Amjad K Jabir',
    role: 'Co-Founder',
    photo: '/Amjad.webp',
  },
];

// Reusable Section Pill [ index ● LABEL ]
function SectionPill({ index, label, hasAccent = false }: { index?: string; label: string; hasAccent?: boolean }) {
  return (
    <div className={styles.sectionPill}>
      {index && <span className={styles.pillIndex}>{index}</span>}
      <span className={hasAccent ? styles.accentDot : styles.pillDot} />
      <span>{label}</span>
    </div>
  );
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // FAQ accordion state: single-row open at a time
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ─── Timeline scroll progress ───
  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [activeSteps, setActiveSteps] = useState<boolean[]>(new Array(TIMELINE_STEPS.length).fill(false));

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const viewportTrigger = window.innerHeight * 0.55;

      // Overall line fill progress
      const totalHeight = rect.height;
      const scrolledPast = viewportTrigger - rect.top;
      const progress = Math.max(0, Math.min(1, scrolledPast / totalHeight));
      setTimelineProgress(progress);

      // Per-step activation
      const stepEls = timelineRef.current.querySelectorAll('[data-timeline-step]');
      const newActive = [...activeSteps];
      stepEls.forEach((el, i) => {
        const stepRect = el.getBoundingClientRect();
        newActive[i] = stepRect.top < viewportTrigger;
      });
      setActiveSteps(newActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Case study slider ───
  const [activeCase, setActiveCase] = useState(0);
  const touchStartX = useRef(0);

  const goToCase = useCallback((idx: number) => {
    setActiveCase((idx + CASE_STUDIES.length) % CASE_STUDIES.length);
  }, []);

  const handleTouchStart = useCallback((e: ReactTouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: ReactTouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goToCase(activeCase + (diff > 0 ? 1 : -1));
    }
  }, [activeCase, goToCase]);

  // ─── Testimonial slider (mobile) ───
  const testimonialSliderRef = useRef<HTMLDivElement>(null);
  const [activeTestimonialSlide, setActiveTestimonialSlide] = useState(0);

  const handleTestimonialScroll = useCallback(() => {
    const container = testimonialSliderRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const slideWidth = container.scrollWidth / 3; // 3 columns
    const index = Math.round(scrollLeft / slideWidth);
    setActiveTestimonialSlide(Math.min(Math.max(index, 0), 2));
  }, []);

  const scrollToTestimonialSlide = useCallback((index: number) => {
    const container = testimonialSliderRef.current;
    if (!container) return;
    const slideWidth = container.scrollWidth / 3;
    container.scrollTo({ left: slideWidth * index, behavior: 'smooth' });
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

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

  const scrollToContact = () => {
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo('#contact');
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ─── Tech logo renderer ───
  const renderTechLogos = (logos: string[]) =>
    logos.map((name) => {
      const slug = getLogoSlug(name);
      return (
        <div key={name} className={styles.techLogoItem}>
          <div className={styles.techLogoIcon}>
            <Image
              src={`/logos/${slug}.svg`}
              alt={name}
              width={18}
              height={18}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <span className={styles.techLogoName}>{name}</span>
        </div>
      );
    });

  return (
    <div className={styles.pageWrapper}>
      {/* ===================================================================
          Hero Section
          =================================================================== */}
      <section className={styles.heroSection}>
        {/* Liquid Metal Animation Background */}
        {mounted && (
          <div className={styles.heroLiquidMetal}>
            <LiquidMetal
              {...liquidMetalPresets[2]}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* <div className={styles.heroLiquidOverlay} /> */}
          </div>
        )}

        <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* <SectionPill label="Unicorn AI Partner" hasAccent /> */}

            <h1 className={styles.heroTitle}>
              Intelligent Automation for Modern Business
            </h1>

            <p className={styles.heroSubtitle}>
              We build AI-powered automation systems that eliminate manual work, reduce costs, and multiply your business performance.
            </p>

            <div className={styles.heroCtaGroup}>
              <button
                type="button"
                className={styles.primaryPillBtn}
                onClick={scrollToContact}
              >
                <span>Send Your Request!</span>
                <ArrowRight />
              </button>

              <button
                type="button"
                className={styles.secondaryHeroBtn}
                onClick={scrollToContact}
              >
                <div className={styles.avatarGroup}>
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                    alt="Team member 1"
                    width={22}
                    height={22}
                  />
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                    alt="Team member 2"
                    width={22}
                    height={22}
                  />
                </div>
                <span>Work with Us</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================================================================
          S1. Who We Are
          =================================================================== */}
      <section id="who-we-are" className={styles.whoWeAreSection}>
          <div className={styles.whoWeAreInner}>
            <div className={styles.sectionHeader}>
              <SectionPill index="001" label="WHO WE ARE" />
            </div>

            <div className={styles.whoWeAreRevealText}>
              <ScrollReveal
                baseOpacity={0}
                enableBlur={true}
                baseRotation={5}
                blurStrength={10}
              >
                We help businesses build custom web and mobile applications, streamline operations with CRM and ERP solutions, and implement business management systems. From workflow and process automation to AI-powered internal and customer chatbots, we design intelligent systems that scale with you.
              </ScrollReveal>
            </div>

            <div className={styles.whoWeAreVideoWrapper}>
              {/* Background stat marquee text */}
              <div className={styles.marqueeStatsBehind}>
                <Marquee direction="left" duration={25}>
                  <div className={styles.marqueeStatText}>
                    <span>5X FASTER RESPONSE</span>
                    <span className={styles.marqueeStatDot} />
                    <span>600+ SAVED HOURS</span>
                    <span className={styles.marqueeStatDot} />
                    <span>40% MORE CONVERSIONS</span>
                    <span className={styles.marqueeStatDot} />
                    <span>50% LESS ADMIN</span>
                    <span className={styles.marqueeStatDot} />
                  </div>
                </Marquee>
              </div>

              {/* Video card */}
              <div className={styles.whoWeAreVideoCard}>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  src="/assets/Cursor_typing_slash_logo_animation_20260918195311.mp4"
                />
              </div>
            </div>
          </div>
      </section>

            {/* ===================================================================
          4.2 Why Choose Us?
          =================================================================== */}
      <section id="values" className={styles.whyChooseUsSection}>
        <div className="section-container">
          <div className={styles.sectionHeader}>
            <SectionPill index="002" label="VALUES" />
            <h2>Why Choose Us?</h2>
            <p>
              We build AI-powered automation systems that eliminate manual work, reduce costs, and multiply your business performance.
            </p>
          </div>

          <div className={styles.whyChooseUsGrid}>
            {/* Card 01 */}
            <div className={styles.outerShellCard}>
              <div className={styles.darkGlassTile}>
                <div className={styles.glassTileCircle}>
                  <Sparkles />
                </div>
                <span className={styles.indexChip}>01</span>
              </div>
              <div className={styles.shellContent}>
                <h3>Business-First AI Strategy</h3>
                <p>We design solutions aligned with your revenue goals.</p>
              </div>
            </div>

            {/* Card 02 */}
            <div className={styles.outerShellCard}>
              <div className={styles.darkGlassTile}>
                <div className={styles.glassTileCircle}>
                  <Rocket />
                </div>
                <span className={styles.indexChip}>02</span>
              </div>
              <div className={styles.shellContent}>
                <h3>End-to-End Implementation</h3>
                <p>From strategy to development, followed by deployment.</p>
              </div>
            </div>

            {/* Card 03 */}
            <div className={styles.outerShellCard}>
              <div className={styles.darkGlassTile}>
                <div className={styles.glassTileCircle}>
                  <LayoutGrid />
                </div>
                <span className={styles.indexChip}>03</span>
              </div>
              <div className={styles.shellContent}>
                <h3>Custom-Built Automation</h3>
                <p>No templates. Every workflow is tailored to your unique operations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* ===================================================================
          4.3 Our AI-Driven Services (Bento Grid)
          =================================================================== */}
      <section id="capabilities" className={styles.servicesSection}>
        <div className="section-container">
          <div className={styles.sectionHeader}>
            <SectionPill index="003" label="CAPABILITIES" />
            <h2>Our AI-Driven Services</h2>
            <p>Engineered automation architectures custom tailored to modern enterprise workflows.</p>
          </div>

          <div className={styles.bentoGrid}>
            {/* Card 1: Tall Left Card */}
            <div className={`${styles.bentoCard} ${styles.tallBentoCard}`}>
              <div>
                <p className={styles.cardParagraph}>
                  <strong>AI Workflow Automation.</strong>
                  Automate repetitive tasks across departments using intelligent triggers and decision logic.
                </p>
                <ul className={styles.checklist}>
                  <li>
                    <Check />
                    <span>Workflow mapping</span>
                  </li>
                  <li>
                    <Check />
                    <span>Real-time system integration</span>
                  </li>
                  <li>
                    <Check />
                    <span>Validated output</span>
                  </li>
                </ul>
              </div>

              <div className={styles.bentoCardImageWrap}>
                <Image src="/automation.webp" alt="AI Workflow Automation" fill className={styles.bentoCardImage} />
              </div>
            </div>

            {/* Card 2: AI Chatbots & Conversational Agents */}
            <div className={styles.bentoCard}>
              <p className={styles.cardParagraph}>
                <strong>AI Chatbots & Conversational Agents.</strong>
                24/7 customer support, lead qualification, booking systems, and AI sales reps.
              </p>
              <div className={styles.bentoCardImageWrap}>
                <Image src="/agentic_chat.webp" alt="AI Chatbot" fill className={styles.bentoCardImage} />
              </div>
            </div>

            {/* Card 3: AI Data & Reporting Systems */}
            <div className={styles.bentoCard}>
              <p className={styles.cardParagraph}>
                <strong>AI Data & Reporting Systems.</strong>
                Automated dashboards, business intelligence, performance forecasting.
              </p>
              <div className={styles.bentoCardImageWrap}>
                <Image src="/report.webp" alt="AI Reporting" fill className={styles.bentoCardImage} />
              </div>
            </div>

            {/* Card 4: CRM & Sales Automation */}
            <div className={styles.bentoCard}>
              <p className={styles.cardParagraph}>
                <strong>CRM & Sales Automation.</strong>
                Pipeline automation, AI lead scoring, follow-ups, predictive insights.
              </p>
              <div className={styles.bentoCardImageWrap}>
                <Image src="/lead_ranking.webp" alt="Lead Ranking" fill className={styles.bentoCardImage} />
              </div>
            </div>

            {/* Card 5: Marketing Automation */}
            <div className={styles.bentoCard}>
              <p className={styles.cardParagraph}>
                <strong>Marketing Automation.</strong>
                Email sequences, personalization engines, AI-generated content systems.
              </p>
              <div className={styles.bentoCardImageWrap}>
                <Image src="/marketing.webp" alt="Marketing Automation" fill className={styles.bentoCardImage} />
              </div>
            </div>
          </div>

          {/* Second Bento Grid Row: CTA + Security */}
          <div className={styles.bentoGrid}>
            {/* Card: Hologram CTA */}
            <div className={`${styles.bentoCard} ${styles.hologramCtaCard}`}>
              <div className={styles.hologramAvatarRow}>
                <Image
                  src="/faaraz.webp"
                  alt="Faaraz"
                  width={48}
                  height={48}
                  className={styles.hologramAvatar}
                />
                <div className={styles.hologramPhoneIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
              </div>
              <h3 className={styles.hologramHeading}>Not sure what to automate first?</h3>
              <p className={styles.hologramDesc}>
                Book a free 30-minute AI strategy session. We&apos;ll analyze your current workflows and identify the highest-ROI automation opportunities for your business.
              </p>
              <a href="#contact" className={styles.primaryPillBtn}>
                Schedule a Session <ArrowRight />
              </a>
            </div>

            {/* Card: Security Features */}
            <div className={`${styles.bentoCard} ${styles.securityCard}`}>
              <h3 className={styles.securityHeading}>Your Data. Protected. Always.</h3>
              <div className={styles.securityFeatures}>
                <div className={styles.securityFeatureItem}>
                  <div className={styles.securityIconWrap}>
                    <Image src="/encryption.svg" alt="Encryption" width={50} height={50} />
                  </div>
                  <span>End-to-End Encryption</span>
                </div>
                <div className={styles.securityFeatureItem}>
                  <div className={styles.securityIconWrap}>
                    <Image src="/secure_integration.svg" alt="Secure API" width={50} height={50} />
                  </div>
                  <span>Secure API Integrations</span>
                </div>
                <div className={styles.securityFeatureItem}>
                  <div className={styles.securityIconWrap}>
                    <Image src="/rbac.svg" alt="RBAC" width={50} height={50} />
                  </div>
                  <span>Role-Based Access Control</span>
                </div>
                <div className={styles.securityFeatureItem}>
                  <div className={styles.securityIconWrap}>
                    <Image src="/data_minimize.svg" alt="Data Minimization" width={50} height={50} />
                  </div>
                  <span>Data Minimization</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          S2. How We Work — Timeline
          =================================================================== */}
      <section id="process" className={styles.howWeWorkSection}>
        <div className="section-container">
          <div className={styles.sectionHeader}>
            <SectionPill index="004" label="PROCESS" />
            <h2>How We Work</h2>
            <p>A proven 5-step methodology from audit to scale.</p>
          </div>

          <div className={styles.timelineContainer} ref={timelineRef}>
            {/* Static background line */}
            <div className={styles.timelineLine} />
            {/* Filled portion driven by scroll */}
            <div
              className={styles.timelineLineFill}
              style={{ height: `${timelineProgress * 100}%` }}
            />

            <div className={styles.timelineSteps}>
              {TIMELINE_STEPS.map((step, i) => {
                const isActive = activeSteps[i];
                return (
                  <div
                    key={step.index}
                    data-timeline-step
                    className={`${styles.timelineStep} ${isActive ? styles.timelineStepActive : ''}`}
                  >
                    <div className={styles.timelineDotWrapper}>
                      <div className={`${styles.timelineDot} ${isActive ? styles.timelineDotActive : ''}`}>
                        <div className={styles.timelineDotInner} />
                      </div>
                    </div>
                    <div className={styles.timelineStepContent}>
                      <div className={styles.timelineStepIndex}>{step.index}</div>
                      <h3 className={styles.timelineStepTitle}>{step.title}</h3>
                      <p className={styles.timelineStepDesc}>{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          S3. What We've Built — Case Studies
          =================================================================== */}
      <section id="case-studies" className={styles.caseStudiesSection}>
        <div className="section-container">
          <div className={styles.sectionHeader}>
            <SectionPill index="005" label="CASE STUDIES" />
            <h2>What We&apos;ve Built</h2>
            <p>Real results from businesses that scaled with intelligent automation.</p>
          </div>

          <div
            className={styles.caseStudySlider}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className={styles.caseStudyCard}>
              {/* Image side — stacked cross-fade */}
              <div className={styles.caseStudyImageWrap}>
                {CASE_STUDIES.map((cs, i) => (
                  <Image
                    key={i}
                    src={cs.image}
                    alt={cs.title}
                    fill
                    sizes="50vw"
                    className={`${styles.caseStudyImage} ${i === activeCase ? styles.active : ''}`}
                  />
                ))}
              </div>

              {/* Details side — cross-fade */}
              <div className={styles.caseStudyDetails}>
                {CASE_STUDIES.map((cs, i) => (
                  <div
                    key={i}
                    className={`${styles.caseStudyDetailsInner} ${i === activeCase ? styles.active : ''}`}
                    style={{ display: i === activeCase ? 'block' : 'none' }}
                  >
                    <div className={styles.caseStudyClient}>
                      <div className={styles.clientLogo}>{cs.clientInitial}</div>
                      <span className={styles.clientName}>{cs.clientName}</span>
                    </div>
                    <h3 className={styles.caseStudyTitle}>{cs.title}</h3>
                    <p className={styles.caseStudyDesc}>{cs.desc}</p>
                    <button type="button" className={styles.caseStudyReadMore}>
                      Read More <ArrowRight />
                    </button>
                    <div className={styles.caseStudyStats}>
                      {cs.stats.map((stat, si) => (
                        <div key={si} className={styles.statBlock}>
                          <div className={styles.statValue}>{stat.value}</div>
                          <div className={styles.statLabel}>{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className={styles.caseStudyNav}>
              <button
                type="button"
                className={styles.caseStudyNavBtn}
                onClick={() => goToCase(activeCase - 1)}
                aria-label="Previous case study"
              >
                <ChevronLeft />
              </button>
              <div className={styles.caseStudyDots}>
                {CASE_STUDIES.map((_, i) => (
                  <div
                    key={i}
                    className={`${styles.dot} ${i === activeCase ? styles.activeDot : ''}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className={styles.caseStudyNavBtn}
                onClick={() => goToCase(activeCase + 1)}
                aria-label="Next case study"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          S4. Technology Ecosystem — Logo Marquee
          =================================================================== */}
      <section id="integrations" className={styles.techEcosystemSection}>
          <div className={styles.sectionHeader}>
            <SectionPill index="006" label="INTEGRATIONS" />
            <h2>Technology Ecosystem</h2>
            <p>Connecting the platforms that power your business.</p>
          </div>

          <div className={styles.techEcosystemInner}>
            {/* Glowing center circle with logo */}
            <GlassSurface
              width={140}
              height={140}
              borderRadius={9999}
              brightness={20}
              opacity={0.96}
              backgroundOpacity={0.7}
              blur={14}
              saturation={1.4}
              className={styles.techCenterCircle}
            >
              <Image
                src="/logo.png"
                alt="Slash logo"
                width={52}
                height={52}
              />
              <div className={styles.techCenterLabel}>Powered by Slash</div>
            </GlassSurface>

            {/* 3 rows of logos */}
            <div className={styles.techMarqueeRows}>
              <Marquee direction="left" duration={35}>
                {renderTechLogos(TECH_LOGOS_ROW1)}
              </Marquee>
              <Marquee direction="right" duration={40}>
                {renderTechLogos(TECH_LOGOS_ROW2)}
              </Marquee>
              <Marquee direction="left" duration={35}>
                {renderTechLogos(TECH_LOGOS_ROW3)}
              </Marquee>
            </div>

            <p className={styles.techCaption}>
              Our automation architecture connects data, workflows, and platforms into a secure, high-performance system that grows with you.
            </p>
          </div>
      </section>

      {/* ===================================================================
          4.1 Testimonials: "What They're Saying"
          =================================================================== */}
      <section id="testimonials" className={styles.testimonialsSection}>
        <div className="section-container">
          <div className={styles.sectionHeader}>
            <SectionPill label="TESTIMONIALS" />
            <h2>What They&apos;re Saying</h2>
            <p>Proven impact from companies scaling with intelligent automated pipelines.</p>
          </div>

          <div
            className={styles.testimonialMasonry}
            ref={testimonialSliderRef}
            onScroll={handleTestimonialScroll}
          >
            {/* Column 1 (Starts slightly lower) */}
            <div className={styles.masonryCol}>
              {/* Video Card 1 */}
              <div className={styles.videoCard}>
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                  alt="Founder interview"
                  width={400}
                  height={300}
                  className={styles.videoBgImage}
                />
                <div className={styles.videoOverlay} />
                <button
                  type="button"
                  className={styles.playBtnCircle}
                  aria-label="Play video"
                  onClick={() => alert("Video playback demo")}
                >
                  <Play />
                </button>
                <div className={styles.videoBottom}>
                  <div className={styles.videoLogo}>
                    <span />
                    Logoipsum
                  </div>
                  <h4>How Puno Automated 80% of Lead Handling</h4>
                </div>
              </div>

              {/* Quote Card: David Lee */}
              <div className={styles.quoteCard}>
                <div className={styles.quoteTopRow}>
                  <div className={styles.avatarCircle}>
                    <Image
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                      alt="David Lee"
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className={styles.quoteMark}>&ldquo;</span>
                </div>
                <div className={styles.authorName}>David Lee</div>
                <div className={styles.authorRole}>Founder, Atodio Studio</div>
                <div className={styles.quoteText}>
                  <p>
                    We were spending hours on repetitive tasks. Their automation system saved us 30+ hours per week and dramatically improved our sales performance.
                  </p>
                </div>
              </div>

              {/* Quote Card: Daniel Kim */}
              <div className={styles.quoteCard}>
                <div className={styles.quoteTopRow}>
                  <div className={styles.avatarCircle}>
                    <Image
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80"
                      alt="Daniel Kim"
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className={styles.quoteMark}>&ldquo;</span>
                </div>
                <div className={styles.authorName}>Daniel Kim</div>
                <div className={styles.authorRole}>Founder, ScaleLabs Education</div>
                <div className={styles.quoteText}>
                  <p>
                    Our enrollment process used to require manual follow-ups and spreadsheet tracking. Now, AI handles lead qualification, scheduling, reminders, and CRM updates automatically.
                  </p>
                  <p>
                    We&apos;ve increased enrollment conversion by 35% in just one quarter.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2 (Starts highest) */}
            <div className={styles.masonryCol}>
              {/* Quote Card: Michael Tran */}
              <div className={styles.quoteCard}>
                <div className={styles.quoteTopRow}>
                  <div className={styles.avatarCircle}>
                    <Image
                      src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80"
                      alt="Michael Tran"
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className={styles.quoteMark}>&ldquo;</span>
                </div>
                <div className={styles.authorName}>Michael Tran</div>
                <div className={styles.authorRole}>Founder & CEO, Skyline Realty Group</div>
                <div className={styles.quoteText}>
                  <p>
                    We reduced admin work by nearly 50% and doubled our qualified appointment bookings. The ROI was faster than we expected, and the system continues to scale with us.
                  </p>
                </div>
              </div>

              {/* Quote Card: Sarah Mitchell */}
              <div className={styles.quoteCard}>
                <div className={styles.quoteTopRow}>
                  <div className={styles.avatarCircle}>
                    <Image
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                      alt="Sarah Mitchell"
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className={styles.quoteMark}>&ldquo;</span>
                </div>
                <div className={styles.authorName}>Sarah Mitchell</div>
                <div className={styles.authorRole}>COO, BrightPath SaaS</div>
                <div className={styles.quoteText}>
                  <p>
                    We struggled with inconsistent lead follow-ups and slow response times. Their AI automation blueprint gave us clarity first, then execution.
                  </p>
                  <p>
                    Now, our CRM runs intelligently, leads are scored automatically, and follow-ups happen without manual effort. We&apos;ve increased demo bookings by 40% while reducing operational friction.
                  </p>
                </div>
              </div>

              {/* Quote Card: Jonathan Reed */}
              <div className={styles.quoteCard}>
                <div className={styles.quoteTopRow}>
                  <div className={styles.avatarCircle}>
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                      alt="Jonathan Reed"
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className={styles.quoteMark}>&ldquo;</span>
                </div>
                <div className={styles.authorName}>Jonathan Reed</div>
                <div className={styles.authorRole}>Managing Director, Nexora Digital Agency</div>
                <div className={styles.quoteText}>
                  <p>
                    We were scaling fast but drowning in manual workflows. Their automation system connected our CRM, email marketing, and reporting into one intelligent flow.
                  </p>
                  <p>
                    The result? 30+ hours saved per week and complete visibility across our pipeline.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3 (Starts in between) */}
            <div className={styles.masonryCol}>
              {/* Quote Card: Alex Johnson */}
              <div className={styles.quoteCard}>
                <div className={styles.quoteTopRow}>
                  <div className={styles.avatarCircle}>
                    <Image
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                      alt="Alex Johnson"
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className={styles.quoteMark}>&ldquo;</span>
                </div>
                <div className={styles.authorName}>Alex Johnson</div>
                <div className={styles.authorRole}>Head of Operations, Innovate Consulting</div>
                <div className={styles.quoteText}>
                  <p>
                    Security and compliance were major concerns for us. They designed an automation architecture that was not only efficient but enterprise-grade secure.
                  </p>
                </div>
              </div>

              {/* Video Card 2 */}
              <div className={styles.videoCard}>
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                  alt="Executive interview"
                  width={400}
                  height={300}
                  className={styles.videoBgImage}
                />
                <div className={styles.videoOverlay} />
                <button
                  type="button"
                  className={styles.playBtnCircle}
                  aria-label="Play video"
                  onClick={() => alert("Video playback demo")}
                >
                  <Play />
                </button>
                <div className={styles.videoBottom}>
                  <div className={styles.videoLogo}>
                    <span />
                    Logoipsum
                  </div>
                  <h4>Scaling SaaS Operations with AI Automation</h4>
                </div>
              </div>

              {/* Quote Card: Laura Martinez */}
              <div className={styles.quoteCard}>
                <div className={styles.quoteTopRow}>
                  <div className={styles.avatarCircle}>
                    <Image
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                      alt="Laura Martinez"
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className={styles.quoteMark}>&ldquo;</span>
                </div>
                <div className={styles.authorName}>Laura Martinez</div>
                <div className={styles.authorRole}>CMO, Elevate Commerce Co.</div>
                <div className={styles.quoteText}>
                  <p>
                    Marketing automation always felt fragmented: too many tools, not enough cohesion.
                  </p>
                  <p>
                    They unified everything into one intelligent ecosystem. Campaign triggers, abandoned cart flows, segmentation: all automated with precision.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Slider pagination dots — visible only on mobile via CSS */}
          {/* <div className={styles.sliderDots}>
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                type="button"
                className={`${styles.sliderDot} ${activeTestimonialSlide === i ? styles.activeDot : ''}`}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollToTestimonialSlide(i)}
              />
            ))}
          </div> */}
        </div>
      </section>
      
      {/* ===================================================================
          S5. Meet the Conicorn's Minds — Team
          =================================================================== */}
      <section id="team" className={styles.teamSection}>
        <div className="section-container">
          <div className={styles.sectionHeader}>
            <SectionPill index="009" label="TEAM" />
            <h2>Meet the Slash&apos;s Minds</h2>
            <p>The people building the future of business automation.</p>
          </div>

          <div className={styles.teamGrid}>
            {TEAM_MEMBERS.map((member) => (
              <div key={member.name} className={styles.teamCard}>
                <div className={styles.teamPhoto}>
                  <Image
                    src={member.photo}
                    alt={member.name}
                    width={260}
                    height={347}
                  />
                </div>
                <h3 className={styles.teamName}>{member.name}</h3>
                <p className={styles.teamRole}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

        
      {/* ===================================================================
          4.4 Common Questions (FAQ) & 4.5 Contact Form Wrapper
          =================================================================== */}
      <section className={styles.faqAndContactWrapper}>
        <div className={styles.silverWaveBlur1} />
        <div className={styles.silverWaveBlur2} />

        <div className="section-container">
          {/* FAQ Accordion */}
          <div id="faqs" className={styles.faqContainer}>
            <div className={styles.sectionHeader}>
              <SectionPill label="FAQS" />
              <h2>Common Questions</h2>
              <p>Everything you need to know about working with Slash.</p>
            </div>

            <div className={styles.faqList}>
              {[
                {
                  q: "What industries do you work with?",
                  a: "We partner across high-growth service businesses, SaaS platforms, education, real estate, specialized digital agencies, and e-commerce brands looking to scale throughput without proportional headcount."
                },
                {
                  q: "How long does implementation take?",
                  a: "Most implementations deploy within 2 to 6 weeks. We initiate with a rapid 1-week architecture blueprint, followed by agile development sprints and validated production cutover."
                },
                {
                  q: "Do we need technical knowledge to work with you?",
                  a: "No technical expertise is required from your team. We manage the entire lifecycle—architecture, system integrations, security auditing, and prompt engineering—providing a turnkey handover with simple operator training."
                },
                {
                  q: "Is AI automation secure?",
                  a: "Security is built-in from day one. We enforce zero-trust isolation, end-to-end encrypted API credentials, strict role-based access controls, and SOC2-compliant data practices."
                },
                {
                  q: "What kind of ROI can we expect?",
                  a: "Clients typically see measurable ROI within their first quarter. Typical results include 30+ hours saved per week per team, 50% admin reduction, and 35-40% increases in qualified pipeline conversion."
                }
              ].map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className={styles.faqRow}>
                    <button
                      type="button"
                      className={styles.faqHeader}
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                    >
                      <div className={styles.faqLeft}>
                        <span className={styles.numChip}>{idx + 1}</span>
                        <span className={styles.faqQuestion}>{faq.q}</span>
                      </div>
                      <div className={`${styles.toggleBtn} ${isOpen ? styles.rotated : ''}`}>
                        <Plus />
                      </div>
                    </button>
                    <div className={`${styles.faqAnswerCollapse} ${isOpen ? styles.open : ''}`}>
                      <div className={styles.faqAnswerInner}>
                        {faq.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.faqFooterPrompt}>
              <span>Have any other questions?</span>
              <a onClick={scrollToContact}>Contact Us</a>
              <span className={styles.arrowChip} onClick={scrollToContact}>
                <ArrowDown />
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
