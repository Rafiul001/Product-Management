export const PRODUCT_STATUS = {
  ACTIVATED: "ACTIVATED",
  DEACTIVATED: "DEACTIVATED",
};

export const TYPE = {
  PRIMARY: "PRIMARY",
  SECONDARY: "SECONDARY",
  DANGER: "DANGER",
  SUCCESS: "SUCCESS",
};

export const getColorTheme = (type: (typeof TYPE)[keyof typeof TYPE]) => {
  if (type === TYPE.PRIMARY) {
    return "bg-blue-500 text-white hover:bg-blue-600";
  } else if (type === TYPE.SECONDARY) {
    return "bg-gray-600 text-white hover:bg-gray-800";
  } else if (type === TYPE.DANGER) {
    return "bg-red-600 text-white hover:bg-red-700";
  } else if (type === TYPE.SUCCESS) {
    return "bg-teal-600 text-white hover:bg-teal-700";
  } else return "bg-white text-black hover:bg-gray-100";
};

export const getTextColor = (type: (typeof TYPE)[keyof typeof TYPE]) => {
  if (type === TYPE.PRIMARY) {
    return "text-blue-600";
  } else if (type === TYPE.SECONDARY) {
    return "text-gray-700";
  } else if (type === TYPE.DANGER) {
    return "text-red-600";
  } else if (type === TYPE.SUCCESS) {
    return "text-teal-600";
  } else return "text-black";
};
