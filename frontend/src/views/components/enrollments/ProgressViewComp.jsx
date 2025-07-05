import { memo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, GraduationCap, Calendar, School } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const ProgressSkeleton = memo(() => {
  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-emerald-500 shadow-md">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <Skeleton className="h-8 w-48 md:w-64 rounded mb-2" /> {/* Title */}
              <Skeleton className="h-4 w-64 md:w-96 rounded" /> {/* Description */}
            </div>

            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 md:w-28 rounded-md" />
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>
        </CardContent>
      </Card>
      <Card className="overflow-hidden border-none shadow-md py-0">
        {/* Cover Image / Gradient Header Placeholder */}
        <div className="h-32 bg-muted relative">
          <div className="absolute inset-0 bg-black/0"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <Skeleton className="h-6 w-3/4 rounded mb-2" />
            <Skeleton className="h-4 w-full rounded" />
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="p-4">
          <Skeleton className="h-5 w-24 mb-3 rounded" /> {/* Sub-chapter title */}
          <ul className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <li key={i} className="flex items-start gap-3">
                <Skeleton className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-48 rounded" />
                </div>
              </li>
            ))}
          </ul>
        </CardContent>

        {/* Footer */}
        <CardFooter className="bg-gray-50 px-4 py-3 flex justify-between items-center">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-6 w-16 rounded-md" />
        </CardFooter>
      </Card>
    </div>
  );
});

const ProgressViewComp = ({ publicSubjectDetail, info, sliderProgress }) => {
  return publicSubjectDetail ? (
    <div className="space-y-6">
      {/* Subject Header Card */}
      <Card className="border-t-4 border-t-emerald-500 shadow-md">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl md:text-3xl capitalize font-bold text-emerald-700">
                {publicSubjectDetail?.name}
              </CardTitle>
              <CardDescription className="text-base mt-2 break-words whitespace-normal line-clamp-2 ">
                {publicSubjectDetail?.description}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1"
              >
                <School className="h-3.5 w-3.5" />
                <span>Class {publicSubjectDetail?.class}</span>
              </Badge>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
              >
                <GraduationCap className="h-3.5 w-3.5" />
                <span>{publicSubjectDetail?.boardType?.name}</span>
              </Badge>
              <Badge
                variant="outline"
                className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>{publicSubjectDetail?.batch?.name}</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BookOpen className="h-4 w-4" />
            <span>Subject Code: {publicSubjectDetail?.code}</span>
          </div>
        </CardContent>

        <CardFooter>
          Student Name :{' '}
          <h1 className="font-bold capitalize pl-2"> {info?.enrollmentDetails?.studentId?.name}</h1>
        </CardFooter>
      </Card>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chapter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subchapter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {publicSubjectDetail?.chapters?.map((chapter) => (
              <>
                {chapter?.subChapters?.map((subChapter, index) => (
                  <tr key={subChapter?._id}>
                    {index === 0 ? (
                      <td
                        rowSpan={chapter?.subChapters?.length}
                        className="px-6 py-4 whitespace-nowrap align-top border-r border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
                            {chapter?.order + 1}
                          </div>
                          <div>
                            <h3 className="font-medium capitalize">{chapter?.title}</h3>
                            <p className="text-sm text-gray-500">
                              {parseInt(sliderProgress?.[chapter?._id]?.progress || 0)}%
                            </p>
                          </div>
                        </div>
                      </td>
                    ) : null}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-medium">
                          {subChapter?.order + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{subChapter?.title}</h4>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {subChapter?.content}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-emerald-600 h-2.5 rounded-full"
                            style={{
                              width: `${
                                sliderProgress?.[chapter?._id]?.subChapters?.[subChapter?._id]
                                  ?.topicProgress || 0
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">
                          {sliderProgress?.[chapter?._id]?.subChapters?.[subChapter?._id]
                            ?.topicProgress || 0}
                          %
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Card className="flex flex-col items-center justify-center p-8 text-center shadow-none border-0">
      <div className="rounded-full p-3 bg-muted mb-4">
        <BookOpen className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold">Subject Not Found</h3>
      <p className="text-muted-foreground mt-2 max-w-sm">
        The requested subject could not be found. Please check the subject code or try another
        search.
      </p>
    </Card>
  );
};

export default memo(ProgressViewComp);
