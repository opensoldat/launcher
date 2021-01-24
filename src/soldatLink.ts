const SOLDAT_PROTOCOL = "soldat";
const SOLDAT_LINK_PREFIX = `${SOLDAT_PROTOCOL}://`;

function isSoldatLink(value: string): boolean {
    return value?.startsWith(SOLDAT_LINK_PREFIX);
}

interface SoldatLink {
    ip: string;
    port: string;
    password: string;
}

function parseSoldatLink(value: string): SoldatLink {
    if (!isSoldatLink(value)) {
        return null;
    }

    const link = value.slice(SOLDAT_LINK_PREFIX.length);
    const portSeparator = ":", passwordSeparator = "/";
    const portSeparatorIdx = link.indexOf(portSeparator);
    const passwordSeparatorIdx = link.indexOf(passwordSeparator);

    let ip = "";
    if (portSeparatorIdx >= 0) {
        ip = link.substring(0, portSeparatorIdx);
    } else {
        if (passwordSeparatorIdx >= 0) {
            ip = link.substring(0, passwordSeparatorIdx);
        } else {
            ip = link;
        }
    }

    let port = "";
    if (portSeparatorIdx >= 0) {
        if (passwordSeparatorIdx >= 0) {
            port = link.substring(portSeparatorIdx + 1, passwordSeparatorIdx);
        } else {
            port = link.substring(portSeparatorIdx + 1)
        }
    }

    let password = "";
    if (passwordSeparatorIdx >= 0) {
        password = link.substring(passwordSeparatorIdx + 1);
    }

    return { ip, port, password }
}

export {
    isSoldatLink,
    parseSoldatLink,
    SOLDAT_PROTOCOL
}