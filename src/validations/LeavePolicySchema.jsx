import * as Yup from "yup";

export const leaveType = Yup.object({
  name: Yup.string()
    .required("Leave Type is required")
    .max(100, "Leave Name must be at most 100 characters"),
  abbreviation: Yup.string()
    .required("Abbreviation is required")
    .max(5, "Abbreviation must be at most 5 characters."),
  comment: Yup.string().max(250, "Description must be at most 250 characters."),
});

export const LeavePolicy = Yup.object({
  employment_type_id: Yup.object().required("Emploment Type is required"),
  leave_type_id: Yup.object().required("Leave Type is required"),
  leave_credit: Yup.string()
    .matches(/^1?\d+(\.\d)?$/, {
      message: "Leave credit must be a number with an optional '1' prefix.",
    })
    .required("Leave credit is required"),
});
