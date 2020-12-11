import { ServerResponse } from "http";
import { join, extname } from "path";
import { promises } from "fs";

const extContentType = new Map<string, string>([
    [".html", "text/html; charset=utf-8"],
    [".css", "text/css; charset=utf-8"],
    [".js", "text/javascript; charset=utf-8"],
    [".png", "image/png; charset=utf-8"],
]);

export const sendFile = async (url: string, res: ServerResponse) => {
    const splittedUrl: string[] = url.split("/");
    const name: string = splittedUrl[splittedUrl.length - 1];
    const ext: string = extname(name);
    const contentType: string = extContentType.get(ext) || "";
    const filePath: string = join(...splittedUrl);
    const file: string = await promises.readFile(filePath, {encoding: "utf8"});
    res.setHeader("Content-Type", contentType);
    res.end(file);
};
