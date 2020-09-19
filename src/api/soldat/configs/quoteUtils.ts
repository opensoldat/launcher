// Each double-quote character inside the parameter will be replaced
// with a block of two double-quote characters (" => "").
// Apart from that, we add double-quote characters around the string.
const addQuotes = (value: string): string => {
    return `"${value.replace(/"/g, '""')}"`;
}

/* Soldat relies on Pascal's TStringList for parsing config files line by line.
 * TStringList has some fancy behavior for detecting strings inside strings, and
 * I don't really feel like rewriting their implementation in Javascript.
 * So, instead of that, we make the assumption that all strings in config files
 * (whether they contain one word, or many whitespace-separated words) will be
 * quoted with double-quote characters (").
 * Example:
 * '"bind" "ALT+S" "say Yeah"' => ['bind', 'ALT+S', 'say Yeah']
 * 
 * Just like with TStringList, if we want to have a double-quote character inside
 * a quoted string, we need to add two double-quote characters next to each other.
 * Example:
 * '"bind" "ALT+O" "say ""Follow me"""' => ['bind', 'ALT+O', 'say "Follow me"']
 * 
 * As for the reasoning behind all this stuff: initially, I thought it would be
 * enough to split all lines from config files with some whitespace character as
 * separator. I was pretty confident that only the action in "bind" command would
 * contain whitespace characters, and so when parsing config files, I thought I
 * could just extract the first two words ("bind" and the chosen key, like "ALT+S"),
 * and treat the rest of the line as "bind" command's action. I was proven wrong when
 * testing key bindings that contain spaces, like:
 * bind "Keypad 8" "say test"
 * Thus I realized that splitting config lines by whitespaces isn't really a great
 * solution, and decided to move to this other approach, which provides more
 * compatibility between launcher and Soldat itself.
 */
const splitQuotedStrings = (line: string): string[] => {
    const result: string[] = [];

    let startIndex: number;
    let isQuoted = false;
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
            if (!isQuoted) {
                isQuoted = true;
                startIndex = i;
                continue;
            } else {
                /* If we found two double-quote characters next to each other
                 * while being inside a quoted string, we just skip them.
                 * We will later convert this block into a single double-quote character,
                 * just like it's done in Pascal. */ 
                if (i + 1 < line.length && line[i + 1] === '"') {
                    i++;
                    continue;
                }

                // Remove outer quote characters, and replace blocks of two
                // double-quote characters with a single double-quote character.
                const quotedString = line.substring(startIndex + 1, i).replace(/""/g, '"');
                result.push(quotedString);
                isQuoted = false;
            }
        }
    }

    return result;
}

export { addQuotes, splitQuotedStrings };