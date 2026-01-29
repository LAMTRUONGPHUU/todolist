import jsonServer from "json-server";
import { randomUUID } from "crypto";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// ✅ LOAD ROUTES.JSON
const rewriter = jsonServer.rewriter({
  "/auth/me": "/authMe"
});

// id -> _id
router.render = (req, res) => {
  const data = res.locals.data;

  const convert = (item) => {
    if (Array.isArray(item)) return item.map(convert);
    if (item && typeof item === "object" && item.id) {
      item._id = item.id;
      // delete item.id;
    }
    return item;
  };

  res.json(convert(data));
};
server.use(middlewares);
server.use(jsonServer.bodyParser);

// ✅ APPLY ROUTES
server.use(rewriter);

// ✅ DEFAULT LOGIC FOR POST /todo

server.use((req, res, next) => {
  if (req.method === "POST" && req.path === "/todo") {
    req.body ??= {};
    req.body.id = randomUUID();   // ✅ QUAN TRỌNG
    req.body.status = 0;
    req.body.userId = "user-1";
  }
  next();
});

// ✅ ROUTER LAST
server.use(router);

server.listen(3001, () => {
  console.log("🚀 Mock API running at http://localhost:3001");
});
