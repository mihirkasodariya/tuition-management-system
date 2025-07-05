import { memo, useCallback, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { BookOpen, GraduationCap, Calendar, School } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { subjectActions } from '@/redux/combineActions';
import { useParams } from 'react-router-dom';
import Header from '@/views/components/navbar/Header';
import MetaData from '@/utils/MetaData';

const ChapterCardSkeleton = () => {
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
};
const PublicChapterDetail = () => {
  const dispatch = useDispatch();
  const { subjectId } = useParams();
  const { getPublicSubjectDetailAction } = subjectActions;
  const { publicSubjectDetail, loading } = useSelector((state) => state.subjectState);

  useEffect(() => {
    if (!publicSubjectDetail || publicSubjectDetail?._id !== subjectId) {
      fetchSubjectDetailsHandler();
    }
  }, [subjectId]);
  const fetchSubjectDetailsHandler = useCallback(() => {
    dispatch(getPublicSubjectDetailAction(subjectId));
  }, [publicSubjectDetail, subjectId]);
  return (
    <div className="flex min-h-screen flex-col">
      <MetaData title={`${publicSubjectDetail?.name || 'Chapter Details'} | AcademIQ`} />
      <Header />
      <main className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <ChapterCardSkeleton />
          ) : publicSubjectDetail ? (
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
              </Card>

              {/* Tabs for different views */}
              <Tabs defaultValue="chapters" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="chapters">Chapters</TabsTrigger>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                  <TabsTrigger value="table">Table View</TabsTrigger>
                </TabsList>

                {/* Chapters View - Accordion Style */}
                <TabsContent value="chapters" className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Syllabus Breakdown</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {publicSubjectDetail?.chapters?.map((chapter) => (
                      <AccordionItem
                        key={chapter?._id}
                        value={chapter?._id}
                        className="border border-gray-200 rounded-lg mb-4 overflow-hidden"
                      >
                        <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
                              {chapter?.order + 1}
                            </div>
                            <div className="text-left">
                              <h3 className="text-lg font-semibold capitalize">{chapter?.title}</h3>
                              <p className="text-sm text-gray-500 max-w-md  break-words whitespace-normal line-clamp-2 ">
                                {chapter?.content}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-2 pb-4">
                          <div className="pl-12 border-l-2 border-dashed border-emerald-200 ml-4 space-y-6">
                            {chapter?.subChapters?.map((subChapter) => (
                              <div key={subChapter?._id} className="relative">
                                <div className="absolute -left-[26px] top-1 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-medium">
                                  {subChapter?.order + 1}
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                  <h4 className="font-medium text-lg mb-2">{subChapter?.title}</h4>
                                  <p className="text-gray-600 mb-3">{subChapter?.content}</p>
                                  <div className="bg-gray-50 p-3 rounded-md mt-2">
                                    <div className="text-xs text-gray-500">Learning Resources</div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                        <BookOpen className="h-4 w-4 text-gray-600" />
                                      </div>
                                      <span className="text-sm">View study materials</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>

                {/* Grid View */}
                <TabsContent value="grid">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {publicSubjectDetail?.chapters?.map((chapter) => (
                      <Card
                        key={chapter?._id}
                        className="overflow-hidden border-none shadow-md py-0"
                      >
                        <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600 relative">
                          <div className="absolute inset-0 bg-black/20"></div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white text-xl font-bold capitalize">
                              {chapter?.title}
                            </h3>
                            <p className="text-white/80 text-sm">{chapter?.content}</p>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-medium text-gray-700 mb-3">Sub-chapters:</h4>
                          <ul className="space-y-3">
                            {chapter?.subChapters?.map((subChapter) => (
                              <li key={subChapter?._id} className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center text-emerald-700 text-xs font-medium mt-0.5">
                                  {subChapter?.order + 1}
                                </div>
                                <div>
                                  <h5 className="font-medium">{subChapter?.title}</h5>
                                  <p className="text-sm text-gray-600">{subChapter?.content}</p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        <CardFooter className="bg-gray-50 px-4 py-3 flex justify-between">
                          <span className="text-sm text-gray-500">
                            {chapter?.subChapters?.length} sub-chapters
                          </span>
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                            Chapter {chapter?.order + 1}
                          </Badge>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Table View */}
                <TabsContent value="table">
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
                              </tr>
                            ))}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Footer Information */}
              <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200 mt-8">
                <p>Last updated: {new Date(publicSubjectDetail?.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center p-8 text-center shadow-none border-0">
              <div className="rounded-full p-3 bg-muted mb-4">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Subject Not Found</h3>
              <p className="text-muted-foreground mt-2 max-w-sm">
                The requested subject could not be found. Please check the subject code or try
                another search.
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default memo(PublicChapterDetail);
