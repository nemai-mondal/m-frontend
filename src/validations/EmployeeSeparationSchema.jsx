import * as Yup from "yup";

const SUPPORTED_FORMATS = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/pdf",
  // "image/jpg",
  // "image/jpeg",
  // "image/png",
];

export const EmployeeSeparationSchema = Yup.object({
  date_of_joining: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .required("Joining Date Is Required"),
  year_of_service: Yup.string().max(6,"Value length can't be grater than 6").required("Year Of Service Is Required"),
  submission_date: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .required("Submission Date Is Required"),
  lwd_expected: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .nullable(),
  lwd_after_serving_notice: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .required("Leaving Date Is Required"),
  file: Yup.mixed()
    .nullable()
    .test(
      "Fichier taille",
      "File should not be more than 1gb",
      function (value) {
        const { size } = this.parent.file || {};
        return !size || (size && size <= 1024 * 1024 * 1024);
      }
    )
    .test(
      "format",
      "'DOC', 'XLSX', 'XLS', 'PDF' Supported",
      function (value) {
        const { type } = this.parent.file || {};
        return !this.parent?.file?.name
          ? true
          : "" || !type
          ? false
          : "" || (type && SUPPORTED_FORMATS.includes(type));
      }
    ),
  remarks: Yup.string()
    .trim()
    .max(100, "Character must be less than or equal 100")
    .nullable(),
});
