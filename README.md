# Project Management Tool

A full-stack web application for managing software projects, tasks, and teams. This project was built as an intern assignment to demonstrate skills in Python, Django, React, and REST API development.

---

## **Contact Information**

* **Full Name:** Ahmed Kola
* **Email:** ahmedkola5956@gmail.com
* **Contact:** +91 8618215747

---

## **Deployment** 🚀

* **Live Frontend (Vercel):** `https://project-management-tool-kappa-two.vercel.app/`
* **Live Backend (PythonAnywhere):** `https://AhmedKola.pythonanywhere.com/`

---

## **Features** ✨

* **Role-Based Access Control:** Three distinct user roles (Admin, Manager, Developer) with specific permissions.
* **User Authentication:** Secure JWT-based authentication for login and registration.
* **Project Management:** Managers can create, edit, and delete projects.
* **Team Management:** Managers can add users to project teams.
* **Task Management:** Managers can create, assign, and delete tasks. Developers can update the status of their assigned tasks.
* **Deadline Tracking:** Tasks have deadlines, and the UI visually indicates when a task is overdue.

---

## **Tech Stack** 💻

* **Backend:** Python, Django, Django REST Framework, Simple JWT
* **Frontend:** JavaScript, React, React Router, Axios
* **Database:** MySQL
* **API Testing:** Postman

---

## **How to Run the Project Locally**

### **Prerequisites**

* Python 3.x
* Node.js and npm
* MySQL Server

### **Backend Setup**

1.  Navigate to the `backend` directory: `cd backend`
2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  Install dependencies: `pip install -r requirements.txt`
4.  Set up your local MySQL database and update the `DATABASES` configuration in `pm_tool/settings.py`.
5.  Run database migrations: `python manage.py migrate`
6.  Start the server: `python manage.py runserver`
    * The backend will be running at `http://127.0.0.1:8000`

### **Frontend Setup**

1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Start the client: `npm start`
    * The frontend will open at `http://localhost:3000`

---

## **API Endpoints Summary** 🌐

| Method | Endpoint                       | Description                                  |
| :----- | :----------------------------- | :------------------------------------------- |
| `POST` | `/api/register/`               | Registers a new user.                        |
| `POST` | `/api/token/`                  | Logs in a user to get JWT tokens.            |
| `GET`  | `/api/users/`                  | Lists all users (for Manager/Admin).         |
| `GET`  | `/api/projects/`               | Lists projects for the logged-in user.       |
| `POST` | `/api/projects/`               | Creates a new project (Manager/Admin).       |
| `GET`  | `/api/projects/{id}/`          | Retrieves details of a single project.       |
| `PATCH`| `/api/projects/{id}/`          | Updates a project's details (Manager/Admin). |
| `DELETE`| `/api/projects/{id}/`          | Deletes a project (Manager/Admin).           |
| `POST` | `/api/projects/{id}/add_member/` | Adds a user to a project (Manager/Admin).    |
| `POST` | `/api/tasks/`                  | Creates a new task (Manager/Admin).          |
| `PATCH`| `/api/tasks/{id}/`             | Updates a task (e.g., changing status).      |
| `DELETE`| `/api/tasks/{id}/`             | Deletes a task (Manager/Admin).              |

---

## **Assumptions and Future Improvements**

* **Assumptions:** It was assumed that any authenticated user can see a list of all other users in the system to facilitate the "Add Member" feature. For enhanced security, this could be restricted to only Admins.
* **Improvements:**
    * Implement the optional reporting dashboard with project progress metrics.
    * Add a comprehensive suite of backend unit tests.
    * Integrate the bonus AI-powered user story generator.
