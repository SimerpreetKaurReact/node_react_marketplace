const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());
const tours = fs.readFile(`${__dirname}/dev_data/data/tours-simple.json`);
const getTour = (req, res) => {
  console.log(req.params);
  const tour = tours.find((ele) => ele.id === req.params.id * 1);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: "fail", meassage: "Invalid ID" });
  }
  res.status(200).json({ status: "success", data: { tour } });
};
const getAllTours = (req, res) => {
  res
    .status(200)
    .json({ status: "success", results: tours.length, data: { tours } });
};
const createTour = (req, res) => {
  const newId = tours[tours.length - 1] + 1;
  const newTours = Object.assign({ id: newId }, req.body);
  tours.push(newTours);
  fs.writeFile(
    `${__dirname}/dev_data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res
        .status(201)
        .json({ status: "success", results: tours.length, data: { newTours } });
    }
  );
};
const updateTours = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: "fail", meassage: "Invalid ID" });
  }
  const updatedTour = tours.map((ele) => {
    if (ele.id === req.params.id * 1) {
    }
    return ele;
  });
  res.status(200).json({ status: "success", data: { tour: updatedTour } });
};
const deleteTours = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: "fail", meassage: "Invalid ID" });
  }

  res.status(204).json({ status: "success", data: null });
};
app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTours)
  .delete(deleteTours);
app.route("/api/v1/tours").get(getAllTours).post(createTour);

//201 means created
//204 means no data response
app.get("/", (req, res) => {
  res.status(200).json({ message: "hello from apps" });
});
app.post("/", (req, res) => {
  res.status(200).send("hi");
});
app.listen(3000, () => {
  console.log("app is running on port 3000");
});
//rest representation state
//seperate API into logical resoursces,
// expose structural resource based URL
//use http methids
//patch send only part of the object that is updated, put sends back complete object
// send data as json
//stateless rest Apis
