import moment from "moment";
import * as Yup from "yup";
import { PhoneNumberUtil } from "google-libphonenumber";

Yup.addMethod(Yup.string, "phone", function (errorMessage) {
  return this.test("phone", errorMessage, function (value) {
    const { path, createError } = this;
    
    if (!value) {
      return true; // Allow empty values, you may customize this based on your requirements
    }
    
    // Additional length validation
    if (value.length < 6) {
      return true;
    }


    const phoneUtil = PhoneNumberUtil.getInstance();

    const phoneNumber = phoneUtil.isValidNumber(
      phoneUtil.parseAndKeepRawInput(value)
    );

    return phoneNumber ? true : createError({ path, message: errorMessage });
  });
});


export const AddEmployeeSchema = Yup.object({
  honorifics: Yup.string().required("honorifics required"),
  first_name: Yup.string()
    .min(3, "Employee Name Should be minimum 3 character")
    .max(70, "Employee Name can be maximum 70 character")
    .matches(/^[a-zA-Z]+$/, "name must contain only characters")
    .required("Enter First  Name"),
  last_name: Yup.string()
    .min(3, "Employee Name Should be minimum 3 character")
    .max(70, "Employee Name can be maximum 70 character")
    .matches(/^[a-zA-Z]+$/, "name must contain only characters")
    .required("Enter Last Name"),
  joining_date: Yup.date().required("date is required"),
  date_of_birth: Yup.date()
    .max(moment().format("YYYY-MM-DD"))
    .required("date is required"),
  company_email: Yup.string().email().required("Please Enter Your Email-ID"),
  password: Yup.string()
    .min(8, "Password Should be atleast 8 chars")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W])(?!.*\s).{8,}$/,
      "Password must be atleast 8 characters length, 1 uppercase letter, 1 lowercase letter, 1 special character, and 1 number"
    )
    .required("Please Enter Your Password"),
  role: Yup.string().required("role required"),
  department: Yup.string().required("department required"),
  designation: Yup.string().required("designation required"),
  shift_id: Yup.string().required("Shift is required"),
  phone: Yup.string().phone("phone is invalid").required("Phone required"),
});
