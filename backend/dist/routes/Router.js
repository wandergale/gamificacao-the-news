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
const db_1 = __importDefault(require("../config/db"));
const router = (0, express_1.default)();
router.post("/webhook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newsletter_id, opened_at, utm_souce, utm_medium, utm_campaigm, utm_channel, } = req.body;
    try {
        const result = yield db_1.default.query(`SELECT * FROM users WHERE email = ${email}`);
        if (result.rows.length === 0) {
            yield db_1.default.query(`INSERT INTO users (email) VALUES (${email})`);
        }
        yield db_1.default.query(`INSERT INTO reads (user_id, newsletter_id, opened_at, utm_source, utm_medium, utm_campaigm, utm_channel) ` +
            `VALUES ((SELECT id FROM users WHERE email = ${email}), ${newsletter_id}, ${opened_at}, ${utm_souce}, ${utm_medium}, ${utm_campaigm}, ${utm_channel})`);
        const streakResult = yield db_1.default.query(`SELECT * FROM streaks WHERE user_id = (SELECT id FROM users WHERE email = ${email})`);
        if (streakResult.rows.length > 0) {
            const lastStreakDate = streakResult.rows[0].lastStreakDate;
            const currentStreak = streakResult.rows[0].currentStreak;
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDay() - 1);
            if (lastStreakDate === yesterday.toISOString().split("T")[0]) {
                yield db_1.default.query(`UPDATE streaks SET current_streak = ${currentStreak + 1} WHERE user_id = (SELECT id FROM users WHERE email = ${email})`);
            }
            else {
                yield db_1.default.query(`INSERT INTO streaks (user_id, current_streak, last_streak_date) VALUES ((SELECT id FROM users WHERE email = ${email}), 1, ${opened_at.split("T")[0]})`);
            }
        }
        res.status(200).json({ message: "Dados processados" });
    }
    catch (error) {
        console.error(`Error ao processar webhook: ${error}`);
        res.status(500).json({ message: "Erro ao processar dados" });
    }
}));
exports.default = router;
