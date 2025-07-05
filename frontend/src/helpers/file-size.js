export const getImageSizeFormat = (size) => {
  if (size > 1024 * 1024 * 1024) {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  } else if (size > 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' MB';
  } else {
    return (size / 1024).toFixed(2) + ' KB';
  }
};
