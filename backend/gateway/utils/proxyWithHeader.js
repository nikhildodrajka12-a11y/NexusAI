import proxy from "express-http-proxy"

export const proxyWithHeader = (serviceUrl) => {
    return proxy(serviceUrl, {
        // Do NOT let express-http-proxy parse/reconstruct the request body.
        // Its default body-parsing only understands JSON/urlencoded bodies —
        // for multipart/form-data (our PDF uploads), it mangles or drops the
        // file entirely before forwarding. parseReqBody: false makes it pipe
        // the raw request stream straight through, byte-for-byte, so multer
        // on the agent service receives the file intact.
        parseReqBody: false,
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            if (srcReq.user) {
                proxyReqOpts.headers["x-user-id"] = srcReq.user.userId
            }
            return proxyReqOpts
        }
    })
}