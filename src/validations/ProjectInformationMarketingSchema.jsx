import * as Yup from "yup";

export const ProjectInformationMarketingSchema = Yup.object({
  client_id: Yup.object().required("Client Is Required"),
  name: Yup.string()
    .trim()
    .max(80, "Character must be equal or less that 80")
    .required("Project Title Is Required"),
  start_date: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .required("Start Date Is Required"),
  end_date: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .when("start_date", (start_date, schema) => {
      return start_date && !isNaN(new Date(start_date))
        ? schema.min(
            new Date(
              new Date(start_date).setDate(new Date(start_date).getDate() + 1)
            ),
            "End date must be after the Start date"
          )
        : schema;
    }),

  manager_id: Yup.object().required("Manager Is Required"),
  project_type: Yup.object().required("Project Type Is Required"),
  currency_type: Yup.string().nullable(),
  cost: Yup.string()
    .max(15, "Integer must be equal or less than 15")
    .nullable(),
  estimation_value: Yup.string()
    .max(15, "Integer must be equal or less than 15")
    .nullable(),
  project_status: Yup.object().required("Project Status Is Required"),
  priority: Yup.object().required("Project Priority Is Required"),
  description: Yup.string().nullable(),
});
