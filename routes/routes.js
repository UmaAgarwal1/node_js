const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const isAuthenticated = require("../middleware/auth_middleware");
const Teacher = require("../models/Teacher");

router.get("/", (req, res) => {
  res.render("home");
});
router.get("/login", (req, res) => {
  res.render("teacherLogin", {
    success: true,
    message: "",
  });
});
router.get("/add-record", (req, res) => {
  res.render("addRecord");
});
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.sendStatus(500);
    }
    res.redirect("/");
  });
});
router.get("/search", async (req, res) => {
  const { rollNo, name } = req.query;
  console.log(rollNo, name);
  if (rollNo == undefined && name == undefined) {
    res.render("search_page");
    return;
  }
  try {
    // Create a MongoDB query object based on the provided parameters
    const query = {};
    if (rollNo) {
      query.rollno = rollNo;
    }
    if (name) {
      query.name = { $regex: new RegExp(name, "i") }; // Case-insensitive regex for partial matching
    }
    const searchResults = await Student.find(query);
    console.log(searchResults);
    if (rollNo == undefined && name == undefined) {
      res.redirect("search");
    } else {
      res.render("search_result", {
        results: searchResults,
        count: searchResults.length,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/result", (req, res) => {
  res.render("result");
});

router.post("/add-record", async (req, res) => {
  console.log(req.body);
  const data = await new Student({
    rollno: req.body.rollNo,
    name: req.body.name,
    dob: req.body.dob,
    score: req.body.score,
  });
  //console.log(data);
  await data.save().then((response) => {
    if (response) {
      req.session.message = {
        type: "success",
        message: "Student added successfully !",
      };
      res.redirect("/view-records");
    }
  });
});
router.get("/view-records", isAuthenticated, async (req, res) => {
  try {
    const students = await Student.find({});
    res.render("viewRecords", {
      title: "class",
      students: students,
      count: students.length,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.get("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const student = await Student.findById(id);

    if (student == null) {
      return res.redirect("/view-records");
    }

    res.render("edit_student", {
      title: "Edit Student",
      student: student,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.redirect("/view-records");
  }
});

// update student route
router.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const updateData = {
    rollno: req.body.rollNo,
    name: req.body.name,
    dob: req.body.dob,
    score: req.body.score,
  };

  try {
    await Student.findByIdAndUpdate(id, updateData);
    req.session.message = {
      type: "success",
      message: "Student Updated Successfully!",
    };
    res.redirect("/view-records");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});
//Get Student By ID
router.get("/view/:id", async function (req, res) {
  const id = req.params.id;
  const data = await Student.findById(id);
  console.log(data);
  res.render("view_details", { data: data });
});

router.get("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Student.findByIdAndDelete(id);

    if (result) {
      req.session.message = {
        type: "info",
        message: "Student deleted successfully!",
      };
      res.redirect("/view-records");
    } else {
      res.json({ message: "Student not found or could not be deleted." });
    }
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.get("/login", function (req, res) {
  res.render("teacherLogin", {
    success: true,
    message: "",
  });
});

router.post("/login", async function (req, res) {
  try {
    const { username, password } = req.body;
    if (username == "test" && password == "test123") {
      req.session.user_id = 1;
      res.redirect("/view-records");
    }
    if (username && password) {
      const userLogin = await Teacher.findOne({ username: username });
      console.log(userLogin, "data");
      if (userLogin) {
        // You can check the password here using a validation function or library
        // For simplicity, let's assume password matching for now
        if (userLogin.password === password) {
          req.session.user_id = userLogin._id;
          req.session.isAdmin = userLogin.isAdmin;
          res.redirect("/view-records");
        } else {
          res.render("teacherLogin", {
            success: false,
            message: "Invalid password",
          });
        }
      } else {
        res.render("teacherLogin", {
          success: false,
          message: "Invalid username or password",
        });
      }
    } else {
      res.render("teacherLogin", {
        success: false,
        message: "Invalid username and password",
      });
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
