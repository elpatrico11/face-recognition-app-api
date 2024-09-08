const PAT = "046005d92a954fb18b233e95a94cd304";
const USER_ID = "patryk21";
const APP_ID = "my-first-application-l0l4zo";
const MODEL_ID = "age-demographics-recognition";

const handleApiCall = (req, res) => {
  const { input } = req.body; // Receive the image URL from the frontend

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: input, // Use input from the request body
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  fetch(
    "https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs",
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      res.json(data); // Send the Clarifai response back to the frontend
    })
    .catch((err) => res.status(400).json("unable to work with API"));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => {
      res.status(400).json("unable to get entries");
    });
};

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall,
};
