import React, { useRef, useState, useEffect } from 'react';
import './Hero.css';

const HERO_VIDEO_URL = '/hero.mp4';

export default function Hero({
  partnerOne = 'Aarav',
  partnerTwo = 'Riya',
  weddingDate = 'DEC 18',
  weddingTime = '4:00 PM',
  leadText = 'Together With Their Families',
  noteTitle = 'A Celebration of Eternal Love',
  noteDescription = 'Join us under the sunlit canopy as we unite our hearts and celebrate the beginning of our forever.',
  captionText = 'Two hearts, one soul, forever intertwined in love.',
}) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const play = video.play();
    if (play?.catch) play.catch(() => {});
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
      setReady(true);
    }
  }, []);

  const coupleTitle = `${partnerOne} & ${partnerTwo}`;

  const weddingStats = [
    { figure: weddingDate, label: 'Wedding Day', foot: 'Save The Date' },
    { figure: weddingTime, label: 'Auspicious Time', foot: 'Grand Matrimony' },
  ];

  return (
    <section className="hero" id="top">
      <div className="hero__media" aria-hidden="true">
        <video
          ref={videoRef}
          className={`hero__video ${ready ? 'is-ready' : ''}`}
          src={HERO_VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setReady(true)}
        />
        <div className="hero__scrim" />
      </div>

      <div className="hero__body shell">
        <h1 className="hero__title">
          <span className="hero__title-lead">{leadText}</span>
          {coupleTitle}
        </h1>
        <a className="btn btn--pearl hero__cta" href="#events">
          View Wedding Details
        </a>
      </div>

      <div className="hero__foot shell">
        <article className="card card--note">
          <h2>{noteTitle}</h2>
          <p>{noteDescription}</p>
        </article>

        <p className="hero__caption">{captionText}</p>

        <div className="hero__stats">
          {weddingStats.map((s) => (
            <article key={s.label} className="card card--stat">
              <strong>{s.figure}</strong>
              <span className="card__label">{s.label}</span>
              <span className="card__foot">{s.foot}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
