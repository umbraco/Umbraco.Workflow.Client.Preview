import { TaskStatusModel } from "@umbraco-workflow/generated";

export function getStatusFromString(status?: string | null) {
  status = status ?? TaskStatusModel.PENDING_APPROVAL;
  status = status[0].toLowerCase() + status.substring(1);

  return `workflow_${status}`;
}
