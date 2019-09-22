import React from 'react';
import { Page, Layout} from "@shopify/polaris";

class PayFoxy extends React.Component {

  render(){
    const { shop } = this.props;
    return(
      <Page>
          <EmptyState
                heading="Accept App Charges"
                action={{
                    content: 'Re Install', 
                    url: `https://shopify-addon.appspot.com/auth?shop=${shop}`}}
                image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
            >
                <p>
                    Theme Addon is not free, you need to accpet Charges first.
                </p>
            </EmptyState>
            <p>Reinstall from this link (https://octabyteinc.github.io/Addon/)</p>
      </Page>
    );
  }
}
export default PayFoxy;
