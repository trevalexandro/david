import React, { useEffect, useState } from 'react';
import ForgeReconciler, { Tabs, TabList, Tab, TabPanel, Box } from '@forge/react';
import { invoke } from '@forge/bridge';
import Refinement from './refinement';
import SprintStarter from './sprint-starter';
import JiraAdmin from './jira-admin';

const App = () => {
  const [data, setData] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  useEffect(() => {
    invoke('getText', { example: 'my-invoke-variable' }).then(setData);
  }, []);

  return (
    <>
      <Tabs id="tabParent" onChange={(index) => setSelectedTab(index)} selected={selectedTab}>
        <TabList>
          <Tab>Refinement</Tab>
          <Tab>Sprint Starter</Tab>
          <Tab>Jira Admin</Tab>
        </TabList>
        <TabPanel>
          <Refinement />
        </TabPanel>
        <TabPanel>
          <SprintStarter />
        </TabPanel>
        <TabPanel>
          <JiraAdmin />
        </TabPanel>
      </Tabs>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
