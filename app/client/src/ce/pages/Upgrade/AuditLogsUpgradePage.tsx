import React from "react";
import type { Carousel, Header } from "./types";
import UpgradePage from "./UpgradePage";
import DebuggingImage from "assets/images/upgrade/audit-logs/log-1.png";
import IncidentManagementImage from "assets/images/upgrade/audit-logs/log-2.png";
import SecurityAndComplianceImage from "assets/images/upgrade/audit-logs/log-3.png";
import {
  AUDIT_LOGS_UPGRADE_PAGE_SUB_HEADING,
  createMessage,
  DEBUGGING,
  DEBUGGING_DETAIL1,
  EXCLUSIVE_TO_BUSINESS,
  INCIDENT_MANAGEMENT,
  INCIDENT_MANAGEMENT_DETAIL1,
  INTRODUCING,
  SECURITY_AND_COMPLIANCE,
  SECURITY_AND_COMPLIANCE_DETAIL1,
  SECURITY_AND_COMPLIANCE_DETAIL2,
} from "@appsmith/constants/messages";
import useOnUpgrade from "utils/hooks/useOnUpgrade";

export function AuditLogsUpgradePage() {
  const { onUpgrade } = useOnUpgrade({
    logEventName: "AUDIT_LOGS_UPGRADE_ADMIN_SETTINGS",
    logEventData: { source: "AuditLogs" },
  });

  const header: Header = {
    heading: createMessage(INTRODUCING, "审计日志"),
    subHeadings: [createMessage(AUDIT_LOGS_UPGRADE_PAGE_SUB_HEADING)],
  };
  const carousel: Carousel = {
    triggers: [
      {
        icon: "lock-2-line",
        heading: createMessage(SECURITY_AND_COMPLIANCE),
        details: [
          createMessage(SECURITY_AND_COMPLIANCE_DETAIL1),
          createMessage(SECURITY_AND_COMPLIANCE_DETAIL2),
        ],
      },
      {
        icon: "search-eye-line",
        heading: createMessage(DEBUGGING),
        details: [createMessage(DEBUGGING_DETAIL1)],
      },
      {
        icon: "alert-line",
        heading: createMessage(INCIDENT_MANAGEMENT),
        details: [createMessage(INCIDENT_MANAGEMENT_DETAIL1)],
      },
    ],
    targets: [
      <img
        alt={createMessage(SECURITY_AND_COMPLIANCE)}
        key="security-and-compliance"
        src={SecurityAndComplianceImage}
      />,
      <img
        alt={createMessage(DEBUGGING)}
        key="debugging"
        src={DebuggingImage}
      />,
      <img
        alt={createMessage(INCIDENT_MANAGEMENT)}
        key="incident-management"
        src={IncidentManagementImage}
      />,
    ],
    design: "split-left-trigger",
  };

  const footer = {
    onClick: () => {
      onUpgrade();
    },
    message: createMessage(EXCLUSIVE_TO_BUSINESS, ["审计日志"]),
  };
  const props = { header, carousel, footer };
  return <UpgradePage {...props} />;
}
