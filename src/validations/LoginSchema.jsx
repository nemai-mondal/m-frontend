import * as Yup from "yup";
export const LoginSchema = Yup.object({
  employee_id : Yup.string().required("Please Enter Your Employee-ID"),
  password: Yup.string().required("Please Enter Your Password"),
});
