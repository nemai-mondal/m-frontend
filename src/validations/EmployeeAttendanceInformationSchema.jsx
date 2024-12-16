import * as Yup from "yup";
export const EmployeeAttendanceInformationSchema = Yup.object({
  department_id: Yup.object().nullable(),
  punch_required: Yup.boolean().nullable(),
  cc_not_allowed: Yup.boolean().nullable(),
  overtime_default: Yup.number().nullable(),
  overtime_weekoff: Yup.number().nullable(),
  overtime_holiday: Yup.number().nullable(),
  weekoff_start_default: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .nullable(),
  weekoff_start_approved: Yup.object().nullable(),
});
