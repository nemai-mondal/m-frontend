import * as Yup from "yup";

export const ClientSchema = Yup.object({
  name: Yup.string()
    .trim()
    .max(80, "Client Name Can't be More Than 80 Characters")
    .required("Client Name Is Required"),
  type: Yup.object().required("Client Category Is Required"),
  site: Yup.object().required("Client Type Is Required"),
  email: Yup.string().trim().email().required("Email Is Required"),
  phone: Yup.string()
    .max(10, "Invalid phone number format")
    .matches(/^[6-9]\d{9}$/, "Invalid phone number format")
    .nullable(),
  country: Yup.object().nullable(),
  industry: Yup.object().required("Client Industry Is Required"),
  company_name: Yup.string()
    .trim()
    .max(80, "Company Name Can't be More Than 80 Characters")
    .nullable(),
  company_address: Yup.string()
    .trim()
    .max(100, "Company Address Can't be More Than 100 Characters")
    .nullable(),
  contact_person
: Yup.string()
    .trim()
    .max(80, "Contact Person Can't be More Than 80 Characters")
    .required("Contact Person Is Required"),
  opportunity_source

: Yup.object().required("Source Is Required"),
  status: Yup.object().required("Client Status Is Required"),
});
