# Project Ciscode

**Project Ciscode** is a student-built coding platform by **CISCO** that offers algorithm challenges to help students practice, improve, and master their problem-solving skills.  

The platform provides a collection of problems, ranging from beginner-friendly to advanced, designed to sharpen your coding abilities in a competitive yet supportive environment.

---

## 🚀 Tech Stack
- **Fullstack Framework:** [Next.js](https://nextjs.org/) (frontend + API backend)  
- **Database:** [MySQL](https://www.mysql.com/)  
- **ORM:** [Sequelize](https://sequelize.org/)  

---

## 📂 Features
- 🧑‍💻 Algorithm challenges across multiple difficulty levels  
- 📊 Track progress and submitted solutions  
- 🔍 Search and filter problems  
- 👤 User authentication & accounts  
- ⚡ Fast and modern UI powered by Next.js  

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (>= 18)  
- MySQL (installed and running)  
- npm or yarn  

### Clone the Repository
```bash
git clone https://github.com/usc-cisco/ciscode.git
cd ciscode
```

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

App will be running on [http://localhost:3000](http://localhost:3000).

---

#### Docker support

**Build and Run**
   ```bash
   # Build the Docker image
   docker build -t ciscode-app:latest .
   
   # Or use docker-compose (recommended)
   docker compose up -d --build
   ```
**Database Connection**

    If you are locally hosting your database, it is recommended that you also use a container for mysql. 
    in the docker-compose.yml...

    ```
    network_mode: "host"
    ```

    ...denotes that the database must be locally hosted. it would still also use the db credentials that you input in the .env


## 🤝 Contributing
Contributions are welcome! Feel free to fork the repo, submit issues, or open pull requests.

---

## 📜 License
This project is for educational purposes under USC-CISCO.