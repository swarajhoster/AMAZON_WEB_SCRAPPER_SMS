// Packages
const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);

const url =
  "https://www.amazon.in/Apple-Retina-Display-24-inch-8%E2%80%91core/dp/B0932MLQQ2/ref=sr_1_2?crid=LB5ITVPUEUB9&keywords=mac+computer&qid=1656137783&sprefix=mac+compute%2Caps%2C216&sr=8-2";
const product = { name: "", price: "", link: "" };

const handle = setInterval(scrape, 20000)

async function scrape() {
  // Fetch the data
  const { data } = await axios.get(url);

  // Load up HTML
  const $ = cheerio.load(data);
  const item = $("div#dp-container");

  // Extract the data that we need
  product.name = $(item).find("h1 span#productTitle").text();
  product.link = url;
  const price = $(item)
    .find("span .a-price-whole")
    .first()
    .text()
    .replace(/[,.]/g, "");

  const priceNum = parseInt(price);
  product.price = priceNum;

  console.log("Running...");

  // Send an SMS
  if (priceNum > 1) {
    client.messages
      .create({
        body: `The price of ${product.name} when below ${price}. Purchase it at ${product.link}`,
        from: "+19034818242",
        to: "+918088980088",
      })
      .then((message) => console.log(message))
      .catch((err) => console.log(err));
  }
}

scrape();
