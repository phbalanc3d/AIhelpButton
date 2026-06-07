
// cotext scraping logic
console.log("AZ Content Script Loaded");

const script = document.createElement("script");

script.src = chrome.runtime.getURL("hook.js");

(document.head || document.documentElement)
.appendChild(script);

script.onload = () => {
    script.remove();
};

window.addEventListener(
    "xhrDataFetched",
    (event) => {

        const res = JSON.parse(
            event.detail.response
        );

        window.azProblemContext = {
            title: res.data.title || "",

            description:
                res.data.body || "",

            inputFormat:
                res.data.input_format || "",

            outputFormat:
                res.data.output_format || "",

            constraints:
                res.data.constraints || "",

            hints:
                JSON.stringify(
                    res.data.hints || {}
                ),
            editorialCode:
              res.data.editorial_code || []
        };
        console.log(
            "Problem Context Loaded:",
            window.azProblemContext
        );
    }
);