import { memo } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';
import { Button } from '@/components/ui/button';

const BoardCard = ({ board, editBoardModal }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold">{board?.name}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">{board.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Created By</p>
            <p>{board?.createdBy?.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Updated By</p>
            <p>{board?.updatedBy?.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Created At (IST)</p>
            <p>{moment(board?.createdAt).format('MMM D, YYYY h:mm A')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Updated At (IST)</p>
            <p>{moment(board?.updatedAt).format('MMM D, YYYY h:mm A')}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={() => editBoardModal(board?._id)}>Edit</Button>
      </CardFooter>
    </Card>
  );
};
export default memo(BoardCard);
