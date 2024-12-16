import * as Yup from "yup";
const SUPPORTED_FORMATS = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/pdf",
  "image/jpg",
  "image/jpeg",
  "image/png",
];

export const PassportSchema = Yup.object({
  issue_date: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    // .max(
    //   moment(),
    //   "Issue date should not be after today date"
    // )
    .required("Issue date required"),

  expiry_date: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .required("Expiry date required")
    .when("issue_date", (issue_date, schema) => {
      return issue_date && !isNaN(new Date(issue_date))
        ? schema.min(
            new Date(
              new Date(issue_date).setDate(new Date(issue_date).getDate() + 1)
            ),
            "Expiry date must be after the issue date"
          )
        : schema;
    }),

  country: Yup.string()
    .trim()
    .max(100, "Character must be less than or equal 100")
    .required("Country required"),
  number: Yup.string()
    .trim()
    .min(15, "The Passport no must be 15 characters")
    .max(15, "The Passport no must be 15 characters")
    .required("Passport number required"),
  file: Yup.mixed()
    .required("File required")
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
      "Upload correct file type 'DOC', 'XLSX', 'XLS', 'PDF' ,'JPG','JPEG','PNG'",
      function (value) {
        const { type } = this.parent.file || {};
        return !this.parent?.file?.name
          ? true
          : "" || !type
          ? false
          : "" || (type && SUPPORTED_FORMATS.includes(type));
      }
    ),
  name: Yup.string()
    .trim()
    .max(100, "Character must be less than or equal 100")
    .required("Name required"),
});
