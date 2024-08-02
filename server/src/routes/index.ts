import express from "express";

const routes = express.Router();
// Router
routes.get("/", (req, res) => {
 res.status(200).json({
  message: "Wellcome to FilmTify API",
  status: 200,
 });
});

export default routes;
