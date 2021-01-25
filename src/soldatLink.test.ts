import { parseSoldatLink } from "./soldatLink";

interface ParseTestCase {
    input: string;
    expectedIp: string;
    expectedPort: string;
    expectedPassword: string;
}

const testCases: ParseTestCase[] = [
    {
        input: "soldat://127.0.0.1:23073/serverpass",
        expectedIp: "127.0.0.1",
        expectedPort: "23073",
        expectedPassword: "serverpass"
    },
    {
        input: "soldat://1.1.1.1",
        expectedIp: "1.1.1.1",
        expectedPort: "",
        expectedPassword: ""
    },
    {
        input: "soldat://2.2.2.2:23090",
        expectedIp: "2.2.2.2",
        expectedPort: "23090",
        expectedPassword: ""
    },
    {
        input: "soldat://3.3.3.3/pass",
        expectedIp: "3.3.3.3",
        expectedPort: "",
        expectedPassword: "pass"
    },
    {
        input: "soldat://4.4.4.4/",
        expectedIp: "4.4.4.4",
        expectedPort: "",
        expectedPassword: ""
    },
    {
        input: "soldat://5.5.5.5:20000/",
        expectedIp: "5.5.5.5",
        expectedPort: "20000",
        expectedPassword: ""
    }
]

testCases.forEach(testCase => {
    test(`Parses ${testCase.input} link correctly`, () => {
        const parsedLink = parseSoldatLink(testCase.input);

        expect(parsedLink.ip).toStrictEqual(testCase.expectedIp);
        expect(parsedLink.port).toStrictEqual(testCase.expectedPort);
        expect(parsedLink.password).toStrictEqual(testCase.expectedPassword);
    });
})