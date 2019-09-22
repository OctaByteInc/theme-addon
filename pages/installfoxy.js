import { Page, EmptyState } from "@shopify/polaris";

const InstallFoxy = () => (
  <Page>
    <EmptyState
        heading="Install Foxy Theme"
        image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
    >
        <p>Currently this app is only work with Foxy Theme install from (https://foxy.octabyte.io)</p>
    </EmptyState>
  </Page>
);

export default InstallFoxy;
