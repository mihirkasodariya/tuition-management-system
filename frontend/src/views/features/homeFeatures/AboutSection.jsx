import React, { memo } from "react";

const AboutSection = () => {
  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Meet Your Tutor
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              With 5 years of teaching experience, I'm dedicated to helping
              students excel in their studies.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <img
            src="https://media.istockphoto.com/id/1468140092/photo/happy-elementary-students-raising-their-hands-on-a-class-at-school.jpg?s=612x612&w=0&k=20&c=BrkqxwR_nW4WzbDCAmpQEyF-QYvML9EktH4hhCj-76U="
            width={400}
            height={400}
            alt="Teacher portrait"
            className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
          />
          <div className="flex flex-col justify-center space-y-4">
            <ul className="grid gap-6">
              <li>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Qualified Educator</h3>
                  <p className="text-muted-foreground">
                    Master's degree in Education with specialization in English
                    and Mathematics.
                  </p>
                </div>
              </li>
              <li>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Personalized Approach</h3>
                  <p className="text-muted-foreground">
                    Tailored teaching methods to match each student's learning
                    style and pace.
                  </p>
                </div>
              </li>
              <li>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Proven Results</h3>
                  <p className="text-muted-foreground">
                    Helped over 200 students improve their grades and build
                    confidence in their abilities.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(AboutSection);
