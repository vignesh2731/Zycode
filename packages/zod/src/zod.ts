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


export type SubmissionStatusType = {
    problemId:string,
    contestId:string,
    userId: number,
    type: "submission_status",
    accepted : boolean,
    name ?: string,
    winner ?:string,
    ended :boolean
} 

export type WebSocketRegisterType = {
    type: "init",
    userId: number,
    contestId: string
}

export type WebSocketContestStartType = Omit<WebSocketRegisterType,'type'> & {type: 'contest_started'}


export type WebSocketDataType = SubmissionStatusType| WebSocketRegisterType | WebSocketContestStartType;