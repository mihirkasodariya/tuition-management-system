import React, { memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from "lucide-react";

const TestimonialSection = () => {
  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Student Success Stories
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear what my students and their parents have to say
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <span className="font-semibold text-primary">S</span>
                </div>
                <div>
                  <CardTitle className="text-base">Sarah K.</CardTitle>
                  <CardDescription>9th Grade Student</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground">
                "My math grades improved from a C to an A- after just two months
                of tutoring. The personalized approach really helped me
                understand concepts I was struggling with."
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <span className="font-semibold text-primary">M</span>
                </div>
                <div>
                  <CardTitle className="text-base">Michael T.</CardTitle>
                  <CardDescription>Parent</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground">
                "My son was struggling with English essays, but after working
                with this tutor, his writing has improved dramatically. The
                online format works perfectly with our busy schedule."
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <span className="font-semibold text-primary">J</span>
                </div>
                <div>
                  <CardTitle className="text-base">Jamie L.</CardTitle>
                  <CardDescription>11th Grade Student</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground">
                "I was really anxious about my SAT, but the test prep sessions
                helped me feel confident. I improved my score by over 100
                points! The tutor is patient and explains things clearly."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default memo(TestimonialSection);
