import cors from "cors";
import { database, type DataType } from "./db.ts"
import express, { json } from "express";


const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
	res.send(JSON.stringify(database));
});
app.get("/colors", (req, res) => {
	res.send(JSON.stringify(database));
});

let index = 0;
app.get("/colors/random", (req, res) => {
	const count = req.query.count
	const colorsArray: DataType[] = Array(+count!).fill(null).map((item, idx) => ({
		id: index++,
		initialColor: getRandomColors(),
		appliedColor: ""
	}))
	index + 1
	colorsArray.forEach(item => database.push(item))
	res.send(JSON.stringify(colorsArray))
})

app.get("/colors/refresh-color", (req, res) => {
	const colorId = req.query.id
	const newColor = getRandomColors()
	database[+colorId!]!.initialColor = newColor
	res.send({ newColor })
})

app.delete("/colors/delete/:id", (req, res) => {
	const id = parseInt(req.params.id)!
	if (!id) return res.send({ message: "color not found" })
	database.splice(id, 1)
	res.send({ status: "SUCCES", message: "Color o'chirildi" })
})


function getRandomColors() {
	const letters = "0123456789ABCDEF";
	let color = "#";
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
const PORT = 6000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}...`);
});
