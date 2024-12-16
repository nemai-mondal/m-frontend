import * as Yup from "yup";
export const EmployeePersonalInformationSchema = Yup.object({
  personal_email: Yup.string().email("invalid email formate").trim().required("Personal Email-Id Is Required"),
  hobbies: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .trim()
    .nullable(),
  religion: Yup.object().nullable(),
  nationality: Yup.object().required("Nationality Is Required"),
  father_name: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .trim()
    .nullable(),
  mother_name: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .trim()
    .nullable(),
  spouse_name: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .trim()
    .nullable(),
  marriage_date: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .nullable(),
  marital_status: Yup.object().required("Marital status required"),
  state_of_birth: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .trim()
    .required("State Of Birth Is Required"),
  place_of_birth: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .trim()
    .nullable(),
  country_of_birth: Yup.object().required("Country of birth required"),
  confirmation_date: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .nullable(),
  identification_mark1: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .trim()
    .nullable(),
  identification_mark2: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .trim()
    .nullable(),
  physical_disabilities: Yup.object().required("Physical Disabilities Is Required"),
});
