import type { Metadata } from "next";
import CrmWorkspace from "../crm-workspace";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ValueY CRM | حلو العقارية",
  description: "Real estate CRM workspace for projects, inventory, sales and customer relationships.",
};

export default function CrmPage() {
  return (
    <div dir="ltr" lang="en">
      <CrmWorkspace />
    </div>
  );
}
