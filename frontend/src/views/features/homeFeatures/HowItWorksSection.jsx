import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, MessageSquare, Video } from 'lucide-react';

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              How Online Tutoring Works
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Simple, effective, and convenient online learning process
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-3">
          <Card className="flex flex-col items-center text-center">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground m-auto">
                <MessageSquare className="h-6 w-6" />
              </div>
              <CardTitle>1. Book a Session</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Choose your subject, date, and time for your personalized tutoring session.
              </p>
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center text-center">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground  m-auto">
                <Video className="h-6 w-6" />
              </div>
              <CardTitle>2. Join Google Meet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Connect via Google Meet for a face-to-face interactive learning experience.
              </p>
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center text-center">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground  m-auto">
                <GraduationCap className="h-6 w-6" />
              </div>
              <CardTitle>3. Learn & Improve</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Receive personalized instruction, practice, and feedback to boost your skills.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default memo(HowItWorksSection);
