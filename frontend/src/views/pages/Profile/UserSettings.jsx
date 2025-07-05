import React, { memo, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import MainWrapper from '@/views/layouts/Mainwrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import ProfileDetails from './ProfileDetails';
import ChangePassword from './ChangePassword';
import Integrations from './Integrations';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { ADMIN } from '@/constants/roles.constants';

const menuItemsConstant = [
  {
    id: 'my-profile',
    label: 'My Profile',
    breadCrumbs: [
      { label: 'Settings', href: null },
      { label: 'Profile', href: null },
    ],
  },
  {
    id: 'change-password',
    label: 'Change Password',
    breadCrumbs: [
      { label: 'Settings', href: null },
      { label: 'Change Password', href: null },
    ],
  },
];

const settingsMenuMapper = {
  'my-profile': ProfileDetails,
  'change-password': ChangePassword,
};

const Setting = () => {
  const { settingId } = useParams();
  const { profileDetails } = useSelector((state) => state.userProfileState);
  const [menuItems, setMenuItems] = useState(_.cloneDeep(menuItemsConstant));

  useEffect(() => {
    if (profileDetails?.role === ADMIN) {
      setMenuItems((prev) => [
        ...prev,
        {
          id: 'admin-integrations',
          label: 'Admin Integrations',
          breadCrumbs: [
            { label: 'Settings', href: null },
            { label: 'Admin Integrations', href: null },
          ],
        },
      ]);
      settingsMenuMapper['admin-integrations'] = Integrations;
    }
  }, [profileDetails?.role]);

  const navigate = useNavigate();
  const ComponentRender = useMemo(
    () => settingsMenuMapper[settingId] || settingsMenuMapper['my-profile'],
    [settingId, menuItems]
  );
  const breadCrumbs = useMemo(() => {
    let current = menuItems.find((item) => item.id === settingId);
    return current?.breadCrumbs || menuItems[0].breadCrumbs;
  }, [settingId, menuItems]);

  const handleTabChange = useCallback(
    (id) => {
      navigate(`/settings/${id}`);
    },
    [settingId]
  );

  return (
    <MainWrapper breadCrumbs={breadCrumbs}>
      <div className="flex gap-6 mt-4 h-[85vh]">
        <div className="flex flex-col  gap-6  w-4/5 ">
          <div className=" max-h-[82vh] overflow-y-auto pr-2">
            <ComponentRender />
          </div>
        </div>

        <div className="sticky w-1/5 top-4">
          <Card className=" bg-white dark:bg-gray-800 p-4 border-r dark:border-gray-700">
            <h2 className="text-lg font-medium mb-4">Settings</h2>
            <div className="max-h-[calc(100vh-100px)] overflow-y-auto pr-2">
              <nav className="flex flex-col space-y-1">
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={settingId === item.id ? 'secondary' : 'ghost'}
                    className={`justify-start text-left ${
                      'profile' === item.id ? 'font-medium bg-gray-100 dark:bg-gray-700' : ''
                    }`}
                    onClick={() => handleTabChange(item.id)}
                  >
                    {item.label}
                  </Button>
                ))}
              </nav>
            </div>
          </Card>
        </div>
      </div>
    </MainWrapper>
  );
};

export default Setting;
