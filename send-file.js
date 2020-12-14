import { join, extname } from "path";
import { promises } from "fs";
const extContentType = new Map([
    [".html", "text/html; charset=utf-8"],
    [".css", "text/css; charset=utf-8"],
    [".js", "text/javascript; charset=utf-8"],
    [".png", "image/png; charset=utf-8"],
]);
export const sendFile = async (url, res) => {
    const splittedUrl = url.split("/");
    const name = splittedUrl[splittedUrl.length - 1];
    const ext = extname(name);
    const contentType = extContentType.get(ext) || "";
    const filePath = join(...splittedUrl);
    const file = await promises.readFile(filePath, { encoding: "utf8" });
    res.setHeader("Content-Type", contentType);
    res.end(file);
};
//# sourceMappingURL=send-file.js.map