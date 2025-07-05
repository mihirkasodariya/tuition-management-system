import React, { memo } from 'react';
import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row md:justify-between">
        <div className="flex gap-2 items-center text-xl font-bold">
          <GraduationCap className="h-6 w-6" />
          <span>AcademIQ Tutorial</span>
        </div>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} AcademIQ. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy Policy
          </Link>
          <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
