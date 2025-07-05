import React, { memo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ADMIN } from '@/constants/roles.constants';

const roleDisplayConstant = {
  admin: 'Owner',
  student: 'Student',
};

const ProfileDetails = () => {
  // const dispatch = useDispatch();
  const { profileDetails } = useSelector((state) => state.userProfileState);
  const [info, setInfo] = useState({
    isSubmitting: true,
    isReadOnly: true,
  });

  const touched = {};
  const errors = {};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Profile Details</CardTitle>
        <CardDescription>
          Update your personal information and manage your profile settings.
        </CardDescription>
      </CardHeader>
      {profileDetails?.role == ADMIN ? (
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder={'name'}
                value={profileDetails?.name}
                //   onChange={changeHandlerFunction}
                readOnly={true}
                required
              />
            </div>

            {profileDetails?.email && (
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder={'email'}
                  value={profileDetails?.email}
                  readOnly={true}
                  required
                />
              </div>
            )}

            {profileDetails?.role && (
              <div className="grid gap-2">
                <Label htmlFor="role">Role :</Label>
                <Input
                  id="role"
                  type="role"
                  name="role"
                  placeholder={'role'}
                  value={roleDisplayConstant[profileDetails?.role]}
                  readOnly={true}
                  required
                />
              </div>
            )}
          </div>

          <br />
          <Button disabled={false}>Update Profile</Button>
        </CardContent>
      ) : (
        <CardContent className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={profileDetails?.name}
              // onChange={handleChange}
              // onBlur={handleBlur}
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
                value={profileDetails?.email}
                // onChange={handleChange}
                // onBlur={handleBlur}
                disabled={info?.isSubmitting}
                readOnly={info?.isReadOnly}
              />
              {touched?.email && errors?.email && (
                <span className="text-red-500 text-sm">{errors?.email}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Father's Name */}
            <div className="space-y-2">
              <Label htmlFor="fatherName">Father's Name</Label>
              <Input
                id="fatherName"
                type="text"
                placeholder="Robert Doe"
                value={profileDetails?.fatherName}
                // onChange={handleChange}
                // onBlur={handleBlur}
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
                value={profileDetails?.motherName}
                // onChange={handleChange}
                // onBlur={handleBlur}
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
                value={profileDetails?.phone}
                // onChange={handleChange}
                // onBlur={handleBlur}
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
                    {profileDetails?.dateOfBirth ? (
                      format(profileDetails?.dateOfBirth, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    // selected={values?.dateOfBirth}
                    // onSelect={(date) => setFieldValue('dateOfBirth', date)}
                    // initialFocus
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
                value={profileDetails?.gender}
                // onValueChange={(value) => setFieldValue('gender', value)}
                className="flex gap-4"
                readOnly={info?.isReadOnly}
                disabled={info?.isSubmitting}
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
              value={profileDetails?.address}
              // onChange={handleChange}
              // onBlur={handleBlur}
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
                value={profileDetails?.school}
                // onChange={handleChange}
                // onBlur={handleBlur}
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
              <Input
                id="school"
                type="text"
                placeholder="Class room"
                value={profileDetails?.class}
                // onChange={handleChange}
                // onBlur={handleBlur}
                disabled={info?.isSubmitting}
                readOnly={info?.isReadOnly}
              />
            </div>

            {/* Board Type */}
            <div className="space-y-2">
              <Label htmlFor="boardType">Board Type</Label>
              <Input
                id="school"
                type="text"
                placeholder="Board Name"
                value={profileDetails?.boardType?.name}
                // onChange={handleChange}
                // onBlur={handleBlur}
                disabled={info?.isSubmitting}
                readOnly={info?.isReadOnly}
              />
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
                  value={profileDetails?.timings?.startTimeHHMM}
                  // onChange={handleChange}
                  // onBlur={handleBlur}
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
                  value={profileDetails?.timings?.endTimeHHMM}
                  // onChange={handleChange}
                  // onBlur={handleBlur}
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
                      {profileDetails?.dateOfJoining ? (
                        format(profileDetails?.dateOfJoining, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      // selected={values?.dateOfJoining}
                      // onSelect={(date) => setFieldValue('dateOfJoining', date)}
                      // initialFocus
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
              {Object.keys(profileDetails?.days).map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={`days.${day}`}
                    checked={profileDetails?.days[day]}
                    // onCheckedChange={(checked) => setFieldValue(`days.${day}`, checked)}
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
      )}
    </Card>
  );
};

export default memo(ProfileDetails);
