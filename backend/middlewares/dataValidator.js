const zod = require('zod')

const signUpSchema = zod.object({
  username: zod.string().email(), 
  password: zod.string(),
  firstname: zod.string(),
  lastname: zod.string()
})

const signInSchema = zod.object({
  username: zod.string().email(),
  password: zod.string()
});

const updateSchema = zod.object({
  password: zod.string().optional(),
  firstname: zod.string().optional(),
  lastname: zod.string().optional()
})

module.exports = { signUpSchema, signInSchema, updateSchema};
