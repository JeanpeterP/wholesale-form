import withMiddleware from "@/utils/middleware/withMiddleware.js";
import prisma from "@/utils/prisma";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    //GET, POST, PUT, DELETE
    console.log("Serve this only if the request method is GET");
    return res.status(401).send({ error: true });
  }

  try {
    const { formFields } = req.body;
    const formId = await prisma.applicationForm.findMany({});
    const form = await prisma.applicationForm.upsert({
      where: { id: formId[0]?.id ?? "form_id" },
      update: {
        fields: JSON.stringify(formFields),
      },
      create: {
        fields: JSON.stringify(formFields),
      },
    });
    return res.status(200).send({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(401).send({ error: true });
  }
};

export default withMiddleware("verifyRequest")(handler);
