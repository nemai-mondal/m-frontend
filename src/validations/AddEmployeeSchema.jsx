import * as Yup from "yup";
export const AddEmployeeSchema = Yup.object({
  employee_id: Yup.string()
    .matches(/^[A-Za-z]{3}\d{4}$/, "Invalid Formate")
    .max(100, "Character must be equal or less than 100")
    .required("Employee id is required"),

  first_name: Yup.string()
    .trim()
    .max(100, "Character must be equal or less than 100")
    .required("First Name is required"),
  gender: Yup.object().required("Gender is required"),
  date_of_birth: Yup.date()
    .min(new Date("1947-01-01"), "Date must be after 1946")
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      "Age must be at least 18 years old"
    )
    .required("Date of Birth is required"),
  office_email: Yup.string()
    .trim()
    .email("Invalid email format")
    .required("Email id is required"),
  phone: Yup.string()
    .trim()
    .max(10, "Phone number should not be more than 10 characters")
    .matches(/^[6-9]\d{9}$/, "Invalid phone number format")
    .nullable(),
  reporting_manager_id: Yup.object().required("Reporting manager is required"),
  contract_type: Yup.object().required("Contract type is required"),
  shift_id: Yup.object().required("Shift is required"),
  employment_type_id: Yup.object().required("Employment type is required"),
  department_id: Yup.object().required("Department is required"),
  designation_id: Yup.object().required("Designation is required"),
  date_of_joining: Yup.date().required("Date of joining is required"),
});
