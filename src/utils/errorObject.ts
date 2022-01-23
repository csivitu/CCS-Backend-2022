const errorObject = (code: number, message?: Error | string, obj?: unknown) => {
  if (code !== 200) {
    return {
      success: false,
      code,
      message,
    };
  }
  return {
    success: true,
    message,
    result: obj,
  };
};

export default errorObject;
