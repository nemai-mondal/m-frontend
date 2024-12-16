import * as Yup from "yup";

export const RoleSchema = Yup.object({
  name: Yup.string().required("Role name is required."),
  description: Yup.string().max(
    500,
    "Role description must be at most 500 characters."
  ),
});
