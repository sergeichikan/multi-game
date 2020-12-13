import { IncomingMessage } from "http";

import { concatBody } from "./concat-body.js";

export const getBody = <T = unknown>(req: IncomingMessage): Promise<T> => {
    return concatBody(req)
        .then((body: Buffer): string => body.toString("utf8"))
        .then((text: string) => JSON.parse(text));
};
