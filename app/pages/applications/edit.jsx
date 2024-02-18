import useFetch from "@/components/hooks/useFetch";
import prisma from "@/utils/prisma";
import {
  Button,
  Card,
  Layout,
  Page,
  Select,
  TextField,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ApplicationEdit = (props) => {
  const router = useRouter();
  const fetch = useFetch();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState(props.fields);
  const [canAddField, setCanAddField] = useState(true);

  const addField = () => {
    if (!canAddField) return;

    const newField = {
      id: "",
      label: "",
      value: "",
      type: "text",
      options: [],
    };
    setFields((prev) => [...prev, newField]);
  };

  const removeField = (id) => {
    setFields((prev) => prev.filter((field) => field.id !== id));
  };

  const formatId = (label) => {
    return label.trim();
    //return label.trim().replace(/\s+/g, "-").toLowerCase();
  };

  const fieldTypes = [
    { label: "URL", value: "url" },
    { label: "Text", value: "text" },
    { label: "Number", value: "number" },
    { label: "Dropdown", value: "dropdown" },
  ];

  useEffect(() => {
    const lastField = fields[fields.length - 1];
    if (
      lastField.label &&
      (lastField.type !== "dropdown" ||
        (lastField.type === "dropdown" && lastField.options.length >= 2))
    ) {
      setCanAddField(true);
    } else {
      setCanAddField(false);
    }
  }, [fields]);

  const saveForm = async () => {
    setIsLoading(true);
    const response = await fetch("/api/apps/application/saveForm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formFields: fields,
      }),
    });

    const data = await response.json();

    setIsLoading(false);

    if (!data.error) {
      console.log(data);
      alert("Form saved successfully!");
      router.push("/");
    } else {
      alert("Error");
      console.error("Error saving form");
    }
  };

  return (
    <>
      <Page
        title="Application Fields"
        backAction={{
          content: "Home",
          onAction: () => {
            router.push("/");
          },
        }}
        primaryAction={{
          content: "Save",
          onAction: saveForm,
          loading: isLoading,
        }}
      >
        <Layout>
          <Layout.Section>
            <Card>
              {fields.map((field, index) => (
                <>
                  <div key={index}>
                    {index > 0 && (
                      <>
                        <div style={{ marginTop: "10px" }}></div>
                      </>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ width: "50%" }}>
                        <TextField
                          label={`Field Label`}
                          value={field.label}
                          onChange={(label) => {
                            const id = formatId(label);
                            setFields((prev) =>
                              prev.map((f) =>
                                f.id === field.id ? { ...f, label, id } : f
                              )
                            );
                          }}
                        />
                      </div>
                      <div style={{ width: "10px" }}></div>
                      <div style={{ width: "50%" }}>
                        <Select
                          label="Field Type"
                          options={fieldTypes}
                          onChange={(type) =>
                            setFields((prev) =>
                              prev.map((f) =>
                                f.id === field.id ? { ...f, type } : f
                              )
                            )
                          }
                          value={field.type}
                        />
                      </div>
                    </div>
                    {field.type === "dropdown" && (
                      <TextField
                        label="Dropdown Options (comma-separated)"
                        value={field.options.join(",")}
                        onChange={(options) =>
                          setFields((prev) =>
                            prev.map((f) =>
                              f.id === field.id
                                ? { ...f, options: options.split(",") }
                                : f
                            )
                          )
                        }
                      />
                    )}
                  </div>

                  {index > 1 && (
                    <>
                      <div style={{ marginTop: "5px" }}>
                        <Button
                          variant="primary"
                          tone="critical"
                          onClick={() => removeField(field.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </>
                  )}
                </>
              ))}
              <br />
              <Button
                fullWidth
                variant="primary"
                onClick={addField}
                disabled={!canAddField}
              >
                Add field
              </Button>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
};

export default ApplicationEdit;

export const getServerSideProps = async () => {
  const applicationForm = await prisma.applicationForm.findFirst();
  let fields = [
    { id: "name", label: "Name", value: "", type: "text", options: [] },
    { id: "email", label: "Email", value: "", type: "text", options: [] },
  ];

  if (applicationForm && applicationForm.fields) {
    fields = JSON.parse(applicationForm.fields);
  }

  return {
    props: {
      fields,
    },
  };
};
