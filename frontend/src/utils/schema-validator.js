export const getErrorMessageByPropertyName = (obj, propertyPath) => {
  // let obj = errors
  // let propertyPath = "admin.name.firstName"
  // let propertyPath = "admin.name.lastName"

  const properties = propertyPath.split(".");
  // ["admin","name","firstName"]
  // ["admin","name","lastName"]
  let value = obj;

  for (let prop of properties) {
    if (value[prop]) {
      value = value[prop];
    } else {
      return undefined;
    }
  }

  return value.message;
};
