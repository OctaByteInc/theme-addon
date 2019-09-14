import React from 'react';
import { Card, Button, Stack } from "@shopify/polaris";

class SettingSection extends React.Component {
    
    gotoSettingPage = () => {
        const { shop } = this.props;
        const settingURL =  "https://" + shop + "/admin/themes/";
        window.open(settingURL);
    }

    render(){
        return(
            <Card sectioned>
              <p>Customize -> Theme Setting -> Addon</p>
              <Stack distribution="trailing">
                  <Button primary submit onClick={this.gotoSettingPage}>
                    Settings
                  </Button>
              </Stack>
            </Card>
        );
    }
}

export default SettingSection;