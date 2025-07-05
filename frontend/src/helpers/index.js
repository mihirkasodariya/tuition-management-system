import _ from 'lodash';

// Function to recursively clean the object
export function cleanObject(obj) {
  return _.omitBy(
    _.mapValues(obj, (value) => {
      if (_.isArray(value)) {
        // Recursively clean arrays
        return value.map(cleanObject);
      } else if (_.isObject(value)) {
        // Recursively clean nested objects
        return cleanObject(value);
      }
      return value;
    }),
    (val) => _.isEmpty(val) || _.isNil(val)
  ); // Remove empty strings, null, or undefined
}

export function objectToQueryString(obj) {
  if (!_.isObject(obj)) return '';

  const queryString = Object.entries(obj)
    .map(([key, value]) => {
      if (_.isNil(value) || value === '') return '';
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .filter(Boolean)
    .join('&');

  return queryString ? `?${queryString}` : '';
}
