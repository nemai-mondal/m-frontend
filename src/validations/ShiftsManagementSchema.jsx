import * as Yup from "yup";

export const ShiftsManagementSchema = Yup.object().shape({
  name: Yup.string().trim().max(50,"Character must be equal or less than 50 character").required("Shift Name Is Required"),
  shift_start: Yup.date()
    .nullable()
    .required("Shift Start Is Required")
    .typeError("Shift Start must be a valid date"),

  shift_end: Yup.date()
    .required("Shift End Is Required")
    // .when("shift_start", (shift_start, schema) => {
    //   return shift_start && !isNaN(new Date(shift_start))
    //     ? schema.min(
    //         new Date(new Date(shift_start).getTime() + 30 * 60000),
    //         "Shift End time must be after Shift start time"
    //       )
    //     : schema;
    // })
    ,

  timezone: Yup.object().required("Timezone Is Required"),
});
