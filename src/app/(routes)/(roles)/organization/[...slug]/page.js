import OrganizationDetailsView from "@/components/features/building/view/organization/organizations.details";
import SiteDetails from "@/components/features/building/view/organization/site.details";

export default function organizationDetailsPage({ params }) {
  console.log(params);
  const { slug } = params;
  const orgDetails = slug[0];
  const SiteDetail = slug[1];
  console.log(orgDetails, SiteDetail);
  if (SiteDetail != undefined) {
    return <SiteDetails />;
  } else {
    return <OrganizationDetailsView />;
  }
}
