import React from 'react';
import { Heading, Page, Layout, Card, Button, Stack, Link } from "@shopify/polaris";

class Index extends React.Component {
  render(){
    const settingURL = window.location.host + "/admin/themes"
    return(
      <Page>
        <Heading>Theme Addon</Heading>
        <Layout>
          <Layout.AnnotatedSection
            title="Curreny Converter"
            description="Convert shopy currency in user local currency, You can also set 
                          user location based currency converter"
          >
            <Card sectioned>
              <p>Open setting go to customization, Under theme setting click on Addon</p>
              <Stack distribution="trailing">
                <Link url={settingURL}>
                  <Button primary submit>
                    Settings
                  </Button>
                </Link>
              </Stack>
            </Card>
          </Layout.AnnotatedSection>
        </Layout>

        <Layout>
          <Layout.AnnotatedSection
            title="Curreny Converter"
            description="Convert shopy currency in user local currency, You can also set 
                          user location based currency converter"
          >
            <Card sectioned>
              <p>Open setting go to customization, Under theme setting click on Addon</p>
              <Stack distribution="trailing">
                <Link url={settingURL}>
                  <Button primary submit>
                    Settings
                  </Button>
                </Link>
              </Stack>
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
      </Page>
    );
  }
}
export default Index;
