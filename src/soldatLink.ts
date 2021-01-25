const SOLDAT_PROTOCOL = "soldat";
const SOLDAT_LINK_PREFIX = `${SOLDAT_PROTOCOL}://`;
const PORT_SEPARATOR = ":", PASSWORD_SEPARATOR = "/";

interface SoldatLink {
    ip: string;
    port?: string;
    password?: string;
}

function isSoldatLink(value: string): boolean {
    return value?.startsWith(SOLDAT_LINK_PREFIX);
}

function parseSoldatLink(value: string): SoldatLink {
    if (!isSoldatLink(value)) {
        return null;
    }

    const link = value.slice(SOLDAT_LINK_PREFIX.length);
    const portSeparatorIdx = link.indexOf(PORT_SEPARATOR);
    const passwordSeparatorIdx = link.indexOf(PASSWORD_SEPARATOR);

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

function soldatLinkToString(link: SoldatLink): string {
    if (!link) {
        return "";
    }

    let res = SOLDAT_LINK_PREFIX;
    if (link.ip?.length > 0) {
        res += link.ip;
    }
    if (link.port?.length > 0) {
        res += `${PORT_SEPARATOR}${link.port}`;
    }
    if (link.password?.length > 0) {
        res += `${PASSWORD_SEPARATOR}${link.password}`;
    }
    return res;
}

export {
    isSoldatLink,
    parseSoldatLink,
    soldatLinkToString,
    SOLDAT_PROTOCOL
}