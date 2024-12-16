import * as Yup from "yup";

export const EmployeeEmergencyAddressSchema = Yup.object().shape({
  addresses: Yup.array().of(
    Yup.object().shape({
      // Validation for the first (index 0)
      contact_name: Yup.string()
        .trim()
        .max(100, "Character must be equal or less that 100")
        .required("Name Is Required"),
      relation: Yup.string()
        .trim()
        .max(100, "Character must be equal or less that 100")
        .nullable(),
      city: Yup.string()
        .trim()
        .max(100, "Character must be equal or less that 100")
        .nullable(),
      line1: Yup.string()
        .trim()
        .max(100, "Character must be equal or less that 100")
        .required("Address Is Required"),
      pincode: Yup.string()
        .min(6, "pincode must be equal 6")
        .max(6, "pincode must be equal 6")
        .required("Pincode Is Required"),
      state: Yup.string()
        .trim()
        .max(100, "Character must be equal or less that 100")
        .required("State Is Required"),
      country: Yup.object().required("Country Is Required"),
      phone1: Yup.string()
        .trim()
        .max(10, "Phone number should not be more than 10 characters")
        .matches(/^[6-9]\d{9}$/, "Invalid phone number format")
        .nullable(),
      phone2: Yup.string()
        .trim()
        .max(10, "Phone number should not be more than 10 characters")
        .matches(/^[6-9]\d{9}$/, "Invalid phone number format")
        .required("Mobile Number Is Required"),
    }),
    Yup.object().shape({
      // Validation for the second (index 1)
      contact_name: Yup.string()
        .trim()
        .max(100, "Character must be equal or less that 100")
        .nullable(),
      relation: Yup.string()
        .trim()
        .max(100, "Character must be equal or less that 100")
        .nullable(),
      city: Yup.string()
        .trim()
        .max(100, "Character must be equal or less that 100")
        .nullable(),
      line1: Yup.string()
        .trim()
        .max(100, "Character must be equal or less that 100")
        .nullable(),
      pincode: Yup.string()
        .min(6, "pincode must be equal 6")
        .max(6, "pincode must be equal 6")
        .nullable(),
      state: Yup.string()
        .trim()
        .max(100, "Character must be equal or less that 100")
        .nullable(),
      country: Yup.object().nullable(),
      phone1: Yup.string()
        .trim()
        .max(10, "Phone number should not be more than 10 characters")
        .matches(/^[6-9]\d{9}$/, "Invalid phone number format")
        .nullable(),
      phone2: Yup.string()
        .trim()
        .max(10, "Phone number should not be more than 10 characters")
        .matches(/^[6-9]\d{9}$/, "Invalid phone number format")
        .nullable(),
    })
  ),
});
