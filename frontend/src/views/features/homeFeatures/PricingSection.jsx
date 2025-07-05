import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingSection = () => {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Affordable Pricing</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Quality education at reasonable rates with flexible packages
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Single Session</CardTitle>
              <div className="text-3xl font-bold">₹25</div>
              <CardDescription>Per 1-hour session</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>60-minute one-on-one tutoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Personalized instruction</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Practice materials included</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="#book">Book Now</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="border-primary pt-0">
            <CardHeader className="bg-primary text-primary-foreground py-3 rounded-t-lg">
              <CardTitle>Weekly Package</CardTitle>
              <div className="text-3xl font-bold">₹90</div>
              <CardDescription className="text-primary-foreground/90">
                4 sessions per month (₹22.50/session)
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Four 60-minute sessions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Consistent weekly progress</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Homework help included</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Progress tracking</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="#book">Best Value</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Intensive Package</CardTitle>
              <div className="text-3xl font-bold">₹160</div>
              <CardDescription>8 sessions per month (₹20/session)</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Eight 60-minute sessions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Twice weekly sessions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Comprehensive support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Exam preparation focus</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Priority scheduling</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="#book">Book Now</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default memo(PricingSection);
