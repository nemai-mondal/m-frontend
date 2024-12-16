import * as Yup from "yup";

const SUPPORTED_FORMATS = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/pdf",
];

export const HrDocumentSchema = Yup.object({
  name: Yup.string()
    .max(80, "Character must be less than or equal 80")
    .required("Name is required"),
  description: Yup.string()
    .max(100, "Character must be less than or equal 100")
    .required(),
  file: Yup.mixed()
    .required("File required")

    .test("Fichier taille", "File should not be more than 25MB", function () {
      const { size } = this.parent.file || {  };
      return !size || (size && size <= 1024 * 1024 * 25);
    })
    .test(
      "format",
      "Upload correct file type 'DOC', 'Word', 'Docx', 'PDF', xlx, xlsx",
      function () {
        const { type } = this.parent.file || {};
        return !this.parent?.file?.name
          ? true
          : "" || !type
          ? false
          : "" || (type && SUPPORTED_FORMATS.includes(type));
      }
    ),
});
