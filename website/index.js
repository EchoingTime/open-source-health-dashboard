/* 
@File: index.js
@Author: Dante Anzalone
@Created: 2025-08-28
@Last Modified: 2025-08-29
@Description: Implements interactivity and application logic for the Open Source Health Dashboard.
*/

// On form submission, trigger formHandler
document.getElementById("repo-form").addEventListener("submit", formHandler);

/**
 * @function formHandler
 * @description Handles the repository form submission by parsing the input URL
 *              and triggering a data fetch for repository information.
 * @param {Event} event - The submit event via the HTML repository form.
 * @returns {Promise<void>} Resolves when repository data has been successfully fetched.
 * @throws {Error} If the respitory URL is invalid or data fetching fails.
 */
async function formHandler(event) {
  // Prevent default form behavior (page reload and server submission)
  event.preventDefault();

  const repoUrlReference = document.getElementById("repo-url");
  const url = repoUrlReference.value;
  const repoData = document.getElementById("checklist");

  try {
    // Parsing URL to retrieve owner and repo
    const { owner, repo } = parseUrl(url);
    await fetchData(owner, repo, repoData);
  } catch (error) {
    alert(error.message);
    console.error("Error:", error);
  }
}

/**
 * @function parseUrl
 * @description Takes in a string parameter representing a Github Repository
 *              URL and uses an URL constructor to extract the pathname and split
 *              it to obtain the owner and repo. Validation is included to ensure
 *              that it is a GitHub URL.
 * @param {string} url A GitHub Repository Url.
 * @returns {strings} Returns the Repository's owner and name.
 * @throws {Error} If URL is not from github.com or has invalid format.
 */
function parseUrl(url) {
  try {
    const parsedUrl = new URL(url);

    // Github URL validation
    if (parsedUrl.hostname !== "github.com" && parsedUrl.hostname !== "www.github.com") {
      throw new Error("Invalid URL: This is not a Github repository link.");
    }

    // Splits the pathname for owner and repo name extraction
    const pathNames = parsedUrl.pathname.split("/").filter((part) => part.length > 0);

    // Format validation
    if (pathNames.length < 2) {
      throw new Error('Invalid repository URL format. Must use the format "https://github.com/owner/repo".');
    }

    const owner = pathNames[0];
    const repo = pathNames[1];

    return { owner, repo };
  } catch (e) {
    // If URL constructor fails, re-throw with a message
    if (e instanceof TypeError) {
      throw new Error("Invalid URL format. Must enter a valid URL.");
    }
    throw e;
  }
}

// **In Progress**
async function fetchData(owner, repo, element) {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    displayData(data, element);
  } catch (error) {
    throw new Error(`Failed to fetch repository data. Check the URL: ${error.message}`);
  }
}

// **In Progress**
function displayData(data, element) {
  element.innerHTML = `
    <h2><a href="${data.html_url}" target="_blank">${data.full_name}</a></h2>
    <p><strong>Description:</strong> ${data.description || "No description provided."}</p>
    <p><strong>Language:</strong> ${data.language || "N/A"}</p>
    <p><strong>Stars:</strong> ${data.stargazers_count}</p>
    <p><strong>Forks:</strong> ${data.forks_count}</p>
    <p><strong>Open Issues:</strong> ${data.open_issues_count}</p>
    <p><strong>Default Branch:</strong> ${data.default_branch}</p>
  `;
}
