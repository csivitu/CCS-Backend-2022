const standardizeObject = <T>(err: T) => {
  if (typeof err === "object" && err !== null) {
    if (Array.isArray(err)) {
      const error = err.map(
        (e) => <unknown>standardizeObject(e)
      ) as unknown as T;

      return error;
    }

    const error = {} as T;
    const allKeys = Object.getOwnPropertyNames(err);

    allKeys.forEach((key) => {
      error[key as keyof T] = standardizeObject(err[key as keyof T]);
    });

    return error;
  }

  return err;
};

export default standardizeObject;
