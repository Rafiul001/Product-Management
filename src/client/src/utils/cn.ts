export const cn = (...strings: string[]) => {
  const combinedString = strings.reduce((prev, curr, index) => {
    return (prev =
      prev + (index === strings.length - 1 ? curr : " " + curr + " "));
  }, "");

  return combinedString;
};
