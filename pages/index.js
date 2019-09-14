import React from 'react';
import { Page, Layout} from "@shopify/polaris";
import SettingSection from '../components/setting_section';

class Index extends React.Component {

  render(){
    const { shop } = this.props;
    return(
      <Page>

        <Layout>
          <Layout.AnnotatedSection
            title="Curreny Converter"
            description="Convert shopy currency in user local currency, You can also set 
                          user location based currency converter">
            <SettingSection shop={shop} />
          </Layout.AnnotatedSection>
        </Layout>

        <Layout>
          <Layout.AnnotatedSection
            title="WishList"
            description="Allow customers to save their favourite products in wish list">
            <SettingSection shop={shop} />
          </Layout.AnnotatedSection>
        </Layout>

        <Layout>
          <Layout.AnnotatedSection
            title="Product Swatches"
            description="Show product variants with their images and colors. So user can easily
                          pick variant">
            <SettingSection shop={shop} />
          </Layout.AnnotatedSection>
        </Layout>

        <Layout>
          <Layout.AnnotatedSection
            title="Product Reviews"
            description="Allow users to feedback on products">
            <SettingSection shop={shop} />
          </Layout.AnnotatedSection>
        </Layout>

      </Page>
    );
  }
}
export default Index;
