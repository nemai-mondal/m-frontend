import * as Yup from "yup";
export const EmployeeAddressSchema = Yup.object({
  mailing_wef: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .nullable(),
  mailing_city: Yup.string()
    .trim()
    .max(100, "Character must be equal or less than 100")
    .nullable(),
  mailing_state: Yup.string()
    .trim()
    .max(100, "Character must be equal or less than 100")
    .required("State Is Eequired"),
  mailing_line1: Yup.string()
    .trim()
    .max(100, "Character must be equal or less than 100")
    .required("Address 1 Is Required"),
  mailing_line2: Yup.string()
    .trim()
    .max(100, "Character must be equal or less than 100")
    .nullable(),
  mailing_line3: Yup.string()
    .trim()
    .max(100, "Character must be equal or less than 100")
    .nullable(),
  mailing_phone1: Yup.string()
    .max(10, "Phone number should not be more than 10 characters")
    .matches(/^[6-9]\d{9}$/, "Invalid phone number format")
    .required("Mobile Number 1 Is Required"),
  mailing_phone2: Yup.string()
    .max(10, "Phone number should not be more than 10 characters")
    .matches(/^[6-9]\d{9}$/, "Invalid phone number format")
    .nullable(),
  mailing_country: Yup.object().required("Country Is Required"),
  mailing_pincode: Yup.string()
    .trim()
    .min(6, "Pincode must be equal 6")
    .max(6, "Pincode must be equal 6")
    .required("Pincode required"),
  mailing_city_type: Yup.object().nullable(),
  mailing_land_line1: Yup.string()
    .max(10, "Land line number should not be more than 10 characters")
    // .matches(/^[0-9]\d{10}$/, "Invalid format")
    .nullable(),
  mailing_land_line2: Yup.string()
    .max(10, "Land line number should not be more than 10 characters")
    // .matches(/^[0-9]\d{10}$/, "Invalid format")
    .nullable(),
  parmanent_wef: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .nullable(),
  parmanent_city: Yup.string()
    .trim()
    .max(100, "Character must be equal or less than 100")
    .nullable(),
  parmanent_state: Yup.string()
    .trim()
    .max(100, "Character must be equal or less than 100")
    .required("State Is Required"),
  parmanent_line1: Yup.string()
    .trim()
    .max(100, "Character must be equal or less than 100")
    .required("Address 1 Is Required"),
  parmanent_line2: Yup.string()
    .trim()
    .max(100, "Character must be equal or less than 100")
    .nullable(),
  parmanent_line3: Yup.string()
    .trim()
    .max(100, "Character must be equal or less than 100")
    .nullable(),
  parmanent_phone1: Yup.string()
    .max(10, "Phone number should not be more than 10 characters")
    .matches(/^[6-9]\d{9}$/, "Invalid phone number format")
    .required("Mobile Number 1 Is Required"),
  parmanent_phone2: Yup.string()
    .max(10, "Phone number should not be more than 10 characters")
    .matches(/^[6-9]\d{9}$/, "Invalid phone number format")
    .nullable(),
  parmanent_country: Yup.object().required("Country Is Required"),
  parmanent_pincode: Yup.string()
    .trim()
    .min(6, "Pincode must be equal 6")
    .max(6, "Pincode must be equal 6")
    .required("Pincode Is Required"),
  parmanent_city_type: Yup.object().nullable(),
  parmanent_land_line1: Yup.string()
    .max(10, "Land line number should not be more than 10 characters")
    // .matches(/^[6-9]\d{9}$/, "Invalid land line number format")
    .nullable(),
  parmanent_land_line2: Yup.string()
    .max(10, "Land line number should not be more than 10 characters")
    // .matches(/^[6-9]\d{9}$/, "Invalid land line number format")
    .nullable(),
  permanent_same_as_current: Yup.boolean(),
});
