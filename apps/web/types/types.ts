export type QuestionDetails = {
    title: string;
    description: string;
    testcase: TestCase[]
}

export type TestCase = {
    testcase: string;
    result: string;
}