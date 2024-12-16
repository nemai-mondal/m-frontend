import * as Yup from "yup";
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
export const QuoteSchema = Yup.object({
  quote: Yup.string()
    .trim()
    .max(150, "Character must be less than or equal 150")
    .required("Quote Is Required"),
  said_by: Yup.string()
    .trim()
    .max(100, "Character must be less than or equal 100")
    .required("Author Name Is Required"),
  image: Yup.mixed()
    .nullable()
    .test(
      "Fichier taille",
      "File should not be more than 2mb",
      function (value) {
        const { size } = this.parent.image || {};
        return !size || (size && size <= 1024 * 1024 * 2);
      }
    )
    .test(
      "format",
      "Upload correct file type 'JPG','JPEG','PNG'",
      function (value) {
        const { type } = this.parent.image || {};
        return !this.parent?.image?.name
          ? true
          : "" || !type
          ? false
          : "" || (type && SUPPORTED_FORMATS.includes(type));
      }
    ),
});
