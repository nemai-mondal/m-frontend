import * as Yup from "yup";

const SUPPORTED_FORMATS = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/pdf",
];
export const ProjectDocumentDevSchema = Yup.object({
  description: Yup.string()
    .trim()
    .max(100, "Character must be less than or equal 100")
    .nullable(),
  name: Yup.string()
    .trim()
    .max(80, "Character must be less than or equal 80")
    .required("Name Is Required"),
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
      "Upload correct file type 'DOC', 'DOCX' , 'PDF' , 'XLS' and 'XLSX'",
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
