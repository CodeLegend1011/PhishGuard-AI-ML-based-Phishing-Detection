const express = require("express");
const cors = require("cors");
const fetchEmails = require("./fetchEmails");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/fetch-emails", async (req, res) => {
    const emails = await fetchEmails();
    res.json(emails);
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
