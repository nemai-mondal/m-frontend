import * as Yup from "yup";
export const EmployeeLanguageSchema = Yup.object({
  name: Yup.string().max(100,"Character must be less than or equal 100").required("Name Is Required").trim(),
});
