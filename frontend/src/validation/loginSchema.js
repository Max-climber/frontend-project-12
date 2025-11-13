import * as yup from 'yup'

export const createLoginSchema = (t) => yup.object().shape({
  username: yup
    .string()
    .trim()
    .required(t('loginPage.validation.required')),
  password: yup
    .string()
    .required(t('loginPage.validation.required')),
})

