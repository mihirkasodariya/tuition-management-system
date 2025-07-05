import React, { useState, memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { submitContactFormApi } from '@/apis/contact.api';
import toast from 'react-hot-toast';

const classrooms = Array.from({ length: 12 }, (_, i) => i + 1);
const preferredTime = ['any', 'morning', 'afternoon', 'evening'];
const heardAboutUs = ['website', 'friend', 'social media', 'newspaper', 'other'];

const ContactSection = () => {
  const [info, setInfo] = useState({
    isSubmitting: false,
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Full name is required').min(2, 'Too short!'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9]+$/, 'Must be only digits')
      .min(10, 'Too short!')
      .max(15, 'Too long!'),
    class: Yup.string().required('Class is required'),
    preferredTime: Yup.string().required('Preferred time is required'),
    heardAboutUs: Yup.string().required('This field is required'),
    message: Yup.string().min(3, 'Message should be at least 3 characters'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      class: '',
      preferredTime: 'any',
      heardAboutUs: 'website',
      message: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      submitContactFormHandler(values);
    },
  });
  const { errors, values, touched, handleChange, handleSubmit, handleBlur, resetForm } = formik;

  const submitContactFormHandler = useCallback(
    async (values) => {
      if (info?.isSubmitting) return;

      setInfo((prev) => ({
        ...prev,
        isSubmitting: true,
      }));

      let json = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        studentClass: values.class,
        preferredTime: values.preferredTime,
        heardAboutUs: values.heardAboutUs,
      };

      if (values?.message) {
        json.message = values.message;
      }

      const response = await submitContactFormApi(json);
      if (response[2] === 201) {
        toast.success('Thank you! Your message has been received. We will contact you soon.');
        resetForm();
      } else {
        toast.error(response[1]?.message || 'something went wrong please try again later');
      }

      setInfo((prev) => ({
        ...prev,
        isSubmitting: false,
      }));
    },
    [info?.isSubmitting]
  );

  return (
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Book Your First Session
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Take the first step toward academic excellence
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-3xl gap-6 py-12 lg:grid-cols-2">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Fill out the form below to schedule your first tutoring session or ask any
                questions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                {/* name */}
                <div className="grid gap-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    className={`flex h-10 w-full rounded-md border ${
                      touched.name && errors.name ? 'border-red-500' : 'border-input'
                    } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                    placeholder="Enter student name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.name}
                    readOnly={info?.isSubmitting}
                    disabled={info?.isSubmitting}
                  />
                  {touched?.name && errors?.name && (
                    <div className="text-sm text-red-500">{errors?.name}</div>
                  )}
                </div>

                {/* email */}
                <div className="grid gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`flex h-10 w-full rounded-md border ${
                      touched?.email && errors?.email ? 'border-red-500' : 'border-input'
                    } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                    placeholder="Enter your email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    readOnly={info?.isSubmitting}
                    disabled={info?.isSubmitting}
                  />
                  {touched?.email && errors?.email && (
                    <div className="text-sm text-red-500">{errors?.email}</div>
                  )}
                </div>

                {/* phone number */}
                <div className="grid gap-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className={`flex h-10 w-full rounded-md border ${
                      touched?.phone && errors?.phone ? 'border-red-500' : 'border-input'
                    } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                    placeholder="Enter your phone number"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.phone}
                    readOnly={info?.isSubmitting}
                    disabled={info?.isSubmitting}
                  />
                  {touched?.phone && errors?.phone && (
                    <div className="text-sm text-red-500">{errors?.phone}</div>
                  )}
                </div>

                {/* class */}
                <div className="grid gap-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Class
                  </label>
                  <select
                    id="class"
                    name="class"
                    className={`flex h-10 w-full rounded-md border ${
                      touched?.class && errors?.class ? 'border-red-500' : 'border-input'
                    } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.class?.toString()}
                    readOnly={info?.isSubmitting}
                    disabled={info?.isSubmitting}
                  >
                    <option value="">Select a Class</option>
                    {classrooms.map((classroom) => (
                      <option key={classroom} value={classroom}>
                        Class {classroom}
                      </option>
                    ))}
                  </select>
                  {touched?.class && errors?.class && (
                    <div className="text-sm text-red-500">{errors?.class}</div>
                  )}
                </div>

                {/* preferred time */}
                <div className="grid gap-2">
                  <label
                    htmlFor="preferredTime"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Time to Contact At ?
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    className={`flex h-10 w-full rounded-md border ${
                      touched?.preferredTime && errors?.preferredTime
                        ? 'border-red-500'
                        : 'border-input'
                    } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={values?.preferredTime}
                    readOnly={info?.isSubmitting}
                    disabled={info?.isSubmitting}
                  >
                    {preferredTime.map((singleTime) => (
                      <option key={singleTime} value={singleTime}>
                        {singleTime}
                      </option>
                    ))}
                  </select>
                  {touched?.preferredTime && errors?.preferredTime && (
                    <div className="text-sm text-red-500">{errors?.preferredTime}</div>
                  )}
                </div>

                {/* heard about us */}
                <div className="grid gap-2">
                  <label
                    htmlFor="heardAboutUs"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Heard About us From ?
                  </label>
                  <select
                    id="heardAboutUs"
                    name="heardAboutUs"
                    className={`flex h-10 w-full rounded-md border ${
                      touched?.heardAboutUs && errors?.heardAboutUs
                        ? 'border-red-500'
                        : 'border-input'
                    } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.heardAboutUs}
                    readOnly={info?.isSubmitting}
                    disabled={info?.isSubmitting}
                  >
                    {heardAboutUs.map((singleHeardAboutUs) => (
                      <option key={singleHeardAboutUs} value={singleHeardAboutUs}>
                        {singleHeardAboutUs}
                      </option>
                    ))}
                  </select>
                  {touched?.heardAboutUs && errors?.heardAboutUs && (
                    <div className="text-sm text-red-500">{errors?.heardAboutUs}</div>
                  )}
                </div>

                {/* message */}
                <div className="grid gap-2 md:col-span-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className={`flex min-h-[120px] w-full rounded-md border ${
                      touched?.message && errors?.message ? 'border-red-500' : 'border-input'
                    } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                    placeholder="Tell me about your learning goals or any questions you have"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.message}
                    readOnly={info?.isSubmitting}
                    disabled={info?.isSubmitting}
                  ></textarea>
                  {touched?.message && errors?.message && (
                    <div className="text-sm text-red-500">{errors?.message}</div>
                  )}
                </div>

                <Button type="submit" disabled={info?.isSubmitting} className="md:col-span-2">
                  {info?.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Other Ways to Connect</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">contact@AcademIQ.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-medium">Social Media</h3>
                    <div className="flex gap-2 mt-1">
                      <Link to="#" className="text-muted-foreground hover:text-foreground">
                        Facebook
                      </Link>
                      <span className="text-muted-foreground">•</span>
                      <Link to="#" className="text-muted-foreground hover:text-foreground">
                        Instagram
                      </Link>
                      <span className="text-muted-foreground">•</span>
                      <Link to="#" className="text-muted-foreground hover:text-foreground">
                        Twitter
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default memo(ContactSection);
