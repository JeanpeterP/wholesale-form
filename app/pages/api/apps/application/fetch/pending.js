import withMiddleware from "@/utils/middleware/withMiddleware.js";
import prisma from "@/utils/prisma";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    //GET, POST, PUT, DELETE
    console.log("Serve this only if the request method is GET");
    return res.status(401).send({ error: true });
  }

  try {
    const applications = await prisma.applications.findMany({
      where: { application_status: "pending" },
    });
    return res.status(200).send(applications);
  } catch (e) {
    console.error(e);
    return res.status(401).send({ error: true });
  }
};

export default withMiddleware("verifyRequest")(handler);
