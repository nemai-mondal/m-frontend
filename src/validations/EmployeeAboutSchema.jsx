import * as Yup from "yup";
export const EmployeeAboutSchema = Yup.object({
  employee_id: Yup.string().required("Employee-Id Is Required"),
  machine_code: Yup.string().trim().nullable(),
  first_name: Yup.string()
    .max(40, "Character must be less than or equal 40")
    .trim()
    .required("First Name Is Required"),
  last_name: Yup.string()
    .max(40, "Character must be less than or equal 40")
    .trim()
    .required("Last Name Is Required"),
  middle_name: Yup.string()
    .max(40, "Character must be less than or equal 40")
    .trim()
    .nullable(),
  gender: Yup.object().required("Gender Is Required"),
  date_of_birth: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      "Age must be at least 18 years old"
    )
    .required("Date Of Birth Is Required"),

  phone: Yup.string()
    .max(10, "Phone number should not be more than 10 characters")
    .matches(/^[6-9]\d{9}$/, "Invalid phone number format")
    .required("Phone No Is Required"),
});
