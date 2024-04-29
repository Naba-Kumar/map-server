const express = require('express');
const hbs = require('hbs')
const path = require('path')
const app = express();

const viewpath = path.join(__dirname , "../tamplates/views")
const partialpath = path.join(__dirname , "../tamplates/partials")
app.set("view engine", "hbs")
app.set("views", viewpath);
hbs.registerPartials(partialpath);

// app.set("view engine", "hbs");
// app.set("views", viewPath);
// hbs.registerPartials(partialPath);

app.get('/', (req, res)=>{
    res.render("home");
})

// Start the Express application
app.listen(3000, () => {
  console.log('App listening on port 3000');
});