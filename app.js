console.log("running");

const apiURL = "https://codeforces.com/api/problemset.problems";
let currentPage = 1;
const problemsPerPage = 10;

function fetchAndDisplayProblems(page) {
    const startIdx = (page - 1) * problemsPerPage;
    const endIdx = startIdx + problemsPerPage;

    fetch(apiURL)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            console.log("API Response:", data);

            if (
                !data ||
                !data.result ||
                !data.result.problems ||
                !data.result.problemStatistics
            ) {
                throw new Error("No problems data found");
            }

            const problems = data.result.problems;
            const problemStatistics = data.result.problemStatistics;

            const tableBody = document.querySelector("#table tbody");
            tableBody.innerHTML = "";

            for (let i = startIdx; i < Math.min(endIdx, problems.length); i++) {
                const problem = problems[i];
                const problemStat = problemStatistics.find(
                    (stat) =>
                        stat.contestId === problem.contestId && stat.index === problem.index
                );
                displayProblem(problem, problemStat, tableBody);
            }

            const pageCount = Math.ceil(problems.length / problemsPerPage);
            document.getElementById("pageCount").textContent = `Page ${currentPage} of ${pageCount}`;
        })
        .catch((error) => {
            console.error("Error fetching or parsing data:", error);
        });
}

function displayProblem(problem, problemStat, tableBody) {
    const row = document.createElement("tr");
    row.classList.add("hover:bg-base-200", "border-2");


    const contestIdCell = document.createElement("td");
    contestIdCell.textContent = problem.contestId + problem.index;
    contestIdCell.classList.add("px-12", "mb-10", "border-r", "font-semibold");

    const nameCell = document.createElement("td");
    nameCell.classList.add("px-12", "mb-10", "border-r", "font-semibold");

    const nameAnchor = document.createElement("a");
    nameAnchor.href = `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`;
    nameAnchor.textContent = problem.name;
    nameCell.appendChild(nameAnchor);

    const solveCountCell = document.createElement("td");
    solveCountCell.classList.add("px-16", "mb-10", "border-r", "font-semibold");

    solveCountCell.innerHTML = problemStat
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-check" viewBox="0 0 16 16">
            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
            <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
        </svg> ${problemStat.solvedCount}`
        : "Unknown";

    const tagsCell = document.createElement("td");
    tagsCell.classList.add("px-12", "mb-10", "border-r", "font-semibold");

    tagsCell.textContent = problem.tags.join(", #");

    row.appendChild(contestIdCell);
    row.appendChild(nameCell);
    row.appendChild(solveCountCell);
    row.appendChild(tagsCell);

    tableBody.appendChild(row);
}


fetchAndDisplayProblems(currentPage);


document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        fetchAndDisplayProblems(currentPage);
    }
});

document.getElementById("nextBtn").addEventListener("click", () => {
    currentPage++;
    fetchAndDisplayProblems(currentPage);
});












