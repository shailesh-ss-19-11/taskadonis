import { rules, schema } from "@adonisjs/validator"


export const SignupSchema = schema.create({
  name: schema.string({ trim: true }, [rules.minLength(2)]),
  email: schema.string({ trim: true }, [rules.email()]),
  password: schema.string({}, [rules.minLength(8)]),
})

export const LoginSchema = schema.create({
  email: schema.string({ trim: true }, [rules.email()]),
  password: schema.string({}, [rules.minLength(8)]),
})
