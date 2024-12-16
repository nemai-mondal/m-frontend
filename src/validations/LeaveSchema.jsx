import * as Yup from "yup";

const SUPPORTED_FORMATS = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/pdf",
  "image/jpeg",
  "image/jpg",
];

export const ApplyLeave = Yup.object({
  leave_type_id: Yup.object().required("Leave Type Is required."),
  leave_value_start: Yup.object().required("From Leave Value Is Required."),
  leave_value_end: Yup.object().required("To Leave Value Is Required."),
  from_date: Yup.date().required("From Date Is Required."),
  till_date: Yup.date()
    .required("Till Date Is Required.")
    .min(
      Yup.ref("from_date"),
      "Till Date must be equal or greater than From Date"
    ),
  remarks: Yup.string().max(250, "Remarks must be at most 250 characters."),
  email_notificaiton_to: Yup.array().max(
    20,
    "Email notification can have a maximum of 20 members."
  ),
  attachments: Yup.mixed()
    .test("Fichier taille", "File should not be more than 2MB", function () {
      const { size } = this.parent.attachments || {};
      return !size || (size && size <= 1024 * 1024 * 2);
    })
    .test(
      "format",
      "Upload correct file type 'DOC', 'Word', 'Docx', 'PDF', JPEG, JPG",
      function () {
        const { type } = this.parent.attachments || {};
        return !this.parent?.attachments?.name
          ? true
          : "" || !type
          ? false
          : "" || (type && SUPPORTED_FORMATS.includes(type));
      }
    ),
});
