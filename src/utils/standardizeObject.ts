const standardizeObject = <T>(err: T) => {
  if (typeof err === "object" && err !== null) {
    const allKeys = [
      ...Object.getOwnPropertyNames(err),
      ...Object.getOwnPropertySymbols(err).map((s) => `[${s.toString()}]`),
    ];

    const error = allKeys.reduce(
      (prev, curr) => ({
        ...prev,
        [curr]: standardizeObject(err[curr as keyof T]),
      }),
      {}
    ) as T;

    return error;
  }

  return err;
};

export default standardizeObject;
