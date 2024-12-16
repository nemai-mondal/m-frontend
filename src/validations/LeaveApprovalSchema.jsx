import * as Yup from "yup";

export const LeaveApprovalSchema = Yup.object({
  remarks: Yup.string().max(250, "Remarks must be at most 250 characters."),
  email_ids: Yup.array().max(20, "Email can have a maximum of 20 members."),
});
