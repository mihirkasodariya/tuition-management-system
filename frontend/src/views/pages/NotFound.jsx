import React, { useRef, memo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';
import MetaData from '@/utils/MetaData';

const NotFound = () => {
  const container = useRef();
  const text404Ref = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const buttonRef = useRef();

  useGSAP(
    () => {
      // Initial setup - hide elements
      gsap.set([text404Ref.current, titleRef.current, subtitleRef.current, buttonRef.current], {
        opacity: 0,
        y: 20,
      });

      // Animation sequence
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to(text404Ref.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      })
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          '-=0.4'
        )
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          '-=0.3'
        )
        .to(
          buttonRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          '-=0.2'
        );

      // Continuous floating animation for 404 text
      gsap.to(text404Ref.current, {
        y: '-=10',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    },
    { scope: container }
  );

  return (
    <div
      ref={container}
      className="min-h-screen bg-gradient-to-br  flex flex-col items-center justify-center p-4 text-center text-black"
    >
      <MetaData title="Page Not Found | AcademIQ" />
      <div className="max-w-2xl w-full space-y-8">
        {/* 404 Text with glow effect */}
        <h1
          ref={text404Ref}
          className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
          style={{
            textShadow: '0 0 10px rgba(192, 132, 252, 0.5)',
            filter: 'drop-shadow(0 0 20px rgba(192, 132, 252, 0.3))',
          }}
        >
          404
        </h1>

        {/* Title */}
        <h2 ref={titleRef} className="text-4xl font-bold tracking-tight sm:text-5xl text-black">
          Page not found
        </h2>

        {/* Subtitle */}
        <p ref={subtitleRef} className="text-xl text-gray-300 max-w-lg mx-auto">
          Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL or
          the page has been moved.
        </p>

        <Button className="px-6 py-4 text-base ">
          Go back home <MoveRight />{' '}
        </Button>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-10"
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              filter: 'blur(40px)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(NotFound);
