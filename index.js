const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("build"));
const generateId = () => {
    return Math.floor(Math.random() * 1000);
};

const requestLogger = (request, response, next) => {
    console.log(`Body ${request.body}`);
    console.log(`Method ${request.method}`);
    console.log(`path ${request.path}`);
    console.log(`----***----`);
    next();
};

// app.use(requestLogger);
morgan.token("requestBody", function (req) {
    const body = JSON.stringify(req.body);
    return body;
});
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :requestBody"
    )
);

const phoneEntries = () => {
    const entries =
        phonebook.length > 0 ? Math.max(...phonebook.map((p) => p.id)) : 0;
    return entries;
};

const checkName = (name) => {
    // uses the find method to check if a name exists and returns true or false
    name = phonebook.find((phoneEntry) => phoneEntry.name === name);
    return name?.name ? true : false;
};

let phonebook = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

app.get("/", (request, response) => {
    response.send("<h1> Phonebook </h1>");
});

app.get("/info", (request, response) => {
    response.send(
        `<p>Phonebook has info for ${phoneEntries()} people<p/> <br/> <p>${new Date()}<p/>`
    );
});

app.get("/api/persons", (request, response) => {
    response.json(phonebook);
});

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = phonebook.find((person) => person.id === id);
    person ? response.json(person) : response.sendStatus(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    phonebook = phonebook.filter((phone) => phone.id === id);
    console.log(`deleted entry with ID of ${id}`);
    response.status(204).end();
});

app.post("/api/persons", (request, response) => {
    const newPerson = request.body;
    if (!newPerson.name || !newPerson.number) {
        // check if the request does not contains a name or a number and will return a falsy value hence the !
        response.send(`invalid input! name or number is missing`);
        console.log(`number: ${newPerson.number}`);
    } else if (checkName(newPerson.name)) {
        response.status(400).json({ error: "name must be unique" });
        console.log(`duplicate entry!`);
    } else {
        newPerson.id = generateId();
        phonebook = phonebook.concat(newPerson);
        // console.log(`phone book updated with: `);
        // console.log(newPerson);
        response.json(phonebook);
    }
});

const unknownEndpoint = (request, response) => {
    response.status(400).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
