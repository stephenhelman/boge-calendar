import Client from "../models/Client.js";
import User from "../models/User.js";
import Url from "../models/Url.js";
import expressAsyncHandler from "express-async-handler";

//@desc get clients
//@route GET /client
const getAllClients = expressAsyncHandler(async (req, res) => {
  const clients = await Client.find().lean();
  if (!clients?.length)
    return res.status(400).json({ message: "No clients found" });
  const clientsWithSchemaInfo = await Promise.all(
    clients.map(async (client) => {
      const user = await User.findById(client.user).lean().exec();
      const calendarLink = await Url.findById(client.calendarLink)
        .lean()
        .exec();
      return {
        ...client,
        username: user?.username,
        calendarLink: calendarLink?.newURL,
        linkId: calendarLink?._id,
      };
    })
  );
  res.json(clientsWithSchemaInfo);
});

//@desc create a client
//@route POST /client
const createNewClient = expressAsyncHandler(async (req, res) => {
  if (
    !req?.body?.firstName ||
    !req?.body?.lastName ||
    !req?.body?.user ||
    !req?.body?.stage
  )
    return res.status(400).json({ message: "All fields are required" });
  const { firstName, lastName, user, stage } = req.body;
  const fullName = `${firstName} ${lastName}`;
  const duplicate = await Client.findOne({ fullName: fullName }).exec();
  if (duplicate) return res.sendStatus(409);
  const result = await Client.create({
    firstName: firstName,
    lastName: lastName,
    user: user,
    stage: stage,
    fullName: `${firstName} ${lastName}`,
  });
  res.status(201).json({ result });
});

//@desc update a client
//@route PUT /client
const updateClient = expressAsyncHandler(async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "Client ID is required" });

  const { id } = req.body;

  const client = await Client.findOne({ _id: id }).exec();
  if (!client)
    return res
      .status(400)
      .json({ message: `Client ID ${req.body.id} not found` });

  const { firstName, lastName, user, calendarLink, stage } = req.body;

  if (req?.body?.firstName) client.firstName = firstName;
  if (req?.body?.lastName) client.lastName = lastName;
  if (req?.body?.user) client.user = user;
  if (req?.body?.calendarLink) client.calendarLink = calendarLink;
  if (req?.body?.stage) client.stage = stage;

  const result = client.save();
  res.json({ message: `Client ID ${req.body.id} updated` });
});

//@desc delete a client
//@route DELETE /client
const deleteClient = expressAsyncHandler(async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "Client ID is required" });
  const { id } = req.body;
  const client = await Client.findById(id).exec();
  if (!client)
    return res.status(400).json({ message: `Client ID ${id} not found` });
  if (!client.calendarLink) {
    await client.deleteOne();
    return res.json(`Client ID ${id} successfully deleted`);
  }
  const clientUrl = await Url.findOne({ client: id });
  await clientUrl.deleteOne();
  await client.deleteOne();
  res.json(`Client ID ${id} successfully deleted`);
});

export { getAllClients, createNewClient, updateClient, deleteClient };
