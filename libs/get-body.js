import { concatBody } from "./concat-body.js";
export const getBody = (req) => {
    return concatBody(req)
        .then((body) => body.toString("utf8"))
        .then((text) => JSON.parse(text));
};
//# sourceMappingURL=get-body.js.map