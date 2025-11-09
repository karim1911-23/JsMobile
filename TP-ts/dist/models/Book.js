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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = exports.Format = exports.Status = void 0;
const mongoose_1 = require("mongoose");
var Status;
(function (Status) {
    Status["Read"] = "Read";
    Status["ReRead"] = "Re-read";
    Status["DNF"] = "DNF";
    Status["CurrentlyReading"] = "Currently reading";
    Status["ReturnedUnread"] = "Returned Unread";
    Status["WantToRead"] = "Want to read";
})(Status || (exports.Status = Status = {}));
var Format;
(function (Format) {
    Format["Print"] = "Print";
    Format["PDF"] = "PDF";
    Format["EBook"] = "EBook";
    Format["AudioBook"] = "AudioBook";
})(Format || (exports.Format = Format = {}));
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    pages: { type: Number, required: true },
    status: { type: String, enum: Object.values(Status), required: true },
    price: { type: Number, required: true },
    pagesRead: { type: Number, default: 0 },
    format: { type: String, enum: Object.values(Format), required: true },
    suggestedBy: { type: String, required: true },
    finished: { type: Boolean, default: false },
});
bookSchema.pre("save", function (next) {
    this.finished = this.pagesRead === this.pages;
    next();
});
bookSchema.methods.currentlyAt = function () {
    return (this.pagesRead / this.pages) * 100;
};
bookSchema.methods.deleteBook = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.deleteOne();
    });
};
exports.Book = (0, mongoose_1.model)("Book", bookSchema);
