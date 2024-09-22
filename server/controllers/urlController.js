import Url from "../models/Url.js";
import User from "../models/User.js";
import Client from "../models/Client.js";
import { nanoid } from "nanoid";
import { format, differenceInCalendarDays } from "date-fns";
import expressAsyncHandler from "express-async-handler";
import path from "path";
import { fileURLToPath } from "url";
import buildPage from "../middleware/html-generator.js";

//@desc get all redirect Urls
//@route GET /url
const getAllRedirects = expressAsyncHandler(async (req, res) => {
  const urls = await Url.find().lean();
  if (!urls?.length) return res.status(400).json({ message: "No URLs found" });
  const urlsWithSchemaInfo = await Promise.all(
    urls.map(async (url) => {
      const client = await Client.findById(url.client).lean().exec();
      return {
        ...url,
        client: `${client.firstName} ${client.lastName}`,
        clientId: client._id,
      };
    })
  );
  res.json(urlsWithSchemaInfo);
});

//@desc create a redirect URL
//@route POST /url
const createNewRedirect = expressAsyncHandler(async (req, res) => {
  if (!req?.body?.originalUrl || !req?.body?.expiresIn || !req?.body?.stage)
    return res.status(400).json({ message: "All fields are required" });
  const { originalUrl, expiresIn, stage } = req.body;

  const redirectId = nanoid(8);
  const created = format(new Date(), "MM/dd/yyyy");
  const redirectUrl = `${process.env.BASE}/url/${redirectId}`;
  const newUrl = {
    urlId: redirectId,
    originalURL: originalUrl,
    newURL: redirectUrl,
    createdAt: created,
    expiresIn: expiresIn,
    stage: stage,
  };

  if (req?.body?.client) {
    newUrl.client = req.body.client;
  }

  const result = await Url.create(newUrl);
  res.status(201).json(result);
});

//@desc update a redirect link
//@route PUT /url
const updateRedirect = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "Url ID is required" });

  const url = await Url.findOne({ _id: id }).exec();
  if (!url)
    return res.status(400).json({ message: `Url ID ${req.body.id} not found` });
  console.log(url);

  const { originalUrl, client, expiresIn, stage } = req.body;

  if (req.body?.originalUrl) {
    const redirectId = nanoid(8);
    const redirectUrl = `${process.env.BASE}/url/${redirectId}`;
    const created = format(new Date(), "MM/dd/yyyy");
    url.createdAt = created;
    url.originalURL = originalUrl;
    url.stage = stage;
    url.newURL = redirectUrl;
    url.urlId = redirectId;
  }
  if (req.body?.client) url.client = client;
  if (req.body?.expiresIn) url.expiresIn = expiresIn;

  const result = url.save();
  res.json({ message: `Url ID ${req.body.id} updated` });
});

//@desc delete a redirect url
//@route DELETE /url
const deleteRedirect = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "Url ID is required" });
  const url = await Url.findById(id).exec();
  if (!url) return res.status(400).json({ message: `Url ID ${id} not found` });
  const result = await url.deleteOne();
  res.json(`Url ID ${id} successfully deleted`);
});

//@desc redirect to main calendar
//@route /url/:urlId
const redirectToOriginalUrl = expressAsyncHandler(async (req, res) => {
  const { urlId } = req.params;
  const url = await Url.findOne({ urlId }).exec();
  if (!url) return res.status(400).json({ message: "link does not exist" });

  const { expiresIn, originalURL, createdAt, stage } = url;

  const users = await User.find().lean().exec();
  const user = users.filter(
    (user) => user.calendarLinks[stage] === originalURL
  );

  const { username } = user[0];

  const today = format(new Date(), "MM/dd/yyyy");
  const difference = differenceInCalendarDays(today, createdAt);

  const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
  const __dirname = path.dirname(__filename); // get the name of the directory

  if (difference > expiresIn) {
    return res.sendFile(path.join(__dirname, "..", "views", "expired.html"));
  }

  buildPage(username, originalURL, stage);
  setTimeout(() => {
    res.sendFile(
      path.join(__dirname, "..", "views", `${username}-${stage}.html`)
    );
  }, 500);
});

//@desc refresh a redirect link
//@route PUT /url/:urlId

const refreshRedirect = expressAsyncHandler(async (req, res) => {
  const { urlId } = req.params;
  const url = await Url.findOne({ urlId }).exec();
  if (!url) return res.status(400).json({ message: "link does not exist" });
  const redirectId = nanoid(8);
  const created = format(new Date(), "MM/dd/yyyy");
  const redirectUrl = `${process.env.BASE}/url/${redirectId}`;

  url.newURL = redirectUrl;
  url.createdAt = created;
  url.urlId = redirectId;
  const result = url.save();
  res.json({ message: `Url updated` });
});

export {
  getAllRedirects,
  createNewRedirect,
  updateRedirect,
  deleteRedirect,
  redirectToOriginalUrl,
  refreshRedirect,
};
