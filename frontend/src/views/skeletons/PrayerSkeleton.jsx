import React from 'react';

// Prayer Schedule Skeleton
const PrayerScheduleSkeleton = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-6 w-48 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-64 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="h-10 w-32 rounded-lg bg-gray-200 animate-pulse" />
      </div>

      {/* Today's Prayer Times */}
      <div className="grid gap-4 md:grid-cols-5">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="space-y-3">
              <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
              <div className="h-6 w-16 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Schedule */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="space-y-6">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-4">
            {[...Array(7)].map((_, index) => (
              <div key={index} className="h-4 w-12 rounded bg-gray-200 animate-pulse" />
            ))}
          </div>
          {/* Calendar Grid */}
          {[...Array(5)].map((_, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-4">
              {[...Array(7)].map((_, dayIndex) => (
                <div key={dayIndex} className="aspect-square rounded-lg bg-gray-100 p-2">
                  <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Events Calendar Skeleton
const EventsCalendarSkeleton = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-6 w-48 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-64 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="flex space-x-3">
          <div className="h-10 w-32 rounded-lg bg-gray-200 animate-pulse" />
          <div className="h-10 w-10 rounded-lg bg-gray-200 animate-pulse" />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="rounded-xl bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="h-8 w-8 rounded bg-gray-200 animate-pulse" />
                <div className="h-6 w-24 rounded bg-gray-200 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Members Directory Skeleton
const MembersDirectorySkeleton = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-6 w-48 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-64 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="flex space-x-3">
          <div className="h-10 w-48 rounded-lg bg-gray-200 animate-pulse" />
          <div className="h-10 w-10 rounded-lg bg-gray-200 animate-pulse" />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="h-10 w-64 rounded-lg bg-gray-200 animate-pulse" />
        <div className="h-10 w-32 rounded-lg bg-gray-200 animate-pulse" />
        <div className="h-10 w-32 rounded-lg bg-gray-200 animate-pulse" />
      </div>

      {/* Members Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="rounded-xl bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-gray-200 animate-pulse" />
              </div>
              <div className="space-y-2 text-center">
                <div className="h-5 w-32 mx-auto rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-24 mx-auto rounded bg-gray-200 animate-pulse" />
              </div>
              <div className="flex justify-center space-x-2">
                <div className="h-8 w-8 rounded bg-gray-200 animate-pulse" />
                <div className="h-8 w-8 rounded bg-gray-200 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Donations & Finance Skeleton
const DonationsFinanceSkeleton = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-6 w-48 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-64 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="flex space-x-3">
          <div className="h-10 w-32 rounded-lg bg-gray-200 animate-pulse" />
          <div className="h-10 w-32 rounded-lg bg-gray-200 animate-pulse" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="rounded-xl bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-8 w-8 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
              </div>
              <div className="h-8 w-32 rounded bg-gray-200 animate-pulse" />
              <div className="h-2 w-full rounded bg-gray-100">
                <div className="h-2 w-2/3 rounded bg-gray-200 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Donations */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-6 w-48 rounded bg-gray-200 animate-pulse" />
            <div className="h-8 w-32 rounded bg-gray-200 animate-pulse" />
          </div>

          {/* Donation Entries */}
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
                    <div className="h-3 w-24 rounded bg-gray-200 animate-pulse" />
                  </div>
                </div>
                <div className="h-6 w-24 rounded bg-gray-200 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Donation Categories Chart */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="space-y-6">
          <div className="h-6 w-48 rounded bg-gray-200 animate-pulse" />
          <div className="h-64 w-full rounded bg-gray-100 animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

// Settings Panel Skeleton
const SettingsPanelSkeleton = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="h-6 w-48 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-64 rounded bg-gray-200 animate-pulse" />
      </div>

      {/* Settings Sections */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="space-y-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex items-center space-x-3 p-2">
                  <div className="h-5 w-5 rounded bg-gray-200 animate-pulse" />
                  <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="h-5 w-48 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-64 rounded bg-gray-200 animate-pulse" />
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
                    <div className="h-10 w-full rounded-lg bg-gray-100 animate-pulse" />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <div className="h-10 w-24 rounded-lg bg-gray-200 animate-pulse" />
                <div className="h-10 w-24 rounded-lg bg-gray-200 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export {
  PrayerScheduleSkeleton,
  EventsCalendarSkeleton,
  MembersDirectorySkeleton,
  DonationsFinanceSkeleton,
  SettingsPanelSkeleton,
};
