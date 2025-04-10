import supabase from "../supabase";

export async function initializeCompanies() {
  const companies = [
    {
      id: "williams",
      name: "Williams",
      description: "Pipeline Operator",
      address: "",
      phone: "",
      email: "",
      website: "",
      contact_name: "",
      contact_position: "",
      contact_phone: "",
      contact_email: "",
      region: "",
      pipeline_type: "",
      notes: "",
    },
    {
      id: "nwp",
      name: "NWP",
      description: "Pipeline Operator",
      address: "",
      phone: "",
      email: "",
      website: "",
      contact_name: "",
      contact_position: "",
      contact_phone: "",
      contact_email: "",
      safety_rating: "",
      maintenance_schedule: "",
      notes: "",
    },
    {
      id: "southernstar",
      name: "Southern Star",
      description: "Pipeline Operator",
      address: "",
      phone: "",
      email: "",
      website: "",
      contact_name: "",
      contact_position: "",
      contact_phone: "",
      contact_email: "",
      notes: "",
    },
    {
      id: "dyno",
      name: "Dyno",
      description: "Pipeline Operator",
      address: "",
      phone: "",
      email: "",
      website: "",
      contact_name: "",
      contact_position: "",
      contact_phone: "",
      contact_email: "",
      notes: "",
    },
    {
      id: "boardwalk",
      name: "Boardwalk",
      description: "Pipeline Operator",
      address: "",
      phone: "",
      email: "",
      website: "",
      contact_name: "",
      contact_position: "",
      contact_phone: "",
      contact_email: "",
      notes: "",
    },
    {
      id: "mountainwestpipe",
      name: "Mountain West Pipe",
      description: "Pipeline Operator",
      address: "",
      phone: "",
      email: "",
      website: "",
      contact_name: "",
      contact_position: "",
      contact_phone: "",
      contact_email: "",
      notes: "",
    },
  ];

  // First, create the companies table if it doesn't exist
  const { error: createTableError } = await supabase.rpc(
    "create_companies_table"
  );
  if (createTableError) {
    console.error("Error creating companies table:", createTableError);
    return;
  }

  // Then, insert or update the companies
  for (const company of companies) {
    const { error } = await supabase
      .from("companies")
      .upsert(company, { onConflict: "id" });

    if (error) {
      console.error(`Error upserting company ${company.name}:`, error);
    }
  }
}
