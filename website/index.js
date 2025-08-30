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

    const owner = pathNames[0]; // username/org
    const repo = pathNames[1]; // repository name

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
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`; // API URL Metadata
  const readmeUrl = `${apiUrl}/readme`; // README
  const gitignoreUrl = `${apiUrl}/contents/.gitignore`; // .gitignore
  const commitsUrl = `${apiUrl}/commits?per_page=1`; // Commits - URL for retrieving latest commit
  const workflowsUrl = `${apiUrl}/contents/.github/workflows`; // Workflows directory
  let fetchDict = {};

  try {
    // 1. Main repo data (will always exist) - will check for license within the json
    const repoData = await fetchJsonOrThrow(apiUrl);
    fetchDict["repoData"] = repoData;
    // 2. README (optional)
    const readmeData = await fetchIfExists(readmeUrl);
    fetchDict["readmeData"] = readmeData;
    // 3. Gitignore (optional)
    const gitignoreData = await fetchIfExists(gitignoreUrl);
    fetchDict["gitignoreData"] = gitignoreData;
    // 4. Commits (must exist)
    const commitsData = await fetchJsonOrThrow(commitsUrl);
    const latestCommit = commitsData[0]; // Gets the first and only commit
    const commitDate = latestCommit.commit.author.date; // ISO string
    const readableCommitDate = new Date(commitDate).toLocaleString();
    fetchDict["readableCommitDate"] = readableCommitDate;
    // 5. Workflows (optional)
    const workflowData = await fetchIfExists(workflowsUrl);
    fetchDict["workflowData"] = workflowData;

    // If error is thrown, catch it
  } catch (error) {
    throw new Error(`Failed to fetch repository data. Check the URL: ${error.message}`);
  }

  console.log(fetchDict);
  const checklistDictionary = checkBestPractices(fetchDict);
  console.log(checklistDictionary);
  displayData(checklistDictionary, element);
}

// Fetch helper - throws if required
async function fetchJsonOrThrow(url) {
  const response = await fetch(url); // Makes an HTTP GET request to the GitHub API & GitHub's API returns JSON data
  // Precaution step if bad response
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return await response.json(); // Reading the response's body and parses it as JSON
}

// Fetch helper: returns false if optional resouce not found (meaning missing)
async function fetchIfExists(url) {
  const response = await fetch(url);
  if (response.status === 404) {
    return false; // resouce missing
  }
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return await response.json();
}

function checkBestPractices(data) {
  let checklistDict = {};

  for (let key in data) {
    // Checking for a License file
    if (key === "repoData") {
      if (data[key].license !== null) {
        checklistDict["LICENSE"] = "Found";
      } else {
        checklistDict["LICENSE"] = "Missing";
      }
      // Checking for a README.md file
    } else if (key === "readmeData") {
      if (data[key] !== false) {
        checklistDict["README.md"] = "Found";
      } else {
        checklistDict["README.md"] = "Missing";
      }
      // Checking for a .gitignore file
    } else if (key === "gitignoreData") {
      if (data[key] !== false) {
        checklistDict[".gitignore"] = "Found";
      } else {
        checklistDict[".gitignore"] = "Missing";
      }
      // Checking if a commit was made in the last 6 months
    } else if (key === "readableCommitDate") {
      const today = new Date(); // Finding current date

      const commitDate = new Date(data[key]); // Turning commit date into date object

      // Finding the six months ago mark
      const sixMonths = new Date(today);
      sixMonths.setMonth(today.getMonth() - 6);

      const isWithinSixMonths = commitDate >= sixMonths; // Seeing if commit was pushed within the last 6 months

      if (isWithinSixMonths) {
        checklistDict["Recently Committed"] = "Yes";
      } else {
        checklistDict["Recently Committed"] = "No";
      }
      // Checking for a .github/workflows directory
    } else {
      console.log(data[key]);
      if (data[key] === false) {
        checklistDict[".github/workflows"] = "Missing";
      } else {
        checklistDict[".github/workflows"] = "Found";
      }
    }
  }
  return checklistDict;
}

// **In Progress**
function displayData(checklist, element) {
  for (const key in checklist) {
    const li = document.createElement("li");
    li.innerHTML = `${key}: ${checklist[key]}`;
    element.append(li);
  }
}
