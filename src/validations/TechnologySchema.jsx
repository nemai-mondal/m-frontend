import * as Yup from "yup";
export const TechnologySchema = Yup.object({
  name: Yup.string()
    .trim()
    .max(50, "Character must be less than or equal 50")
    .required("Technology Name Is Required"),
});
