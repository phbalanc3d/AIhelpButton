if (!window.hasHookedXMLHttpRequest) {

    window.hasHookedXMLHttpRequest = true;

    console.log("HOOK INSTALLED");

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (
        method,
        url,
        async,
        user,
        password
    ) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {

        console.log("XHR:", this._url);

        this.addEventListener("load", function () {

            if (
                this._url &&
                this._url.includes(
                    "https://api2.maang.in/problems/user/"
                )
            ) {

                console.log("FOUND PROBLEM API");

                window.dispatchEvent(
                    new CustomEvent(
                        "xhrDataFetched",
                        {
                            detail: {
                                url: this._url,
                                status: this.status,
                                response: this.responseText
                            }
                        }
                    )
                );
            }
        });

        return originalSend.apply(this, arguments);
    };
}