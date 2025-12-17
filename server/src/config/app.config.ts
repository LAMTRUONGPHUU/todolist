export const AppConfig = {
  serverPort: parseInt(process.env.PORT || "3000"),
  databaseUri: process.env.MONGO_URI || "mongodb://localhost:27017/todolist",
  sessionSecret: process.env.SESSION_SECRET || "your_session_secret_here"
}
