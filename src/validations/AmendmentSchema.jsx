import * as Yup from "yup";

const SUPPORTED_FORMATS = ["application/msword", "application/pdf"];

export const AmendmentSchema = Yup.object({
  name: Yup.string()
    .trim()
    .max(70, "Character must be less than or equal 70")
    .required("Name Required"),
  file: Yup.mixed()
    .required("File Required")
    .test(
      "Fichier taille",
      "File should not be more than 5mb",
      function (value) {
        const { size } = this.parent.file || {};
        return !size || (size && size <= 1024 * 1024 * 5);
      }
    )
    .test(
      "format",
      "Upload correct file type 'DOC' and 'PDF' ",
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
