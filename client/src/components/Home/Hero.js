import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundImage: 'url(/images/hero_bg_hd.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        /* Fallback color while image loads */
        backgroundColor: '#1a3d1a',
        /* WebKit fix for older Safari/Chrome */
        WebkitBackgroundSize: 'cover',
      }}
    >
      {/* Dark gradient overlay — left side darker for text readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(10,30,10,0.88) 0%, rgba(10,30,10,0.65) 55%, rgba(10,30,10,0.30) 100%)',
          /* Also add a subtle bottom gradient for mobile where layout stacks */
          backgroundImage:
            'linear-gradient(to right, rgba(10,30,10,0.88) 0%, rgba(10,30,10,0.65) 55%, rgba(10,30,10,0.30) 100%), linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '80px 16px 60px',
          boxSizing: 'border-box',
        }}
      >
        <div className="hero-grid">
          {/* Left Column — Text */}
          <div className="hero-left">
            <h1
              style={{
                fontSize: 'clamp(1.4rem, 4vw, 3.5rem)',
                fontWeight: '800',
                color: '#ffffff',
                lineHeight: '1.2',
                marginBottom: '20px',
                textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
              }}
            >
              Union des chambres d&apos;agriculture,
              <br />
              d&apos;élevage et de la pêche des Comores
            </h1>
            <p
              style={{
                fontSize: 'clamp(0.9rem, 2vw, 1.15rem)',
                color: 'rgba(220,240,220,0.95)',
                marginBottom: '36px',
                lineHeight: '1.7',
                maxWidth: '540px',
                textShadow: '0 1px 6px rgba(0,0,0,0.5)',
                fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
              }}
            >
              C&apos;est une institution nationale comorienne qui regroupe les trois chambres
              insulaires d&apos;agriculture, d&apos;élevage et de la pêche (Ngazidja, Mohéli, Anjouan)...
            </p>

            <div className="hero-buttons">
              <Link
                to="/register"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#f97316',
                  color: '#fff',
                  fontWeight: '600',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                  boxShadow: '0 4px 20px rgba(249,115,22,0.5)',
                  transition: 'background-color 0.2s, transform 0.2s, box-shadow 0.2s',
                  fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#ea6a00';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(249,115,22,0.6)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = '#f97316';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(249,115,22,0.5)';
                }}
              >
                Rejoignez notre communauté
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/about"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'transparent',
                  color: '#fff',
                  fontWeight: '600',
                  padding: '13px 28px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                  border: '2px solid rgba(255,255,255,0.75)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  transition: 'background-color 0.2s, border-color 0.2s, transform 0.2s',
                  fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.borderColor = '#fff';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.75)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Découvrir le réseau
                <Play size={16} />
              </Link>
            </div>
          </div>

          {/* Right Column — Stats Card */}
          <div className="hero-right">
            <div
              style={{
                backgroundColor: 'rgba(10,30,10,0.75)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '16px',
                padding: 'clamp(20px, 4vw, 40px)',
                maxWidth: '380px',
                width: '100%',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'clamp(16px, 3vw, 28px)',
                }}
              >
                {[
                  { number: '1000', label: 'Producteurs actifs' },
                  { number: '4', label: 'Régions' },
                  { number: '25+', label: 'Partenaires' },
                  { number: '15+', label: 'Années' },
                ].map((item, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '8px 0' }}>
                    <div
                      style={{
                        fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
                        fontWeight: '800',
                        color: '#f97316',
                        lineHeight: '1',
                        marginBottom: '6px',
                        fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
                      }}
                    >
                      {item.number}
                    </div>
                    <div
                      style={{
                        fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
                        color: 'rgba(200,230,200,0.9)',
                        fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
                      }}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive styles via style tag */}
      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
        }
        .hero-left {
          order: 1;
        }
        .hero-right {
          order: 2;
          display: flex;
          justify-content: flex-end;
        }
        .hero-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .hero-left {
            order: 2;
          }
          .hero-right {
            order: 1;
            justify-content: center;
          }
        }
        @media (max-width: 480px) {
          .hero-buttons {
            flex-direction: column;
            align-items: stretch;
          }
          .hero-buttons a {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
