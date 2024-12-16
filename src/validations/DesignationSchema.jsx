import * as Yup from "yup";
export const DesignationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .max(50, "Character must be less than or equal 50")
    .required("Designation Name Is Required"),

  department_id: Yup.object().required("Please Select Department"),

});
  