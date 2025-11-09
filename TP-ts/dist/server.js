"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const Book_1 = require("./models/Book");
const app = (0, express_1.default)();
const PORT = 3000;
app.use(body_parser_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
mongoose_1.default
    .connect("mongodb://localhost:27017/booktracker")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../public/index.html"));
});
app.post("/api/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = new Book_1.Book(req.body);
        yield book.save();
        res.status(201).json(book);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
app.get("/api/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield Book_1.Book.find();
        const booksWithPercent = books.map((book) => (Object.assign(Object.assign({}, book.toJSON()), { percentage: book.currentlyAt() })));
        res.json(booksWithPercent);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
app.delete("/api/books/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield Book_1.Book.findById(req.params.id);
        if (!book)
            return res.status(404).json({ error: "Book not found" });
        yield book.deleteBook();
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
app.put("/api/books/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield Book_1.Book.findById(req.params.id);
        if (!book)
            return res.status(404).json({ error: "Book not found" });
        if (req.body.pagesRead !== undefined) {
            book.pagesRead = req.body.pagesRead;
            yield book.save();
            res.json(Object.assign(Object.assign({}, book.toJSON()), { percentage: book.currentlyAt() }));
        }
        else {
            res.status(400).json({ error: "pagesRead required" });
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
