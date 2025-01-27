import React, { useState } from "react";
import PageWrapper from "@appsmith/pages/common/PageWrapper";
import styled from "styled-components";
import { Tabs, Tab, TabsList, TabPanel } from "design-system";
import General from "./General";
import GitConfig from "./GitConfig";
import { useLocation } from "react-router";
import { GIT_PROFILE_ROUTE } from "constants/routes";
import { BackButton } from "components/utils/helperComponents";

const ProfileWrapper = styled.div`
  width: 978px;
  margin: var(--ads-v2-spaces-7) auto;
  padding-left: var(--ads-v2-spaces-7);

  .tab-item {
    display: flex;
    gap: 5px;
    align-items: center;
  }
`;

function UserProfile() {
  const location = useLocation();

  let initialTab = "general";
  const tabs = [
    {
      key: "general",
      title: "基本信息",
      panelComponent: <General />,
      icon: "general",
    },
  ];

  tabs.push({
    key: "gitConfig",
    title: "Git 用户信息",
    panelComponent: <GitConfig />,
    icon: "git-branch",
  });
  if (location.pathname === GIT_PROFILE_ROUTE) {
    initialTab = "gitConfig";
  }

  const [selectedTab, setSelectedTab] = useState(initialTab);

  return (
    <PageWrapper displayName={"个人信息"}>
      <ProfileWrapper>
        <BackButton />
        <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            {tabs.map((tab) => {
              return (
                <Tab key={tab.key} value={tab.key}>
                  <div className="tab-item">{tab.title}</div>
                </Tab>
              );
            })}
          </TabsList>
          {tabs.map((tab) => {
            return (
              <TabPanel key={tab.key} value={tab.key}>
                {tab.panelComponent}
              </TabPanel>
            );
          })}
        </Tabs>
      </ProfileWrapper>
    </PageWrapper>
  );
}

export default UserProfile;
