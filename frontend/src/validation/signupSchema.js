import * as yup from 'yup'

export const createSignupSchema = t => yup.object().shape({
  username: yup
    .string()
    .trim()
    .min(3, t('signupPage.validation.usernameLength'))
    .max(20, t('signupPage.validation.usernameLength'))
    .required(t('signupPage.validation.required')),
  password: yup
    .string()
    .min(6, t('signupPage.validation.passwordMin'))
    .required(t('signupPage.validation.required')),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password')], t('signupPage.validation.passwordsMatch'))
    .required(t('signupPage.validation.required')),
})
