import { z } from 'zod'

export const ContestDataSchema = z.array(z.object({
    title: z.string(),
    description: z.string(),
    problemNumber: z.number(),
    testcases: z.array(
        z.object({
            testCase: z.string(),
            result: z.string()
        })
    )
}))

export type ContestDataType = z.infer<typeof ContestDataSchema>


export const SubmissionDataSchema = z.object({
    problemId: z.string(),
    contestId: z.string(),
    code: z.string(),
    language: z.string()
})

export type SubmissionDataType = z.infer<typeof SubmissionDataSchema>


export const AuthSchema = z.object({
    username: z.email(),
    password: z.string().min(6),
    name: z.string()
})

export type AuthData = z.infer<typeof AuthSchema>