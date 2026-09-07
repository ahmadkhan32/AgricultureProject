import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import heroBg from '../../Images/hero_bg.jpg';

const Hero = () => {
  return (
    <>
      <style>{`
        .hero-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
              -ms-flex-align: center;
                  align-items: center;
          background-image: url('${heroBg}');
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          background-color: #1a4a1a;
          /* Safari fix */
          -webkit-background-size: cover;
          /* IE fix */
          -ms-background-size: cover;
        }

        .hero-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: -webkit-linear-gradient(left, rgba(5,20,5,0.88) 0%, rgba(5,20,5,0.65) 50%, rgba(5,20,5,0.25) 100%);
          background:         linear-gradient(to right, rgba(5,20,5,0.88) 0%, rgba(5,20,5,0.65) 50%, rgba(5,20,5,0.25) 100%);
        }

        .hero-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 80px 24px 60px;
          -webkit-box-sizing: border-box;
                  box-sizing: border-box;
        }

        .hero-grid {
          display: -ms-grid;
          display: grid;
          -ms-grid-columns: 1fr 1fr;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          -webkit-box-align: center;
              -ms-flex-align: center;
                  align-items: center;
        }

        .hero-left {
          -ms-grid-column: 1;
          grid-column: 1;
        }

        .hero-right {
          -ms-grid-column: 2;
          grid-column: 2;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: end;
              -ms-flex-pack: end;
                  justify-content: flex-end;
        }

        .hero-title {
          font-size: clamp(1.5rem, 3.5vw, 3.2rem);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
          margin: 0 0 20px 0;
          text-shadow: 0 2px 16px rgba(0,0,0,0.7);
          font-family: Inter, 'Segoe UI', Arial, sans-serif;
        }

        .hero-subtitle {
          font-size: clamp(0.9rem, 1.8vw, 1.1rem);
          color: rgba(215, 240, 215, 0.95);
          margin: 0 0 36px 0;
          line-height: 1.75;
          max-width: 520px;
          text-shadow: 0 1px 8px rgba(0,0,0,0.6);
          font-family: Inter, 'Segoe UI', Arial, sans-serif;
        }

        .hero-buttons {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-wrap: wrap;
              flex-wrap: wrap;
          gap: 14px;
          -webkit-box-align: center;
              -ms-flex-align: center;
                  align-items: center;
        }

        .btn-primary {
          display: -webkit-inline-box;
          display: -ms-inline-flexbox;
          display: inline-flex;
          -webkit-box-align: center;
              -ms-flex-align: center;
                  align-items: center;
          gap: 8px;
          background-color: #f97316;
          color: #ffffff;
          font-weight: 700;
          padding: 14px 30px;
          border-radius: 8px;
          text-decoration: none;
          font-size: clamp(0.85rem, 1.4vw, 1rem);
          border: none;
          cursor: pointer;
          -webkit-box-shadow: 0 4px 20px rgba(249,115,22,0.5);
                  box-shadow: 0 4px 20px rgba(249,115,22,0.5);
          -webkit-transition: background-color 0.2s, -webkit-transform 0.2s, -webkit-box-shadow 0.2s;
                  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
          font-family: Inter, 'Segoe UI', Arial, sans-serif;
        }

        .btn-primary:hover {
          background-color: #ea6c00;
          -webkit-transform: translateY(-2px);
                  transform: translateY(-2px);
          -webkit-box-shadow: 0 8px 28px rgba(249,115,22,0.65);
                  box-shadow: 0 8px 28px rgba(249,115,22,0.65);
        }

        .btn-secondary {
          display: -webkit-inline-box;
          display: -ms-inline-flexbox;
          display: inline-flex;
          -webkit-box-align: center;
              -ms-flex-align: center;
                  align-items: center;
          gap: 8px;
          background-color: transparent;
          color: #ffffff;
          font-weight: 700;
          padding: 12px 30px;
          border-radius: 8px;
          text-decoration: none;
          font-size: clamp(0.85rem, 1.4vw, 1rem);
          border: 2px solid rgba(255,255,255,0.8);
          cursor: pointer;
          -webkit-backdrop-filter: blur(6px);
                  backdrop-filter: blur(6px);
          -webkit-transition: background-color 0.2s, border-color 0.2s, -webkit-transform 0.2s;
                  transition: background-color 0.2s, border-color 0.2s, transform 0.2s;
          font-family: Inter, 'Segoe UI', Arial, sans-serif;
        }

        .btn-secondary:hover {
          background-color: rgba(255,255,255,0.18);
          border-color: #ffffff;
          -webkit-transform: translateY(-2px);
                  transform: translateY(-2px);
        }

        .stats-card {
          background-color: rgba(5,20,5,0.72);
          -webkit-backdrop-filter: blur(14px);
                  backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 16px;
          padding: clamp(24px, 3vw, 44px);
          max-width: 380px;
          width: 100%;
        }

        .stats-grid {
          display: -ms-grid;
          display: grid;
          -ms-grid-columns: 1fr 1fr;
          grid-template-columns: 1fr 1fr;
          gap: clamp(18px, 2.5vw, 30px);
        }

        .stat-item {
          text-align: center;
          padding: 8px 0;
        }

        .stat-number {
          font-size: clamp(1.8rem, 3.5vw, 3rem);
          font-weight: 800;
          color: #f97316;
          line-height: 1;
          margin-bottom: 6px;
          font-family: Inter, 'Segoe UI', Arial, sans-serif;
        }

        .stat-label {
          font-size: clamp(0.75rem, 1.1vw, 0.88rem);
          color: rgba(200, 235, 200, 0.9);
          font-family: Inter, 'Segoe UI', Arial, sans-serif;
        }

        /* Tablet */
        @media screen and (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr;
            -ms-grid-columns: 1fr;
            gap: 36px;
          }
          .hero-left { -ms-grid-column: 1; }
          .hero-right {
            -ms-grid-column: 1;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
          }
        }

        /* Mobile */
        @media screen and (max-width: 600px) {
          .hero-section {
            min-height: 100svh;
            background-position: 60% center;
          }
          .hero-container {
            padding: 70px 16px 48px;
          }
          .hero-overlay {
            background: linear-gradient(to bottom, rgba(5,20,5,0.80) 0%, rgba(5,20,5,0.70) 60%, rgba(5,20,5,0.55) 100%);
          }
          .hero-buttons {
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
                -ms-flex-direction: column;
                    flex-direction: column;
            -webkit-box-align: stretch;
                -ms-flex-align: stretch;
                    align-items: stretch;
          }
          .btn-primary,
          .btn-secondary {
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
            width: 100%;
          }
          .stats-card {
            max-width: 100%;
          }
        }

        /* Very small screens */
        @media screen and (max-width: 360px) {
          .hero-title {
            font-size: 1.35rem;
          }
        }
      `}</style>

      <section className="hero-section">
        {/* Overlay */}
        <div className="hero-overlay" />

        {/* Content */}
        <div className="hero-container">
          <div className="hero-grid">
            {/* Left — Text */}
            <div className="hero-left">
              <h1 className="hero-title">
                Union des chambres d&apos;agriculture, d&apos;élevage
                <br />
                et de la pêche des Comores
              </h1>
              <p className="hero-subtitle">
                C&apos;est une institution nationale comorienne qui regroupe les trois chambres
                insulaires d&apos;agriculture, d&apos;élevage et de la pêche
                (Ngazidja, Mohéli, Anjouan)...
              </p>
              <div className="hero-buttons">
                <Link to="/register" className="btn-primary">
                  Rejoignez notre communauté
                  <ArrowRight size={18} />
                </Link>
                <Link to="/about" className="btn-secondary">
                  Découvrir le réseau
                  <Play size={16} />
                </Link>
              </div>
            </div>

            {/* Right — Stats */}
            <div className="hero-right">
              <div className="stats-card">
                <div className="stats-grid">
                  {[
                    { number: '1000', label: 'Producteurs actifs' },
                    { number: '4',    label: 'Régions' },
                    { number: '25+',  label: 'Partenaires' },
                    { number: '15+',  label: 'Années' },
                  ].map((item, i) => (
                    <div key={i} className="stat-item">
                      <div className="stat-number">{item.number}</div>
                      <div className="stat-label">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
