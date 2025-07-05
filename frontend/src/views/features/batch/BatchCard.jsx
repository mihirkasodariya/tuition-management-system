import { memo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';

const BatchCard = ({ batch }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold">{batch?.name}</CardTitle>
            <CardDescription className="mt-1">
              {moment(batch?.startDate).format('MMM d, yyyy')} -{' '}
              {moment(batch?.endDate).format('MMM d, yyyy')}
            </CardDescription>
          </div>
          <Badge variant={batch?.isActive ? 'default' : 'secondary'}>
            {batch?.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Created By</p>
            <p>{batch?.createdBy?.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Updated By</p>
            <p>{batch?.updatedBy?.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Created At</p>
            <p>{moment(batch?.createdAt).format('MMM d, yyyy h:mm a')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Updated At</p>
            <p>{moment(batch?.updatedAt).format('MMM d, yyyy h:mm a')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default memo(BatchCard);
