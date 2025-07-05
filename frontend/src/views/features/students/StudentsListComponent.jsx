import React, { memo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import _ from 'lodash';
// Usage example with your data
const StudentsListComponent = ({
  classRooms,
  boardTypes,
  batchTypes,
  data,
  info,
  setInfo,
  filterChangeHandlerFunction,
  navigateToStudentDetails,
  navigateToStudentAttendanceList,
}) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= data?.totalPages) {
      filterChangeHandlerFunction('page', page);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Student Management</h1>
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-10"
              value={info?.name}
              onChange={(e) => {
                filterChangeHandlerFunction('name', e.target.value);
              }}
            />
          </div>

          <Select
            value={info?.classRoom}
            onValueChange={(value) => filterChangeHandlerFunction('classRoom', value)}
            // disabled={info?.isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {info?.classRoom && <SelectItem value={'all'}>All </SelectItem>}
              {classRooms?.map((grade) => (
                <SelectItem key={grade} value={grade.toString()}>
                  Class {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={info?.boardType}
            onValueChange={(value) => filterChangeHandlerFunction('boardType', value)}
            //   disabled={info?.isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select board type" />
            </SelectTrigger>
            <SelectContent>
              {info?.boardType && <SelectItem value={'all'}>All </SelectItem>}
              {boardTypes?.map((board) => (
                <SelectItem key={board?._id} value={board?._id}>
                  {board?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={info?.batchType}
            onValueChange={(value) => filterChangeHandlerFunction('batchType', value)}
            //   disabled={info?.isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select batch type" />
            </SelectTrigger>
            <SelectContent>
              {info?.batchType && <SelectItem value={'all'}>All </SelectItem>}
              {batchTypes?.map((singleBatch) => (
                <SelectItem key={singleBatch?._id} value={singleBatch?._id}>
                  {singleBatch?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={() => filterChangeHandlerFunction('reset', null)}>Reset </Button>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Board</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Timings</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.docs?.length > 0 ? (
                data?.docs?.map((student) => (
                  <TableRow key={student?._id}>
                    <TableCell className="font-medium">{student?.name}</TableCell>
                    <TableCell>{student?.email}</TableCell>
                    <TableCell>{student?.class}</TableCell>
                    <TableCell>{_.find(boardTypes, { _id: student?.boardType }).name}</TableCell>
                    <TableCell>{student?.school}</TableCell>
                    <TableCell>
                      {Object.entries(student?.days)
                        .filter(([_, value]) => value)
                        .map(([day]) => day.slice(0, 3))
                        .join(', ')}
                    </TableCell>
                    <TableCell>
                      {student?.timings?.startTimeHHMM} - {student?.timings?.endTimeHHMM}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="flex items-center gap-2"
                            onClick={() => navigateToStudentDetails(student)}
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2"
                            onClick={() => navigateToStudentAttendanceList(student)}
                          >
                            <List className="h-4 w-4" />
                            Attendance
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {data?.totalPages > 1 && _.size(data?.docs) > 0 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(info?.currentPage - 1)}
                  disabled={info?.currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </PaginationItem>

              {Array.from({ length: data?.totalPages || 1 }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <Button
                    variant={info?.currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                </PaginationItem>
              ))}

              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(info?.currentPage + 1)}
                  disabled={info?.currentPage === data?.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default memo(StudentsListComponent);
