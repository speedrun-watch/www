function handler(event) {
    var request = event.request;
    var headers = request.headers;
    var host = headers.host && headers.host.value;

    // Redirect www to apex
    if (host === "www.speedrun.watch") {
        return {
            statusCode: 301,
            statusDescription: "Moved Permanently",
            headers: {
                "location": { value: "https://speedrun.watch" + request.uri }
            }
        };
    }

    // Block requests with wrong Host (e.g. direct CF distribution-id access)
    if (host !== "speedrun.watch") {
        return {
            statusCode: 403,
            statusDescription: "Forbidden",
            headers: {
                "content-type": { value: "text/html" }
            },
            body: "Access Denied"
        };
    }

    // Rewrite extension-less paths to /index.html so prerendered sub-paths
    // (e.g. /terms-of-service/index.html) get served. Paths with extensions
    // (e.g. /assets/foo.js) pass through unchanged. Missing prerendered files
    // still fall back to /index.html via custom_error_response — this is the
    // SPA fallback for /dashboard, /login, etc.
    var uri = request.uri;
    if (uri.endsWith("/")) {
        request.uri = uri + "index.html";
    } else if (!uri.includes(".")) {
        request.uri = uri + "/index.html";
    }

    return request;
}
