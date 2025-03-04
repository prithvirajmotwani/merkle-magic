
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error && error.message) return error.message;
  return 'Unknown error occurred';
};
