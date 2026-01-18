Project Technical Report: Solving Data Integrity & Connectivity

This project is a Next.js application that interfaces with the Open Food Facts (OFF) API. Throughout development, I encountered significant hurdles regarding how the API processes search queries versus direct barcode lookups.
1. The Core Problem: Search vs. Direct Lookup

The primary issue was a conflict between the Search API (/cgi/search.pl) and the Product API (/api/v0/product/).

    The Conflict: Users often entered barcodes into the general search bar. The legacy search script (search.pl) treats numeric strings with extra characters—like 6111242100992(EAN/EAN-13)—as a text search.

    The Result: This caused the server to perform a complex database scan which often timed out (504 Gateway Timeout) or resulted in an empty product array.

2. Methodology: Multi-Layer Sanitization

To solve this, I implemented a logic branch inside fetchProducts that detects the intent of the user's query before sending the request.
A. Local Input Sanitization

I used a Regular Expression (\D) to strip all non-digit characters from the search query. This ensures that even if a user pastes a barcode with metadata, the application extracts the raw numeric key.

`
const numericOnly = query.replace(/\D/g, ''); 
const isBarcode = numericOnly.length >= 8 && numericOnly.length <= 14;
`

B. API Routing Logic

Instead of sending everything to the Search API, I implemented an Internal Router:

    If it's a Barcode: Route to api/v0/product/{barcode}.json. This is a direct Key-Value lookup, which is significantly faster and more reliable than a search query.

    If it's Text: Route to cgi/search.pl?search_terms={query} for natural language processing.

3. Resolving CORS and 504 Timeouts

The browser console frequently reported CORS Missing Allow Origin. My investigation revealed that this was a symptom, not the cause.

    The Discovery: When the Open Food Facts server received "noisy" characters (parentheses or slashes) in the URL, it crashed with a 504 Gateway Timeout.

    The Browser Behavior: Because a 504 error page is a generic server response, it does not include the standard API CORS headers. The browser, seeing no headers, assumed a security violation.

    The Solution: By cleaning the string before the fetch, the server responded with a 200 OK. Successful responses from OFF include the correct headers, causing the "CORS error" to disappear without needing server-side changes.

4. Stability & Functionality Preservation

A strict "Preservation of Utilities" policy was adopted to ensure that fixing the search logic did not break other pages.

    Restoration of fetchProductByBarcode: This function was dedicated to the Product Detail pages, ensuring they remain isolated from the Home Page's search logic.

    Utility Retention: The getNutrient helper was standardized to handle missing data gracefully, preventing UI crashes when a product lacks specific macro-nutrients.
