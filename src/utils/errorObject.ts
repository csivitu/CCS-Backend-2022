const errorObject = (code: number, message?: Error | string, obj?) => {
  if (code !== 200) {
    return {
      success: false,
      code,
      message,
    };
  }
  return {
    success: true,
    code,
    message,
    result: obj,
  };
};

export default errorObject;
