import * as Yup from "yup";
export const AddActivitySchema = Yup.object({
  name: Yup.string()
    .trim()
    .max(50, "Character must be equal or less than 50")
    .required("Activity Name Is Required"),

  department_id: Yup.object().required("Please Select Department"),

});
