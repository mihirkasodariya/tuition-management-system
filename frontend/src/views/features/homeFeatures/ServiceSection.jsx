import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, GraduationCap, Star } from "lucide-react";
import { Link } from "react-router-dom";

const ServiceSection = () => {
  return (
    <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Tutoring Services
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Specialized one-on-one tutoring in English and Mathematics for
              students of all levels.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <CardTitle>English Tutoring</CardTitle>
              </div>
              <CardDescription>
                Comprehensive English language and literature tutoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Grammar and vocabulary development</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Essay writing and critical analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Reading comprehension skills</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Exam preparation and practice</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Public speaking and presentation skills</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="#book">Book English Tutoring</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <CardTitle>Mathematics Tutoring</CardTitle>
              </div>
              <CardDescription>
                Clear and effective mathematics instruction for all levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Arithmetic and basic mathematics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Algebra and geometry concepts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Problem-solving strategies</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Test preparation and practice</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>Advanced topics for higher grades</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="#book">Book Math Tutoring</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default memo(ServiceSection);
