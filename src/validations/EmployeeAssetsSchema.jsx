import * as Yup from "yup";

export const EmployeeAssetsSchema = Yup.object({
  sr_no: Yup.string().trim().required("Serial Number Is Required"),
  remarks: Yup.string().trim().nullable(),
  assets_name: Yup.string().trim().required("Assets Name Is Required"),
  assign_date: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .required("Assign Date Is Required"),
  valid_till: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .required("Valid Till Date Is Required")
    .when("assign_date", (assign_date, schema) => {
      return assign_date && !isNaN(new Date(assign_date))
        ? schema.min(
            new Date(
              new Date(assign_date).setDate(new Date(assign_date).getDate() + 1)
            ),
            "Valid till date must be after the assign date"
          )
        : schema;
    }),
  assets_type: Yup.string().trim().required("Assets Type Is Required"),
  assets_status: Yup.object().required("Assets Status Is Required"),
});
