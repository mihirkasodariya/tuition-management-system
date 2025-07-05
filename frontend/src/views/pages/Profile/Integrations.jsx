import React, { memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { ExternalLink, Calendar, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BASE_URL } from '@/services/config';
import { connectToGoogleApi } from '@/apis/integration.api';
import { myDetailsActions } from '@/redux/combineActions';

const integrationsConstants = [
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Schedule and manage prayer times, Jummah, Eid prayers, and community events.',
    icon: <Calendar className="h-8 w-8" />,
    consoleUrl: `${BASE_URL}/auth/google`,
    category: 'prayer',
    popular: true,
    stateName: 'google',
  },

  //   {
  //     id: 'zoom',
  //     name: 'Zoom',
  //     description: 'Host virtual Islamic classes, committee meetings, and live-stream events.',
  //     icon: <Video className="h-8 w-8" />,
  //     consoleUrl: 'https://zoom.us/signin',
  //     category: 'communication',
  //     popular: true,
  //   },
  //   {
  //     id: 'discord',
  //     name: 'Discord',
  //     description: 'Build an online community space for youth groups and special interest programs.',
  //     icon: <Users className="h-8 w-8" />,
  //     consoleUrl: 'https://discord.com/login',
  //     category: 'community',
  //   },
];
const Integrations = () => {
  const dispatch = useDispatch();
  const { integrations } = useSelector((state) => state.myDetailsState);
  const { isGoogleConnectedAction } = myDetailsActions;

  const onClickConnectButton = (integrationDetails) => {
    if (integrationDetails?.id === 'google-calendar') {
      connectToGoogleApi();
    }
  };

  useEffect(() => {
    if (!integrations?.google?.isApiCalled) {
      fetchGoogleIntegrationHandler();
    }
  }, []);

  const fetchGoogleIntegrationHandler = useCallback(() => {
    dispatch(isGoogleConnectedAction());
  }, [integrations?.google]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>MyClasses Integrations</CardTitle>
          <CardDescription>
            Manage and customize the integrations for your MyClasses, including Ramadan timings and
            query forms, to enhance community engagement and support.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrationsConstants?.map((integration) => (
              <Card key={integration.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-muted rounded-md">{integration.icon}</div>
                    {integration.popular && <Badge variant="secondary">Popular</Badge>}
                  </div>
                  <CardTitle className="mt-4">{integration.name}</CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  {integrations[integration?.stateName]?.isGoogleConnected ? (
                    <Button className="w-full bg-green-800 hover:bg-green-900">
                      Connected
                      <BadgeCheck className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={() => onClickConnectButton(integration)}>
                      Connect
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default memo(Integrations);
