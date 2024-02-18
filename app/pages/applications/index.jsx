import prisma from "@/utils/prisma";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
} from "@shopify/polaris";
import { useRouter } from "next/router";

const ApplicationHome = (props) => {
  const router = useRouter();
  return (
    <>
      <Page
        title="Wholesale Applications"
        backAction={{
          onAction: () => {
            router.push("/");
          },
        }}
      >
        <Layout>
          <Layout.Section fullWidth>
            <Card>
              <BlockStack gap="200">
                <Text variant="headingMd">
                  {`Pending Applications (${props.pending})`}
                </Text>
                <Text>New applications that are waiting to be reviewed.</Text>
                <InlineStack align="end">
                  <Button
                    variant="primary"
                    onClick={() => {
                      router.push("/applications/pending");
                    }}
                  >
                    View
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="200">
                <Text variant="headingMd">Approved Applications</Text>
                <Text>A list of approved applications</Text>
                <InlineStack align="end">
                  <Button
                    variant="primary"
                    onClick={() => {
                      router.push("/applications/approved");
                    }}
                  >
                    Approved Applications
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="200">
                <Text variant="headingMd">Rejected Applications</Text>
                <Text>A list of rejected applications.</Text>
                <InlineStack align="end">
                  <Button
                    variant="primary"
                    onClick={() => {
                      router.push("/applications/rejected");
                    }}
                  >
                    Rejected Applications
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
};

export default ApplicationHome;

export const getServerSideProps = async () => {
  const pendingApplicationsCount = await prisma.applications.count({
    where: { application_status: "pending" },
  });
  return {
    props: {
      pending: pendingApplicationsCount,
    },
  };
};
