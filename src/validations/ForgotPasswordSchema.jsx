import * as Yup from "yup";
export const ForgotPasswordSchema = Yup.object({
  email: Yup.string().email().required("Please Enter Your Email-ID")
});