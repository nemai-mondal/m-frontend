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
export const ElectionSchema = Yup.object({
  number: Yup.string()
    .trim()
    .min(10, "The Election card no must be 10 characters")
    .max(10, "The Election card no must be 10 characters")
    .required("Election card number required"),
  file: Yup.mixed()
    .required("File Is Required")
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
    .required("Name Is Required"),
});
