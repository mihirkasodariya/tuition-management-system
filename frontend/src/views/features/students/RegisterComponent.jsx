import { memo, useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const StudentRegistrationForm = ({
  errors,
  values,
  touched,
  handleChange,
  setFieldValue,
  handleSubmit,
  handleBlur,
  resetForm,
  info,
  setInfo,
  classRooms,
  boardTypes,
  studentId,
}) => {
  const togglePasswordVisibility = () => {
    setInfo((prev) => ({
      ...prev,
      showPassword: !prev?.showPassword,
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex justify-between">
            {' '}
            {studentId ? 'Student Details' : 'Register New Student'}
            {studentId && (
              <Button
                variant={info?.isReadOnly ? 'outline' : 'destructive'}
                onClick={() => setInfo((prev) => ({ ...prev, isReadOnly: !prev.isReadOnly }))}
              >
                {info?.isReadOnly ? 'Edit' : 'Cancel'}
              </Button>
            )}
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={values?.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={info?.isSubmitting}
                readOnly={info?.isReadOnly}
              />
              {touched?.name && errors?.name && (
                <span className="text-red-500 text-sm">{errors?.name}</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@example.com"
                  value={values?.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={info?.isSubmitting}
                  readOnly={info?.isReadOnly}
                />
                {touched?.email && errors?.email && (
                  <span className="text-red-500 text-sm">{errors?.email}</span>
                )}
              </div>

              {/* Password */}
              {!studentId && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={info?.showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={values?.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={info?.isSubmitting}
                      readOnly={info?.isReadOnly}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={togglePasswordVisibility}
                    >
                      {info?.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {touched?.password && errors?.password && (
                    <span className="text-red-500 text-sm">{errors?.password}</span>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Father's Name */}
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name</Label>
                <Input
                  id="fatherName"
                  type="text"
                  placeholder="Robert Doe"
                  value={values?.fatherName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={info?.isSubmitting}
                  readOnly={info?.isReadOnly}
                />
                {touched?.fatherName && errors?.fatherName && (
                  <span className="text-red-500 text-sm">{errors?.fatherName}</span>
                )}
              </div>

              {/* Mother's Name */}
              <div className="space-y-2">
                <Label htmlFor="motherName">Mother's Name</Label>
                <Input
                  id="motherName"
                  type="text"
                  placeholder="Alice Doe"
                  value={values?.motherName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={info?.isSubmitting}
                  readOnly={info?.isReadOnly}
                />
                {touched?.motherName && errors?.motherName && (
                  <span className="text-red-500 text-sm">{errors?.motherName}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+919876543210"
                  value={values?.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={info?.isSubmitting}
                  readOnly={info?.isReadOnly}
                />
                {touched?.phone && errors?.phone && (
                  <span className="text-red-500 text-sm">{errors?.phone}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={info?.isSubmitting}
                      readOnly={info?.isReadOnly}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {values?.dateOfBirth ? (
                        format(values?.dateOfBirth, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={values?.dateOfBirth}
                      onSelect={(date) => setFieldValue('dateOfBirth', date)}
                      initialFocus
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
                {touched?.dateOfBirth && errors?.dateOfBirth && (
                  <span className="text-red-500 text-sm">{errors?.dateOfBirth}</span>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup
                  id="gender"
                  value={values?.gender}
                  onValueChange={(value) => setFieldValue('gender', value)}
                  className="flex gap-4"
                  readOnly={info?.isReadOnly}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
                {touched?.gender && errors?.gender && (
                  <span className="text-red-500 text-sm">{errors?.gender}</span>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="123 Main St, Bangalore, India"
                value={values?.address}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={info?.isSubmitting}
                readOnly={info?.isReadOnly}
              />
              {touched?.address && errors?.address && (
                <span className="text-red-500 text-sm">{errors?.address}</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* School */}
              <div className="space-y-2 col-span-3">
                <Label htmlFor="school">School</Label>
                <Input
                  id="school"
                  type="text"
                  placeholder="ABC Public School"
                  value={values?.school}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={info?.isSubmitting}
                  readOnly={info?.isReadOnly}
                />
                {touched?.school && errors?.school && (
                  <span className="text-red-500 text-sm">{errors?.school}</span>
                )}
              </div>

              {/* Class Room */}
              <div className="space-y-2">
                <Label htmlFor="classRoom">Class</Label>
                <Select
                  value={values?.classRoom || ''}
                  onValueChange={(value) => value && setFieldValue('classRoom', value)}
                  disabled={info?.isSubmitting || info?.isReadOnly}
                  // readOnly={info?.isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classRooms.map((grade) => (
                      <SelectItem key={grade} value={grade.toString()}>
                        Class {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {touched?.classRoom && errors?.classRoom && (
                  <span className="text-red-500 text-sm">{errors?.classRoom}</span>
                )}
              </div>

              {/* Board Type */}
              <div className="space-y-2">
                <Label htmlFor="boardType">Board Type</Label>
                <Select
                  value={values?.boardType}
                  onValueChange={(value) => value && setFieldValue('boardType', value)}
                  disabled={info?.isSubmitting || info?.isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select board type" />
                  </SelectTrigger>
                  <SelectContent>
                    {boardTypes?.map((board) => (
                      <SelectItem key={board?._id} value={board?._id}>
                        {board?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {touched?.boardType && errors?.boardType && (
                  <span className="text-red-500 text-sm">{errors?.boardType}</span>
                )}
              </div>
            </div>

            {/* Timings */}
            <div className="grid gap-2 md:col-span-2">
              <Label>Class Timings</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timings.start">Start Time</Label>
                  <Input
                    id="timings.start"
                    type="time"
                    value={values?.timings.start}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={info?.isSubmitting}
                    readOnly={info?.isReadOnly}
                  />
                  {touched?.timings?.start && errors?.timings?.start && (
                    <span className="text-red-500 text-sm">{errors?.timings?.start}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timings.end">End Time</Label>
                  <Input
                    id="timings.end"
                    type="time"
                    value={values?.timings.end}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={info?.isSubmitting}
                    readOnly={info?.isReadOnly}
                  />
                  {touched?.timings?.end && errors?.timings?.end && (
                    <span className="text-red-500 text-sm">{errors?.timings.end}</span>
                  )}
                </div>

                {/* Date of Joining */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfJoining">Date of Joining</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        disabled={info?.isSubmitting}
                        readOnly={info?.isReadOnly}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {values?.dateOfJoining ? (
                          format(values?.dateOfJoining, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={values?.dateOfJoining}
                        onSelect={(date) => setFieldValue('dateOfJoining', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {touched?.dateOfJoining && errors?.dateOfJoining && (
                    <span className="text-red-500 text-sm">{errors?.dateOfJoining}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Days */}
            <div className="grid gap-2 md:col-span-2">
              <Label>Class Days</Label>
              <div className="flex flex-wrap gap-4">
                {Object.keys(values?.days).map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={`days.${day}`}
                      checked={values?.days[day]}
                      onCheckedChange={(checked) => setFieldValue(`days.${day}`, checked)}
                      disabled={info?.isSubmitting}
                      readOnly={info?.isReadOnly}
                    />
                    <Label htmlFor={`days.${day}`} className="capitalize">
                      {day}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6"></div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 mt-8">
            {studentId ? (
              <Button
                type="submit"
                disabled={info?.isSubmitting}
                className={info?.isReadOnly ? 'hidden' : ''}
              >
                {info?.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating ...
                  </>
                ) : (
                  'Update Student'
                )}
              </Button>
            ) : (
              <>
                <Button type="submit" disabled={info?.isSubmitting}>
                  {info?.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering ...
                    </>
                  ) : (
                    'Register Student'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={info?.isSubmitting}
                  onClick={resetForm}
                >
                  Reset Form
                </Button>
              </>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default memo(StudentRegistrationForm);
