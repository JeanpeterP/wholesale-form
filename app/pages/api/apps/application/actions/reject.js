import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware.js";
import prisma from "@/utils/prisma";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    //GET, POST, PUT, DELETE
    console.log("Serve this only if the request method is GET");
    return res.status(401).send({ error: true });
  }

  try {
    const { client } = await clientProvider.offline.graphqlClient({
      shop: req.user_session.shop,
    });

    await client.request(
      `mutation tagsRemove($id: ID!, $tags: [String!]!) {
                  tagsRemove(id: $id, tags: $tags) {
                    node {
                      id
                    }
                    userErrors {
                      field
                      message
                    }
                  }
                }`,
      {
        variables: {
          id: `gid://shopify/Customer/${req.body.customer_id}`,
          tags: ["wholesale", "pending"],
        },
      }
    );

    await prisma.applications.update({
      where: { email: req.body.email },
      data: { application_status: "rejected" },
    });

    return res.status(200).send({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(401).send({ error: true });
  }
};

export default withMiddleware("verifyRequest")(handler);
