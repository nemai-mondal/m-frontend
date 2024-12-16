import * as Yup from "yup";
export const EmployeeOrganizationDetailsSchema = Yup.object({
  department_id: Yup.object().required("Department Is Required"),
  designation_id: Yup.object().required("Designation Is Required"),
  location: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .trim()
    .nullable(),
  effective_date: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .nullable(),
});
