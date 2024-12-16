import * as Yup from "yup";
export const EmployeeSkillSchema = Yup.object({
  name: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .required("Name Is Required")
    .trim(),
  type: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .required("Type Is Required")
    .trim(),
  level: Yup.number()
    .min(1, "Skill level must be 1 or greater")
    .max(10, "Skill level must be 10 or less")
    .required("Level Is Required"),
  effective_date: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .required("Date Is Required"),
});
