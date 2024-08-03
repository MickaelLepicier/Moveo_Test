const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");

// AWS_REGION= eu-west-3 || il-central-1 || eu-north-1
AWS.config.update({ region: process.env.AWS_REGION || "eu-north-1" });

const cognito = new AWS.CognitoIdentityServiceProvider();

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const result = await cognito.initiateAuth(params).promise();
    const idToken = result.AuthenticationResult.IdToken;

    if (!idToken) {
      return res
        .status(401)
        .json({ error: "Authentication failed, no ID token received" });
    }

    const decodedToken = jwt.decode(idToken);
    const role = decodedToken["cognito:groups"]
      ? decodedToken["cognito:groups"][0]
      : "user";

    const token = jwt.sign({ username, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: error.message });
  }
};
