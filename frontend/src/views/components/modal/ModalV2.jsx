import React, { memo, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const ModalV2 = ({
  isOpen,
  onClose,
  children,
  title = '',
  side = 'right', // 'left' or 'right'
  width = 'md', // 'sm', 'md', 'lg', 'full', or custom Tailwind class
  maxHeight = '80vh',
  closeOutside = true,
}) => {
  const modalRef = useRef(null);

  // Handle Escape key
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeFunctionGsap();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen]);

  // Animation for closing with GSAP
  const closeFunctionGsap = () => {
    const offscreenX = side === 'left' ? '-100%' : '100%';
    gsap.to(modalRef.current, {
      x: offscreenX,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.in',
      onComplete: () => onClose(null),
    });
  };

  // Animation for opening with GSAP
  useGSAP(() => {
    if (isOpen) {
      gsap.fromTo(
        modalRef.current,
        { x: side === 'left' ? '-100%' : '100%', opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [isOpen]);

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target) && closeOutside) {
      closeFunctionGsap();
    }
  };

  if (!isOpen) return null;

  // Width mapping
  const widthClasses = {
    sm: 'w-full sm:w-1/3',
    md: 'w-full sm:w-1/2 md:w-2/5',
    lg: 'w-full sm:w-3/4',
    full: 'w-full',
  };

  const modalWidthClass = widthClasses[width] || width; // support custom Tailwind class

  return (
    <div
      className={`fixed inset-0 z-[9999999] flex ${
        side === 'left' ? 'justify-start' : 'justify-end'
      }`}
      onClick={handleOutsideClick}
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeOutside ? closeFunctionGsap : undefined}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative ${modalWidthClass} bg-white shadow-xl z-50 h-full`}
        style={{
          transform: 'translateX(0)',
        }}
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={closeFunctionGsap}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content with scrollable area */}
        <div
          className="overflow-y-auto p-4"
          style={{
            maxHeight: 'calc(100% - 64px)', // Subtract header height
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default memo(ModalV2);
