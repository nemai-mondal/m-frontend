import * as Yup from "yup";
export const DepartmentSchema = Yup.object({
  name: Yup.string().max(50,"Character must be less than or equal 50").trim().required("Department Name Is Required"),
});
