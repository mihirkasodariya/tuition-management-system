import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Loader2, Eye } from 'lucide-react';

const SubjectsListComponent = ({
  classrooms,
  boards,
  info,
  handleChangeFilterFunction,
  handleFilterSearchFunction,
  buttonLoading,
  navigateToEditPage,
}) => {
  // State for filters
  const { subjectsList } = useSelector((state) => state.subjectState);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Subject List</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 max-w-screen-lg">
        <div className="space-y-2 w-full">
          <Label htmlFor="boardType">Subject Name </Label>
          <Input
            placeholder="Filter by name"
            value={info?.name}
            onChange={(e) => console.log(e.target.value)}
          />
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="boardType">Class Room</Label>
          <Select
            value={info?.classRoom}
            onValueChange={(value) => handleChangeFilterFunction('classRoom', value)}
            //   disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classrooms?.map((cls) => (
                <SelectItem key={cls} value={cls.toString()}>
                  Class {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="boardType">Board Type </Label>
          <Select
            value={info?.boardType}
            onValueChange={(value) => handleChangeFilterFunction('boardType', value)}
            // disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select board" />
            </SelectTrigger>
            <SelectContent>
              {boards?.map((board) => (
                <SelectItem key={board?._id} value={board?._id}>
                  {board?.name || ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleFilterSearchFunction} disabled={buttonLoading}>
          {buttonLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Search'
          )}
        </Button>
      </div>

      {/* Subjects Table */}
      <div className="border rounded-lg overflow-scroll ">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Board Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chapters
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subjectsList?.map((subject) => (
              <tr key={subject?._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {subject?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-20 truncate">
                  {subject?.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {subject?.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Class {subject?.class}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {subject?.boardType?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {subject?.chapters?.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(subject?.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Eye className="cursor-pointer" onClick={() => navigateToEditPage(subject)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {subjectsList?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No subjects found matching your filters
        </div>
      )}
    </div>
  );
};

export default SubjectsListComponent;
