import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomPagination from '@/views/components/pagination/PaginationV1';
import DotsLoader from '@/views/components/loaders/DotLoader';
import PropTypes from 'prop-types';

const CustomTable1 = ({
  headers,
  docs,
  onRowAction,
  actions,
  index = true,
  cardTitle = '',
  pagination = true,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  loading = false,
  limit = 10,
}) => {
  // Check if data is empty
  const isEmptyData = !docs || docs?.length === 0;

  return (
    <Card className=" w-full max-sm:w-screen overflow-auto">
      {cardTitle && (
        <CardHeader>
          <CardTitle>{cardTitle}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {index && <TableHead>S.No</TableHead>}
              {headers.map((header, index) => (
                <TableHead key={index}>{header.title}</TableHead>
              ))}
              {actions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          {loading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={headers.length + (actions ? 1 : 0) + (index ? 1 : 0)}>
                  <DotsLoader parentClass={'my-3 py-4'} />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {isEmptyData ? (
                <TableRow>
                  <TableCell
                    colSpan={headers.length + (actions ? 1 : 0) + (index ? 1 : 0)}
                    className="h-24 text-center"
                  >
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                docs?.map((item, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {index && <TableCell>{(currentPage - 1) * limit + rowIndex + 1}.</TableCell>}
                    {headers.map((header, colIndex) => (
                      <TableCell key={colIndex}>
                        <div className="text-sm">{item[header.key] || 'N/A'}</div>
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell>
                        <div className="flex gap-2">{actions(item)}</div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          )}
        </Table>

        {pagination && totalPages !== 1 && (
          <div className="mt-4">
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => onPageChange(page)}
              siblingsCount={1}
              boundaryCount={1}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

CustomTable1.prototype = {
  index: PropTypes.bool,
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
    })
  ).isRequired,
  actions: PropTypes.func,
  pagination: PropTypes.bool,
  onPageChange: PropTypes.func,
  cardTitle: PropTypes.string,
  loading: PropTypes.bool,
  limit: PropTypes.number,
};

export default CustomTable1;
