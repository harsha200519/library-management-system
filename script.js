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

  if (userType === "student") {
    if (studentCredentials[username] === password) {
      alert("Login successful as Student!");
      localStorage.setItem("role", "student");
      window.location.href = "student.html";  // Navigate to student dashboard
    } else {
      alert("Invalid student credentials. Please try again.");
    }
  } else if (userType === "teacher") {
    if (teacherCredentials[username] === password) {
      alert("Login successful as Teacher!");
      localStorage.setItem("role", "teacher");
      window.location.href = "teacher.html";  // Navigate to teacher dashboard
    } else {
      alert("Invalid teacher credentials. Please try again.");
    }
  }
}

// Function to populate available books list (For Students)
function populateAvailableBooks() {
  const availableBooksList = document.getElementById("available-books-list");
  if (availableBooksList) {
    availableBooksList.innerHTML = "";
    books.forEach((book) => {
      // Check if the book is already borrowed
      const isBorrowed = borrowedBooks.some(b => b.book === book);
      if (!isBorrowed) {
        const li = document.createElement("li");
        li.innerHTML = `<span>${book}</span><button onclick="borrowBook('${book}')">Borrow</button>`;
        availableBooksList.appendChild(li);
      }
    });
  }
}

// Function to borrow a book (For Students)
function borrowBook(book) {
  const studentID = prompt("Enter your student ID:");

  if (borrowedBooks.some(b => b.book === book && b.studentID === studentID)) {
    alert("You have already borrowed this book.");
    return;
  }

  borrowedBooks.push({ book, studentID, time: new Date().toLocaleString() });
  // Save borrowedBooks to localStorage
  localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
  updateBorrowedList();
}

// Function to return a borrowed book (For Students)
function returnBook(index) {
  borrowedBooks.splice(index, 1);
  // Save updated borrowedBooks to localStorage
  localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
  updateBorrowedList();
}

// Function to update the borrowed books list (For Students)
function updateBorrowedList() {
  const borrowedBooksList = document.getElementById("borrowed-books-list");
  const borrowedCount = document.getElementById("borrowed-count");

  borrowedBooksList.innerHTML = "";
  borrowedBooks.forEach((book, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${book.book} (Borrowed: ${book.time})</span>
      <span>Student ID: ${book.studentID}</span>
      <button onclick="returnBook(${index})">Return</button>
    `;
    borrowedBooksList.appendChild(li);
  });

  borrowedCount.textContent = borrowedBooks.length;
}

// Function to filter books based on search query (For Students)
function filterBooks() {
  const query = document.getElementById("search-bar").value.toLowerCase();
  const availableBooksList = document.getElementById("available-books-list");

  const filteredBooks = books.filter((book) => book.toLowerCase().includes(query));
  availableBooksList.innerHTML = "";
  filteredBooks.forEach((book) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${book}</span><button onclick="borrowBook('${book}')">Borrow</button>`;
    availableBooksList.appendChild(li);
  });
}

// Teacher Functions (Add/Remove books and view borrowed records)

// Function to populate books for teachers (For Teachers)
function populateBooksForTeacher() {
  const booksList = document.getElementById("books-list");
  if (booksList) {
    booksList.innerHTML = "";
    books.forEach((book, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${book}</span>
        <button onclick="removeBook(${index})">Remove</button>
      `;
      booksList.appendChild(li);
    });
  }
}

// Function to add a new book (For Teachers)
document.getElementById("add-book-form")?.addEventListener("submit", function (event) {
  event.preventDefault();
  const newBookTitle = document.getElementById("new-book-title").value;
  if (newBookTitle) {
    books.push(newBookTitle);
    populateBooksForTeacher();
    document.getElementById("new-book-title").value = "";
    alert("Book added successfully!");
  }
});

// Function to remove a book (For Teachers)
function removeBook(index) {
  books.splice(index, 1);
  populateBooksForTeacher();
}

// Function to populate borrowed books record for teachers (For Teachers)
function populateBorrowedRecords() {
  const borrowedRecordsList = document.getElementById("borrowed-records-list");
  if (borrowedRecordsList) {
    borrowedRecordsList.innerHTML = "";
    borrowedBooks.forEach((record) => {
      const li = document.createElement("li");
      li.textContent = `${record.book} - Borrowed at ${record.time} by Student ID: ${record.studentID}`;
      borrowedRecordsList.appendChild(li);
    });
  }
}

// Logout function (For both students and teachers)
function logout() {
  localStorage.removeItem("role"); // Remove role from localStorage
  window.location.href = "index.html";  // Redirect to login page
}

// Function to initialize the page based on the dashboard type (Student or Teacher)
window.onload = function () {
  const role = localStorage.getItem("role");

  // Ensure the page behaves correctly based on the logged-in role
  if (role === "student") {
    if (document.getElementById("available-books-list")) {
      populateAvailableBooks();  // Populate books for students
    }
    if (document.getElementById("borrowed-books-list")) {
      updateBorrowedList();  // Update borrowed books for students
    }
  } else if (role === "teacher") {
    if (document.getElementById("books-list")) {
      populateBooksForTeacher();  // Populate books for teachers
    }
    if (document.getElementById("borrowed-records-list")) {
      populateBorrowedRecords();  // Populate borrowed records for teachers
    }
  } else {
    window.location.href = "index.html"; // Redirect to login page if no role is found
  }
};