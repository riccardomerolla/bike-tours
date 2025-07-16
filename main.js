document.addEventListener("DOMContentLoaded", function() {
    // Find the placeholder element
    const footerPlaceholder = document.querySelector("#footer-placeholder");

    if (footerPlaceholder) {
        // Fetch the footer content from footer.html
        fetch("footer.html")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Could not load footer.");
                }
                return response.text();
            })
            .then(data => {
                // Insert the fetched HTML into the placeholder
                footerPlaceholder.innerHTML = data;
            })
            .catch(error => {
                console.error("Error fetching footer:", error);
                footerPlaceholder.innerHTML = "<p style='text-align:center;color:red;'>Footer could not be loaded.</p>";
            });
    }
});