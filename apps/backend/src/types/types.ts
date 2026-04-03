import type { Request } from "express";

export interface CustomRequest extends Request{
    id ?: number
}

export interface ContestData{
    title: string,
    description:string,
    problemNumber: number,
    testcases:{
        testCase: string,
        result:string,
    }[]
}