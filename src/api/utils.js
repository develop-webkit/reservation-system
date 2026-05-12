export function unwrapResponse(response) {
  const payload = response?.data;

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data;
  }

  return payload;
}

export function getErrorMessage(error, fallback = 'Something went wrong.') {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}
