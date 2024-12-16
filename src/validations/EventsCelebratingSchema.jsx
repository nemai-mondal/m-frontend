import * as Yup from "yup";
export const EventsCelebratingSchema = Yup.object({
  message: Yup.string()
    .trim()
    .max(100, "Character must be equal or less than 100")
    .required("Wish Message Required"),
});
