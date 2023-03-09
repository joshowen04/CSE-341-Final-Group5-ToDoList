const express = require("express");
const router = express.Router();

router.post("/todo", (req, res) => {
    res.status(201).send("This works");
});

router.get("/todo/findByUserId", (req, res) => {
    res.send("This works");
});

router.get("/todo/findByStatus", (req, res) => {
    res.send("This works");
});

router.get("/todo/findByText", (req, res) => {
    res.send("This works");
});

router.get("/todo/findByType", (req, res) => {
    res.send("This works");
});

router.get("/todo/findByTitle", (req, res) => {
    res.send("This works");
});

router.delete("/todo/:todoId", (req, res) => {
    res.sendStatus(204);
});

router.put("/todo/:todoId", (req, res) => {
    res.send("This works");
});

module.exports = router;
