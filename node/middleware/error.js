module.exports = function(err, req, res, next){
  // Log the exception
  if(err instanceof SyntaxError)
    res.status(400).send("You typed incorrect JSON");
  else if(err instanceof TypeError)
    res.status(400).send("You typed incorrect JSON");
  else
    res.status(500).send("Something failed");
}