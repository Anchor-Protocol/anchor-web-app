export const jsonToBase64 = (obj: object): string => (
    Buffer
        .from(JSON.stringify(obj))
        .toString("base64")
)