import React from "react";
import {
  createMessage,
  CURRENT_PAGE_DISCARD_WARNING,
  DISCARD_CHANGES_WARNING,
} from "@appsmith/constants/messages";
import { useSelector } from "react-redux";
import { getCurrentPageName } from "selectors/editorSelectors";
import { getGitStatus } from "selectors/gitSyncSelectors";
import { Callout, Text } from "design-system";
import styled from "styled-components";

const Container = styled.div`
  margin: 8px 0 16px;
`;

export default function DiscardChangesWarning({
  discardDocUrl,
  onCloseDiscardChangesWarning,
}: any) {
  const currentPageName = useSelector(getCurrentPageName) || "";
  const modifiedPageList = useSelector(getGitStatus)?.modified.map(
    (page: string) => page.toLocaleLowerCase(),
  );
  const isCurrentPageDiscardable =
    modifiedPageList?.some((page: string) =>
      page.includes(currentPageName.toLocaleLowerCase()),
    ) || false;

  return (
    <Container>
      <Callout
        isClosable
        kind="error"
        links={[
          {
            onClick: () => window.open(discardDocUrl, "_blank"),
            children: "Learn More",
            endIcon: "right-arrow",
          },
        ]}
        onClose={onCloseDiscardChangesWarning}
      >
        <Text kind="heading-xs">{createMessage(DISCARD_CHANGES_WARNING)}</Text>
        <br />
        {isCurrentPageDiscardable
          ? createMessage(CURRENT_PAGE_DISCARD_WARNING, currentPageName)
          : null}
      </Callout>
    </Container>
  );
}
