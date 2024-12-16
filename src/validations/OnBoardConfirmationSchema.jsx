import * as Yup from "yup";
export const OnBoardConfirmationSchema = Yup.object({
  employee_id: Yup.string()
    .trim()
    .max(100, "Character must be equal or less than 100")
    .required("Employee-Id is Required"),

  // shift_id: Yup.string()
  // .trim()
  // .max(100, "Character must be equal or less than 100")
  // .required("Shift is Required"),

  first_name: Yup.string()
    .trim()
    .max(100, "Character must be equal or less than 100")
    .required("First name required"),
  gender: Yup.object().required("Gender required"),
  date_of_birth: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      "Age must be at least 18 years old"
    )
    .required("Date of birth required"),

  personal_phone: Yup.string()
    .trim()
    .max(10, "Phone number should not be more than 10 characters")
    .matches(/^[6-9]\d{9}$/, "Invalid phone number format")
    .required("Phone no required"),
});
