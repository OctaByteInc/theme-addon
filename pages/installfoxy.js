import { Heading, Page, EmptyState } from "@shopify/polaris";

const InstallFoxy = () => (
  <Page>
    <Heading>Install Foxy Theme</Heading>
    <EmptyState
        heading="Install Foxy Theme"
        action={{content: 'Install', url: 'https://foxy.octabyte.io'}}
        image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
    >
        <p>Currently this app is only work with Foxy Theme</p>
    </EmptyState>
  </Page>
);

export default InstallFoxy;
