"use client";

import { motion } from "motion/react";

const TeamsIcon = () => (
  <svg viewBox="0 0 2228.83 2073.33" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
    <path fill="#5059C9" d="M1554.64,777.5h575.71c54.39,0,98.48,44.09,98.48,98.48v524.4c0,199.9-162.05,361.95-361.95,361.95h-1.71c-199.9,0.03-361.97-162-362-361.9c0-0.02,0-0.03,0-0.05V828.97C1503.17,800.54,1526.21,777.5,1554.64,777.5z"/>
    <circle fill="#5059C9" cx="1943.75" cy="440.58" r="233.25"/>
    <circle fill="#7B83EB" cx="1218.08" cy="336.92" r="336.92"/>
    <path fill="#7B83EB" d="M1667.32,777.5H717.01c-53.74,1.33-96.26,45.93-95.01,99.68v598.1c-7.51,322.52,247.66,590.16,570.17,598.05c322.51-7.89,577.67-275.53,570.17-598.05v-598.1C1763.58,823.43,1721.07,778.83,1667.32,777.5z"/>
    <linearGradient id="teams_grad" gradientUnits="userSpaceOnUse" x1="198.0988" y1="-1123.0724" x2="942.2333" y2="165.7381" gradientTransform="matrix(1 0 0 1 0 1515.3333)">
      <stop offset="0" stopColor="#5A62C3"/>
      <stop offset="0.5" stopColor="#4D55BD"/>
      <stop offset="1" stopColor="#3940AB"/>
    </linearGradient>
    <path fill="url(#teams_grad)" d="M95.01,466.5h950.31c52.47,0,95.01,42.54,95.01,95.01v950.31c0,52.47-42.54,95.01-95.01,95.01H95.01c-52.47,0-95.01-42.54-95.01-95.01V561.51C0,509.04,42.54,466.5,95.01,466.5z"/>
    <path fill="#FFFFFF" d="M820.21,828.19H630.24v517.3H509.21v-517.3H320.12V727.84h500.09V828.19z"/>
  </svg>
);

const SlackIcon = () => (
  <svg viewBox="0 0 122.88 122.78" width="26" height="26" xmlns="http://www.w3.org/2000/svg">
    <path fill="#E01E5A" d="M25.91,77.62c0,7.14-5.77,12.9-12.9,12.9S0.1,84.75,0.1,77.62c0-7.14,5.77-12.9,12.9-12.9h12.9V77.62z M32.36,77.62c0-7.14,5.77-12.9,12.9-12.9s12.9,5.77,12.9,12.9v32.26c0,7.14-5.77,12.9-12.9,12.9s-12.9-5.77-12.9-12.9V77.62z"/>
    <path fill="#36C5F0" d="M45.26,25.81c-7.14,0-12.9-5.77-12.9-12.9c0-7.14,5.77-12.9,12.9-12.9s12.9,5.77,12.9,12.9v12.9H45.26z M45.26,32.36c7.14,0,12.9,5.77,12.9,12.9c0,7.14-5.77,12.9-12.9,12.9H12.9C5.77,58.17,0,52.4,0,45.26c0-7.14,5.77-12.9,12.9-12.9H45.26z"/>
    <path fill="#2EB67D" d="M96.97,45.26c0-7.14,5.77-12.9,12.9-12.9c7.14,0,12.9,5.77,12.9,12.9c0,7.14-5.77,12.9-12.9,12.9h-12.9V45.26z M90.52,45.26c0,7.14-5.77,12.9-12.9,12.9c-7.14,0-12.9-5.77-12.9-12.9V12.9c0-7.14,5.77-12.9,12.9-12.9c7.14,0,12.9,5.77,12.9,12.9V45.26z"/>
    <path fill="#ECB22E" d="M77.62,96.97c7.14,0,12.9,5.77,12.9,12.9c0,7.14-5.77,12.9-12.9,12.9c-7.14,0-12.9-5.77-12.9-12.9v-12.9H77.62z M77.62,90.52c-7.14,0-12.9-5.77-12.9-12.9c0-7.14,5.77-12.9,12.9-12.9h32.36c7.14,0,12.9,5.77,12.9,12.9c0,7.14-5.77,12.9-12.9,12.9H77.62z"/>
  </svg>
);

const HRISIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="7" width="20" height="14" rx="2" fill="#F59E0B" opacity="0.15"/>
    <rect x="2" y="7" width="20" height="14" rx="2" stroke="#F59E0B" strokeWidth="1.5"/>
    <path d="M8 7V5a4 4 0 018 0v2" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="13" r="2" fill="#F59E0B"/>
    <path d="M8 21v-1a4 4 0 018 0v1" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ReviewsIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="3" fill="#8B5CF6" opacity="0.12"/>
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="#8B5CF6" strokeWidth="1.5"/>
    <path d="M12 7l1.35 2.73L16.5 10.2l-2.25 2.19.53 3.11L12 14l-2.78 1.5.53-3.11L7.5 10.2l3.15-.47L12 7z" fill="#8B5CF6"/>
  </svg>
);

const SurveysIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="3" fill="#0EA5E9" opacity="0.12"/>
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="#0EA5E9" strokeWidth="1.5"/>
    <path d="M6 15l3-4 3 2.5 3-5 3 3" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const INTEGRATIONS = [
  { name: "Microsoft Teams", Icon: TeamsIcon, bg: "rgba(80,89,201,0.07)", border: "rgba(80,89,201,0.18)" },
  { name: "Slack", Icon: SlackIcon, bg: "rgba(224,30,90,0.06)", border: "rgba(224,30,90,0.18)" },
  { name: "Your HRIS", Icon: HRISIcon, bg: "rgba(245,158,11,0.07)", border: "rgba(245,158,11,0.2)" },
  { name: "Performance Reviews", Icon: ReviewsIcon, bg: "rgba(139,92,246,0.07)", border: "rgba(139,92,246,0.2)" },
  { name: "Pulse Surveys", Icon: SurveysIcon, bg: "rgba(14,165,233,0.07)", border: "rgba(14,165,233,0.2)" },
];

export default function Integrations() {
  return (
    <section
      className="relative py-20 px-6 overflow-hidden"
      style={{ background: "#F5F9F7" }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#16855B",
              marginBottom: "16px",
            }}
          >
            Integrations
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(34px, 4.5vw, 56px)",
              fontWeight: 400,
              lineHeight: 1.1,
              color: "#111827",
              marginBottom: "20px",
              maxWidth: "600px",
              margin: "0 auto 20px",
            }}
          >
            It plugs into the tools you already use
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(15px, 1.6vw, 18px)",
              color: "#6B7280",
              lineHeight: 1.65,
              maxWidth: "540px",
              margin: "0 auto",
            }}
          >
            Workenvo doesn&apos;t ask your people to change how they work. It listens
            to the systems already in motion — and turns the noise into early
            warnings.
          </p>
        </motion.div>

        {/* Integration cards */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.12 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            justifyContent: "center",
            marginBottom: "48px",
          }}
        >
          {INTEGRATIONS.map((integration, i) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.18 + i * 0.07 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "14px",
                padding: "14px 20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                minWidth: "180px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: integration.bg,
                  border: `1px solid ${integration.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <integration.Icon />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                {integration.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Supporting line */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-base"
          style={{
            fontFamily: "var(--font-sans)",
            color: "#16855B",
            fontWeight: 500,
          }}
        >
          Connect one to start. Add more as you grow. The more Workenvo sees, the
          earlier it warns.
        </motion.p>

      </div>
    </section>
  );
}
