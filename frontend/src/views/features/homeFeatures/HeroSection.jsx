import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Personalized Online Tutoring for Your Academic Success
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Expert one-on-one tutoring in English and Mathematics from the comfort of your home.
              Boost your grades with personalized attention.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <a href="#contact">Book Your First Class</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#services">Explore Services</a>
              </Button>
            </div>
          </div>
          <div className="mx-auto lg:mx-0">
            <img
              src="https://thumbs.dreamstime.com/b/children-education-kid-read-book-school-boy-reading-books-dreaming-over-blackboard-background-92807607.jpg"
              width={550}
              height={550}
              alt="Online tutoring illustration"
              className="rounded-lg object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(HeroSection);
