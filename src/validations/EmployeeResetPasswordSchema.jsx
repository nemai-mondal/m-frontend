import * as Yup from "yup";
export const EmployeeResetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password Should be atleast 8 charcter")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])(?!.*\s).{8,}$/,
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one special character, and one number."
    )
    .required("Password Is Required"),
  password_confirmation: Yup.string()
    .required("Confirm Password Is Required")
    .oneOf(
      [Yup.ref("password"), null],
      "The Password confirmation does not match with New Password"
    ),
});
