const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
mongoose.connect(
  "mongodb+srv://admin-hriodoy:haran123@cluster0-mrj9i.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("Public"));

const itemSchema = new mongoose.Schema({
  name: String,
});
const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema],
});

const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);

const item1 = new Item({
  name: "Welcome to your todo list",
});
const item2 = new Item({
  name: "Hit the add button and create a Task",
});
const item3 = new Item({
  name: "<---- Hit that delete Task",
});
const defaultItem = [item1, item2, item3];

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItem, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved all deafult data");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", listItems: foundItems });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.item;
  const listName = req.body.list;
  const item = new Item({
    name: itemName,
  });
  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});
//WORK PAGE
app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItem,
        });

        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          listItems: foundList.items,
        });
      }
    }
  });
});
//DELETE
app.post("/delete", function (req, res) {
  const checkItemID = req.body.checkbox;
  const newListName = req.body.listName;
  if (newListName === "Today") {
    Item.findByIdAndRemove(checkItemID, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Removed successfully");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: newListName },
      { $pull: { items: { _id: checkItemID } } },
      function (err, result) {
        if (!err) {
          res.redirect("/" + newListName);
        }
      }
    );
  }
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function () {
  console.log("App started on port 3000");
});
