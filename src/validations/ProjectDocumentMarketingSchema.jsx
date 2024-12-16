import * as Yup from "yup";

const SUPPORTED_FORMATS = [
  "application/msword",
  "application/pdf",
  "application/vnd.ms-excel",
];
export const ProjectDocumentMarketingSchema = Yup.object({
  description: Yup.string()
    .trim()
    .max(100, "Character must be less than or equal 100")
    .nullable(),
  name: Yup.string()
    .trim()
    .max(80, "Character must be less than or equal 80")
    .nullable(),
  file: Yup.mixed()
    .required("File Required")
    .test(
      "Fichier taille",
      "File should not be more than 5mb",
      function (value) {
        const { size } = this.parent.file || {};
        return !size || (size && size <= 1024 * 1024 * 25);
      }
    )
    .test(
      "format",
      "Upload correct file type 'DOC', 'PDF' and 'XLS' ",
      function (value) {
        const { type } = this.parent.file || {};
        return !this.parent?.file?.name
          ? true
          : "" || !type
          ? false
          : "" || (type && SUPPORTED_FORMATS.includes(type));
      }
    )
    .required("File Required"),
});
