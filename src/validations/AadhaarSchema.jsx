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

export const AadhaarSchema = Yup.object({
  adhaar_no: Yup.string()
    .min(12, "The adhaar no must be 12 characters")
    .max(12, "The adhaar no must be 12 characters")
    .required("Aadhaar number required"),
  enrollment_no: Yup.string()
    .min(14, "The enrollment no must be 14 characters")
    .max(14, "The enrollment no must be 14 characters")
    .nullable(),
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
