import React, { useState, useEffect, useCallback, memo } from 'react';
import MainWrapper from '@/views/layouts/Mainwrapper';
import { useDispatch, useSelector } from 'react-redux';
import { contactActions } from '@/redux/combineActions';
import MetaData from '@/utils/MetaData';
import CustomTable1 from '@/views/components/tables/TableV1';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';
import { format } from 'timeago.js';

const breadCrumbs = [{ label: 'Contact Responses', href: null }];

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'email', key: 'email' },
  { title: 'Phone', key: 'phone' },
  { title: 'Class', key: 'class' },
  { title: 'Message', key: 'message' },
  { title: 'Preferred Time', key: 'preferredTime' },
  { title: 'Heard From', key: 'heardAboutUs' },
  { title: 'Date', key: 'date' },
  { title: 'Time Ago', key: 'timeAgo' },
];

const badgeStyles = {
  morning: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100',
  afternoon:
    'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100',
  evening:
    'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-100',
  any: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100',
  friend: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100',
  'social media': 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100',
  newspaper:
    'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100',
  flyer:
    'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-100',
  website:
    'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-100',
  other: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100',
  default: 'bg-gray-100 text-gray-800',
};

const ContactList = () => {
  const { getContactFormListAction } = contactActions;
  const dispatch = useDispatch();
  const { contactList, loading } = useSelector((state) => state.contactFormState);

  const [info, setInfo] = useState({
    loading: true,
    limit: 20,
    currentPage: 1,
  });

  useEffect(() => {
    if (!contactList && contactList?.currentPage !== 1) {
      fetchFormResponseListHandler();
    }
  }, []);

  const fetchFormResponseListHandler = useCallback(
    async (queryObject) => {
      let query = {
        page: queryObject?.currentPage ?? info?.currentPage,
        limit: queryObject?.limit ?? info?.limit,
      };
      dispatch(getContactFormListAction(query));
    },
    [contactList, info?.currentPage, info?.limit]
  );

  const paginationFunctionHandler = useCallback(
    (page) => {
      let queryObject = {
        currentPage: page,
      };

      setInfo((prev) => ({
        ...prev,
        ...queryObject,
      }));
      fetchFormResponseListHandler(queryObject);
    },
    [info?.currentPage]
  );
  return (
    <MainWrapper breadCrumbs={breadCrumbs}>
      <MetaData title="Form Responses | AcademIQ" />

      <br />

      <CustomTable1
        headers={headers}
        docs={contactList?.docs?.map((singleData) => ({
          ...singleData,
          preferredTime: (
            <Badge className={badgeStyles[singleData?.preferredTime || 'default']}>
              {singleData?.preferredTime}
            </Badge>
          ),
          heardAboutUs: (
            <Badge className={badgeStyles[singleData?.heardAboutUs || 'default']}>
              {singleData?.heardAboutUs}
            </Badge>
          ),
          date: moment(singleData?.createdAt).format('LL'),
          timeAgo: format(singleData?.createdAt),
        }))}
        cardTitle="Form Response Data"
        loading={loading}
        totalPages={contactList?.totalPages}
        currentPage={contactList?.currentPage}
        onPageChange={paginationFunctionHandler}
        limit={info?.limit}
      />
    </MainWrapper>
  );
};

export default memo(ContactList);
