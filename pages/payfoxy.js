import React from 'react';
import { Page, EmptyState} from "@shopify/polaris";

class PayFoxy extends React.Component {

  render(){
    return(
      <Page>
          <EmptyState
                heading="Accept App Charges"
                image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
            >
                <p>
                 You need to accpet charges. 
                 Reinstall from this link (https://octabyteinc.github.io/Addon/)
                </p>
            </EmptyState>
      </Page>
    );
  }
}
export default PayFoxy;
