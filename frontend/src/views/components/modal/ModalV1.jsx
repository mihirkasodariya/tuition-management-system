import React, { memo, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const ModalV1 = ({
  isOpen,
  onClose,
  children,
  size = 'medium',
  title = '',
  maxHeight = '80vh',
  closeOutside = true,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose(null);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen]);

  useGSAP(() => {
    if (isOpen) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: -100 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    full: 'max-w-full mx-4',
  };

  const closeFunctionGsap = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      y: -50,
      duration: 0.5,
      ease: 'power3.in',
      onComplete: () => onClose(null),
    });
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target) && closeOutside) {
      closeFunctionGsap();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999999] flex items-center justify-center"
      onClick={handleOutsideClick}
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative w-full ${sizeClasses[size]} bg-white rounded-lg shadow-xl z-50`}
        style={{ maxHeight, height: maxHeight }}
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
          className="overflow-y-auto"
          style={{
            maxHeight: 'calc(100% - 64px)', // Subtracting header height
            height: 'calc(100% - 64px)',
            paddingRight: '1rem',
            paddingLeft: '1rem',
            paddingBottom: '1rem',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default memo(ModalV1);
