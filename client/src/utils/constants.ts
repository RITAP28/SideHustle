interface language {
    language: string;
    version: string;
}

export const LANGUAGE_VERSIONS: language[] = [
    {
        language: "javascript",
        version: "18.15.0"
    },{
        language: "python",
        version: "3.10.0"
    },{
        language: "typescript",
        version: "5.0.3"
    },{
        language: "java",
        version: "15.0.3"
    },{
        language: "php",
        version: "8.2.3"
    }
]

export interface CodeSnippets {
    [key: string]: string;
}

export const CODE_SNIPPETS: CodeSnippets = {
    javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
    python: `\ndef greet(name): \n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
    typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
    java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\tSystem.out.println("Hello, World!");\n\t}\n}\n`,
    php: "<?php\n\n$name = 'Alex';\necho $name;\n"
};
