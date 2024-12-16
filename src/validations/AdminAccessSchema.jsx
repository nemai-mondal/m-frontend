import * as Yup from "yup";
export const AdminAccessSchema = Yup.object({
  email: Yup.string().trim().email().required("Email Is Required"),
  reporting_manager_id: Yup.object().required("Reporting Manager Is Required"),
  shift_id: Yup.object().required("Shift Is Required"),
  date_of_joining: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .required("Date Is Required"),
  machine_code: Yup.string()
    .trim()
    .max(70, "Character must be equal or less than 70")
    .required("Machine Code Is Required"),
});
