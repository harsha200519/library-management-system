// Hardcoded credentials for student and teacher login
const studentCredentials = {
  "22e51a0234": "nashmitha",
  "22e51a0208": "abhishek",
  "22e51a0231": "mahesh",
  "22e51a0201": "ganesh"
};

const teacherCredentials = {
  "rdbms.eee": "pranathi",
  "chiranjeevi": "chiranjeevi"
};

// Shared books data (for both students and teachers)
let books = [
  "Electric Circuits by James W. Nilsson",
  "Power System Analysis by John Grainger",
  "Digital Signal Processing by Alan V. Oppenheim",
  "Control Systems Engineering by Norman Nise",
  "Electrical Machines by P.S. Bimbhra",
  "Electromagnetics by William Hayt",
  "Renewable Energy Systems by Godfrey Boyle",
  "High Voltage Engineering by E. Kuffel",
  "Electrical Measurements by A.K. Sawhney",
  "Switchgear and Protection by Sunil Rao"
];

// Initialize borrowedBooks from localStorage
let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];

// Function to handle login for both Student and Teacher
function login(userType) {
  const usernameField = document.getElementById(`${userType}-username`);
  const passwordField = document.getElementById(`${userType}-password`);
  const username = usernameField.value;
  const password = passwordField.value;

  if (userType === "student" && studentCredentials[username] === password) {
    alert("Login successful as Student!");
    localStorage.setItem("role", "student");
    window.location.href = "student.html"; // Navigate to student dashboard
  } else if (userType === "teacher" && teacherCredentials[username] === password) {
    alert("Login successful as Teacher!");
    localStorage.setItem("role", "teacher");
    window.location.href = "teacher.html"; // Navigate to teacher dashboard
  } else {
    alert("Invalid credentials. Please try again.");
  }
}

// Function to populate available books list (For Students)
function populateAvailableBooks() {
  const availableBooksList = document.getElementById("available-books-list");
  if (availableBooksList) {
    availableBooksList.innerHTML = books
      .filter(book => !borrowedBooks.some(b => b.book === book))
      .map(book => `<li><span>${book}</span><button onclick="borrowBook('${book}')">Borrow</button></li>`)
      .join("");
  }
}

// Function to borrow a book (For Students)
function borrowBook(book) {
  const studentID = prompt("Enter your student ID:");
  if (!studentID) return;

  if (borrowedBooks.some(b => b.book === book && b.studentID === studentID)) {
    alert("You have already borrowed this book.");
    return;
  }

  borrowedBooks.push({ book, studentID, time: new Date().toLocaleString() });
  localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
  updateBorrowedList();
  populateAvailableBooks();
}

// Function to return a borrowed book (For Students)
function returnBook(index) {
  borrowedBooks.splice(index, 1);
  localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
  updateBorrowedList();
  populateAvailableBooks();
}

// Function to update the borrowed books list (For Students)
function updateBorrowedList() {
  const borrowedBooksList = document.getElementById("borrowed-books-list");
  const borrowedCount = document.getElementById("borrowed-count");

  if (borrowedBooksList) {
    borrowedBooksList.innerHTML = borrowedBooks
      .map(
        (book, index) =>
          `<li>
            <span>${book.book} (Borrowed: ${book.time})</span>
            <span>Student ID: ${book.studentID}</span>
            <button onclick="returnBook(${index})">Return</button>
          </li>`
      )
      .join("");
  }

  if (borrowedCount) {
    borrowedCount.textContent = borrowedBooks.length;
  }
}

// Function to filter books based on search query (For Students)
function filterBooks() {
  const query = document.getElementById("search-bar").value.toLowerCase();
  const availableBooksList = document.getElementById("available-books-list");

  if (availableBooksList) {
    availableBooksList.innerHTML = books
      .filter(book => book.toLowerCase().includes(query) && !borrowedBooks.some(b => b.book === book))
      .map(book => `<li><span>${book}</span><button onclick="borrowBook('${book}')">Borrow</button></li>`)
      .join("");
  }
}

// Teacher Functions (Add/Remove books and view borrowed records)
function populateBooksForTeacher() {
  const booksList = document.getElementById("books-list");
  if (booksList) {
    booksList.innerHTML = books
      .map(
        (book, index) =>
          `<li>
            <span>${book}</span>
            <button onclick="removeBook(${index})">Remove</button>
          </li>`
      )
      .join("");
  }
}

document.getElementById("add-book-form")?.addEventListener("submit", function (event) {
  event.preventDefault();
  const newBookTitle = document.getElementById("new-book-title").value;
  if (newBookTitle) {
    books.push(newBookTitle);
    populateBooksForTeacher();
  }
});

function removeBook(index) {
  books.splice(index, 1);
  populateBooksForTeacher();
}

// Function to display all borrowed books (For Teachers)
function displayAllBorrowedBooks() {
  const allBorrowedBooksList = document.getElementById("all-borrowed-books-list");

  if (allBorrowedBooksList) {
    allBorrowedBooksList.innerHTML = borrowedBooks
      .map(
        (book, index) =>
          `<li>
            <span>${book.book} (Borrowed by: Student ID: ${book.studentID}, Date: ${book.time})</span>
          </li>`
      )
      .join("");
  }
}

// Function to log out
function logout() {
  localStorage.removeItem("role");
  window.location.href = "index.html"; // Redirect to login page
}

// Initialize pages
if (localStorage.getItem("role") === "student") {
  populateAvailableBooks();
  updateBorrowedList();
} else if (localStorage.getItem("role") === "teacher") {
  populateBooksForTeacher();
  displayAllBorrowedBooks();
}