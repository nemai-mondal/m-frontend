import * as Yup from "yup";

export const EmployeeJoiningDetailsSchema = Yup.object({
  status: Yup.object().required("Status Is Required"),
  // office_email: Yup.string()
  //   .max(100, "Character must be less than or equal 100")
  //   .email("Invalid Email-Id formate")
  //   .trim()
  //   .required("Email required"),
  date_of_joining: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid  date")
    // .max(new Date(), "Date of Joining should not be in the future")
    .nullable(),
  contract_type: Yup.object().nullable(),
  transfer_date: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .nullable(),
  salary_start_date: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .when("date_of_joining", (date_of_joining, schema) => {
      return date_of_joining && !isNaN(new Date(date_of_joining))
        ? schema.min(
            new Date(
              new Date(date_of_joining)
            ),
            "Salary start date should match or come after the joining date"
          )
        : schema;
    })
    .nullable(),
  last_working_date: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .nullable(),
  confirmation_date: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .nullable(),
  employment_type_id: Yup.object().required("Employement Type Is Required"),
  notice_period_employee: Yup.string().nullable(),
  notice_period_employer: Yup.number().nullable(),
  probation_period_in_days: Yup.number().nullable(),
});
