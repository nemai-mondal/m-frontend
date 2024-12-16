import * as Yup from "yup";

export const HolidaySchema = Yup.object({
  holiday_name: Yup.string()
    .trim()
    .min(2, "The holiday name must be at least 2 characters ")
    .max(50, "Character must be a equal or less than 50")
    .required(" Holiday Name Is Required"),
  date_from: Yup.date().required("Start Date Is Required"),
  // date_to: Yup.date()
  //   .min(
  //     Yup.ref("date_from"),
  //     "End date must be equal to or after the start date"
  //   )
  //   .required("End Date Required"),

  date_to: Yup.date()
    .required("End Date Is Required")
    .when("date_from", (date_from, schema) => {
      return date_from && !isNaN(new Date(date_from))
        ? schema.min(
            date_from,
            "End date must be equal to or after the start date"
          )
        : schema;
    }),
  days: Yup.number().nullable(),
  
});
