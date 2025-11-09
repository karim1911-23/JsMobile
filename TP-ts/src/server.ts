import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path from "path";
import { Book, IBook } from "./models/Book";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

mongoose
  .connect("mongodb://localhost:27017/booktracker")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.post("/api/books", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find();
    const booksWithPercent = books.map((book) => ({
      ...book.toJSON(),
      percentage: book.currentlyAt(),
    }));
    res.json(booksWithPercent);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.delete("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    await book.deleteBook();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.put("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (req.body.pagesRead !== undefined) {
      book.pagesRead = req.body.pagesRead;
      await book.save();
      res.json({ ...book.toJSON(), percentage: book.currentlyAt() });
    } else {
      res.status(400).json({ error: "pagesRead required" });
    }
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
