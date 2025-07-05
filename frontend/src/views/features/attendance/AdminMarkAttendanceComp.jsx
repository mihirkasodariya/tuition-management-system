import React, { memo, useState } from 'react';
import { Search, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import _ from 'lodash';
import moment from 'moment';
import { format } from 'date-fns';

const AdminMarkAttendanceComponent = ({
  classRooms,
  data,
  info,
  filterChangeHandlerFunction,
  navigateToStudentDetails,
}) => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Day Wise Attendance Mark Sheet</h1>
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

          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={info?.isSubmitting}
                  readOnly={info?.isReadOnly}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {info?.date ? format(info?.date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={info?.date}
                  onSelect={(date) => filterChangeHandlerFunction('date', date)}
                  // initialFocus
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button onClick={() => filterChangeHandlerFunction('reset', null)}>Reset </Button>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.no</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Board</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Attendance</TableHead>
                {/* <TableHead>Actions</TableHead>  */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length > 0 ? (
                data?.map((singleAttendance, index) => (
                  <TableRow key={singleAttendance?._id}>
                    <TableCell>{index + 1}.</TableCell>
                    <TableCell className="font-medium">{singleAttendance?.student?.name}</TableCell>
                    <TableCell>{singleAttendance?.class}</TableCell>
                    <TableCell>{singleAttendance?.board?.name}</TableCell>
                    <TableCell>{moment(singleAttendance?.startDate).format('LLL')}</TableCell>
                    <TableCell>
                      <Button
                        variant={singleAttendance?.isPresent ? 'destructive' : 'secondary'}
                        onClick={() =>
                          filterChangeHandlerFunction('toggleAttendance', singleAttendance)
                        }
                      >
                        {singleAttendance?.isPresent ? 'Mark Absent' : 'Mark Present'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No Live found Today.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default memo(AdminMarkAttendanceComponent);
