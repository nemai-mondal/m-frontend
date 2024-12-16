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

export const SalesDocumentSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string()
    .required()
    .max(250, "Description must be at most 250 characters."),
  file: Yup.mixed()
    .required("File required")

    .test("Fichier taille", "File should not be more than 1gb", function () {
      const { size } = this.parent.file || {};
      return !size || (size && size <= 1024 * 1024 * 25);
    })
    .test(
      "format",
      "Upload correct file type 'DOC', 'Word', 'Docx', 'PDF' ,'JPG','JPEG'",
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
