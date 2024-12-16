import * as Yup from "yup";

const SUPPORTED_FORMATS = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/pdf",
];

export const EmployeeDocumentSchema = Yup.object({
  files: Yup.array()
    .required()
    .max(5, "You can add maximum 5 file")
    .test({
      name: "fileValidation",
      test: function (files) {
        if (!files) {
          // No files
          return true;
        }

        // Check for invalid files
        const sizeError = files.some(
          (file) => file && file.size > 1024 * 1024 * 1024
        );
        const formatError = files.some((file) =>
          !file?.name
            ? false
            : "" || !file.type
            ? true
            : "" || (file && !SUPPORTED_FORMATS.includes(file.type))
        );

        // Generate separate error messages for size and format validation
        let errorMessage = "";
        if (sizeError) {
          errorMessage += "File size should not be more than 1GB. ";
        }
        if (formatError) {
          errorMessage +=
            "Unsupported file format. Please upload DOC, XLSX, XLS, or PDF files. ";
        }

        // Return true if no invalid files, else return a single error message
        return (
          errorMessage.length === 0 ||
          this.createError({ message: errorMessage })
        );
      },
    })
    .nullable(),
  related_to_ids: Yup.object().required("Document Owner Name Is Required"),
  document_type: Yup.object().required("Document Type Is Required"),
  issue_date: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .required("Issue Date Is Required"),
  expiry_date: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .required("Expiry Date Is Required")
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

  issue_place: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .trim()
    .nullable(),
  remarks: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .trim()
    .nullable(),
  document_no: Yup.string()
    .max(100, "Document no must be less than or equal 100")
    .trim()
    .required("Document No Is Required"),
});

export const EmployeeDocumentUpdateSchema = Yup.object({
  files: Yup.array()
    .nullable()
    .max(5, "You can add maximum 5 file")
    .test({
      name: "fileValidation",
      test: function (files) {
        if (!files) {
          // No files
          return true;
        }

        // Check for invalid files
        const sizeError = files.some(
          (file) => file && file.size > 1024 * 1024 * 1024
        );
        const formatError = files.some((file) =>
          !file?.name
            ? false
            : "" || !file.type
            ? true
            : "" || (file && !SUPPORTED_FORMATS.includes(file.type))
        );

        // Generate separate error messages for size and format validation
        let errorMessage = "";
        if (sizeError) {
          errorMessage += "File size should not be more than 1GB. ";
        }
        if (formatError) {
          errorMessage +=
            "Unsupported file format. Please upload DOC, XLSX, XLS, or PDF files. ";
        }

        // Return true if no invalid files, else return a single error message
        return (
          errorMessage.length === 0 ||
          this.createError({ message: errorMessage })
        );
      },
    })
    .nullable(),
  related_to_ids: Yup.object().required("Document Owner Name Is Required"),
  document_type: Yup.object().required("Document Type Is Required"),
  issue_date: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .required("Issue Date Is Required"),
  expiry_date: Yup.date()
    .min(new Date("1947-01-31"), "Date must be after 1946")
    .max(new Date("9999-12-31"), "Invalid date")
    .required("Expiry Date Is Required")
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

  issue_place: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .trim()
    .nullable(),
  remarks: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .trim()
    .nullable(),
  document_no: Yup.string()
    .max(100, "Document no must be less than or equal 100")
    .trim()
    .required("Document No Is Required"),
});
